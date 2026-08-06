import type { ProsaDB } from "./schema";
import type {
  ChangeType,
  DocumentRecord,
  EntityType,
  HighlightRecord,
  PositionRecord,
  ReadingStatus,
} from "./types";
import { sha256 } from "../hash";
import type { Anchor } from "../anchor/types";
import {
  documentToWire,
  highlightToWire,
  positionToWire,
} from "../sync/wire";

/**
 * TODA mutación pasa por acá. Es el mismo patrón que las apps nativas y no es
 * decorativo: el store es lo único que actualiza `updatedAt` y escribe el ChangeLog,
 * así que ninguna escritura puede olvidarse de encolar su cambio.
 *
 * El ChangeLog se escribe SIEMPRE, haya cuenta o no. Es barato, y si el usuario crea
 * su @ en el mes 3, su historia entera sube con los timestamps correctos.
 */
export class DocumentStore {
  /**
   * Mientras se aplican cambios que vinieron del servidor, las escrituras NO generan
   * ChangeLog. Sin este flag cada pull produciría un push idéntico, y los dos
   * dispositivos se mandarían el mismo cambio para siempre.
   *
   * Ojo con la excepción: el DuplicateReconciler corre DESPUÉS del pull y sus
   * escrituras sí tienen que registrarse. Por eso `applyingRemote` envuelve solo el
   * apply, nunca la reconciliación. (PLAN.md §0.2.14.)
   */
  private applyingRemote = false;

  constructor(
    private readonly db: ProsaDB,
    private readonly deviceId: string,
    private readonly now: () => string = () => new Date().toISOString(),
    private readonly uuid: () => string = () => crypto.randomUUID(),
  ) {}

  /** Envuelve la aplicación de cambios remotos suprimiendo el ChangeLog. */
  async applyRemote<T>(fn: () => Promise<T>): Promise<T> {
    this.applyingRemote = true;
    try {
      return await fn();
    } finally {
      this.applyingRemote = false;
    }
  }

  get isApplyingRemote(): boolean {
    return this.applyingRemote;
  }

  /**
   * Importa un markdown. Devuelve el documento creado.
   *
   * Atómico: metadata, contenido y ChangeLog entran en una sola transacción. Si la
   * cuota de IndexedDB se agota a mitad, no queda un registro a medias.
   */
  async importDocument(markdown: string, titleOverride?: string): Promise<DocumentRecord> {
    // El parser va por import() dinámico: pesa más que todo el resto del shell junto
    // y no hace falta hasta que alguien importa o abre un documento.
    const { parseDocument } = await import("../markdown/parse");
    const parsed = await parseDocument(markdown);
    const contentHash = await sha256(markdown);
    const now = this.now();
    const title = titleOverride?.trim() || parsed.title;

    const doc: DocumentRecord = {
      id: this.uuid(),
      title,
      contentHash,
      wordCount: parsed.wordCount,
      plainTextIndex: parsed.plainTextIndex,
      status: "unread",
      importedAt: now,
      lastOpenedAt: null,
      coverSeed: coverSeedFor(title),
      updatedAt: now,
      deviceId: this.deviceId,
      deletedAt: null,
    };

    await this.db.transaction(
      "rw",
      [this.db.documents, this.db.contents, this.db.changeLog],
      async () => {
        await this.db.documents.add(doc);
        await this.db.contents.add({ documentId: doc.id, markdown });
        await this.log("document", doc.id, "upsert", documentToWire(doc), doc.updatedAt);
      },
    );

    return doc;
  }

  /** Guarda la posición de lectura. La llama el lector con debounce de 500ms. */
  async savePosition(documentId: string, anchor: Anchor): Promise<void> {
    const now = this.now();
    const position: PositionRecord = {
      documentId,
      blockIndex: anchor.blockIndex,
      blockHash: anchor.blockHash,
      anchorSnippet: anchor.anchorSnippet,
      offsetInBlock: anchor.offsetInBlock,
      progress: anchor.progress,
      updatedAt: now,
      deviceId: this.deviceId,
    };

    await this.db.transaction("rw", [this.db.positions, this.db.changeLog], async () => {
      await this.db.positions.put(position);
      await this.log("position", documentId, "upsert", positionToWire(position), now);
    });
  }

