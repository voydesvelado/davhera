import { useEffect, useState } from "react";

import { db } from "../../core/db/schema";

/**
 * Preferencias de lectura: globales (no por documento) y aplicadas en vivo. Se
 * guardan en `meta`, no en `localStorage`.
 */
export interface ReadingSettings {
  family: "serif" | "sans";
  /** 16–22px. */
  size: number;
  /** 1.4–1.7. */
  lineHeight: number;
  theme: "system" | "light" | "sepia" | "dark" | "black";
}

export const DEFAULT_SETTINGS: ReadingSettings = {
  family: "serif",
  size: 18,
  lineHeight: 1.55,
  theme: "system",
};

const KEY = "readingSettings";

export function useReadingSettings(): [ReadingSettings, (next: Partial<ReadingSettings>) => void] {
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    void db.meta.get(KEY).then((record) => {
      if (record?.value) setSettings({ ...DEFAULT_SETTINGS, ...(record.value as ReadingSettings) });
    });
  }, []);

  const update = (next: Partial<ReadingSettings>) => {
    setSettings((current) => {
      const merged = { ...current, ...next };
      void db.meta.put({ key: KEY, value: merged });
      return merged;
    });
  };

  return [settings, update];
}

/** El `data-theme` que corresponde, resolviendo "system" contra el navegador. */
export function resolveTheme(theme: ReadingSettings["theme"]): string {
  if (theme !== "system") return theme;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
