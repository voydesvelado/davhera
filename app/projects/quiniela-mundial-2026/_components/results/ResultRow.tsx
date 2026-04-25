"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ResultQuestion } from "../../_data/mockResults";

interface ResultRowProps {
  question: ResultQuestion;
  index: number;
}

function ResultRowImpl({ question, index }: ResultRowProps) {
  const reduced = useReducedMotion();
  const ok = question.isCorrect;
  const containerClass = ok
    ? "bg-stadium-pitch-glow"
    : "bg-stadium-coral-glow";
  const accentBorder = ok ? "var(--color-stadium-pitch)" : "var(--color-stadium-coral)";
  const iconColor = ok ? "text-stadium-pitch" : "text-stadium-coral";
  const userValueColor = ok ? "text-stadium-pitch" : "text-stadium-coral";

  return (
    <motion.li
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: reduced ? 0 : index * 0.1, ease: "easeOut" }}
      role="listitem"
      className={`relative rounded-[10px] px-4 py-3.5 ${containerClass}`}
      style={{ borderLeft: `3px solid ${accentBorder}` }}
    >
      <div className="flex items-start gap-2.5">
        <span aria-hidden="true" className={`text-[18px] font-bold leading-none ${iconColor}`}>
          {ok ? "✓" : "✗"}
        </span>
        <p className="flex-1 text-[13px] font-bold leading-[1.3] text-stadium-text-primary">
          {question.text}
        </p>
      </div>
      <div className="mt-2 flex items-end justify-between gap-3 pl-7">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stadium-text-muted">
            Tu respuesta
          </span>
          <span className={`text-[13px] font-semibold ${userValueColor}`}>
            {question.userAnswer}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stadium-text-muted">
            Resultado
          </span>
          <span className="text-[13px] font-semibold text-stadium-pitch">
            {question.correctAnswer}
          </span>
        </div>
      </div>
    </motion.li>
  );
}

export const ResultRow = memo(ResultRowImpl);
