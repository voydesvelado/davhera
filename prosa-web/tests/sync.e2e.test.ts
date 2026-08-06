import "fake-indexeddb/auto";
import { execFileSync, spawn, type ChildProcess } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { ProsaDB } from "../src/core/db/schema";
import { DocumentStore } from "../src/core/db/store";
import { ProsaClient } from "../src/core/sync/client";
import { SyncEngine } from "../src/core/sync/engine";
import { listLibrary } from "../src/core/db/queries";
import { BASE } from "./fixtures/variants";

/**
 * El criterio de la DoD de v1.1, de punta a punta y contra el servidor REAL:
 *
 *   "Creo @mariana en el browser A, abro el browser B con @ + clave: biblioteca
 *    completa con highlights. Subrayo en B, aparece en A."
 *
 * Levanta una instancia pública de verdad (uvicorn, base temporal) y usa dos
 * bases IndexedDB separadas como si fueran dos navegadores. Sin mocks: el valor
 * de este test es exactamente que no los tiene.
 */

const CLOUD = process.env["PROSA_CLOUD"] ?? "/home/david/prosa-cloud";
const PORT = 8788;
const API = `http://127.0.0.1:${PORT}`;

const available = existsSync(`${CLOUD}/venv/bin/uvicorn`);
let server: ChildProcess | null = null;

beforeAll(async () => {
  if (!available) return;

  const work = mkdtempSync(join(tmpdir(), "prosa-e2e-"));
  const dbPath = join(work, "public.db");
  const docsDir = join(work, "documents");

  execFileSync(`${CLOUD}/venv/bin/python`, ["-m", "app.migrate", dbPath], {
    cwd: CLOUD,
    env: { ...process.env, PROSA_DB_PATH: dbPath },
  });

  server = spawn(
    `${CLOUD}/venv/bin/uvicorn`,
    ["app.main:app", "--host", "127.0.0.1", "--port", String(PORT)],
    {
      cwd: CLOUD,
      env: {
        ...process.env,
        PROSA_MODE: "public",
        PROSA_DB_PATH: dbPath,
        PROSA_DOCS_DIR: docsDir,
        PROSA_ALLOWED_ORIGINS: "https://davhera.com",
      },
      stdio: "ignore",
    },
  );

  // Esperar a que responda, sin dormir a ciegas.
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(`${API}/v1/health`);
      if (response.ok) return;
    } catch {
      /* todavía no levantó */
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("el servidor de prueba no arrancó");
}, 30_000);

afterAll(() => {
  server?.kill("SIGKILL");
});

function browser(name: string) {
  const db = new ProsaDB(`prosa-e2e-${name}-${Math.random().toString(36).slice(2)}`);
  const store = new DocumentStore(db, `web-${name}`);
  return { db, store, deviceId: `web-${name}` };
}

