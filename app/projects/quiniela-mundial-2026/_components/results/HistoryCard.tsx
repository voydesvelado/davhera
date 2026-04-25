"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { PastMatch } from "../../_data/mockResults";

interface HistoryCardProps {
  match: PastMatch;
  index: number;
}

function HistoryCardImpl({ match, index }: HistoryCardProps) {
  const reduced = useReducedMotion();
  return (
    <motion.li
      role="listitem"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: reduced ? 0 : index * 0.06, ease: "easeOut" }}
      className="rounded-[10px] border border-stadium-border-subtle bg-stadium-surface px-4 py-3.5 transition-all duration-150 hover:-translate-y-px hover:border-stadium-border"
    >
      <p className="text-[11px] font-medium text-stadium-text-muted">
        {match.matchday} · {match.date}
      </p>
      <p className="mt-1 text-[14px] font-bold text-stadium-text-primary">
        {match.home} {match.score} {match.away}
      </p>
      <div className="mt-2.5 flex items-center gap-2.5">
        <div className="flex items-center gap-1" aria-label={`${match.correct} de ${match.total} aciertos`}>
          {Array.from({ length: match.total }).map((_, i) => {
            const filled = i < match.correct;
            return (
              <motion.span
                key={i}
                aria-hidden="true"
                className={`block h-2 w-2 rounded-full ${filled ? "bg-stadium-pitch" : "bg-stadium-surface-hover"}`}
                initial={reduced ? { scale: 1 } : { scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.18, delay: reduced ? 0 : 0.1 + i * 0.04 }}
              />
            );
          })}
        </div>
        <span className="text-[13px] font-medium text-stadium-text-secondary">
          {match.correct}/{match.total} aciertos
        </span>
        <span className="ml-auto font-mono text-[13px] font-bold text-stadium-pitch">
          +{match.points} pts
        </span>
      </div>
    </motion.li>
  );
}

export const HistoryCard = memo(HistoryCardImpl);
