"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CountdownTimer } from "./CountdownTimer";
import type { Match, MatchStatus } from "../../_lib/types";

interface MatchCardProps {
  match: Match;
  venue: string;
  group: string;
  matchday: string;
  status: MatchStatus;
  upcomingKickoffMs: number;
  onCta: () => void;
}

function statusBadge(status: MatchStatus) {
  const base = "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.05em]";
  switch (status) {
    case "halftime":
      return (
        <span className={`${base} bg-stadium-gold-glow text-stadium-gold`}>
          <span aria-hidden="true">⚽</span> Medio tiempo
        </span>
      );
    case "live":
      return (
        <span className={`${base} bg-stadium-coral-glow text-stadium-coral`}>
          <motion.span
            aria-hidden="true"
            className="block h-1.5 w-1.5 rounded-full bg-stadium-coral"
            animate={{ scale: [1, 1.6, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          En vivo
        </span>
      );
    case "finished":
      return <span className={`${base} bg-stadium-surface-hover text-stadium-text-muted`}>Finalizado</span>;
    default:
      return <span className={`${base} bg-stadium-surface-hover text-stadium-text-secondary`}>Próximo</span>;
  }
}

function ctaLabel(status: MatchStatus) {
  if (status === "upcoming") return "ACTIVAR RECORDATORIO";
  if (status === "finished") return "VER RESULTADOS";
  return "PARTICIPAR AHORA";
}

export function MatchCard({ match, venue, group, matchday, status, upcomingKickoffMs, onCta }: MatchCardProps) {
  const reduced = useReducedMotion();
  const isUpcoming = status === "upcoming";
  const isFinished = status === "finished";
  const showLiveGlow = status === "live" || status === "halftime";

  return (
    <motion.article
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.2 : 0.5, delay: reduced ? 0 : 0.5, ease: "easeOut" }}
      role="article"
      aria-label={`Partido ${match.homeTeam.name} vs ${match.awayTeam.name}`}
      className="relative mx-6 mt-8 overflow-hidden rounded-[20px] bg-stadium-surface px-6 py-7"
      style={{
        boxShadow: showLiveGlow
          ? "0 8px 32px rgb(0 0 0 / 0.3), 0 0 0 1px rgb(42 58 78 / 0.5), 0 0 60px rgb(0 230 118 / 0.06)"
          : "0 8px 32px rgb(0 0 0 / 0.3), 0 0 0 1px rgb(42 58 78 / 0.5)",
      }}
    >
      {/* Gradient top border */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
        style={{
          background: "linear-gradient(90deg, #00E676 0%, #FFD740 100%)",
        }}
      />

      {/* Metadata */}
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-stadium-text-muted">
        {group} · {matchday}
      </p>

      {/* Teams + score */}
      <div className="mt-5 grid grid-cols-3 items-center gap-2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[44px] leading-none" aria-hidden="true">{match.homeTeam.flag}</span>
          <span className="text-[13px] font-bold uppercase tracking-wide text-stadium-text-primary">
            {match.homeTeam.code}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center">
          {isUpcoming ? (
            <span className="font-display text-[28px] font-extrabold text-stadium-text-muted">VS</span>
          ) : (
            <div className="font-mono text-[40px] font-black leading-none tabular-nums text-stadium-text-primary">
              <span>{match.score.home}</span>
              <span className="px-2 text-stadium-text-muted">–</span>
              <span>{match.score.away}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-[44px] leading-none" aria-hidden="true">{match.awayTeam.flag}</span>
          <span className="text-[13px] font-bold uppercase tracking-wide text-stadium-text-primary">
            {match.awayTeam.code}
          </span>
        </div>
      </div>

      {/* Status / countdown */}
      <div className="mt-4 flex justify-center">
        {isUpcoming ? (
          upcomingKickoffMs > 0 ? (
            <CountdownTimer targetMs={upcomingKickoffMs} />
          ) : (
            <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-stadium-text-muted">
              EMPIEZA PRONTO
            </span>
          )
        ) : (
          statusBadge(status)
        )}
      </div>

      {/* CTA */}
      <motion.button
        type="button"
        onClick={onCta}
        whileHover={reduced ? undefined : { y: -1 }}
        whileTap={reduced ? undefined : { scale: 0.99 }}
        transition={{ duration: 0.15 }}
        aria-label={`${ctaLabel(status)} en la quiniela ${match.homeTeam.name} vs ${match.awayTeam.name}`}
        className={`relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] px-6 text-[16px] font-bold transition-shadow cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-surface ${
          isFinished
            ? "bg-stadium-surface-elevated text-stadium-text-primary border border-stadium-border"
            : "bg-gradient-to-br from-stadium-pitch to-stadium-pitch-dark text-stadium-text-inverse shadow-[0_4px_20px_rgb(0_230_118_/_0.3)] hover:shadow-[0_6px_28px_rgb(0_230_118_/_0.4)]"
        }`}
        style={{ minHeight: 56 }}
      >
        <span className="relative z-10">{ctaLabel(status)}</span>
        <span aria-hidden="true" className="relative z-10">→</span>
        {!reduced && !isFinished && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-0 block w-1/3"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgb(255 255 255 / 0.12) 50%, transparent 100%)",
              animation: "stadium-shimmer-sweep 3s ease-in-out 1s infinite",
            }}
          />
        )}
      </motion.button>

      {/* Venue */}
      <p className="mt-4 text-center text-[11px] text-stadium-text-muted">
        <span aria-hidden="true" className="mr-1">📍</span>
        {venue}
      </p>
    </motion.article>
  );
}
