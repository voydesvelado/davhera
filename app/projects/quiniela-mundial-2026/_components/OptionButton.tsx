"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface OptionButtonProps {
  label: string;
  letter: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

function OptionButtonImpl({ label, letter, selected, onSelect, disabled }: OptionButtonProps) {
  const reduced = useReducedMotion();
  const ringClasses = selected
    ? "bg-stadium-pitch text-stadium-text-inverse border-transparent"
    : "bg-stadium-surface-hover text-stadium-text-muted border border-stadium-border";

  const containerClasses = selected
    ? "border-stadium-pitch bg-stadium-pitch-glow"
    : "border-stadium-border bg-stadium-surface-elevated hover:bg-stadium-surface-hover";

  const textColor = selected ? "text-stadium-pitch font-bold" : "text-stadium-text-primary";

  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      disabled={disabled}
      whileTap={reduced || disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.1 }}
      className={`group flex w-full min-h-12 items-center gap-3 rounded-[10px] border-2 px-4 py-3.5 text-left transition-colors duration-150 ease-out cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-midnight ${containerClasses}`}
    >
      <span
        aria-hidden="true"
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold transition-colors duration-150 ${ringClasses}`}
      >
        {selected ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          letter
        )}
      </span>
      <span className={`text-[15px] leading-snug ${textColor}`}>{label}</span>
    </motion.button>
  );
}

export const OptionButton = memo(OptionButtonImpl);
