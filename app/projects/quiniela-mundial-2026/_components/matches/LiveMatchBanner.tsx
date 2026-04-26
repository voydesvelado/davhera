"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCountdown, formatCountdown } from "../../_hooks/useCountdown";
import type { SelectableMatch } from "../../_data/matchesData";

interface LiveMatchBannerProps {
  match: SelectableMatch | null;
  windowEndsAt: number | null;
  onParticipate: () => void;
}

function statusLabel(status: SelectableMatch["status"]): string {
  if (status === "halftime") return "Medio tiempo";
  if (status === "live") return "En vivo";
  return "";
}

export function LiveMatchBanner({ match, windowEndsAt, onParticipate }: LiveMatchBannerProps) {
  const reduced = useReducedMotion();
  const countdown = useCountdown(windowEndsAt);

  if (!match) return null;

  return (
    <motion.section
      role="region"
      aria-label="Partido en vivo destacado"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative mx-4 mt-4 rounded-[20px] border border-[rgb(0_230_118_/_0.2)] bg-stadium-surface p-5"
      style={{
        boxShadow:
          "0 8px 32px rgb(0 0 0 / 0.3), 0 0 60px rgb(0 230 118 / 0.08)",
      }}
    >
      <div className="flex items-center gap-2">
        <motion.span
          aria-hidden="true"
          className="block h-1.5 w-1.5 rounded-full bg-stadium-pitch"
          animate={reduced ? undefined : { scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
          transition={
            reduced
              ? undefined
              : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-stadium-pitch">
          Partido en vivo
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl leading-none" aria-hidden="true">
            {match.homeTeam.flag}
          </span>
          <span className="text-sm font-bold text-stadium-text-primary">
            {match.homeTeam.code}
          </span>
        </div>
        <div className="font-mono text-[24px] font-black tabular-nums text-stadium-text-primary">
          <span>{match.score?.home ?? 0}</span>
          <span className="px-2 text-stadium-text-muted">–</span>
          <span>{match.score?.away ?? 0}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl leading-none" aria-hidden="true">
            {match.awayTeam.flag}
          </span>
          <span className="text-sm font-bold text-stadium-text-primary">
            {match.awayTeam.code}
          </span>
        </div>
      </div>

      <p className="mt-2 text-center text-[11px] text-stadium-text-muted">
        {statusLabel(match.status)} · Grupo {match.group}
      </p>

      <motion.button
        type="button"
        onClick={onParticipate}
        whileHover={reduced ? undefined : { y: -1 }}
        whileTap={reduced ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.15 }}
        aria-label={`Participar ahora en ${match.homeTeam.name} vs ${match.awayTeam.name}`}
        className="mt-4 flex w-full items-center justify-center rounded-[10px] bg-gradient-to-br from-stadium-pitch to-stadium-pitch-dark text-[15px] font-bold text-stadium-text-inverse shadow-[0_4px_20px_rgb(0_230_118_/_0.25)] hover:shadow-[0_6px_28px_rgb(0_230_118_/_0.35)] transition-shadow cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-surface"
        style={{ minHeight: 48 }}
      >
        PARTICIPAR AHORA →
      </motion.button>

      {windowEndsAt != null && !countdown.expired && (
        <p className="mt-3 text-center text-xs text-stadium-text-secondary">
          <span aria-hidden="true">⏱</span>{" "}
          La ventana cierra en{" "}
          <span className="font-mono font-semibold tabular-nums">
            {formatCountdown(countdown)}
          </span>
        </p>
      )}
    </motion.section>
  );
}
