/**
 * Cliente HTTP de Prosa Cloud.
 *
 * La clave ES el bearer: el servidor deriva el usuario de ella. Nunca aparece en
 * una URL, en un log ni en el estado de React fuera del flujo de creación.
 */

/**
 * La URL de la API pública.
 *
 * Es un host sslip.io y no `api.prosa.davhera.com` por una razón concreta: sslip.io
 * resuelve cualquier `*.46.225.147.90.sslip.io` a esa IP sin tocar el DNS de
 * davhera.com, que vive en Vercel. Así el respaldo funciona HOY. Cuando exista el
 * registro A de api.prosa.davhera.com se cambia esta constante y el `connect-src`
 * de la CSP en next.config.ts; el servidor no cambia (Caddy sirve los dos nombres).
 *
 * Vacía = no hay servidor: `syncAvailable()` devuelve false y Ajustes dice que el
 * respaldo no está disponible, en vez de ofrecer un botón que falla siempre.
 */
const DIRECT_API = "https://public.46.225.147.90.sslip.io";

export const API_BASE: string = import.meta.env["VITE_PROSA_API"] ?? DIRECT_API;

/**
 * El mismo servidor por davhera.com (rewrite en next.config.ts). Hay ISP que no
 * enrutan la IP del VPS; para ellos la directa se cuelga y este camino sí llega.
 * No es el camino por defecto porque el servidor limita la creación de cuentas
 * por IP, y por el proxy todos comparten la de Vercel.
 */
export const PROXY_API = "/prosa-api/public";

let resolvedBase: Promise<string> | null = null;
let currentBase = API_BASE;

/**
 * Decide UNA vez por sesión qué camino usar: un health directo con 4 s de tope.
 * Se prueba con un GET idempotente y no reintentando la request real, porque un
 * POST que "falló" pudo haber llegado.
 */
export function resolveApiBase(): Promise<string> {
  if (API_BASE !== DIRECT_API) return Promise.resolve(API_BASE);
  resolvedBase ??= fetch(`${DIRECT_API}/v1/health`, { signal: AbortSignal.timeout(4000) })
    .then(() => DIRECT_API)
    .catch(() => PROXY_API)
    .then((base) => (currentBase = base));
  return resolvedBase;
}

export function syncAvailable(): boolean {
  return API_BASE !== "";
}

export interface Change {
  change_id: string;
  entity_type: string;
  entity_id: string;
  change_type: string;
  client_timestamp: string;
  payload: Record<string, unknown>;
}

export interface PushResult {
  accepted: number;
  superseded: string[];
  conflicts: { change_id: string; reason: string }[];
  latest_seq: number;
}

export interface PullResult {
  changes: (Change & { seq: number; server_timestamp: string })[];
  latest_seq: number;
  has_more: boolean;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown,
  ) {
    super(`HTTP ${status}`);
  }
}

export class ProsaClient {
  private readonly baseOverride: string | undefined;

  constructor(
    private readonly key: string,
    base?: string,
  ) {
    // `undefined` explícito (como pasa el runtime cuando no hay override) cae en
    // el camino que resuelva resolveApiBase().
    this.baseOverride = base;
  }

  private async url(path: string): Promise<string> {
    return `${this.baseOverride ?? (await resolveApiBase())}${path}`;
  }

  private headers(extra: Record<string, string> = {}): Record<string, string> {
    return { Authorization: `Bearer ${this.key}`, ...extra };
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(await this.url(path), init);
    if (!response.ok) {
      throw new ApiError(response.status, await response.json().catch(() => null));
    }
    return (await response.json()) as T;
  }

  static async available(
    handle: string,
    base?: string,
  ): Promise<{ available: boolean; spots_left: number }> {
    base ??= await resolveApiBase();
    const response = await fetch(`${base}/v1/handles/${encodeURIComponent(handle)}/available`);
    if (!response.ok) throw new ApiError(response.status, null);
    return (await response.json()) as { available: boolean; spots_left: number };
  }

  static async createAccount(
    handle: string,
    base?: string,
  ): Promise<{ handle: string; key: string }> {
    base ??= await resolveApiBase();
    const response = await fetch(`${base}/v1/accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle }),
    });
    if (!response.ok) {
      throw new ApiError(response.status, await response.json().catch(() => null));
    }
    return (await response.json()) as { handle: string; key: string };
  }

  me(): Promise<{
    handle: string;
    doc_count: number;
    bytes_used: number;
    limits: { documents: number; bytes: number };
  }> {
    return this.request("/v1/accounts/me", { headers: this.headers() });
  }

  deleteAccount(): Promise<{ deleted: boolean }> {
    return this.request("/v1/accounts/me", { method: "DELETE", headers: this.headers() });
  }

  push(deviceId: string, changes: Change[]): Promise<PushResult> {
    return this.request("/v1/sync/push", {
      method: "POST",
      headers: this.headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ device_id: deviceId, changes }),
    });
  }

  pull(since: number, deviceId: string, limit = 500): Promise<PullResult> {
    const query = new URLSearchParams({
      since: String(since),
      device_id: deviceId,
      limit: String(limit),
    });
    return this.request(`/v1/sync/pull?${query}`, { headers: this.headers() });
  }

  async putContent(documentId: string, markdown: string, contentHash: string): Promise<void> {
    const response = await fetch(await this.url(`/v1/documents/${documentId}/content`), {
      method: "PUT",
      headers: this.headers({
        "Content-Type": "text/markdown; charset=utf-8",
        "X-Content-Hash": contentHash,
      }),
      body: markdown,
    });
    if (!response.ok) {
      throw new ApiError(response.status, await response.json().catch(() => null));
    }
  }

  async getContent(documentId: string): Promise<string | null> {
    const response = await fetch(await this.url(`/v1/documents/${documentId}/content`), {
      headers: this.headers(),
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new ApiError(response.status, null);
    return response.text();
  }

  /**
   * Envío final al backgroundear la pestaña. `keepalive` deja que la request
   * sobreviva a que la página se cierre — es el equivalente web de guardar al
   * salir, y sin él el último tramo de lectura no llega nunca al servidor.
   */
  flushPosition(deviceId: string, changes: Change[]): void {
    // Síncrono a propósito (la pestaña se está yendo): usa el camino ya resuelto.
    void fetch(`${this.baseOverride ?? currentBase}/v1/sync/push`, {
      method: "POST",
      headers: this.headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ device_id: deviceId, changes }),
      keepalive: true,
    }).catch(() => {
      // Si falla, el cambio sigue sin marcar como sincronizado y se reintenta en
      // la próxima apertura. No hay nada que avisar acá.
    });
  }
}
