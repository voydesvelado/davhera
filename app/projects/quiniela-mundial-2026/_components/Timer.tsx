"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCountdown, formatCountdown } from "../_hooks/useCountdown";

interface TimerProps {
  endsAt: number | null;
  onExpired?: () => void;
}

const URGENT_THRESHOLD_MS = 5 * 60 * 1000;

export function Timer({ endsAt, onExpired }: TimerProps) {
  const countdown = useCountdown(endsAt, onExpired);
  const reduced = useReducedMotion();
  const urgent = !countdown.expired && countdown.remainingMs <= URGENT_THRESHOLD_MS;

  const colorClasses = countdown.expired
    ? "bg-stadium-surface text-stadium-text-muted border-stadium-border"
    : urgent
      ? "bg-stadium-coral-glow text-stadium-coral border-[rgb(255_82_82_/_0.27)]"
      : "bg-stadium-surface-elevated text-stadium-text-primary border-stadium-border";

  return (
    <motion.div
      className={`inline-flex flex-col items-center rounded-[14px] border px-4 py-2 ${colorClasses}`}
      animate={urgent && !reduced ? { scale: [1, 1.02, 1] } : { scale: 1 }}
      transition={urgent && !reduced ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
    >
      <span className="text-[11px] font-semibold uppercase tracking-[0.05em] opacity-80">
        {countdown.expired ? "VENTANA" : "CIERRA EN"}
      </span>
      <span className="font-mono text-[22px] font-extrabold tracking-[0.08em] tabular-nums">
        {countdown.expired ? "CERRADA" : formatCountdown(countdown)}
      </span>
    </motion.div>
  );
}
