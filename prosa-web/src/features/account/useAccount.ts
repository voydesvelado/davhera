import { useCallback, useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { db } from "../../core/db/schema";
import { ProsaClient } from "../../core/sync/client";
import { SyncEngine, type SyncState } from "../../core/sync/engine";
import { getStore } from "../../app/store";

/**
 * La cuenta y el motor de sync, atados al ciclo de vida de la app.
 *
 * Disparadores (PROSA_WEB_SPEC §8): al cargar, tras cada import, con debounce de
 * 30s tras cambios, al backgroundear la pestaña, y el botón manual. Todo silencioso
 * salvo la fila de Ajustes.
 */

const CHANGE_DEBOUNCE_MS = 30_000;

export function useAccount() {
  const account = useLiveQuery(() => db.accountKey.get("current"), []);
  const [state, setState] = useState<SyncState>({
    status: "idle",
    lastSyncedAt: null,
    error: null,
  });
  const engineRef = useRef<SyncEngine | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!account) {
      engineRef.current?.stop();
      engineRef.current = null;
      return;
    }

    let cancelled = false;
    void (async () => {
      const store = await getStore();
      const deviceId = String((await db.meta.get("deviceId"))?.value ?? "web-unknown");
      if (cancelled) return;

      const engine = new SyncEngine(
        db,
        store,
        new ProsaClient(account.key),
        deviceId,
        setState,
      );
      engineRef.current = engine;

      const lastSynced = (await db.meta.get("lastSyncedAt"))?.value;
      if (typeof lastSynced === "string") {
        setState((current) => ({ ...current, lastSyncedAt: lastSynced }));
      }

      // Al cargar la app.
      void engine.sync();
    })();

    return () => {
      cancelled = true;
      engineRef.current?.stop();
    };
  }, [account]);

  // Al backgroundear: es donde se pierde el último tramo si no se fuerza.
  useEffect(() => {
    const onHidden = () => {
      if (document.visibilityState === "hidden") void engineRef.current?.sync();
    };
    document.addEventListener("visibilitychange", onHidden);
    return () => document.removeEventListener("visibilitychange", onHidden);
  }, []);

  // Debounce de 30s tras cambios locales: sincronizar en cada tecla sería ruido.
  useEffect(() => {
    if (!account) return;
    const onCreating = () => {
      if (debounce.current) clearTimeout(debounce.current);
      debounce.current = setTimeout(() => void engineRef.current?.sync(), CHANGE_DEBOUNCE_MS);
    };
    db.changeLog.hook("creating", onCreating);
    return () => {
      db.changeLog.hook("creating").unsubscribe(onCreating);
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [account]);

  const syncNow = useCallback(() => engineRef.current?.sync(), []);

  const signOut = useCallback(async () => {
    // Solo se borra la clave. La biblioteca local queda intacta y el respaldo del
    // servidor también: cerrar sesión no es borrar nada.
    engineRef.current?.stop();
    await db.accountKey.delete("current");
  }, []);

  const deleteAccount = useCallback(async () => {
    if (!account) return;
    await new ProsaClient(account.key).deleteAccount();
    await db.accountKey.delete("current");
    await db.meta.delete("lastSeq");
    await db.meta.delete("lastSyncedAt");
  }, [account]);

  return { account, state, syncNow, signOut, deleteAccount };
}

/** "hace 2 min", sin librería de fechas. */
export function relativeTime(iso: string | null, locale: "es" | "en"): string | null {
  if (!iso) return null;
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  const units: [number, string, string][] = [
    [60, "s", "s"],
    [3600, "min", "min"],
    [86400, "h", "h"],
  ];
  if (seconds < 60) return locale === "es" ? "hace segundos" : "seconds ago";
  for (const [limit, es, en] of units) {
    if (seconds < limit * 60 && limit >= 60) {
      const value = Math.round(seconds / limit);
      return locale === "es" ? `hace ${value} ${es}` : `${value} ${en} ago`;
    }
  }
  const days = Math.round(seconds / 86400);
  return locale === "es" ? `hace ${days} d` : `${days} d ago`;
}
