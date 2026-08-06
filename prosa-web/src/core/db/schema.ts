import Dexie, { type EntityTable } from "dexie";

import type {
  AccountKeyRecord,
  ChangeLogRecord,
  ContentRecord,
  DocumentRecord,
  DocumentTagRecord,
  HighlightRecord,
  MetaRecord,
  PositionRecord,
  TagRecord,
} from "./types";

/**
 * IndexedDB vía Dexie. localStorage está prohibido en este proyecto: 5MB, síncrono
 * y solo strings — una biblioteca de ensayos lo revienta en semanas.
 *
 * Los markdown viven en `contents`, separados de la metadata, para que listar la
 * biblioteca no cargue un solo byte de texto.
 */
export class ProsaDB extends Dexie {
  documents!: EntityTable<DocumentRecord, "id">;
  contents!: EntityTable<ContentRecord, "documentId">;
  positions!: EntityTable<PositionRecord, "documentId">;
  highlights!: EntityTable<HighlightRecord, "id">;
  tags!: EntityTable<TagRecord, "id">;
  documentTags!: EntityTable<DocumentTagRecord, "documentId">;
  changeLog!: EntityTable<ChangeLogRecord, "seq">;
  meta!: EntityTable<MetaRecord, "key">;
  accountKey!: EntityTable<AccountKeyRecord, "id">;

  constructor(name = "prosa") {
    super(name);
    this.version(1).stores({
      documents: "id, title, contentHash, status, importedAt, updatedAt, deletedAt",
      contents: "documentId",
      positions: "documentId",
      highlights: "id, documentId, groupId, deletedAt",
      tags: "id, &name",
      documentTags: "[documentId+tagId], documentId, tagId",
      // `synced` se indexa como 0|1: IndexedDB no indexa booleanos.
      changeLog: "++seq, synced",
      meta: "key",
      // La clave de acceso, aparte de `meta` a propósito (PROSA_WEB_SPEC §7).
      accountKey: "id",
    });
  }
}

export const db = new ProsaDB();
