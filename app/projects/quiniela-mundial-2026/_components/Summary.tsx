"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MatchHeader } from "./MatchHeader";
import { Timer } from "./Timer";
import type { Answers, Match, Question, WindowInfo } from "../_lib/types";

interface SummaryProps {
  match: Match;
  questions: Question[];
  answers: Answers;
  windowInfo: WindowInfo;
  onEdit: (questionIndex: number) => void;
  onSubmit: () => void;
  onExpired: () => void;
}

export function Summary({ match, questions, answers, windowInfo, onEdit, onSubmit, onExpired }: SummaryProps) {
  const reduced = useReducedMotion();
  return (
    <div className="flex h-full flex-col px-4 pt-3 pb-6">
      <MatchHeader match={match} />

      <div className="mt-4 flex flex-col">
        <Timer endsAt={windowInfo.endsAt} onExpired={onExpired} />
      </div>

      <div className="mt-6 flex-1 overflow-y-auto pr-1">
        <p className="mb-4 text-[20px] font-extrabold text-stadium-text-primary">Revisa tus respuestas</p>

        <ul className="flex flex-col gap-2.5">
          {questions.map((q, idx) => {
            const answerId = answers[q.id];
            const answerLabel = q.options.find((o) => o.id === answerId)?.label ?? "—";
            return (
              <li
                key={q.id}
                className="rounded-[10px] border border-stadium-border-subtle bg-stadium-surface px-4 py-3.5"
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex shrink-0 items-center justify-center rounded-full bg-stadium-surface-hover text-[11px] font-semibold text-stadium-text-muted"
                    style={{ height: 22, width: 22 }}
                  >
                    {idx + 1}
                  </span>
                  <p className="flex-1 truncate text-[13px] text-stadium-text-secondary">{q.text}</p>
                  <button
                    type="button"
                    onClick={() => onEdit(idx)}
                    className="shrink-0 text-[13px] text-stadium-text-secondary hover:text-stadium-text-primary transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-midnight rounded"
                  >
                    Editar
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2 pl-[34px]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-stadium-pitch" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <p className="text-[15px] font-bold text-stadium-text-primary">{answerLabel}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="pt-5">
        <motion.button
          type="button"
          onClick={onSubmit}
          whileHover={reduced ? undefined : { y: -1 }}
          whileTap={reduced ? undefined : { scale: 0.99 }}
          transition={{ duration: 0.15 }}
          className="relative w-full overflow-hidden rounded-[14px] bg-gradient-to-br from-stadium-pitch to-stadium-pitch-dark px-6 text-[17px] font-bold text-stadium-text-inverse shadow-[0_4px_24px_rgb(0_230_118_/_0.25)] hover:shadow-[0_6px_32px_rgb(0_230_118_/_0.35)] transition-shadow cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-midnight"
          style={{ minHeight: 56 }}
        >
          <span className="relative z-10">ENVIAR RESPUESTAS</span>
          {!reduced && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-0 block w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent"
              style={{ animation: "stadium-shimmer-sweep 3s ease-in-out infinite" }}
            />
          )}
        </motion.button>
        <p className="mt-2 text-center text-[13px] text-stadium-text-muted">
          Puedes cambiar respuestas antes de enviar
        </p>
      </div>
    </div>
  );
}
