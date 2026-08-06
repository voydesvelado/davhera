import { useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { db } from "../../core/db/schema";
import { ProsaClient } from "../../core/sync/client";
import { syncNow, useSyncState } from "../../app/syncRuntime";

/**
 * La cuenta, tal como la ve la UI.
 *
 * El motor de sync NO vive acá: vive en `app/syncRuntime.ts` y arranca con la
 * app. Este hook solo lee su estado y expone las acciones de la cuenta. Cuando el
 * motor estaba montado en Ajustes, el respaldo únicamente ocurría con esa pantalla
 * abierta — que es exactamente lo que no tiene que pasar.
 */
export function useAccount() {
  const account = useLiveQuery(() => db.accountKey.get("current"), []);
  const state = useSyncState();

  const signOut = useCallback(async () => {
    // Solo se borra la clave local. La biblioteca de este navegador queda intacta
    // y el respaldo del servidor también: cerrar sesión no borra nada.
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
  if (seconds < 60) return locale === "es" ? "hace segundos" : "seconds ago";
  if (seconds < 3600) {
    const value = Math.round(seconds / 60);
    return locale === "es" ? `hace ${value} min` : `${value} min ago`;
  }
  if (seconds < 86400) {
    const value = Math.round(seconds / 3600);
    return locale === "es" ? `hace ${value} h` : `${value} h ago`;
  }
  const days = Math.round(seconds / 86400);
  return locale === "es" ? `hace ${days} d` : `${days} d ago`;
}
