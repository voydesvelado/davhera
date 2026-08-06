import type { ProsaDB } from "../db/schema";
import type { DocumentStore } from "../db/store";
import { sha256 } from "../hash";
import type { ChangeLogRecord } from "../db/types";
import { ApiError, ProsaClient, type Change } from "./client";
import { reconcileDuplicates } from "./reconciler";
import {
  documentFromWire,
  highlightFromWire,
  positionFromWire,
  tagFromWire,
} from "./wire";

const BATCH_SIZE = 200;
const BACKOFF_START_MS = 30_000;
const BACKOFF_MAX_MS = 15 * 60_000;
const LOCK_NAME = "prosa-sync";

export interface SyncState {
  status: "idle" | "syncing" | "error";
  lastSyncedAt: string | null;
  error: string | null;
}

/**
 * SyncEngine: push → pull → apply → reconciliar.
 *
 * Silencioso por diseño. La única UI que produce es una fila en Ajustes: nada de
 * spinners, ni de toasts de "sincronizado", ni de badges. Si funciona, no se nota;
 * si falla, reintenta con backoff y lo dice en un solo lugar.
 */
export class SyncEngine {
  private backoff = BACKOFF_START_MS;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private running = false;

  constructor(
    private readonly db: ProsaDB,
    private readonly store: DocumentStore,
    private readonly client: ProsaClient,
    private readonly deviceId: string,
    private readonly onState: (state: SyncState) => void = () => {},
  ) {}

  /**
   * Una sola pestaña sincroniza a la vez.
   *
   * Con dos pestañas abiertas y sin este lock, las dos empujarían la misma cola y
   * las dos avanzarían el cursor: cambios duplicados en el oplog y un `lastSeq`
   * que se pisa. La Web Locks API lo resuelve sin coordinación manual.
   */
  async sync(): Promise<void> {
    if (this.running) return;

    const run = async () => {
      this.running = true;
      this.onState({ status: "syncing", lastSyncedAt: null, error: null });
      try {
        await this.pushPending();
        await this.pullAndApply();
        await reconcileDuplicates(this.db, this.store);

        const now = new Date().toISOString();
        await this.db.meta.put({ key: "lastSyncedAt", value: now });
        this.backoff = BACKOFF_START_MS;
        this.onState({ status: "idle", lastSyncedAt: now, error: null });
      } catch (error) {
        const message = error instanceof ApiError ? describe(error) : String(error);
        this.onState({ status: "error", lastSyncedAt: null, error: message });
        this.scheduleRetry();
      } finally {
        this.running = false;
      }
    };

    if (navigator.locks) {
      await navigator.locks.request(LOCK_NAME, { ifAvailable: true }, async (lock) => {
        if (!lock) return; // otra pestaña está sincronizando: no hay nada que hacer
        await run();
      });
    } else {
      await run();
    }
  }

  /** Sube en lotes de 200. La idempotencia la da `change_id`, no el orden. */
  private async pushPending(): Promise<void> {
    for (;;) {
      const pending = await this.db.changeLog
        .where("synced")
        .equals(0)
        .limit(BATCH_SIZE)
        .toArray();
      if (pending.length === 0) return;

      // El contenido tiene que estar arriba ANTES que su documento: el servidor
      // rechaza un upsert de documento cuyo .md no lo respalda.
      await this.uploadContentFor(pending);

      const result = await this.client.push(this.deviceId, pending.map(toWireChange));

      // `superseded` no es un error: el servidor ya tenía algo más nuevo. El cambio
      // se marca como sincronizado igual, o la cola no se vacía nunca.
      const failed = new Set(result.conflicts.map((c) => c.change_id));
      const done = pending.filter((c) => !failed.has(c.changeId));

      await this.db.changeLog.bulkPut(done.map((c) => ({ ...c, synced: 1 as const })));

      if (done.length === 0) {
        // Todo el lote falló: reintentar en bucle sería una tormenta. Se corta y
        // el backoff se encarga.
        throw new Error(`push rechazado: ${result.conflicts[0]?.reason ?? "desconocido"}`);
      }
    }
  }

  private async uploadContentFor(changes: ChangeLogRecord[]): Promise<void> {
    const documentIds = [
      ...new Set(
        changes
          .filter((c) => c.entityType === "document" && c.changeType === "upsert")
          .map((c) => c.entityId),
      ),
    ];

    for (const documentId of documentIds) {
      const content = await this.db.contents.get(documentId);
      if (!content) continue;
      const hash = await sha256(content.markdown);
      try {
        await this.client.putContent(documentId, content.markdown, hash);
      } catch (error) {
        // 413 = cuota. Se propaga con su forma para que Ajustes lo muestre honesto.
        if (error instanceof ApiError && error.status === 413) throw error;
        throw error;
      }
    }
  }

