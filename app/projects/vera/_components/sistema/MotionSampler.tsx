"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

interface Ease {
  token: string;
  curve: [number, number, number, number];
  durationMs: number;
  description: string;
}

const EASES: Ease[] = [
  { token: "--ease-out",      curve: [0.2, 0.0, 0.0, 1.0],    durationMs: 240, description: "Out · default snappy out" },
  { token: "--ease-snap",     curve: [0.32, 0.72, 0.0, 1.0],  durationMs: 240, description: "Snap · default for most interactions" },
  { token: "--ease-glide",    curve: [0.4, 0.0, 0.2, 1.0],    durationMs: 400, description: "Glide · hero moments only" },
  { token: "--ease-emphasis", curve: [0.16, 1.0, 0.3, 1.0],   durationMs: 400, description: "Emphasis · dramatic curve, used sparingly" },
];

const DURATIONS = [
  { token: "--dur-instant", ms: 60 },
  { token: "--dur-quick",   ms: 100 },
  { token: "--dur-base",    ms: 180 },
  { token: "--dur-snap",    ms: 240 },
  { token: "--dur-smooth",  ms: 400 },
  { token: "--dur-ambient", ms: 800 },
];

export function MotionSampler() {
  const [keys, setKeys] = useState<Record<string, number>>({});
  const reduce = useReducedMotion();

  const replay = (token: string) => {
    setKeys((k) => ({ ...k, [token]: (k[token] ?? 0) + 1 }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {EASES.map((e) => (
          <div
            key={e.token}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(180px, 220px) 1fr auto",
              gap: "var(--space-4)",
              padding: "var(--space-4)",
              background: "var(--bg-raised)",
              border: "1px solid var(--rule)",
              borderRadius: "var(--radius-md)",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
              <span
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "var(--text-sm)",
                  color: "var(--ink)",
                }}
              >
                {e.token}
              </span>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>{e.description}</span>
            </div>
            <div
              style={{
                position: "relative",
                height: "32px",
                background: "var(--bg-sunken)",
                borderRadius: "var(--radius-sm)",
                overflow: "hidden",
              }}
            >
              <motion.div
                key={`${e.token}-${keys[e.token] ?? 0}`}
                initial={{ x: 0 }}
                animate={{ x: "calc(100% - 24px)" }}
                transition={{
                  duration: reduce ? 0.1 : e.durationMs / 1000,
                  ease: reduce ? "linear" : e.curve,
                }}
                style={{
                  width: 24,
                  height: 24,
                  background: "var(--accent)",
                  borderRadius: "var(--radius-xs)",
                  margin: "4px 0",
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => replay(e.token)}
              style={{
                fontFamily: "var(--font-geist), sans-serif",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                letterSpacing: "var(--tracking-wider)",
                textTransform: "uppercase",
                color: "var(--accent)",
                background: "transparent",
                border: "1px solid var(--accent)",
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
              }}
            >
              Reproducir
            </button>
          </div>
        ))}
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "var(--text-sm)",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid var(--rule)" }}>
            <th
              style={{
                textAlign: "left",
                padding: "var(--space-3)",
                fontSize: "var(--text-xs)",
                fontFamily: "var(--font-geist), sans-serif",
                fontWeight: 500,
                letterSpacing: "var(--tracking-wider)",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              Duración
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "var(--space-3)",
                fontSize: "var(--text-xs)",
                fontFamily: "var(--font-geist), sans-serif",
                fontWeight: 500,
                letterSpacing: "var(--tracking-wider)",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              Valor
            </th>
          </tr>
        </thead>
        <tbody>
          {DURATIONS.map((d) => (
            <tr key={d.token} style={{ borderBottom: "1px solid var(--rule-faint)" }}>
              <td style={{ padding: "var(--space-3)", color: "var(--ink)" }}>{d.token}</td>
              <td style={{ padding: "var(--space-3)", textAlign: "right", color: "var(--ink-soft)" }}>
                {d.ms}ms
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
