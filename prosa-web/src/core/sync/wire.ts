import type {
  DocumentRecord,
  DocumentTagRecord,
  EntityType,
  HighlightRecord,
  PositionRecord,
  TagRecord,
} from "../db/types";

/**
 * La ÚNICA frontera entre el modelo local (camelCase) y el wire format del servidor
 * (snake_case). Nada más en la app debe escribir una clave snake_case.
 *
 * Por qué existe, en contra de lo que dice la Referencia Core: ese documento pide
 * conservar camelCase "para que el wire format coincida byte a byte con las apps
 * nativas". El servidor real dice otra cosa — `app/sync.py` lee exclusivamente
 * snake_case (`content_hash`, `block_index`, `snapshot_text`, …) y las apps nativas
 * sincronizan contra él en producción.
 *
 * El daño de equivocarse acá, medido contra el servidor (tests/wire.contract.test.ts):
 *
 * - Documento en camelCase → RECHAZADO. `content_hash` se lee como "" y la guardia
 *   de contenido respaldado lo frena. Ruidoso, se detecta.
 * - Posición en camelCase → ACEPTADA, y ahí está el problema. `progress` sobrevive
 *   de casualidad (se escribe igual en las dos convenciones), así que la biblioteca
 *   muestra "42% leído" y todo parece normal — pero `block_index` queda en 0,
 *   `block_hash` en "" y `anchor_snippet` en null. El ancla se destruyó: el lector
 *   abre el documento arriba de todo. Se leería como "el AnchorEngine falla a veces"
 *   durante meses.
 * - Highlight en camelCase → ACEPTADO con `snapshot_text` vacío, que es el campo
 *   sagrado del que depende todo el re-anclaje.
 *
 * Por eso la traducción vive en un solo archivo y se verifica contra el sync.py real,
 * no contra un mock: un mock escrito por quien escribió el cliente reproduciría el
 * mismo malentendido en vez de detectarlo.
 */

/** Claves que el servidor lee por entidad. Fuente: app/sync.py de prosa-cloud. */
export const WIRE_KEYS: Record<EntityType, readonly string[]> = {
  document: [
    "title",
    "content_hash",
    "word_count",
    "status",
    "cover_seed",
    "imported_at",
    "updated_at",
    "deleted_at",
  ],
  position: [
    "block_index",
    "block_hash",
    "anchor_snippet",
    "offset_in_block",
    "progress",
    "updated_at",
  ],
  highlight: [
    "document_id",
    "group_id",
    "block_index",
    "block_hash",
    "start_offset",
    "end_offset",
    "snapshot_text",
    "note",
    "is_orphaned",
    "created_at",
    "updated_at",
    "deleted_at",
  ],
  tag: ["name", "updated_at"],
  document_tag: ["document_id", "tag_id", "updated_at"],
} as const;

export function documentToWire(doc: DocumentRecord): Record<string, unknown> {
  return {
    title: doc.title,
    content_hash: doc.contentHash,
    word_count: doc.wordCount,
    status: doc.status,
    cover_seed: doc.coverSeed,
    imported_at: doc.importedAt,
    updated_at: doc.updatedAt,
    deleted_at: doc.deletedAt,
    // plainTextIndex y lastOpenedAt NO viajan: el primero se recalcula al parsear,
    // el segundo no existe en el servidor.
  };
}

export function positionToWire(position: PositionRecord): Record<string, unknown> {
  return {
    block_index: position.blockIndex,
    block_hash: position.blockHash,
    anchor_snippet: position.anchorSnippet,
    offset_in_block: position.offsetInBlock,
    progress: position.progress,
    updated_at: position.updatedAt,
  };
}

export function highlightToWire(highlight: HighlightRecord): Record<string, unknown> {
  return {
    document_id: highlight.documentId,
    group_id: highlight.groupId,
    block_index: highlight.blockIndex,
    block_hash: highlight.blockHash,
    start_offset: highlight.startOffset,
    end_offset: highlight.endOffset,
    snapshot_text: highlight.snapshotText,
    note: highlight.note,
    // El servidor hace int(...) sobre este campo: los booleanos de JSON pasan, pero
    // se manda 0/1 explícito para no depender de esa coerción.
    is_orphaned: highlight.isOrphaned ? 1 : 0,
    created_at: highlight.createdAt,
    updated_at: highlight.updatedAt,
    deleted_at: highlight.deletedAt,
  };
}

export function tagToWire(tag: TagRecord): Record<string, unknown> {
  return { name: tag.name, updated_at: tag.updatedAt };
}

export function documentTagToWire(link: DocumentTagRecord): Record<string, unknown> {
  return {
    document_id: link.documentId,
    tag_id: link.tagId,
    updated_at: link.updatedAt,
  };
}

/* ─────────────────────────── vuelta: servidor → local ─────────────────────────── */

type Wire = Record<string, unknown>;

export function documentFromWire(
  id: string,
  p: Wire,
  deviceId: string,
): Omit<DocumentRecord, "plainTextIndex" | "lastOpenedAt"> {
  return {
    id,
    title: str(p["title"]),
    contentHash: str(p["content_hash"]),
    wordCount: num(p["word_count"]),
    status: (str(p["status"]) || "unread") as DocumentRecord["status"],
    coverSeed: num(p["cover_seed"]),
    importedAt: str(p["imported_at"]),
    updatedAt: str(p["updated_at"]),
    deviceId,
    deletedAt: nullableStr(p["deleted_at"]),
  };
}

export function positionFromWire(documentId: string, p: Wire, deviceId: string): PositionRecord {
  return {
    documentId,
    blockIndex: num(p["block_index"]),
    blockHash: str(p["block_hash"]),
    anchorSnippet: str(p["anchor_snippet"]),
    offsetInBlock: num(p["offset_in_block"]),
    progress: num(p["progress"]),
    updatedAt: str(p["updated_at"]),
    deviceId,
  };
}

export function highlightFromWire(id: string, p: Wire, deviceId: string): HighlightRecord {
  return {
    id,
    documentId: str(p["document_id"]),
    groupId: nullableStr(p["group_id"]),
    blockIndex: num(p["block_index"]),
    blockHash: str(p["block_hash"]),
    startOffset: num(p["start_offset"]),
    endOffset: num(p["end_offset"]),
    snapshotText: str(p["snapshot_text"]),
    note: nullableStr(p["note"]),
    isOrphaned: Boolean(num(p["is_orphaned"])),
    createdAt: str(p["created_at"]),
    updatedAt: str(p["updated_at"]),
    deviceId,
    deletedAt: nullableStr(p["deleted_at"]),
  };
}

export function tagFromWire(id: string, p: Wire): TagRecord {
  return {
    id,
    name: str(p["name"]),
    updatedAt: str(p["updated_at"]),
    deletedAt: nullableStr(p["deleted_at"]),
  };
}

export function documentTagFromWire(p: Wire): DocumentTagRecord {
  return {
    documentId: str(p["document_id"]),
    tagId: str(p["tag_id"]),
    updatedAt: str(p["updated_at"]),
    deletedAt: nullableStr(p["deleted_at"]),
  };
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function nullableStr(value: unknown): string | null {
  return typeof value === "string" && value !== "" ? value : null;
}

function num(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}
