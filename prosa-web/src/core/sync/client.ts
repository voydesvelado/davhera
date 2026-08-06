/**
 * Cliente HTTP de Prosa Cloud.
 *
 * La clave ES el bearer: el servidor deriva el usuario de ella. Nunca aparece en
 * una URL, en un log ni en el estado de React fuera del flujo de creación.
 */

export const API_BASE =
  import.meta.env["VITE_PROSA_API"] ?? "https://api.prosa.davhera.com";

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
  constructor(
    private readonly key: string,
    private readonly base: string = API_BASE,
  ) {}

  private headers(extra: Record<string, string> = {}): Record<string, string> {
    return { Authorization: `Bearer ${this.key}`, ...extra };
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.base}${path}`, init);
    if (!response.ok) {
      throw new ApiError(response.status, await response.json().catch(() => null));
    }
    return (await response.json()) as T;
  }

  static async available(
    handle: string,
    base: string = API_BASE,
  ): Promise<{ available: boolean; spots_left: number }> {
    const response = await fetch(`${base}/v1/handles/${encodeURIComponent(handle)}/available`);
    if (!response.ok) throw new ApiError(response.status, null);
    return (await response.json()) as { available: boolean; spots_left: number };
  }

  static async createAccount(
    handle: string,
    base: string = API_BASE,
  ): Promise<{ handle: string; key: string }> {
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
    const response = await fetch(`${this.base}/v1/documents/${documentId}/content`, {
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
    const response = await fetch(`${this.base}/v1/documents/${documentId}/content`, {
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
    void fetch(`${this.base}/v1/sync/push`, {
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
