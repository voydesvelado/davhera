"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DeviceFrame } from "./DeviceFrame";
import { ResetButton } from "./ResetButton";
import { QuestionFlow } from "./QuestionFlow";
import { Summary } from "./Summary";
import { Confirmation } from "./Confirmation";
import { fadeOnlyVariants, fadeScaleVariants, slideVariants, slideTransition } from "./motion/variants";
import type { Direction } from "./motion/variants";
import { match, questions, makeWindowInfo } from "../_data/mockData";
import type { Answers, WindowInfo } from "../_lib/types";
import { clearState, loadState, saveState } from "../_lib/storage";

type Step = "questions" | "summary" | "confirmation";

function firstUnansweredIndex(answers: Answers): number {
  for (let i = 0; i < questions.length; i++) {
    if (!answers[questions[i].id]) return i;
  }
  return questions.length - 1;
}

export function QuinielaApp() {
  const reduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const [windowInfo, setWindowInfo] = useState<WindowInfo>(() => ({ type: "halftime", endsAt: 0 }));
  const [step, setStep] = useState<Step>("questions");
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expired, setExpired] = useState(false);
  const [stepDirection, setStepDirection] = useState<Direction>(1);

  // Hydrate state from localStorage and pin window endsAt on the client only.
  // setState-in-effect is the canonical pattern for hydrating from a non-SSR-safe
  // source (localStorage) on first mount; reading during render would cause a mismatch.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const stored = loadState(match.id);
    if (stored) {
      setAnswers(stored.answers);
      const allAnswered = questions.every((q) => stored.answers[q.id]);
      if (allAnswered) {
        setStep("summary");
        setCurrentIndex(questions.length - 1);
      } else {
        setCurrentIndex(firstUnansweredIndex(stored.answers));
      }
    }
    setWindowInfo(makeWindowInfo());
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist whenever answers or currentIndex change post-hydration.
  useEffect(() => {
    if (!hydrated) return;
    if (Object.keys(answers).length === 0 && currentIndex === 0) return;
    saveState(match.id, answers, currentIndex);
  }, [answers, currentIndex, hydrated]);

  const handleAnswer = useCallback((questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }, []);

  const handleAdvance = useCallback((nextIndex: number) => {
    setCurrentIndex(nextIndex);
  }, []);

  const handleGoBack = useCallback((prevIndex: number) => {
    setCurrentIndex(prevIndex);
  }, []);

  const handleComplete = useCallback(() => {
    setStepDirection(1);
    setStep("summary");
  }, []);

  const handleEdit = useCallback((questionIndex: number) => {
    setStepDirection(-1);
    setCurrentIndex(questionIndex);
    setStep("questions");
  }, []);

  const handleSubmit = useCallback(() => {
    setStepDirection(1);
    setStep("confirmation");
    // Wipe local progress: the participation is "sent".
    clearState(match.id);
  }, []);

  const handleExpired = useCallback(() => {
    setExpired(true);
    const allAnswered = questions.every((q) => answers[q.id]);
    if (allAnswered && step === "questions") {
      handleComplete();
    }
  }, [answers, step, handleComplete]);

  const handleReset = useCallback(() => {
    clearState(match.id);
    setAnswers({});
    setCurrentIndex(0);
    setExpired(false);
    setStepDirection(1);
    setStep("questions");
    setWindowInfo(makeWindowInfo());
  }, []);

  const direction = stepDirection;

  return (
    <DeviceFrame
      caption="Quiniela Mundial 2026 — Prototipo UX"
      floatingSlot={<ResetButton onReset={handleReset} />}
    >
      <div lang="es" className="stadium-nights relative h-full bg-stadium-midnight text-stadium-text-primary">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          {step === "questions" && (
            <motion.div
              key="questions"
              custom={direction}
              variants={reduced ? fadeOnlyVariants : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={reduced ? { duration: 0.18 } : slideTransition}
              className="absolute inset-0"
            >
              {hydrated && windowInfo.endsAt > 0 ? (
                <QuestionFlow
                  match={match}
                  questions={questions}
                  windowInfo={windowInfo}
                  answers={answers}
                  currentIndex={currentIndex}
                  onAnswer={handleAnswer}
                  onAdvance={handleAdvance}
                  onComplete={handleComplete}
                  onExpired={handleExpired}
                  onGoBack={handleGoBack}
                  expired={expired}
                  onRetryNextMatch={handleReset}
                />
              ) : null}
            </motion.div>
          )}

          {step === "summary" && (
            <motion.div
              key="summary"
              custom={direction}
              variants={reduced ? fadeOnlyVariants : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={reduced ? { duration: 0.18 } : slideTransition}
              className="absolute inset-0"
            >
              <Summary
                match={match}
                questions={questions}
                answers={answers}
                windowInfo={windowInfo}
                onEdit={handleEdit}
                onSubmit={handleSubmit}
                onExpired={handleExpired}
              />
            </motion.div>
          )}

          {step === "confirmation" && (
            <motion.div
              key="confirmation"
              variants={reduced ? fadeOnlyVariants : fadeScaleVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 overflow-y-auto"
            >
              <Confirmation match={match} questions={questions} answers={answers} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DeviceFrame>
  );
}
