import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";

import { ProsaDB } from "../src/core/db/schema";
import { DocumentStore } from "../src/core/db/store";
import { exportLibrary, importLibrary } from "../src/core/export/zip";
import { listLibrary } from "../src/core/db/queries";
import { BASE } from "./fixtures/variants";

/**
 * El criterio de la DoD: "exporto el zip, borro todo el site data, importo el zip:
 * biblioteca, posiciones y highlights intactos".
 *
 * Sin cuenta, este archivo es la ÚNICA defensa de una biblioteca contra que el
 * navegador borre sus datos. Si el round-trip pierde algo, la promesa del producto
 * es falsa.
 */

let db: ProsaDB;

afterEach(async () => {
  await db?.delete();
});

async function seed() {
  db = new ProsaDB(`prosa-zip-${Math.random().toString(36).slice(2)}`);
  const store = new DocumentStore(db, "web-test");

  const doc = await store.importDocument(BASE);
  await store.savePosition(doc.id, {
    blockIndex: 12,
    blockHash: "hash-12",
    anchorSnippet: "La atención no es un músculo",
    offsetInBlock: 0.42,
    progress: 0.37,
  });
  await store.addHighlight({
    id: "h1",
    documentId: doc.id,
    groupId: null,
    blockIndex: 12,
    blockHash: "hash-12",
    startOffset: 3,
    endOffset: 11,
    snapshotText: "atención",
    note: "volver a esto",
    isOrphaned: false,
  });
  return { store, doc };
}

describe("export e import de la biblioteca en zip", () => {
  it("round-trip completo: documentos, posiciones y subrayados sobreviven", async () => {
    const { doc } = await seed();
    const blob = await exportLibrary(db);
    expect(blob.size).toBeGreaterThan(0);

    // "Borrar los datos del sitio": la base se destruye entera.
    await db.delete();
    db = new ProsaDB(`prosa-zip-restored-${Math.random().toString(36).slice(2)}`);
    await db.open();
    const store = new DocumentStore(db, "web-test-2");

    const result = await importLibrary(db, store, blob);

    expect(result.documents).toBe(1);
    expect(result.highlights).toBe(1);

    const entries = await listLibrary(db);
    expect(entries).toHaveLength(1);
    expect(entries[0]?.document.title).toBe("El oficio de leer despacio");
    expect(entries[0]?.document.id).toBe(doc.id);
    expect(entries[0]?.document.contentHash).toBe(doc.contentHash);

    // El contenido vuelve intacto, byte a byte.
    expect((await db.contents.get(doc.id))?.markdown).toBe(BASE);

    // La posición, con su progreso y su ancla.
    const position = entries[0]?.position;
    expect(position?.progress).toBeCloseTo(0.37, 10);
    expect(position?.blockIndex).toBe(12);
    expect(position?.anchorSnippet).toBe("La atención no es un músculo");

    // El subrayado, con su snapshotText y su nota.
    const highlight = await db.highlights.get("h1");
    expect(highlight?.snapshotText).toBe("atención");
    expect(highlight?.note).toBe("volver a esto");
    expect(highlight?.startOffset).toBe(3);
  });

  it("importar el mismo zip dos veces no duplica la biblioteca", async () => {
    const { store } = await seed();
    const blob = await exportLibrary(db);

    const again = await importLibrary(db, store, blob);

    expect(again.documents).toBe(0);
    expect(again.skipped).toBe(1);
    expect(await db.documents.count()).toBe(1);
  });

  it("el ChangeLog se reconstruye con los timestamps ORIGINALES, no con los de hoy", async () => {
    const { doc } = await seed();
    const blob = await exportLibrary(db);
    const originalUpdatedAt = doc.updatedAt;

    await db.delete();
    db = new ProsaDB(`prosa-zip-log-${Math.random().toString(36).slice(2)}`);
    await db.open();
    const store = new DocumentStore(db, "web-test-2");
    await importLibrary(db, store, blob);

    // Si el usuario crea su @ tres meses después de restaurar, su historia tiene
    // que subir con las fechas verdaderas o el merge del servidor decide mal.
    const change = (await db.changeLog.toArray()).find((c) => c.entityType === "document");
    expect(change?.clientTimestamp).toBe(originalUpdatedAt);
  });

  it("un zip sin manifiesto se rechaza con un mensaje entendible", async () => {
    db = new ProsaDB(`prosa-zip-bad-${Math.random().toString(36).slice(2)}`);
    await db.open();
    const store = new DocumentStore(db, "web-test");

    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    zip.file("cualquier-cosa.md", "# Hola");
    const blob = await zip.generateAsync({ type: "blob" });

    await expect(importLibrary(db, store, blob)).rejects.toThrow(/prosa-library\.json/);
    // Y nada se escribió a medias.
    expect(await db.documents.count()).toBe(0);
  });

  it("dos ensayos con el mismo título no se pisan dentro del zip", async () => {
    db = new ProsaDB(`prosa-zip-dup-${Math.random().toString(36).slice(2)}`);
    const store = new DocumentStore(db, "web-test");
    await store.importDocument("# Mismo título\n\nPrimer contenido, distinto del otro.");
    await store.importDocument("# Mismo título\n\nSegundo contenido, también distinto.");

    const blob = await exportLibrary(db);
    const { default: JSZip } = await import("jszip");
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());

    const markdownFiles = Object.keys(zip.files).filter((name) => name.endsWith(".md"));
    expect(markdownFiles).toHaveLength(2);
    expect(new Set(markdownFiles).size).toBe(2);
  });
});