  async setStatus(documentId: string, status: ReadingStatus): Promise<void> {
    await this.mutateDocument(documentId, (doc) => ({ ...doc, status }));
  }

  async markOpened(documentId: string): Promise<void> {
    // `lastOpenedAt` es local y no viaja, así que esto no toca `updatedAt` ni el
    // ChangeLog: abrir un documento no es un cambio que otro dispositivo deba ver.
    await this.db.documents.update(documentId, { lastOpenedAt: this.now() });
  }

  async addHighlight(
    highlight: Omit<HighlightRecord, "createdAt" | "updatedAt" | "deviceId" | "deletedAt">,
  ): Promise<HighlightRecord> {
    const now = this.now();
    const record: HighlightRecord = {
      ...highlight,
      createdAt: now,
      updatedAt: now,
      deviceId: this.deviceId,
      deletedAt: null,
    };

    await this.db.transaction("rw", [this.db.highlights, this.db.changeLog], async () => {
      await this.db.highlights.put(record);
      await this.log("highlight", record.id, "upsert", highlightToWire(record), now);
    });

    return record;
  }

  async setHighlightNote(highlightId: string, note: string | null): Promise<void> {
    const existing = await this.db.highlights.get(highlightId);
    if (!existing) return;
    const updated: HighlightRecord = { ...existing, note, updatedAt: this.now() };

    await this.db.transaction("rw", [this.db.highlights, this.db.changeLog], async () => {
      await this.db.highlights.put(updated);
      await this.log("highlight", updated.id, "upsert", highlightToWire(updated), updated.updatedAt);
    });
  }

  /** Tombstone, nunca borrado físico: el delete tiene que poder viajar al servidor. */
  async deleteHighlight(highlightId: string): Promise<void> {
    const existing = await this.db.highlights.get(highlightId);
    if (!existing || existing.deletedAt) return;
    const now = this.now();
    const deleted: HighlightRecord = { ...existing, deletedAt: now, updatedAt: now };

    await this.db.transaction("rw", [this.db.highlights, this.db.changeLog], async () => {
      await this.db.highlights.put(deleted);
      await this.log("highlight", deleted.id, "delete", highlightToWire(deleted), now);
    });
  }

  /** Ídem: tombstone. El contenido se conserva hasta que el sync confirme. */
  async deleteDocument(documentId: string): Promise<void> {
    await this.mutateDocument(documentId, (doc) => ({ ...doc, deletedAt: this.now() }), "delete");
  }

  private async mutateDocument(
    documentId: string,
    change: (doc: DocumentRecord) => DocumentRecord,
    changeType: ChangeType = "upsert",
  ): Promise<void> {
    const existing = await this.db.documents.get(documentId);
    if (!existing) return;
    const updated: DocumentRecord = { ...change(existing), updatedAt: this.now() };

    await this.db.transaction("rw", [this.db.documents, this.db.changeLog], async () => {
      await this.db.documents.put(updated);
      await this.log("document", updated.id, changeType, documentToWire(updated), updated.updatedAt);
    });
  }

  private async log(
    entityType: EntityType,
    entityId: string,
    changeType: ChangeType,
    payload: Record<string, unknown>,
    clientTimestamp: string,
  ): Promise<void> {
    if (this.applyingRemote) return;
    await this.db.changeLog.add({
      changeId: this.uuid(),
      entityType,
      entityId,
      changeType,
      payload,
      // El updatedAt REAL de la entidad, no now(): así un backfill sube la historia
      // con sus fechas verdaderas y el merge del servidor decide bien.
      clientTimestamp,
      synced: 0,
    });
  }
}

/**
 * Semilla determinística de la portada a partir del título, fijada en el import.
 *
 * Hash FNV-1a de 32 bits: barato, estable entre plataformas y sin dependencias.
 * PENDIENTE: confirmar que las apps nativas usan esta misma función; si no, dos
 * dispositivos que importen el mismo ensayo por separado le darán portadas distintas
 * hasta que el sync los reconcilie (PLAN.md §8.1).
 */
export function coverSeedFor(title: string): number {
  let hash = 0x811c9dc5;
  for (const char of title.normalize("NFC")) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash;
}
