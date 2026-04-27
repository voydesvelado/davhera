"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MatchHeader } from "./MatchHeader";
import { Timer } from "./Timer";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { cardSlideVariants, fadeOnlyVariants, slideTransition } from "./motion/variants";
import type { Direction } from "./motion/variants";
import type { Answers, Match, Question, WindowInfo } from "../_lib/types";

interface QuestionFlowProps {
  match: Match;
  questions: Question[];
  windowInfo: WindowInfo;
  answers: Answers;
  currentIndex: number;
  onAnswer: (questionId: string, optionId: string) => void;
  onAdvance: (nextIndex: number) => void;
  onComplete: () => void;
  onExpired: () => void;
  onGoBack: (prevIndex: number) => void;
  expired: boolean;
  onRetryNextMatch?: () => void;
}

const AUTO_ADVANCE_MS = 400;

export function QuestionFlow({
  match,
  questions,
  windowInfo,
  answers,
  currentIndex,
  onAnswer,
  onAdvance,
  onComplete,
  onExpired,
  onGoBack,
  expired,
  onRetryNextMatch,
}: QuestionFlowProps) {
  const reduced = useReducedMotion();
  const [direction, setDirection] = useState<Direction>(1);
  const advanceTimerRef = useRef<number | null>(null);

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimerRef.current != null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearAdvanceTimer, [clearAdvanceTimer]);

  const question = questions[currentIndex];
  const selected = question ? answers[question.id] ?? null : null;
  const isLast = currentIndex === questions.length - 1;
  const total = questions.length;

  const handleSelect = useCallback(
    (optionId: string) => {
      if (!question) return;
      onAnswer(question.id, optionId);
      clearAdvanceTimer();
      setDirection(1);
      advanceTimerRef.current = window.setTimeout(() => {
        if (isLast) {
          onComplete();
        } else {
          onAdvance(currentIndex + 1);
        }
      }, AUTO_ADVANCE_MS);
    },
    [question, onAnswer, clearAdvanceTimer, isLast, onComplete, onAdvance, currentIndex],
  );

  const handleBack = useCallback(() => {
    if (currentIndex === 0) return;
    clearAdvanceTimer();
    setDirection(-1);
    onGoBack(currentIndex - 1);
  }, [currentIndex, clearAdvanceTimer, onGoBack]);

  const variants = reduced ? fadeOnlyVariants : cardSlideVariants;

  return (
    <div className="flex h-full flex-col px-4 pt-3 pb-6">
      <MatchHeader match={match} />

      <div className="mt-4 flex flex-col gap-3">
        <Timer endsAt={windowInfo.endsAt} onExpired={onExpired} />
        <ProgressBar current={currentIndex + 1} total={total} />
      </div>

      <div className="relative mt-6 flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          {question && (
            <motion.div
              key={question.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={reduced ? { duration: 0.18 } : slideTransition}
              className="absolute inset-0 flex flex-col"
            >
              <QuestionCard
                question={question}
                questionNumber={currentIndex + 1}
                selectedOption={selected}
                onSelectOption={handleSelect}
                disabled={expired}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 min-h-[28px]">
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="text-[13px] text-stadium-text-secondary hover:text-stadium-text-primary transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-midnight rounded"
          >
            ← Anterior
          </button>
        )}
      </div>

      <AnimatePresence>
        {expired && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[rgb(11_17_32_/_0.85)] px-6 text-center backdrop-blur-sm"
          >
            <p className="text-[20px] font-bold text-stadium-coral">La ventana se cerró</p>
            <p className="text-[14px] text-stadium-text-secondary">
              Tus respuestas no alcanzaron a registrarse esta vez.
            </p>
            {onRetryNextMatch && (
              <button
                type="button"
                onClick={onRetryNextMatch}
                className="mt-2 rounded-[10px] border border-stadium-border bg-stadium-surface-elevated px-5 py-3 text-[14px] font-semibold text-stadium-text-primary hover:bg-stadium-surface-hover transition-colors cursor-pointer"
              >
                Ver siguiente partido
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
