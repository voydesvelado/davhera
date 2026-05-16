"use client";

import { useSyncExternalStore } from "react";
import { readVisitorData, STORAGE_EVENT, getEmptyVisitorData } from "../_lib/storage";
import type { VisitorData } from "../_lib/types";

const EMPTY = getEmptyVisitorData();

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onChange = () => callback();
  window.addEventListener(STORAGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(STORAGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

let cached: VisitorData | null = null;
let cachedJson: string | null = null;

function getSnapshot(): VisitorData {
  if (typeof window === "undefined") return EMPTY;
  // Cache by the serialized localStorage value to keep referential equality
  // stable between calls when the underlying data hasn't changed — required
  // by useSyncExternalStore.
  const raw = window.localStorage.getItem("vera_visitor_data_v1") ?? "";
  if (raw === cachedJson && cached) return cached;
  cachedJson = raw;
  cached = readVisitorData();
  return cached;
}

function getServerSnapshot(): VisitorData {
  return EMPTY;
}

export function useVisitorData(): VisitorData {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
