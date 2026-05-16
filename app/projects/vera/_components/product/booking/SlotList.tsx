"use client";

import type { Slot } from "../../../_lib/types";
import { formatTime } from "../../../_lib/date-format";

interface SlotListProps {
  slots: Slot[];
  selectedIso: string | null;
  onSelect: (slot: Slot) => void;
  /** ISO of the visitor's "current" slot in reschedule context. */
  currentIso?: string | null;
  emptyMessage?: string;
}

export function SlotList({
  slots,
  selectedIso,
  onSelect,
  currentIso,
  emptyMessage = "No hay horarios disponibles este día.",
}: SlotListProps) {
  if (slots.length === 0) {
    return (
      <div
        style={{
          padding: "var(--space-8) var(--space-4)",
          textAlign: "center",
          fontSize: "var(--text-md)",
          color: "var(--muted)",
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      role="listbox"
      aria-label="Elige un horario"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-1_5)",
      }}
    >
      {slots.map((s) => {
        const iso = s.startsAt.toISOString();
        const selected = selectedIso === iso;
        const isCurrent = currentIso === iso;
        return (
          <button
            key={iso}
            type="button"
            role="option"
            aria-selected={selected}
            onClick={() => onSelect(s)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-3)",
              minHeight: "var(--row-height-base)",
              padding: "0 var(--space-4)",
              background: selected ? "var(--accent)" : isCurrent ? "var(--bg-sunken)" : "var(--bg-raised)",
              color: selected ? "var(--accent-ink)" : "var(--ink)",
              border: "1px solid",
              borderColor: selected ? "var(--accent)" : "var(--rule)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              fontFamily: "var(--font-geist), system-ui, sans-serif",
              transition:
                "background var(--dur-quick) var(--ease-snap), border-color var(--dur-quick) var(--ease-snap), color var(--dur-quick) var(--ease-snap)",
              textAlign: "left",
            }}
            className="vera-slot-row"
          >
            <span
              style={{
                fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                fontSize: "var(--text-lg)",
                fontWeight: 500,
                fontFeatureSettings: '"tnum" 1',
                color: selected ? "var(--accent-ink)" : "var(--accent)",
              }}
            >
              {formatTime(s.startsAt)}
            </span>
            <span
              style={{
                fontSize: "var(--text-sm)",
                color: selected ? "var(--accent-ink)" : "var(--ink-faint)",
                opacity: selected ? 0.8 : 1,
              }}
            >
              {isCurrent ? "(tu horario actual)" : `Hasta ${formatTime(s.endsAt)}`}
            </span>
            <style>{`
              .vera-slot-row:hover[aria-selected="false"] { border-color: var(--rule-strong); }
              .vera-slot-row:active { transform: scale(0.99); }
            `}</style>
          </button>
        );
      })}
    </div>
  );
}
