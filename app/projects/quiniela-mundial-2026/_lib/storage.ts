import type { StoredState, Answers } from "./types";

const SCHEMA_VERSION = 1 as const;

export function storageKey(matchId: string): string {
  return `quiniela:${matchId}:v${SCHEMA_VERSION}`;
}

export function loadState(matchId: string): StoredState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(matchId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    if (parsed.v !== SCHEMA_VERSION) return null;
    if (!parsed.answers || typeof parsed.currentIndex !== "number") return null;
    return parsed as StoredState;
  } catch {
    return null;
  }
}

export function saveState(matchId: string, answers: Answers, currentIndex: number): void {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredState = { v: SCHEMA_VERSION, answers, currentIndex };
    window.localStorage.setItem(storageKey(matchId), JSON.stringify(payload));
  } catch {
    /* quota exceeded or private mode — silent */
  }
}

export function clearState(matchId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(storageKey(matchId));
  } catch {
    /* silent */
  }
}
