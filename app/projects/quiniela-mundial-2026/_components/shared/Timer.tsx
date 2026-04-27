"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type TimerSize = "normal" | "inline";

interface TimerProps {
  endsAt: number;
  onExpired?: () => void;
  size?: TimerSize;
}

const URGENT_THRESHOLD_MS = 5 * 60 * 1000;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function Timer({ endsAt, onExpired, size = "normal" }: TimerProps) {
  const reduced = useReducedMotion();
  const [now, setNow] = useState<number>(() => Date.now());
  const firedRef = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  const remainingMs = Math.max(0, endsAt - now);
  const expired = remainingMs === 0;
  const urgent = !expired && remainingMs <= URGENT_THRESHOLD_MS;

  useEffect(() => {
    if (expired && !firedRef.current) {
      firedRef.current = true;
      onExpired?.();
    }
    if (!expired) firedRef.current = false;
  }, [expired, onExpired]);

  const totalSeconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formatted = `${pad(minutes)}:${pad(seconds)}`;

  const timeText = expired ? "CERRADA" : formatted;
  const timeColor = expired
    ? "text-stadium-text-muted"
    : urgent
      ? "text-stadium-coral"
      : "text-stadium-text-primary";

  if (size === "inline") {
    return (
      <motion.span
        className={`font-mono font-extrabold tabular-nums tracking-[0.08em] ${timeColor}`}
        animate={urgent && !reduced ? { scale: [1, 1.02, 1] } : { scale: 1 }}
        transition={
          urgent && !reduced
            ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.2 }
        }
      >
        {timeText}
      </motion.span>
    );
  }

  const containerColor = expired
    ? "bg-stadium-surface border-stadium-border"
    : urgent
      ? "bg-stadium-coral-glow border-[rgb(255_82_82_/_0.27)]"
      : "bg-stadium-surface-elevated border-stadium-border";

  return (
    <motion.div
      role="timer"
      aria-live="polite"
      className={`inline-flex flex-col items-center rounded-[14px] border px-4 py-2 ${containerColor}`}
      animate={urgent && !reduced ? { scale: [1, 1.02, 1] } : { scale: 1 }}
      transition={
        urgent && !reduced
          ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.2 }
      }
    >
      <span
        className={`text-[11px] font-semibold uppercase tracking-wide opacity-80 ${
          urgent ? "text-stadium-coral" : "text-stadium-text-secondary"
        }`}
      >
        {expired ? "VENTANA" : "CIERRA EN"}
      </span>
      <span className={`font-mono text-[22px] font-extrabold tabular-nums tracking-[0.08em] ${timeColor}`}>
        {timeText}
      </span>
    </motion.div>
  );
}
