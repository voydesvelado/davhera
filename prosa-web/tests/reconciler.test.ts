import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";

import { ProsaDB } from "../src/core/db/schema";
import { DocumentStore } from "../src/core/db/store";
import { mergeOverlapping, reconcileDuplicates } from "../src/core/sync/reconciler";
import type { DocumentRecord, HighlightRecord } from "../src/core/db/types";

/**
 * Los 6 tests obligatorios del DuplicateReconciler.
 *
 * Es donde un bug SÍ puede perder un subrayado: el reconciler borra documentos.
 * Si elige mal el canónico o pierde un highlight en la fusión, alguien se queda
 * sin la nota que escribió hace dos años y nadie se entera hasta que la busca.
 */

let db: ProsaDB;

afterEach(async () => {
  await db?.delete();
});

function fresh() {
  db = new ProsaDB(`prosa-rec-${Math.random().toString(36).slice(2)}`);
  return new DocumentStore(db, "web-test");
}

function doc(id: string, overrides: Partial<DocumentRecord> = {}): DocumentRecord {
  return {
    id,
    title: "El oficio de leer despacio",
    contentHash: "hash-compartido",
    wordCount: 100,
    plainTextIndex: "texto",
    status: "unread",
    importedAt: "2026-08-01T00:00:00.000Z",
    lastOpenedAt: null,
    coverSeed: 1,
    updatedAt: "2026-08-01T00:00:00.000Z",
    deviceId: "web-test",
    deletedAt: null,
    ...overrides,
  };
}

function highlight(id: string, overrides: Partial<HighlightRecord> = {}): HighlightRecord {
  return {
    id,
    documentId: "a",
    groupId: null,
    blockIndex: 3,
    blockHash: "h",
    startOffset: 0,
    endOffset: 10,
    snapshotText: "un pasaje",
    note: null,
    isOrphaned: false,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
    deviceId: "web-test",
    deletedAt: null,
    ...overrides,
  };
}

