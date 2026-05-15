"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

interface EaseRow {
  token: string;
  cubicBezier: [number, number, number, number];
  durationMs: number;
}

const EASES: EaseRow[] = [
  { token: "--ease-out",      cubicBezier: [0.2, 0, 0, 1],    durationMs: 400 },
  { token: "--ease-in-out",   cubicBezier: [0.4, 0, 0.2, 1],  durationMs: 400 },
  { token: "--ease-emphasis", cubicBezier: [0.16, 1, 0.3, 1], durationMs: 700 },
];

/**
 * Interactive motion sampler. Click "Reproducir" to replay all three
 * curves in parallel. Honors prefers-reduced-motion (shorter, opacity only).
 */
export function MotionSampler() {
  const [playCount, setPlayCount] = useState(0);
  const reduce = useReducedMotion();

  return (
    <div style={{ margin: "var(--space-6) 0" }}>
      <button
        type="button"
        onClick={() => setPlayCount((c) => c + 1)}
        style={{
          fontFamily: "var(--font-fraunces), serif",
          fontVariationSettings: '"opsz" 9, "SOFT" 0',
          fontWeight: 600,
          fontSize: "11px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--accent)",
          background: "transparent",
          border: "1px solid var(--accent)",
          padding: "var(--space-3) var(--space-5)",
          cursor: "pointer",
          marginBottom: "var(--space-6)",
        }}
      >
        Reproducir
      </button>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        {EASES.map((e) => (
          <div
            key={e.token}
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1fr",
              gap: "var(--space-5)",
              alignItems: "center",
              padding: "var(--space-3) 0",
              borderBottom: "1px solid var(--rule-soft)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono-vera), monospace",
                  fontSize: "12px",
                  color: "var(--ink)",
                }}
              >
                {e.token}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono-vera), monospace",
                  fontSize: "11px",
                  color: "var(--muted)",
                }}
              >
                {e.durationMs}ms · cubic-bezier({e.cubicBezier.join(", ")})
              </span>
            </div>
            <div
              style={{
                position: "relative",
                height: "32px",
                background: "var(--bg-2)",
                overflow: "hidden",
              }}
            >
              <motion.div
                key={`${e.token}-${playCount}`}
                initial={{ x: 0 }}
                animate={{ x: "calc(100% - 24px)" }}
                transition={{
                  duration: reduce ? 0.15 : e.durationMs / 1000,
                  ease: reduce ? "linear" : e.cubicBezier,
                }}
                style={{
                  width: "24px",
                  height: "24px",
                  background: "var(--accent)",
                  borderRadius: "var(--radius-sm)",
                  margin: "4px 0",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "var(--space-6)",
          fontFamily: "var(--font-newsreader), serif",
          fontStyle: "italic",
          fontSize: "14px",
          color: "var(--muted)",
        }}
      >
        Duraciones disponibles: --dur-instant (100ms) · --dur-fast (150ms) · --dur-base (250ms) ·
        --dur-slow (400ms) · --dur-ambient (700ms).
      </div>
    </div>
  );
}
