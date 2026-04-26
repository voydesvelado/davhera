"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Team } from "../../_lib/types";

interface NextMatchCardMatch {
  homeTeam: Team;
  awayTeam: Team;
  date: string | number | Date;
  group: string;
}

interface NextMatchCardProps {
  match: NextMatchCardMatch;
  onReminder?: () => void;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function getRelativeDate(value: string | number | Date): string {
  if (typeof value === "string") return value;
  const target = value instanceof Date ? value : new Date(value);
  const now = new Date();
  const diffDays = Math.round((startOfDay(target) - startOfDay(now)) / DAY_MS);
  const time = `${target.getHours()}:${pad(target.getMinutes())}`;

  if (diffDays === 0) return `Hoy · ${time}`;
  if (diffDays === 1) return `Mañana · ${time}`;
  if (diffDays > 1 && diffDays < 7) {
    const weekday = target.toLocaleDateString("es-MX", { weekday: "long" });
    return `${weekday[0].toUpperCase()}${weekday.slice(1)} · ${time}`;
  }
  const fmt = target.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
  return `${fmt} · ${time}`;
}

export function NextMatchCard({ match, onReminder }: NextMatchCardProps) {
  const [reminded, setReminded] = useState(false);

  const toggle = () => {
    setReminded((prev) => !prev);
    onReminder?.();
  };

  const dateLabel = getRelativeDate(match.date);

  return (
    <motion.section
      aria-label="Siguiente partido"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden rounded-[20px] border border-stadium-border-subtle bg-stadium-surface px-5 py-5"
      style={{ borderLeft: "3px solid var(--color-stadium-pitch)" }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-stadium-text-muted">
        Siguiente partido
      </p>

      <div className="mt-4 flex items-center justify-center gap-3">
        <span className="text-[26px] leading-none" aria-hidden="true">
          {match.homeTeam.flag}
        </span>
        <span className="text-[14px] font-bold uppercase tracking-wide text-stadium-text-primary">
          {match.homeTeam.code}
        </span>
        <span className="text-[13px] font-medium text-stadium-text-muted">vs</span>
        <span className="text-[14px] font-bold uppercase tracking-wide text-stadium-text-primary">
          {match.awayTeam.code}
        </span>
        <span className="text-[26px] leading-none" aria-hidden="true">
          {match.awayTeam.flag}
        </span>
      </div>

      <p className="mt-1 text-center text-[13px] text-stadium-text-secondary">{dateLabel}</p>
      <p className="text-center text-[11px] text-stadium-text-muted">{match.group}</p>

      <button
        type="button"
        onClick={toggle}
        aria-pressed={reminded}
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
    </motion.section>
  );
}
