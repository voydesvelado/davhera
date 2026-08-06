import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";

import { ProsaDB } from "../src/core/db/schema";
import { DocumentStore, coverSeedFor } from "../src/core/db/store";
import { BASE } from "./fixtures/variants";

/**
 * El DocumentStore es el único camino de mutación. Lo que se prueba acá es
 * justamente eso: que nada escriba sin dejar rastro en el ChangeLog, y que aplicar
 * cambios remotos no genere eco.
 */

let db: ProsaDB;
let store: DocumentStore;
let tick = 0;

beforeEach(async () => {
  await new ProsaDB(`prosa-test-${Math.random()}`).delete().catch(() => {});
  db = new ProsaDB(`prosa-test-${tick}-${Date.now()}`);
  tick = 0;
  store = new DocumentStore(
    db,
    "web-test-device",
    // Reloj determinístico: cada llamada avanza un segundo.
    () => new Date(Date.UTC(2026, 7, 6, 0, 0, tick++)).toISOString(),
    (() => {
      let n = 0;
      return () => `00000000-0000-4000-8000-${String(n++).padStart(12, "0")}`;
    })(),
  );
});

describe("DocumentStore", () => {
  it("importar deja documento, contenido y un cambio encolado, todo en una transacción", async () => {
    const doc = await store.importDocument(BASE);

    expect(doc.title).toBe("El oficio de leer despacio");
    expect(doc.status).toBe("unread");
    expect(doc.wordCount).toBeGreaterThan(500);
    expect(doc.deletedAt).toBeNull();

    expect((await db.contents.get(doc.id))?.markdown).toBe(BASE);

    const changes = await db.changeLog.toArray();
    expect(changes).toHaveLength(1);
    expect(changes[0]).toMatchObject({
      entityType: "document",
      entityId: doc.id,
      changeType: "upsert",
      synced: 0,
    });
    // El payload va en snake_case, listo para el servidor.
    expect(changes[0]?.payload).toMatchObject({
      title: "El oficio de leer despacio",
      content_hash: doc.contentHash,
      status: "unread",
    });
  });

  it("el clientTimestamp es el updatedAt real de la entidad, no la hora de encolado", async () => {
    const doc = await store.importDocument(BASE);
    const change = (await db.changeLog.toArray())[0];
    expect(change?.clientTimestamp).toBe(doc.updatedAt);
  });

  it("aplicar cambios remotos NO genera ChangeLog (si no, eco infinito)", async () => {
    const doc = await store.importDocument(BASE);
    await db.changeLog.clear();

    await store.applyRemote(async () => {
      await store.setStatus(doc.id, "finished");
      await store.savePosition(doc.id, {
        blockIndex: 3,
        blockHash: "abc",
        anchorSnippet: "x",
        offsetInBlock: 0.5,
        progress: 0.5,
      });
    });

    expect(await db.changeLog.count()).toBe(0);
    expect((await db.documents.get(doc.id))?.status).toBe("finished");
    // Y el flag se apaga al salir: lo siguiente sí se registra.
    expect(store.isApplyingRemote).toBe(false);
    await store.setStatus(doc.id, "reading");
    expect(await db.changeLog.count()).toBe(1);
  });

  it("borrar es tombstone: el registro sigue ahí con deletedAt", async () => {
    const doc = await store.importDocument(BASE);
    await store.deleteDocument(doc.id);

    const stored = await db.documents.get(doc.id);
    expect(stored).toBeDefined();
    expect(stored?.deletedAt).not.toBeNull();

    const last = (await db.changeLog.toArray()).at(-1);
    expect(last?.changeType).toBe("delete");
  });

  it("borrar un highlight conserva su snapshotText y su nota", async () => {
    const doc = await store.importDocument(BASE);
    const highlight = await store.addHighlight({
      id: "h1",
      documentId: doc.id,
      groupId: null,
      blockIndex: 2,
      blockHash: "hash",
      startOffset: 0,
      endOffset: 10,
      snapshotText: "una frase",
      note: "por qué me importó",
      isOrphaned: false,
    });

    await store.deleteHighlight(highlight.id);

    const stored = await db.highlights.get("h1");
    expect(stored?.deletedAt).not.toBeNull();
    expect(stored?.snapshotText).toBe("una frase");
    expect(stored?.note).toBe("por qué me importó");
  });

  it("abrir un documento no genera un cambio para sincronizar", async () => {
    const doc = await store.importDocument(BASE);
    await db.changeLog.clear();

    await store.markOpened(doc.id);

    expect(await db.changeLog.count()).toBe(0);
    expect((await db.documents.get(doc.id))?.lastOpenedAt).not.toBeNull();
  });

  it("coverSeed es determinístico y estable para el mismo título", () => {
    expect(coverSeedFor("El oficio de leer despacio")).toBe(
      coverSeedFor("El oficio de leer despacio"),
    );
    expect(coverSeedFor("Otro título")).not.toBe(coverSeedFor("El oficio de leer despacio"));
    expect(coverSeedFor("café")).toBe(coverSeedFor("café")); // NFC: misma semilla
  });
});
