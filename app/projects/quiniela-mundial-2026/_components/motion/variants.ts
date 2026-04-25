import type { Transition, Variants } from "framer-motion";

/** Direction: 1 = forward (next), -1 = backward (previous). */
export type Direction = 1 | -1;

const ease = [0.4, 0, 0.2, 1] as const;

export const slideTransition: Transition = {
  duration: 0.28,
  ease,
};

/** Used for direction-aware horizontal slides on cards/screens. */
export const slideVariants: Variants = {
  enter: (direction: Direction) => ({
    x: direction === 1 ? 56 : -56,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: Direction) => ({
    x: direction === 1 ? -56 : 56,
    opacity: 0,
  }),
};

/** Inner question carousel — slightly larger travel for clearer affordance. */
export const cardSlideVariants: Variants = {
  enter: (direction: Direction) => ({
    x: direction === 1 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: Direction) => ({
    x: direction === 1 ? "-100%" : "100%",
    opacity: 0,
  }),
};

export const fadeScaleVariants: Variants = {
  enter: { opacity: 0, scale: 0.96 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
};

/** Reduced-motion fallback: pure opacity, no transforms. */
export const fadeOnlyVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};
