// @vitest-environment jsdom
import "fake-indexeddb/auto";
import { execFileSync, spawn, type ChildProcess } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { db, ProsaDB } from "../src/core/db/schema";
import { DocumentStore } from "../src/core/db/store";
import { getStore } from "../src/app/store";
import { ProsaClient } from "../src/core/sync/client";
import { SyncEngine } from "../src/core/sync/engine";
import { startSyncRuntime, stopSyncRuntime } from "../src/app/syncRuntime";
import { listLibrary } from "../src/core/db/queries";
import { BASE } from "./fixtures/variants";

/**
 * El respaldo tiene que ocurrir SOLO: sin abrir ninguna pantalla y sin tocar
 * ningún botón.
 *
 * Este test existe por un bug real: el motor de sync se creaba dentro de la
 * pantalla de Ajustes, así que solo sincronizaba mientras esa pantalla estaba
 * montada. Leyendo o mirando la biblioteca no pasaba nada, y en la práctica había
 * que ir a Ajustes a tocar "Respaldar ahora".
 *
 * Acá NO se monta ni un componente de React. Si esto pasa, el respaldo y la
 * recuperación son de verdad automáticos.
 */

const CLOUD = process.env["PROSA_CLOUD"] ?? "/home/david/prosa-cloud";
const PORT = 8787;
const API = `http://127.0.0.1:${PORT}`;

const available = existsSync(`${CLOUD}/venv/bin/uvicorn`);
let server: ChildProcess | null = null;

beforeAll(async () => {
  if (!available) return;
  const work = mkdtempSync(join(tmpdir(), "prosa-rt-"));
  const dbPath = join(work, "public.db");

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
        PROSA_DOCS_DIR: join(work, "documents"),
      },
      stdio: "ignore",
    },
  );

  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      if ((await fetch(`${API}/v1/health`)).ok) return;
    } catch {
      /* todavía no levantó */
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("el servidor de prueba no arrancó");
}, 30_000);

afterAll(() => {
  stopSyncRuntime();
  server?.kill("SIGKILL");
});

async function waitFor(what: string, condition: () => Promise<boolean>, timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await condition()) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`timeout esperando: ${what}`);
}

describe.skipIf(!available)("el respaldo ocurre solo", () => {
  it("la biblioteca baja sola al entrar, y lo que se importa después sube solo", async () => {
    const handle = `auto${Date.now().toString().slice(-7)}`;
    const { key } = await ProsaClient.createAccount(handle, API);

    // ── Otro dispositivo ya dejó una biblioteca respaldada ──
    const otro = new ProsaDB(`otro-${Math.random().toString(36).slice(2)}`);
    const storeOtro = new DocumentStore(otro, "web-otro");
    await storeOtro.importDocument(BASE);
    await new SyncEngine(otro, storeOtro, new ProsaClient(key, API), "web-otro").sync();

    // ── Este navegador: vacío, y lo único que pasa es que aparece la clave ──
    // Ni una pantalla montada, ni un click. Es exactamente lo que ocurre cuando
    // alguien termina el flujo de "ya tengo cuenta".
    startSyncRuntime({ apiBase: API });
    await db.accountKey.put({ id: "current", handle, key });

    await waitFor("que la biblioteca baje sola", async () => (await listLibrary(db)).length > 0);

    const entries = await listLibrary(db);
    expect(entries[0]?.document.title).toBe("El oficio de leer despacio");
    // Y con el contenido, no solo la metadata: se puede leer sin hacer nada más.
    expect((await db.contents.get(entries[0]!.document.id))?.markdown).toBe(BASE);

    // ── La otra mitad: importar acá sube solo, sin pasar por Ajustes ──
    const store = await getStore();
    await store.importDocument("# Ensayo nuevo\n\nImportado despues de entrar con el arroba.");

    await waitFor(
      "que el import suba solo",
      async () => (await db.changeLog.where("synced").equals(0).count()) === 0,
    );

    // Comprobado desde afuera, con un cliente limpio que no comparte nada con el runtime.
    const remote = await new ProsaClient(key, API).pull(0, "un-tercer-device");
    const titles = remote.changes
      .filter((c) => c.entity_type === "document")
      .map((c) => c.payload["title"]);
    expect(titles).toContain("Ensayo nuevo");

    await new ProsaClient(key, API).deleteAccount();
    await otro.delete();
  }, 90_000);
});

if (!available) {
  console.warn(
    "[sync runtime] SALTEADO: no se encontró uvicorn. El respaldo automático NO quedó verificado.",
  );
}
