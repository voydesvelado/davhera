"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface AuthInputProps {
  label: string;
  type: "text" | "email" | "tel" | "password";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
  icon?: ReactNode;
  autoFocus?: boolean;
  inputMode?: "text" | "email" | "tel" | "numeric";
  autoComplete?: string;
}

export function AuthInput({
  label,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  icon,
  autoFocus,
  inputMode,
  autoComplete,
}: AuthInputProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const errorId = `${id}-error`;
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const effectiveType = isPassword && showPassword ? "text" : type;

  const stateClasses = error
    ? "border-stadium-coral ring-1 ring-stadium-coral/20"
    : "border-stadium-border focus-within:border-stadium-pitch focus-within:ring-1 focus-within:ring-stadium-pitch/20";

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-stadium-text-secondary"
      >
        {label}
      </label>
      <div
        className={`flex items-center gap-2 rounded-[10px] border-2 bg-stadium-surface-elevated px-4 transition-all duration-150 ${stateClasses}`}
        style={{ minHeight: 48 }}
      >
        {icon && (
          <span className="shrink-0 text-stadium-text-muted" aria-hidden="true">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={effectiveType}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          autoFocus={autoFocus}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="flex-1 bg-transparent py-2 font-sans text-[15px] text-stadium-text-primary outline-none placeholder:text-stadium-text-muted"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPassword}
            className="flex h-12 w-12 shrink-0 items-center justify-center text-stadium-text-muted hover:text-stadium-text-secondary transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch rounded"
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-1 flex items-center gap-1 text-xs text-stadium-coral"
          >
            <span aria-hidden="true">⚠</span>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
