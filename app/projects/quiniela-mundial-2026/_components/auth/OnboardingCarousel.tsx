"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface OnboardingCarouselProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface Step {
  emoji: string;
  glow: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    emoji: "⚽",
    glow: "rgb(0 230 118 / 0.25)",
    title: "Responde 5 preguntas sobre el partido",
    description:
      "Predice resultados, goleadores y más antes de que termine el medio tiempo",
  },
  {
    emoji: "🏆",
    glow: "rgb(255 215 64 / 0.25)",
    title: "Acumula puntos por cada acierto",
    description: "Mientras más aciertes, más alto llegas en el ranking",
  },
  {
    emoji: "👥",
    glow: "rgb(68 138 255 / 0.25)",
    title: "Compite con tus amigos y gana premios",
    description:
      "Crea tu grupo, invita por WhatsApp y demuestra quién sabe más",
  },
];

export function OnboardingCarousel({ onComplete, onSkip }: OnboardingCarouselProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const isLast = index === STEPS.length - 1;
  const step = STEPS[index];

  const handleNext = useCallback(() => {
    if (isLast) {
      onComplete();
      return;
    }
    setIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }, [isLast, onComplete]);

  const slideVariants = reduced
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: { opacity: 0, x: 100 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -100 },
      };

  return (
    <div className="relative flex h-full flex-col bg-stadium-midnight">
      <div className="flex justify-end px-4 pt-4">
        <button
          type="button"
          onClick={onSkip}
          className="text-sm font-medium text-stadium-text-muted hover:text-stadium-text-secondary transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-midnight rounded"
        >
          Saltar →
        </button>
      </div>

      <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6 pt-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex w-full flex-col items-center"
          >
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-stadium-surface-elevated"
              style={{ boxShadow: `0 0 30px ${step.glow}` }}
            >
              <span className="text-4xl" aria-hidden="true">
                {step.emoji}
              </span>
            </motion.div>

            <h2 className="mt-8 max-w-[300px] text-center text-[22px] font-bold leading-snug text-stadium-text-primary">
              {step.title}
            </h2>
            <p className="mt-3 max-w-[280px] text-center text-[15px] leading-relaxed text-stadium-text-secondary">
              {step.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-6 px-6 pb-8">
        <div
          className="flex items-center gap-2"
          role="tablist"
          aria-label="Progreso del tutorial"
        >
          {STEPS.map((_, i) => (
            <span
              key={i}
              role="tab"
              aria-selected={i === index}
              className={`block h-2 w-2 rounded-full transition-colors duration-300 ${
                i === index ? "bg-stadium-pitch" : "bg-stadium-surface-hover"
              }`}
            />
          ))}
        </div>

        <motion.button
          type="button"
          onClick={handleNext}
          whileHover={reduced ? undefined : { y: -1 }}
          whileTap={reduced ? undefined : { scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className={
            isLast
              ? "flex w-full items-center justify-center rounded-[14px] bg-gradient-to-br from-stadium-pitch to-stadium-pitch-dark text-[17px] font-bold text-stadium-text-inverse shadow-[0_4px_20px_rgb(0_230_118_/_0.25)] hover:shadow-[0_6px_28px_rgb(0_230_118_/_0.35)] transition-shadow cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-midnight"
              : "flex w-full items-center justify-center rounded-[10px] bg-stadium-pitch text-[15px] font-bold text-stadium-text-inverse hover:bg-stadium-pitch-dark transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-midnight"
          }
          style={{ minHeight: isLast ? 56 : 48 }}
        >
          {isLast ? "¡EMPEZAR!" : "SIGUIENTE →"}
        </motion.button>
      </div>
    </div>
  );
}
