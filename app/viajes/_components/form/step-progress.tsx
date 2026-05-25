"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STEPS = ["Viaje", "Contacto", "Detalles", "Confirmar"] as const;
const EASE = [0.22, 1, 0.36, 1] as const;

export function StepProgress({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <div>
      <div className="flex justify-between text-eyebrow mb-3">
        {STEPS.map((label, i) => {
          const idx = i + 1;
          const active = idx === current;
          return (
            <span
              key={label}
              className={cn(
                "transition-colors",
                active
                  ? "text-fg"
                  : idx < current
                  ? "text-fg-muted"
                  : "text-fg-subtle",
              )}
            >
              {label}
            </span>
          );
        })}
      </div>
      <div className="flex gap-2">
        {STEPS.map((label, i) => {
          const idx = i + 1;
          const filled = idx <= current;
          return (
            <div
              key={label}
              className="flex-1 h-1 rounded-full bg-fg/10 overflow-hidden"
            >
              <motion.div
                initial={false}
                animate={{ width: filled ? "100%" : "0%" }}
                transition={{ duration: 0.4, ease: EASE }}
                className="h-full bg-accent"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
