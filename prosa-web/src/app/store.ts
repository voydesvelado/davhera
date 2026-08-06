import { db } from "../core/db/schema";
import { DocumentStore } from "../core/db/store";

/**
 * El `deviceId` identifica este navegador en el oplog de sync. Se genera una vez,
 * al primer uso, y no cambia nunca: si cambiara, el servidor devolvería en cada
 * pull los cambios que este mismo dispositivo acaba de mandar.
 */
async function resolveDeviceId(): Promise<string> {
  const existing = await db.meta.get("deviceId");
  if (typeof existing?.value === "string") return existing.value;

  const deviceId = `web-${crypto.randomUUID()}`;
  await db.meta.put({ key: "deviceId", value: deviceId });
  return deviceId;
}

let storePromise: Promise<DocumentStore> | null = null;

export function getStore(): Promise<DocumentStore> {
  storePromise ??= resolveDeviceId().then((deviceId) => new DocumentStore(db, deviceId));
  return storePromise;
}

/**
 * Pide al navegador que no borre la biblioteca cuando ande corto de espacio.
 * Chrome casi siempre concede; Safari a veces. Es una de las tres defensas contra
 * la evicción — las otras dos son el export y el respaldo con @.
 */
export async function requestPersistence(): Promise<boolean> {
  if (!navigator.storage?.persist) return false;
  if (await navigator.storage.persisted?.()) return true;
  return navigator.storage.persist();
}

export async function storageEstimate(): Promise<{ used: number; quota: number } | null> {
  if (!navigator.storage?.estimate) return null;
  const { usage = 0, quota = 0 } = await navigator.storage.estimate();
  return { used: usage, quota };
}
