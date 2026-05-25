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

function defaultState(): LeadState {
  return {
    session_id: isBrowser() ? getSessionId() : "",
    step: 1,
    status: "partial",
  };
}

export function loadLeadState(): LeadState {
  if (!isBrowser()) return { session_id: "", step: 1, status: "partial" };
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState();
  try {
    const parsed = JSON.parse(raw) as LeadState;
    if (!parsed.session_id) parsed.session_id = getSessionId();
    return parsed;
  } catch {
    return defaultState();
  }
}

export function saveLeadStep(
  step: LeadStep,
  partial: Partial<LeadState>,
): LeadState {
  if (!isBrowser()) {
    return { ...defaultState(), ...partial, step };
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
  void sendLeadStep(next);
  return next;
}

export function resetLeadState(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(SESSION_KEY);
}

// Subscribe API for useSyncExternalStore so React components can read the
// lead state without calling setState in a useEffect (which React 19's new
// rules now flag).
type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeLeadState(listener: Listener): () => void {
  listeners.add(listener);
  if (isBrowser()) {
    window.addEventListener("storage", listener);
  }
  return () => {
    listeners.delete(listener);
    if (isBrowser()) {
      window.removeEventListener("storage", listener);
    }
  };
}

function notify() {
  for (const l of listeners) l();
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
  notify();
  return Promise.resolve();
}
