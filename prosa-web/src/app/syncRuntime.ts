import { liveQuery, type Subscription } from "dexie";
import { useSyncExternalStore } from "react";

import { db } from "../core/db/schema";
import { ProsaClient } from "../core/sync/client";
import { SyncEngine, type SyncState } from "../core/sync/engine";
import { getStore } from "./store";

/**
 * El sync vive acá, fuera de React, y arranca con la app.
 *
 * Antes el motor se creaba dentro de la pantalla de Ajustes, así que solo
 * sincronizaba mientras esa pantalla estaba montada: leyendo o mirando la
 * biblioteca no pasaba nada, y en la práctica había que ir a Ajustes y tocar un
 * botón. Tener cuenta tiene que significar que el respaldo ocurre solo.
 *
 * Un único motor por pestaña, y un único lock entre pestañas (lo maneja el propio
 * SyncEngine con Web Locks).
 */

/** Tras un import conviene subir enseguida: es contenido nuevo que aún no existe en ningún lado. */
const IMPORT_DEBOUNCE_MS = 2_000;
/** El resto (posición de lectura, subrayados) se agrupa: se generan de a muchos. */
const CHANGE_DEBOUNCE_MS = 30_000;
/** Latido mientras la pestaña está visible, para que dos pestañas converjan solas. */
const HEARTBEAT_MS = 5 * 60_000;

let engine: SyncEngine | null = null;
let accountSubscription: Subscription | null = null;
let debounce: ReturnType<typeof setTimeout> | null = null;
let heartbeat: ReturnType<typeof setInterval> | null = null;
let started = false;
/** Base de la API. Se puede inyectar: los tests y `npm run dev` apuntan a otra. */
let apiBase: string | undefined;

let state: SyncState & { handle: string | null } = {
  status: "idle",
  lastSyncedAt: null,
  error: null,
  handle: null,
};
const listeners = new Set<() => void>();

function setState(next: Partial<typeof state>): void {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

function scheduleSync(delay: number): void {
  if (!engine) return;
  if (debounce) clearTimeout(debounce);
  debounce = setTimeout(() => void engine?.sync(), delay);
}

/** Sincroniza ya, sin esperar el debounce. */
export function syncNow(): void {
  if (debounce) clearTimeout(debounce);
  void engine?.sync();
}

async function attach(handle: string, key: string): Promise<void> {
  const store = await getStore();
  const deviceId = String((await db.meta.get("deviceId"))?.value ?? "web-unknown");

  engine = new SyncEngine(
    db,
    store,
    new ProsaClient(key, apiBase),
    deviceId,
    (next) => setState(next),
  );

  const lastSynced = (await db.meta.get("lastSyncedAt"))?.value;
  setState({ handle, lastSyncedAt: typeof lastSynced === "string" ? lastSynced : null });

  // Al entrar: sube lo pendiente y BAJA la biblioteca que ya estaba respaldada.
  // Es lo que hace que abrir el navegador de otro dispositivo no requiera nada.
  void engine.sync();

  heartbeat = setInterval(() => {
    if (document.visibilityState === "visible") void engine?.sync();
  }, HEARTBEAT_MS);
}

function detach(): void {
  engine?.stop();
  engine = null;
  if (heartbeat) clearInterval(heartbeat);
  heartbeat = null;
  if (debounce) clearTimeout(debounce);
  debounce = null;
  setState({ handle: null, status: "idle", lastSyncedAt: null, error: null });
}

export function startSyncRuntime(options: { apiBase?: string } = {}): void {
  if (started) return;
  started = true;
  apiBase = options.apiBase;

  // La cuenta puede aparecer (alguien la crea o entra con su clave) o irse
  // (cerrar sesión) en cualquier momento y desde cualquier pantalla.
  accountSubscription = liveQuery(() => db.accountKey.get("current")).subscribe({
    next: (account) => {
      if (!account) {
        if (engine) detach();
        return;
      }
      if (state.handle === account.handle && engine) return;
      detach();
      void attach(account.handle, account.key);
    },
    error: () => setState({ status: "error", error: "account_unavailable" }),
  });

  // Cambios locales: los imports suben casi enseguida; el resto se agrupa.
  db.changeLog.hook("creating", (_key, record) => {
    scheduleSync(record.entityType === "document" ? IMPORT_DEBOUNCE_MS : CHANGE_DEBOUNCE_MS);
  });

  document.addEventListener("visibilitychange", () => {
    // Al irse: subir lo que quedó. Al volver: bajar lo que pasó en otro lado.
    // Las dos mitades importan y por eso no se filtra por estado.
    void engine?.sync();
  });

  // Volver a tener internet es el mejor momento para reintentar, mucho mejor que
  // esperar el backoff.
  window.addEventListener("online", () => syncNow());
}

export function stopSyncRuntime(): void {
  accountSubscription?.unsubscribe();
  accountSubscription = null;
  detach();
  started = false;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): typeof state {
  return state;
}

/** El estado del sync, disponible desde cualquier pantalla. */
export function useSyncState(): typeof state {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
