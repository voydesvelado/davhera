"use client";

import type { ReactNode } from "react";

export interface Segment<T extends string> {
  value: T;
  label: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
  ariaLabel?: string;
}

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  size = "md",
  ariaLabel,
}: SegmentedControlProps<T>) {
  const height = size === "sm" ? 28 : 32;
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      style={{
        display: "inline-flex",
        background: "var(--bg-sunken)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-sm)",
        padding: 2,
        gap: 2,
      }}
    >
      {segments.map((s) => {
        const active = s.value === value;
        return (
          <button
            key={s.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(s.value)}
            style={{
              height: height - 4,
              padding: "0 var(--space-3)",
              background: active ? "var(--bg-raised)" : "transparent",
              color: active ? "var(--ink)" : "var(--muted)",
              border: "none",
              borderRadius: "calc(var(--radius-sm) - 2px)",
              fontFamily: "var(--font-geist), system-ui, sans-serif",
              fontSize: size === "sm" ? "var(--text-xs)" : "var(--text-sm)",
              fontWeight: active ? 500 : 400,
              cursor: "pointer",
              boxShadow: active ? "var(--shadow-sm)" : "none",
              transition:
                "background var(--dur-quick) var(--ease-snap), color var(--dur-quick) var(--ease-snap)",
            }}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