  private async pullAndApply(): Promise<void> {
    let cursor = Number((await this.db.meta.get("lastSeq"))?.value ?? 0);

    for (;;) {
      const result = await this.client.pull(cursor, this.deviceId);
      if (result.changes.length === 0) {
        await this.db.meta.put({ key: "lastSeq", value: Math.max(cursor, result.latest_seq) });
        return;
      }

      // Aplicar cambios remotos NO escribe ChangeLog: sin este flag, cada pull
      // produciría un push idéntico y los dispositivos se mandarían el mismo
      // cambio para siempre.
      await this.store.applyRemote(async () => {
        for (const change of result.changes) {
          await this.applyChange(change);
        }
      });

      cursor = result.changes[result.changes.length - 1]!.seq;
      await this.db.meta.put({ key: "lastSeq", value: cursor });

      if (!result.has_more) return;
    }
  }

  private async applyChange(change: Change): Promise<void> {
    const { entity_type: type, entity_id: id, change_type: kind, payload } = change;

    switch (type) {
      case "document": {
        const incoming = documentFromWire(id, payload, this.deviceId);
        const existing = await this.db.documents.get(id);

        if (kind === "delete") {
          if (existing) {
            await this.db.documents.put({
              ...existing,
              deletedAt: incoming.deletedAt ?? change.client_timestamp,
              updatedAt: incoming.updatedAt,
            });
          }
          return;
        }
        // LWW por updatedAt. Un cambio más viejo que lo local no pisa nada.
        if (existing && existing.updatedAt > incoming.updatedAt) return;

        await this.db.documents.put({
          ...incoming,
          // Campos locales que no viajan: se conservan los que ya había.
          plainTextIndex: existing?.plainTextIndex ?? "",
          lastOpenedAt: existing?.lastOpenedAt ?? null,
        });

        // El contenido se baja solo si no lo tenemos o si cambió el hash.
        const content = await this.db.contents.get(id);
        if (!content || (existing && existing.contentHash !== incoming.contentHash)) {
          const markdown = await this.client.getContent(id);
          if (markdown !== null) {
            await this.db.contents.put({ documentId: id, markdown });
            const { parseDocument } = await import("../markdown/parse");
            const parsed = await parseDocument(markdown);
            await this.db.documents.update(id, { plainTextIndex: parsed.plainTextIndex });
          }
        }
        return;
      }

      case "position": {
        const incoming = positionFromWire(id, payload, this.deviceId);
        const existing = await this.db.positions.get(id);
        // La posición más avanzada gana, SIEMPRE. Nunca por timestamp, nunca hacia
        // atrás. (Y el lector no mueve el viewport de una lectura activa: eso lo
        // resuelve la UI, que solo lee la posición al abrir.)
        if (existing && existing.progress > incoming.progress) return;
        await this.db.positions.put(incoming);
        return;
      }

      case "highlight": {
        const incoming = highlightFromWire(id, payload, this.deviceId);
        const existing = await this.db.highlights.get(id);
        if (existing && existing.updatedAt > incoming.updatedAt) return;
        await this.db.highlights.put(
          kind === "delete"
            ? { ...incoming, deletedAt: incoming.deletedAt ?? change.client_timestamp }
            : incoming,
        );
        return;
      }

      case "tag": {
        const incoming = tagFromWire(id, payload);
        const existing = await this.db.tags.get(id);
        if (existing && existing.updatedAt > incoming.updatedAt) return;
        await this.db.tags.put(incoming);
        return;
      }

      case "document_tag": {
        const documentId = String(payload["document_id"] ?? "");
        const tagId = String(payload["tag_id"] ?? "");
        if (!documentId || !tagId) return;
        // Los tags son unión: un delete solo aplica si es más nuevo que la
        // asociación, y si no, gana estar asociado.
        await this.db.documentTags.put({
          documentId,
          tagId,
          updatedAt: String(payload["updated_at"] ?? change.client_timestamp),
          deletedAt: kind === "delete" ? change.client_timestamp : null,
        });
        return;
      }
    }
  }

  private scheduleRetry(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => void this.sync(), this.backoff);
    this.backoff = Math.min(this.backoff * 2, BACKOFF_MAX_MS);
  }

  stop(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }
}

function toWireChange(record: ChangeLogRecord): Change {
  return {
    change_id: record.changeId,
    entity_type: record.entityType,
    entity_id: record.entityId,
    change_type: record.changeType,
    client_timestamp: record.clientTimestamp,
    payload: record.payload,
  };
}

function describe(error: ApiError): string {
  if (error.status === 413) return "quota_exceeded";
  if (error.status === 401) return "unauthorized";
  if (error.status === 429) return "rate_limited";
  return `http_${error.status}`;
}
