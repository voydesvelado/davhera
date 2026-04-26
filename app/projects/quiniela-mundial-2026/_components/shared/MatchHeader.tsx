"use client";

import { motion } from "framer-motion";
import type { Match, MatchStatus } from "../../_lib/types";

type MatchHeaderSize = "compact" | "hero";

interface MatchHeaderProps {
  match: Match & { group?: string; matchday?: string };
  size?: MatchHeaderSize;
}

const STATUS_LABEL: Record<MatchStatus, string> = {
  upcoming: "PRÓXIMO",
  live: "EN VIVO",
  halftime: "MEDIO TIEMPO",
  finished: "FINALIZADO",
};

function StatusBadge({ status }: { status: MatchStatus }) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide";
  if (status === "live") {
    return (
      <span className={`${base} bg-stadium-coral-glow text-stadium-coral`}>
        <motion.span
          aria-hidden="true"
          className="block h-1.5 w-1.5 rounded-full bg-stadium-coral"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {STATUS_LABEL.live}
      </span>
    );
  }
  if (status === "halftime") {
    return (
      <span className={`${base} bg-stadium-gold-glow text-stadium-gold`}>
        {STATUS_LABEL.halftime}
      </span>
    );
  }
  if (status === "finished") {
    return (
      <span className={`${base} bg-stadium-surface-hover text-stadium-text-muted`}>
        {STATUS_LABEL.finished}
      </span>
    );
  }
  return (
    <span className={`${base} bg-stadium-surface-hover text-stadium-text-secondary`}>
      {STATUS_LABEL.upcoming}
    </span>
  );
}

export function MatchHeader({ match, size = "compact" }: MatchHeaderProps) {
  const isHero = size === "hero";
  const flagSize = isHero ? 48 : 32;
  const scoreSize = isHero ? 40 : 32;
  const containerPadding = isHero ? "px-5 py-6" : "px-4 py-5";
  const teamLabelClass = "font-bold uppercase tracking-wide text-stadium-text-primary";

  const homeLabel = isHero ? match.homeTeam.name.toUpperCase() : match.homeTeam.code;
  const awayLabel = isHero ? match.awayTeam.name.toUpperCase() : match.awayTeam.code;
  const meta =
    isHero && (match.group || match.matchday)
      ? [match.group, match.matchday].filter(Boolean).join(" · ")
      : null;

  return (
    <header
      role="banner"
      aria-label={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
      className={`rounded-[14px] bg-stadium-surface-elevated ${containerPadding}`}
    >
      {meta ? (
        <p className="mb-3 text-center text-[11px] uppercase tracking-wide text-stadium-text-muted">
          {meta}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-[64px] flex-col items-center gap-1.5">
          <span style={{ fontSize: flagSize, lineHeight: 1 }} aria-hidden="true">
            {match.homeTeam.flag}
          </span>
          <span className={`${teamLabelClass} ${isHero ? "text-[13px]" : "text-xs"}`}>
            {homeLabel}
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center gap-2">
          <div
            className="font-mono font-black leading-none tabular-nums text-stadium-text-primary"
            style={{ fontSize: scoreSize }}
          >
            <span>{match.score.home}</span>
            <span className="px-2 text-stadium-text-muted">–</span>
            <span>{match.score.away}</span>
          </div>
          <StatusBadge status={match.status} />
        </div>

        <div className="flex min-w-[64px] flex-col items-center gap-1.5">
          <span style={{ fontSize: flagSize, lineHeight: 1 }} aria-hidden="true">
            {match.awayTeam.flag}
          </span>
          <span className={`${teamLabelClass} ${isHero ? "text-[13px]" : "text-xs"}`}>
            {awayLabel}
          </span>
        </div>
      </div>
    </header>
  );
}
