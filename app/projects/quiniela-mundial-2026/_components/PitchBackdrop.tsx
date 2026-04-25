"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Looping pulse ring used behind the confirmation checkmark.
 *  Isolated so the reduced-motion guard short-circuits the heaviest animation. */
export function PitchBackdrop() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <motion.span
      aria-hidden="true"
      className="absolute inset-0 rounded-full border-2 border-stadium-pitch"
      initial={{ scale: 1, opacity: 0.4 }}
      animate={{ scale: 1.5, opacity: 0 }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
    />
  );
}
