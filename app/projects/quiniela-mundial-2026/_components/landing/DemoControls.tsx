"use client";

import type { MatchStatus } from "../../_lib/types";

interface DemoControlsProps {
  status: MatchStatus;
  onChange: (next: MatchStatus) => void;
}

const OPTIONS: { value: MatchStatus; label: string }[] = [
  { value: "halftime", label: "Medio T." },
  { value: "live", label: "En vivo" },
  { value: "upcoming", label: "Próximo" },
  { value: "finished", label: "Final" },
];

export function DemoControls({ status, onChange }: DemoControlsProps) {
  return (
    <div className="rounded-[14px] border border-stadium-border bg-stadium-deep px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-stadium-text-muted">
        Demo · Estado del partido
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5" role="tablist" aria-label="Estado del partido (demo)">
        {OPTIONS.map((opt) => {
          const active = opt.value === status;
          return (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(opt.value)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-1 focus-visible:ring-offset-stadium-deep ${
                active
                  ? "border border-stadium-pitch/30 bg-stadium-pitch-glow text-stadium-pitch"
                  : "border border-transparent bg-stadium-surface-elevated text-stadium-text-muted hover:text-stadium-text-secondary"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[9px] italic text-stadium-text-muted">
        Componente de demostración — no visible en producción.
      </p>
    </div>
  );
}
