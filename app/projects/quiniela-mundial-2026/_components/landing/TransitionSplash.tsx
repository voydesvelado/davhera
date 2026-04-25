"use client";

import { motion, useReducedMotion } from "framer-motion";

export function TransitionSplash() {
  const reduced = useReducedMotion();
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-stadium-midnight">
      <div className="flex flex-col items-center gap-3">
        <p className="text-[15px] font-medium text-stadium-text-secondary">Preparando tu quiniela…</p>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-2 w-2 rounded-full bg-stadium-pitch"
              animate={reduced ? undefined : { opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
              transition={
                reduced
                  ? undefined
                  : { duration: 1, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