describe.skipIf(!available)("sync de punta a punta contra el servidor real", () => {
  it("creo la cuenta en A, entro en B con la clave, y los subrayados viajan en los dos sentidos", async () => {
    const handle = `mariana${Date.now().toString().slice(-6)}`;

    // ─── Browser A: biblioteca local, después cuenta ───
    const a = browser("a");
    const doc = await a.store.importDocument(BASE);
    await a.store.savePosition(doc.id, {
      blockIndex: 12,
      blockHash: "hash-12",
      anchorSnippet: "La atención no es un músculo",
      offsetInBlock: 0.3,
      progress: 0.45,
    });
    await a.store.addHighlight({
      id: "highlight-de-a",
      documentId: doc.id,
      groupId: null,
      blockIndex: 12,
      blockHash: "hash-12",
      startOffset: 3,
      endOffset: 11,
      snapshotText: "atención",
      note: "esto es de A",
      isOrphaned: false,
    });

    const { key } = await ProsaClient.createAccount(handle, API);
    expect(key).toMatch(/^prosa-[A-Z2-9]{5}-[A-Z2-9]{5}-[A-Z2-9]{5}-[A-Z2-9]{5}$/);

    const engineA = new SyncEngine(
      a.db,
      a.store,
      new ProsaClient(key, API),
      a.deviceId,
    );
    await engineA.sync();

    // Todo lo local quedó marcado como sincronizado: la cola se vació.
    expect(await a.db.changeLog.where("synced").equals(0).count()).toBe(0);

    // ─── Browser B: nada local, entra con @ y clave ───
    const b = browser("b");
    const engineB = new SyncEngine(
      b.db,
      b.store,
      new ProsaClient(key, API),
      b.deviceId,
    );
    await engineB.sync();

    const entriesB = await listLibrary(b.db);
    expect(entriesB).toHaveLength(1);
    expect(entriesB[0]?.document.title).toBe("El oficio de leer despacio");
    // El contenido bajó entero, no solo la metadata.
    expect((await b.db.contents.get(doc.id))?.markdown).toBe(BASE);
    // La posición viajó con su ancla.
    expect(entriesB[0]?.position?.progress).toBeCloseTo(0.45, 6);
    expect(entriesB[0]?.position?.anchorSnippet).toBe("La atención no es un músculo");
    // Y el subrayado, con su nota.
    const highlightInB = await b.db.highlights.get("highlight-de-a");
    expect(highlightInB?.snapshotText).toBe("atención");
    expect(highlightInB?.note).toBe("esto es de A");

    // ─── Subrayo en B; tiene que aparecer en A ───
    await b.store.addHighlight({
      id: "highlight-de-b",
      documentId: doc.id,
      groupId: null,
      blockIndex: 20,
      blockHash: "hash-20",
      startOffset: 0,
      endOffset: 6,
      snapshotText: "El papel",
      note: null,
      isOrphaned: false,
    });
    await engineB.sync();
    await engineA.sync();

    const highlightInA = await a.db.highlights.get("highlight-de-b");
    expect(highlightInA?.snapshotText).toBe("El papel");

    // ─── Aplicar lo remoto no produce eco: la cola de A sigue vacía ───
    expect(await a.db.changeLog.where("synced").equals(0).count()).toBe(0);

    await a.db.delete();
    await b.db.delete();
  }, 60_000);

  it("dos bibliotecas con el MISMO ensayo importado por separado terminan en una sola copia", async () => {
    const handle = `dupes${Date.now().toString().slice(-6)}`;
    const { key } = await ProsaClient.createAccount(handle, API);

    // A y B importaron el mismo ensayo por su cuenta: mismo contentHash, distinto id.
    const a = browser("dup-a");
    const b = browser("dup-b");
    const docA = await a.store.importDocument(BASE);
    const docB = await b.store.importDocument(BASE);
    expect(docA.id).not.toBe(docB.id);
    expect(docA.contentHash).toBe(docB.contentHash);

    await a.store.addHighlight({
      id: "h-de-a",
      documentId: docA.id,
      groupId: null,
      blockIndex: 4,
      blockHash: "h4",
      startOffset: 0,
      endOffset: 5,
      snapshotText: "Nadie",
      note: "de A",
      isOrphaned: false,
    });
    await b.store.addHighlight({
      id: "h-de-b",
      documentId: docB.id,
      groupId: null,
      blockIndex: 9,
      blockHash: "h9",
      startOffset: 0,
      endOffset: 5,
      snapshotText: "El te",
      note: "de B",
      isOrphaned: false,
    });

    const engineA = new SyncEngine(a.db, a.store, new ProsaClient(key, API), a.deviceId);
    const engineB = new SyncEngine(b.db, b.store, new ProsaClient(key, API), b.deviceId);

    await engineA.sync();
    await engineB.sync();
    await engineA.sync();

    // Una sola copia viva en cada lado...
    const aliveA = (await a.db.documents.toArray()).filter((d) => d.deletedAt === null);
    const aliveB = (await b.db.documents.toArray()).filter((d) => d.deletedAt === null);
    expect(aliveA).toHaveLength(1);
    expect(aliveB).toHaveLength(1);
    // ...y el MISMO canónico en los dos, sin haberse coordinado.
    expect(aliveA[0]?.id).toBe(aliveB[0]?.id);

    // Con los subrayados de ambos, ninguno perdido.
    const highlightsA = (await a.db.highlights.toArray()).filter((h) => h.deletedAt === null);
    expect(highlightsA.map((h) => h.snapshotText).sort()).toEqual(["El te", "Nadie"]);

    await a.db.delete();
    await b.db.delete();
  }, 60_000);

  it("una clave incorrecta falla claro y no rompe la biblioteca local", async () => {
    const c = browser("bad-key");
    await c.store.importDocument(BASE);

    const states: string[] = [];
    const engine = new SyncEngine(
      c.db,
      c.store,
      new ProsaClient("prosa-XXXXX-XXXXX-XXXXX-XXXXX", API),
      c.deviceId,
      (state) => states.push(state.error ?? state.status),
    );
    await engine.sync();
    engine.stop();

    expect(states).toContain("unauthorized");
    // La biblioteca local queda intacta y la cola sin marcar: se reintenta después.
    expect(await c.db.documents.count()).toBe(1);
    expect(await c.db.changeLog.where("synced").equals(0).count()).toBeGreaterThan(0);

    await c.db.delete();
  }, 30_000);
});

if (!available) {
  console.warn(
    `[sync e2e] SALTEADO: no se encontró ${CLOUD}/venv/bin/uvicorn. ` +
      "El sync NO quedó verificado contra el servidor real en esta corrida.",
  );
}
