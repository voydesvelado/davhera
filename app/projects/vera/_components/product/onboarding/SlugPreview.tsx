"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface SlugPreviewProps {
  slug: string;
}

export function SlugPreview({ slug }: SlugPreviewProps) {
  const [showAvailable, setShowAvailable] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowAvailable(false);
    if (!slug) return;
    const t = setTimeout(() => setShowAvailable(true), 400);
    return () => clearTimeout(t);
  }, [slug]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        padding: "var(--space-3)",
        background: "var(--bg-sunken)",
        borderRadius: "var(--radius-sm)",
        fontSize: "var(--text-sm)",
        color: "var(--muted)",
        fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
        flexWrap: "wrap",
      }}
    >
      Tu página será:{" "}
      <span style={{ color: "var(--accent)", fontWeight: 500 }}>vera.app/{slug || "tu-slug"}</span>
      {showAvailable && slug ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            color: "var(--success)",
            fontFamily: "var(--font-geist), system-ui, sans-serif",
            fontSize: "var(--text-xs)",
            marginLeft: "auto",
          }}
        >
          <Check size={12} strokeWidth={2.5} />
          disponible
        </span>
      ) : null}
    </div>
  );
}
