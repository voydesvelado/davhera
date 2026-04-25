"use client";

import { useCountdown } from "../../_hooks/useCountdown";

interface CountdownTimerProps {
  targetMs: number;
  label?: string;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function CountdownTimer({ targetMs, label = "Empieza en" }: CountdownTimerProps) {
  const c = useCountdown(targetMs);
  const totalSeconds = Math.floor(c.remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (c.expired) {
    return (
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-stadium-text-muted">
          {label}
        </span>
        <span className="font-mono text-[24px] font-extrabold text-stadium-pitch">¡AHORA!</span>
      </div>
    );
  }

  const tile = (n: number, unit: string, key: string) => (
    <div key={key} className="flex flex-col items-center gap-1">
      <span className="rounded-[10px] bg-stadium-surface-elevated px-3 py-1.5 font-mono text-[24px] font-extrabold tabular-nums text-stadium-text-primary">
        {pad(n)}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-wider text-stadium-text-muted">
        {unit}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-stadium-text-muted">
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        {tile(hours, "hrs", "h")}
        <span className="font-mono text-[20px] font-medium text-stadium-text-muted">:</span>
        {tile(minutes, "min", "m")}
        <span className="font-mono text-[20px] font-medium text-stadium-text-muted">:</span>
        {tile(seconds, "seg", "s")}
      </div>
    </div>
  );
}
