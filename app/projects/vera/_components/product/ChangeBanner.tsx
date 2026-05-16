"use client";

import { useEffect, useState } from "react";
import { CircleCheck, X } from "lucide-react";

interface ChangeBannerProps {
  storageKey: string;
  message: string;
  durationMs?: number;
}

export function ChangeBanner({ storageKey, message, durationMs = 8000 }: ChangeBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(storageKey) === "1") return;
    } catch {
      // ignore
    }
    setVisible(true);
    const t = setTimeout(() => dismiss(), durationMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  function dismiss() {
    setVisible(false);
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // ignore
    }
  }

  if (!visible) return null;

  return (
    <div
      role="status"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
        padding: "var(--space-3) var(--space-4)",
        background: "color-mix(in oklch, var(--success) 12%, var(--bg-raised))",
        border: "1px solid color-mix(in oklch, var(--success) 35%, var(--rule))",
        borderRadius: "var(--radius-md)",
        color: "var(--ink)",
        fontSize: "var(--text-sm)",
      }}
    >
      <CircleCheck size={16} strokeWidth={1.75} color="var(--success)" />
      <span style={{ flex: 1 }}>{message}</span>
      <button
        type="button"
        aria-label="Descartar aviso"
        onClick={dismiss}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          background: "transparent",
          color: "var(--muted)",
          border: "none",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
        }}
      >
        <X size={14} strokeWidth={1.75} />
      </button>
    </div>
  );
}
