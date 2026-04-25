"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { UpcomingMatch } from "../../_data/mockData";

interface UpcomingMatchesProps {
  matches: UpcomingMatch[];
}

export function UpcomingMatches({ matches }: UpcomingMatchesProps) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: reduced ? 0 : 1.0, ease: "easeOut" }}
      className="mt-8"
    >
      <h2 className="px-6 text-[12px] font-semibold uppercase tracking-[0.05em] text-stadium-text-muted">
        Próximos partidos
      </h2>
      <ul
        role="list"
        className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {matches.map((m) => (
          <li
            key={m.id}
            role="listitem"
            className="group flex w-[140px] shrink-0 snap-start flex-col items-center gap-2 rounded-[14px] border border-transparent bg-stadium-surface-elevated px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-stadium-pitch/30"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[22px] leading-none" aria-hidden="true">{m.homeFlag}</span>
              <span className="text-[10px] font-semibold uppercase text-stadium-text-muted">vs</span>
              <span className="text-[22px] leading-none" aria-hidden="true">{m.awayFlag}</span>
            </div>
            <span className="text-[13px] font-bold uppercase tracking-wide text-stadium-text-primary">
              {m.homeCode} vs {m.awayCode}
            </span>
            <span className="text-[11px] text-stadium-text-muted">{m.when}</span>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
