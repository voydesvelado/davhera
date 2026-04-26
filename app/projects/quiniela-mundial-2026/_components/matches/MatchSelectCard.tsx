"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { SelectableMatch } from "../../_data/matchesData";

interface MatchSelectCardProps {
  match: SelectableMatch;
  onSelect: (match: SelectableMatch) => void;
  onUnavailable?: (message: string) => void;
}

function statusBadge(match: SelectableMatch) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.05em]";
  if (match.status === "live") {
    return (
      <span className={`${base} bg-stadium-coral-glow text-stadium-coral`}>
        <motion.span
          aria-hidden="true"
          className="block h-1.5 w-1.5 rounded-full bg-stadium-coral"
          animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        En vivo
      </span>
    );
  }
  if (match.status === "halftime") {
    return (
      <span className={`${base} bg-stadium-gold-glow text-stadium-gold`}>
        Medio tiempo
      </span>
    );
  }
  if (match.status === "finished") {
    return (
      <span className={`${base} bg-stadium-surface-hover text-stadium-text-muted`}>
        Finalizado
      </span>
    );
  }
  return (
    <span className={`${base} bg-stadium-surface-hover text-stadium-text-secondary`}>
      Próximo
    </span>
  );
}

export function MatchSelectCard({ match, onSelect, onUnavailable }: MatchSelectCardProps) {
  const reduced = useReducedMotion();
  const isLiveLike = match.status === "live" || match.status === "halftime";
  const showScore = match.status !== "upcoming" && match.score != null;
  const canParticipate = match.windowOpen === true && isLiveLike;
  const isInteractive = canParticipate;

  const handleCardClick = () => {
    if (canParticipate) {
      onSelect(match);
      return;
    }
    if (match.status === "upcoming") {
      onUnavailable?.("La ventana aún no abre");
    }
  };

  return (
    <motion.article
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={handleCardClick}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick();
              }
            }
          : undefined
      }
      whileTap={reduced || !isInteractive ? undefined : { scale: 0.98 }}
      whileHover={reduced || !isInteractive ? undefined : { y: -1 }}
      transition={{ duration: 0.15 }}
      className={`rounded-[14px] border p-4 transition-colors duration-150 ${
        canParticipate
          ? "border-stadium-pitch/30 bg-stadium-surface hover:bg-stadium-surface-hover cursor-pointer"
          : "border-stadium-border-subtle bg-stadium-surface"
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-midnight`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-stadium-text-muted">
        {match.matchday} · {match.date} · {match.time}
      </p>

      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none" aria-hidden="true">
            {match.homeTeam.flag}
          </span>
          <span className="text-sm font-bold text-stadium-text-primary">
            {match.homeTeam.code}
          </span>
        </div>

        {showScore && match.score ? (
          <div className="font-mono text-xl font-black tabular-nums text-stadium-text-primary">
            <span>{match.score.home}</span>
            <span className="px-1.5 text-stadium-text-muted">–</span>
            <span>{match.score.away}</span>
          </div>
        ) : (
          <span className="text-sm font-medium text-stadium-text-muted">VS</span>
        )}

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-stadium-text-primary">
            {match.awayTeam.code}
          </span>
          <span className="text-xl leading-none" aria-hidden="true">
            {match.awayTeam.flag}
          </span>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-center gap-2">
        {statusBadge(match)}
        {match.status === "finished" && match.hasParticipated && (
          <span className="inline-flex items-center gap-1 rounded-full bg-stadium-pitch-glow px-2 py-0.5 text-[10px] font-semibold text-stadium-pitch">
            Participaste ✓
          </span>
        )}
        {match.status === "finished" && !match.hasParticipated && (
          <span className="text-[10px] text-stadium-text-muted">No participaste</span>
        )}
      </div>

      {canParticipate && (
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(match);
          }}
          whileTap={reduced ? undefined : { scale: 0.98 }}
          transition={{ duration: 0.1 }}
          aria-label={`Participar en ${match.homeTeam.name} vs ${match.awayTeam.name}`}
          className="mt-3 flex w-full items-center justify-center rounded-[10px] bg-stadium-pitch text-sm font-bold text-stadium-text-inverse hover:bg-stadium-pitch-dark transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-midnight"
          style={{ minHeight: 40 }}
        >
          PARTICIPAR →
        </motion.button>
      )}
    </motion.article>
  );
}
