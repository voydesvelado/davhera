import { VisitorDataSchema } from "./schema";
import type { VisitorData } from "./types";
import { VISITOR_DATA_VERSION } from "./types";

export const STORAGE_KEY = "vera_visitor_data_v1";
export const STORAGE_EVENT = "vera:storage-change";

const EMPTY: VisitorData = { version: VISITOR_DATA_VERSION, bookings: [] };

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function readVisitorData(): VisitorData {
  if (!isBrowser()) return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    const result = VisitorDataSchema.safeParse(parsed);
    if (!result.success) return EMPTY;
    return result.data;
  } catch {
    return EMPTY;
  }
}

export function writeVisitorData(data: VisitorData): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
  } catch {
    // localStorage unavailable or quota exceeded — silent
  }
}

export function clearVisitorData(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
  } catch {
    // ignore
  }
}

export function getEmptyVisitorData(): VisitorData {
  return { version: VISITOR_DATA_VERSION, bookings: [] };
}
