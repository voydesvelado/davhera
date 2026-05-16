"use client";

import { useEffect, useRef } from "react";
import { useToast } from "./Toast";

/**
 * Small hook utility — schedule an "ephemeral" save confirmation toast
 * 800ms after the latest call to `notify()`. Subsequent notify() calls
 * within that window debounce.
 */
export function useEphemeralSave(): { notify: () => void } {
  const toast = useToast();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function notify() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      toast.show({
        tone: "success",
        message: "Cambios guardados (no se guarda en el demo)",
        durationMs: 2000,
      });
    }, 800);
  }

  return { notify };
}
