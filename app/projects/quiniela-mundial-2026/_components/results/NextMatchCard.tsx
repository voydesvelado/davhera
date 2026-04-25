"use client";

import { useEffect, useState } from "react";
import type { NextMatch } from "../../_data/mockResults";

interface NextMatchCardProps {
  match: NextMatch;
  storageKey?: string;
}

const DEFAULT_KEY = "quiniela:nextMatchReminder:v1";

export function NextMatchCard({ match, storageKey = DEFAULT_KEY }: NextMatchCardProps) {
  const [reminded, setReminded] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setReminded(window.localStorage.getItem(storageKey) === "1");
    } catch {
      /* ignore */
    }
  }, [storageKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const toggle = () => {
    const next = !reminded;
    setReminded(next);
    if (typeof window === "undefined") return;
    try {
      if (next) window.localStorage.setItem(storageKey, "1");
      else window.localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  };

  return (
    <section
      aria-label="Siguiente partido"
      className="relative overflow-hidden rounded-[20px] border border-stadium-border-subtle bg-stadium-surface px-5 py-5"
      style={{
        borderLeft: "3px solid var(--color-stadium-pitch)",
      }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-stadium-text-muted">
        Siguiente partido
      </p>

      <div className="mt-4 flex items-center justify-center gap-3">
        <span className="text-[26px] leading-none" aria-hidden="true">{match.homeTeam.flag}</span>
        <span className="text-[14px] font-bold uppercase tracking-wide text-stadium-text-primary">
          {match.homeTeam.code}
        </span>
        <span className="text-[13px] font-medium text-stadium-text-muted">vs</span>
        <span className="text-[14px] font-bold uppercase tracking-wide text-stadium-text-primary">
          {match.awayTeam.code}
        </span>
        <span className="text-[26px] leading-none" aria-hidden="true">{match.awayTeam.flag}</span>
      </div>

      <p className="mt-1 text-center text-[13px] text-stadium-text-secondary">{match.date}</p>
      <p className="text-center text-[11px] text-stadium-text-muted">{match.group}</p>

      <button
        type="button"
        onClick={toggle}
        className={`mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] px-4 text-[14px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-surface ${
          reminded
            ? "bg-stadium-pitch-glow text-stadium-pitch"
            : "bg-stadium-surface-elevated text-stadium-text-primary hover:bg-stadium-surface-hover"
        }`}
        style={{ minHeight: 48 }}
      >
        <span aria-hidden="true">🔔</span>
        {reminded ? "RECORDATORIO ACTIVADO ✓" : "ACTIVAR RECORDATORIO"}
      </button>
    </section>
  );
}