describe("DuplicateReconciler", () => {
  it("1. determinismo bilateral: los dos lados eligen el mismo canónico", async () => {
    // El mismo par de documentos, insertados en orden inverso en cada "lado".
    const results: string[] = [];

    for (const order of [["a", "b"], ["b", "a"]]) {
      const store = fresh();
      await db.documents.bulkPut([
        doc(order[0]!, { importedAt: "2026-08-01T00:00:00.000Z" }),
        doc(order[1]!, { importedAt: "2026-08-01T00:00:00.000Z" }),
      ]);

      const result = await reconcileDuplicates(db, store);
      results.push(result.merged[0]![0]);
      await db.delete();
    }

    // Empate exacto de importedAt → gana el menor UUID lexicográfico, en los dos
    // lados. Sin esa regla, cada dispositivo borraría el documento del otro.
    expect(results[0]).toBe("a");
    expect(results[1]).toBe("a");
  });

  it("2. unión sin pérdida: 3 + 2 highlights con uno solapado terminan en 4", async () => {
    const store = fresh();
    await db.documents.bulkPut([
      doc("a", { importedAt: "2026-08-01T00:00:00.000Z" }),
      doc("b", { importedAt: "2026-08-02T00:00:00.000Z" }),
    ]);
    await db.highlights.bulkPut([
      highlight("a1", { documentId: "a", blockIndex: 1, startOffset: 0, endOffset: 10 }),
      highlight("a2", { documentId: "a", blockIndex: 2, startOffset: 0, endOffset: 10 }),
      highlight("a3", {
        documentId: "a",
        blockIndex: 3,
        startOffset: 0,
        endOffset: 10,
        snapshotText: "un pasaje",
        note: "nota de A",
      }),
      highlight("b1", { documentId: "b", blockIndex: 9, startOffset: 0, endOffset: 5 }),
      highlight("b2", {
        documentId: "b",
        blockIndex: 3,
        startOffset: 5,
        endOffset: 16,
        snapshotText: "asaje largo",
        note: "nota de B",
      }),
    ]);

    await reconcileDuplicates(db, store);

    const live = (await db.highlights.where("documentId").equals("a").toArray()).filter(
      (h) => h.deletedAt === null,
    );
    expect(live).toHaveLength(4);

    // El solapado conserva AMBAS notas, con el separador del spec.
    const merged = live.find((h) => h.blockIndex === 3);
    expect(merged?.note).toBe("nota de A\n—\nnota de B");
    expect(merged?.endOffset).toBe(16);
  });

  it("3. posición: 40% y 70% terminan en 70%", async () => {
    const store = fresh();
    await db.documents.bulkPut([
      doc("a", { importedAt: "2026-08-01T00:00:00.000Z" }),
      doc("b", { importedAt: "2026-08-02T00:00:00.000Z" }),
    ]);
    await db.positions.bulkPut([
      {
        documentId: "a",
        blockIndex: 5,
        blockHash: "x",
        anchorSnippet: "a",
        offsetInBlock: 0,
        progress: 0.4,
        updatedAt: "2026-08-01T00:00:00.000Z",
        deviceId: "web-test",
      },
      {
        documentId: "b",
        blockIndex: 20,
        blockHash: "y",
        anchorSnippet: "b",
        offsetInBlock: 0.5,
        progress: 0.7,
        updatedAt: "2026-08-02T00:00:00.000Z",
        deviceId: "web-test",
      },
    ]);

    await reconcileDuplicates(db, store);

    const position = await db.positions.get("a");
    expect(position?.progress).toBeCloseTo(0.7, 10);
    expect(position?.blockIndex).toBe(20);
  });

  it("4. orden en el ChangeLog: los upserts de la fusión preceden al tombstone", async () => {
    const store = fresh();
    await db.documents.bulkPut([
      doc("a", { importedAt: "2026-08-01T00:00:00.000Z" }),
      doc("b", { importedAt: "2026-08-02T00:00:00.000Z" }),
    ]);
    await db.highlights.put(highlight("b1", { documentId: "b", blockIndex: 7 }));
    await db.changeLog.clear();

    await reconcileDuplicates(db, store);

    const changes = await db.changeLog.orderBy("seq").toArray();
    const highlightUpsert = changes.findIndex((c) => c.entityType === "highlight");
    const tombstone = changes.findIndex(
      (c) => c.entityType === "document" && c.changeType === "delete",
    );

    expect(highlightUpsert).toBeGreaterThan(-1);
    expect(tombstone).toBeGreaterThan(highlightUpsert);
  });

  it("5. triple duplicado converge a UN canónico sin oscilar", async () => {
    const store = fresh();
    await db.documents.bulkPut([
      doc("c", { importedAt: "2026-08-03T00:00:00.000Z" }),
      doc("a", { importedAt: "2026-08-01T00:00:00.000Z" }),
      doc("b", { importedAt: "2026-08-02T00:00:00.000Z" }),
    ]);

    await reconcileDuplicates(db, store);
    // Segunda pasada: no debe cambiar nada. Si oscilara, esto lo delataría.
    const second = await reconcileDuplicates(db, store);

    const alive = (await db.documents.toArray()).filter((d) => d.deletedAt === null);
    expect(alive).toHaveLength(1);
    expect(alive[0]?.id).toBe("a");
    expect(second.merged).toHaveLength(0);
  });

  it("6. sin falsos positivos: mismo título y contenido distinto NO se tocan", async () => {
    const store = fresh();
    await db.documents.bulkPut([
      doc("a", { contentHash: "hash-uno" }),
      doc("b", { contentHash: "hash-dos" }),
    ]);

    const result = await reconcileDuplicates(db, store);

    expect(result.merged).toHaveLength(0);
    const alive = (await db.documents.toArray()).filter((d) => d.deletedAt === null);
    expect(alive).toHaveLength(2);
  });

  it("el status más avanzado gana la fusión", async () => {
    const store = fresh();
    await db.documents.bulkPut([
      doc("a", { importedAt: "2026-08-01T00:00:00.000Z", status: "reading" }),
      doc("b", { importedAt: "2026-08-02T00:00:00.000Z", status: "finished" }),
    ]);

    await reconcileDuplicates(db, store);
    expect((await db.documents.get("a"))?.status).toBe("finished");
  });

  it("fusionar solapados reconstruye el texto de la unión sin tener el documento", () => {
    const merged = mergeOverlapping(
      highlight("a", { startOffset: 3, endOffset: 11, snapshotText: "atención" }),
      highlight("b", { startOffset: 8, endOffset: 20, snapshotText: "ión no es un" }),
    );
    expect(merged.startOffset).toBe(3);
    expect(merged.endOffset).toBe(20);
    expect(merged.snapshotText).toBe("atención no es un");
  });
});
