"use client";

import { motion } from "framer-motion";
import type { Match, MatchStatus } from "../_lib/types";

interface MatchHeaderProps {
  match: Match;
}

const STATUS_LABEL: Record<MatchStatus, string> = {
  upcoming: "PRÓXIMO",
  live: "EN VIVO",
  halftime: "MEDIO TIEMPO",
  finished: "FINAL",
};

function StatusBadge({ status }: { status: MatchStatus }) {
  const base = "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.05em]";
  if (status === "live") {
    return (
      <span className={`${base} bg-stadium-coral-glow text-stadium-coral`}>
        <motion.span
          aria-hidden="true"
          className="block h-1.5 w-1.5 rounded-full bg-stadium-coral"
          animate={{ scale: [1, 1.8, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {STATUS_LABEL.live}
      </span>
    );
  }
  if (status === "halftime") {
    return <span className={`${base} bg-stadium-gold-glow text-stadium-gold`}>{STATUS_LABEL.halftime}</span>;
  }
  if (status === "finished") {
    return <span className={`${base} bg-stadium-surface-hover text-stadium-text-muted`}>{STATUS_LABEL.finished}</span>;
  }
  return <span className={`${base} bg-stadium-surface-hover text-stadium-text-secondary`}>{STATUS_LABEL.upcoming}</span>;
}

export function MatchHeader({ match }: MatchHeaderProps) {
  return (
    <header
      role="banner"
      aria-label={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
      className="rounded-[14px] bg-stadium-surface-elevated px-4 py-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col items-center gap-1.5 min-w-[56px]">
          <span className="text-[32px] leading-none" aria-hidden="true">{match.homeTeam.flag}</span>
          <span className="text-[13px] font-bold uppercase tracking-wide text-stadium-text-primary">
            {match.homeTeam.code}
          </span>
        </div>

        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="font-mono text-[32px] font-black leading-none text-stadium-text-primary tabular-nums">
            <span>{match.score.home}</span>
            <span className="text-stadium-text-muted px-2">–</span>
            <span>{match.score.away}</span>
          </div>
          <StatusBadge status={match.status} />
        </div>

        <div className="flex flex-col items-center gap-1.5 min-w-[56px]">
          <span className="text-[32px] leading-none" aria-hidden="true">{match.awayTeam.flag}</span>
          <span className="text-[13px] font-bold uppercase tracking-wide text-stadium-text-primary">
            {match.awayTeam.code}
          </span>
        </div>
      </div>
    </header>
  );
}
