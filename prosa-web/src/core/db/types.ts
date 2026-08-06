/**
 * El modelo local, espejo del de Swift (PROSA_SPEC §2) con los mismos nombres en
 * camelCase. La traducción a snake_case ocurre en un solo lugar: core/sync/wire.ts.
 *
 * Las fechas son strings ISO-8601 en UTC con milisegundos ("2026-08-06T00:00:00.000Z"),
 * el mismo formato que produce y espera el servidor. Guardarlas como string y no como
 * Date evita que un round-trip por IndexedDB o por JSON cambie la precisión.
 */

export type ReadingStatus = "unread" | "reading" | "finished";

export type EntityType = "document" | "position" | "highlight" | "tag" | "document_tag";

export type ChangeType = "upsert" | "delete";

export interface DocumentRecord {
  id: string;
  title: string;
  contentHash: string;
  wordCount: number;
  plainTextIndex: string;
  status: ReadingStatus;
  importedAt: string;
  /** Local puro: no existe en el servidor, no viaja en el sync. Lo usa el reconciler. */
  lastOpenedAt: string | null;
  coverSeed: number;
  updatedAt: string;
  deviceId: string;
  /** Tombstone. Los deletes NUNCA son borrado físico antes del sync. */
  deletedAt: string | null;
}

/** El markdown vive aparte de la metadata: la biblioteca se lista sin cargar los textos. */
export interface ContentRecord {
  documentId: string;
  markdown: string;
}

export interface PositionRecord {
  documentId: string;
  blockIndex: number;
  blockHash: string;
  anchorSnippet: string;
  offsetInBlock: number;
  progress: number;
  updatedAt: string;
  deviceId: string;
}

export interface HighlightRecord {
  id: string;
  documentId: string;
  /** Comparte ID lógico entre los rangos de un highlight que cruza bloques. */
  groupId: string | null;
  blockIndex: number;
  blockHash: string;
  /** Offsets en CODE POINTS sobre el plainText normalizado; `end` exclusivo. */
  startOffset: number;
  endOffset: number;
  /** Sagrado: siempre presente, jamás se regenera ni se descarta. */
  snapshotText: string;
  note: string | null;
  isOrphaned: boolean;
  createdAt: string;
  updatedAt: string;
  deviceId: string;
  deletedAt: string | null;
}

export interface TagRecord {
  id: string;
  name: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface DocumentTagRecord {
  documentId: string;
  tagId: string;
  updatedAt: string;
  deletedAt: string | null;
}

/**
 * La cola de sync local. `payload` es el estado COMPLETO de la entidad tras el
 * cambio, no un diff — por eso aplicar cambios remotos es idempotente por naturaleza.
 */
export interface ChangeLogRecord {
  seq?: number;
  changeId: string;
  entityType: EntityType;
  entityId: string;
  changeType: ChangeType;
  /** Ya en snake_case, listo para el servidor. */
  payload: Record<string, unknown>;
  /** El updatedAt REAL de la entidad, no now(): los backfills suben su historia correcta. */
  clientTimestamp: string;
  /** 0 | 1 en vez de boolean: IndexedDB no indexa booleanos. */
  synced: 0 | 1;
}

export interface MetaRecord {
  key: string;
  value: unknown;
}

/** La clave de acceso vive en su propia tabla, nunca en `meta` (PROSA_WEB_SPEC §7). */
export interface AccountKeyRecord {
  id: "current";
  handle: string;
  key: string;
}
