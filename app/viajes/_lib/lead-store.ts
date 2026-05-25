export type LeadStep = 1 | 2 | 3 | 4;

export type LeadState = {
  session_id: string;
  step: LeadStep;
  status: "partial" | "completo";
  // Step 1
  trip_slug?: string;
  trip_name?: string;
  fecha_salida?: string;
  fecha_regreso?: string;
  // Step 2
  nombre?: string;
  whatsapp?: string;
  email?: string;
  // Step 3
  personas_adultos?: number;
  personas_ninos?: number;
  presupuesto_rango?: string;
  notas?: string;
  // Meta
  updated_at?: string;
};

const STORAGE_KEY = "viajes_lead_state";
const SESSION_KEY = "viajes_lead_session_id";

const SSR_FALLBACK: LeadState = Object.freeze({
  session_id: "",
  step: 1,
  status: "partial",
}) as LeadState;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function newSessionId(): string {
  if (isBrowser() && typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getSessionId(): string {
  if (!isBrowser()) return "";
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = newSessionId();
  window.localStorage.setItem(SESSION_KEY, id);
  return id;
}

function readFromStorage(): LeadState {
  if (!isBrowser()) return SSR_FALLBACK;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      session_id: getSessionId(),
      step: 1,
      status: "partial",
    };
  }
  try {
    const parsed = JSON.parse(raw) as LeadState;
    if (!parsed.session_id) parsed.session_id = getSessionId();
    return parsed;
  } catch {
    return {
      session_id: getSessionId(),
      step: 1,
      status: "partial",
    };
  }
}

// `useSyncExternalStore` requires `getSnapshot` to return a referentially
// stable value when the underlying data hasn't changed — otherwise React
// throws "The result of getSnapshot should be cached to avoid an infinite
// loop". We memoize the parsed state and only invalidate when saveLeadStep,
// resetLeadState, or a cross-tab storage event fires.
let cachedSnapshot: LeadState | null = null;

export function loadLeadState(): LeadState {
  if (!isBrowser()) return SSR_FALLBACK;
  if (cachedSnapshot) return cachedSnapshot;
  cachedSnapshot = readFromStorage();
  return cachedSnapshot;
}

function invalidateAndNotify(next?: LeadState) {
  cachedSnapshot = next ?? null;
  for (const l of listeners) l();
}

export function saveLeadStep(
  step: LeadStep,
  partial: Partial<LeadState>,
): LeadState {
  if (!isBrowser()) {
    return { ...SSR_FALLBACK, ...partial, step };
  }
  const current = loadLeadState();
  const next: LeadState = {
    ...current,
    ...partial,
    session_id: current.session_id || getSessionId(),
    step,
    status: partial.status ?? (step === 4 ? "completo" : "partial"),
    updated_at: new Date().toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  invalidateAndNotify(next);
  void sendLeadStep(next);
  return next;
}

export function resetLeadState(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(SESSION_KEY);
  invalidateAndNotify();
}

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeLeadState(listener: Listener): () => void {
  listeners.add(listener);
  const onStorage = () => {
    cachedSnapshot = null;
    listener();
  };
  if (isBrowser()) {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(listener);
    if (isBrowser()) {
      window.removeEventListener("storage", onStorage);
    }
  };
}

// Stubbed for now. When the Apps Script endpoint is ready, replace with:
//   await fetch(ENDPOINT, {
//     method: "POST",
//     body: JSON.stringify(state),
//     headers: { "Content-Type": "text/plain;charset=utf-8" },
//   });
async function sendLeadStep(state: LeadState): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    console.log("[lead]", state);
  }
  return Promise.resolve();
}
