import type { ProsaDB } from "../db/schema";
import type { DocumentStore } from "../db/store";
import type {
  DocumentRecord,
  HighlightRecord,
  PositionRecord,
  TagRecord,
} from "../db/types";

/**
 * Export e import de la biblioteca completa como .zip.
 *
 * Es una feature de primera clase, no un extra: sin cuenta, este archivo es la
 * ÚNICA forma de que una biblioteca sobreviva a que el navegador borre sus datos,
 * y es también la migración entre navegadores. El zip lleva los .md legibles con
 * el título como nombre —para que sirvan aunque Prosa desaparezca— más un JSON
 * con todo lo que un .md no puede guardar.
 *
 * JSZip llega por import() dinámico: pesa demasiado para el shell y solo hace
 * falta cuando alguien exporta.
 */

export const MANIFEST_NAME = "prosa-library.json";
export const MANIFEST_VERSION = 1;

export interface LibraryManifest {
  version: number;
  exportedAt: string;
  documents: DocumentRecord[];
  positions: PositionRecord[];
  highlights: HighlightRecord[];
  tags: TagRecord[];
  documentTags: { documentId: string; tagId: string; updatedAt: string; deletedAt: string | null }[];
  /** documentId → nombre del .md dentro del zip. */
  files: Record<string, string>;
}

export async function exportLibrary(db: ProsaDB): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();

  const documents = (await db.documents.toArray()).filter((d) => d.deletedAt === null);
  const contents = await db.contents.toArray();
  const byId = new Map(contents.map((c) => [c.documentId, c.markdown]));

  const files: Record<string, string> = {};
  const used = new Set<string>();

  for (const doc of documents) {
    const markdown = byId.get(doc.id);
    if (markdown === undefined) continue;
    const name = uniqueName(safeFileName(doc.title), used);
    files[doc.id] = name;
    zip.file(name, markdown);
  }

  const manifest: LibraryManifest = {
    version: MANIFEST_VERSION,
    exportedAt: new Date().toISOString(),
    documents,
    positions: await db.positions.toArray(),
    highlights: await db.highlights.toArray(),
    tags: await db.tags.toArray(),
    documentTags: await db.documentTags.toArray(),
    files,
  };
  zip.file(MANIFEST_NAME, JSON.stringify(manifest, null, 2));

  return zip.generateAsync({ type: "blob" });
}

export interface ImportZipResult {
  documents: number;
  highlights: number;
  /** Documentos que ya estaban (mismo id o mismo contentHash) y no se duplicaron. */
  skipped: number;
}

/**
 * Restaura un zip exportado. Reponer una biblioteca no puede DUPLICARLA: los
 * documentos que ya están (por id o por contentHash) se saltean, y los highlights
 * se unen por id en vez de reinsertarse.
 *
 * Todo entra en una transacción: si la cuota de IndexedDB se acaba a mitad, no
 * queda media biblioteca a medio restaurar.
 */
export async function importLibrary(
  db: ProsaDB,
  store: DocumentStore,
  file: Blob,
): Promise<ImportZipResult> {
  const { default: JSZip } = await import("jszip");
  // ArrayBuffer y no el Blob directo: JSZip no reconoce todos los Blob según el
  // entorno, y leerlo una vez acá evita depender de esa detección.
  const zip = await JSZip.loadAsync(await file.arrayBuffer());

  const manifestFile = zip.file(MANIFEST_NAME);
  if (!manifestFile) throw new Error("El zip no tiene prosa-library.json");

  const manifest = JSON.parse(await manifestFile.async("string")) as LibraryManifest;
  if (manifest.version > MANIFEST_VERSION) {
    throw new Error("El zip viene de una versión más nueva de Prosa");
  }

  const existing = await db.documents.toArray();
  const existingIds = new Set(existing.map((d) => d.id));
  const existingHashes = new Set(existing.filter((d) => d.deletedAt === null).map((d) => d.contentHash));

  const result: ImportZipResult = { documents: 0, highlights: 0, skipped: 0 };

  const toAdd: { doc: DocumentRecord; markdown: string }[] = [];
  for (const doc of manifest.documents) {
    if (existingIds.has(doc.id) || existingHashes.has(doc.contentHash)) {
      result.skipped++;
      continue;
    }
    const name = manifest.files[doc.id];
    const entry = name ? zip.file(name) : null;
    if (!entry) {
      result.skipped++;
      continue;
    }
    toAdd.push({ doc, markdown: await entry.async("string") });
  }

  const addedIds = new Set(toAdd.map((entry) => entry.doc.id));
  const positions = manifest.positions.filter((p) => addedIds.has(p.documentId));
  const highlights = manifest.highlights.filter((h) => addedIds.has(h.documentId));

  await db.transaction(
    "rw",
    [db.documents, db.contents, db.positions, db.highlights, db.tags, db.documentTags, db.changeLog],
    async () => {
      for (const { doc, markdown } of toAdd) {
        await db.documents.put(doc);
        await db.contents.put({ documentId: doc.id, markdown });
      }
      await db.positions.bulkPut(positions);
      await db.highlights.bulkPut(highlights);
      await db.tags.bulkPut(manifest.tags);
      await db.documentTags.bulkPut(manifest.documentTags);
    },
  );

  result.documents = toAdd.length;
  result.highlights = highlights.length;

  // El ChangeLog se reconstruye DESPUÉS de la transacción de datos y con los
  // timestamps originales, para que si el usuario crea su @ más tarde, su historia
  // suba con las fechas reales y no con las del día que restauró el zip.
  await store.logRestored(
    toAdd.map((entry) => entry.doc),
    positions,
    highlights,
  );

  return result;
}

function safeFileName(title: string): string {
  const cleaned = title.replace(/[/\\?%*:|"<>]/g, "-").trim();
  return `${cleaned === "" ? "sin-titulo" : cleaned}.md`;
}

function uniqueName(name: string, used: Set<string>): string {
  if (!used.has(name)) {
    used.add(name);
    return name;
  }
  // Dos ensayos con el mismo título son perfectamente posibles; el zip no puede
  // perder uno por eso.
  let counter = 2;
  const base = name.replace(/\.md$/, "");
  let candidate = `${base} (${counter}).md`;
  while (used.has(candidate)) {
    counter++;
    candidate = `${base} (${counter}).md`;
  }
  used.add(candidate);
  return candidate;
}
