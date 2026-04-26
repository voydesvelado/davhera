"use client";

import { motion, useReducedMotion } from "framer-motion";

interface SocialButtonProps {
  provider: "google" | "apple";
  onClick: () => void;
  loading?: boolean;
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 8 3l5.7-5.7C33.6 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 8 3l5.7-5.7C33.6 6.1 29 4 24 4 16.4 4 9.8 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5 0 9.5-1.9 12.9-5l-6-5.1c-2 1.4-4.5 2.1-6.9 2.1-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.7 39.5 16.3 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.7 2.1-2.1 4-3.9 5.4l6 5.1C40.9 35 44 30 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-stadium-text-primary" fill="currentColor" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 17.13c-.43 1-.747 1.83-1.244 2.74-.74 1.34-1.79 3.01-3.087 3.02-1.17.01-1.47-.76-3.06-.75-1.59.01-1.92.76-3.09.75-1.3-.02-2.29-1.52-3.04-2.86-2.09-3.74-2.31-8.13-1.02-10.46.91-1.65 2.34-2.62 3.69-2.62 1.37 0 2.23.75 3.36.75 1.1 0 1.77-.75 3.35-.75 1.2 0 2.47.65 3.38 1.78-2.97 1.62-2.49 5.86.46 6.94-.27.84-.36 1.16-.7 1.46z" />
    </svg>
  );
}

const PROVIDER_LABEL: Record<SocialButtonProps["provider"], string> = {
  google: "Continuar con Google",
  apple: "Continuar con Apple",
};

export function SocialButton({ provider, onClick, loading }: SocialButtonProps) {
  const reduced = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={loading}
      whileTap={reduced || loading ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.1 }}
      aria-label={`Registrarse con ${provider === "google" ? "Google" : "Apple"}`}
      className="flex w-full items-center justify-center gap-3 rounded-[10px] border border-stadium-border bg-stadium-surface-elevated text-[15px] font-medium text-stadium-text-primary hover:bg-stadium-surface-hover transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-midnight"
      style={{ minHeight: 48 }}
    >
      {loading ? (
        <span className="flex items-center gap-1.5" aria-label="Cargando">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-1.5 w-1.5 rounded-full bg-stadium-text-muted"
              animate={reduced ? undefined : { scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
              transition={
                reduced
                  ? undefined
                  : { duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }
              }
            />
          ))}
        </span>
      ) : (
        <>
          {provider === "google" ? <GoogleLogo /> : <AppleLogo />}
          <span>{PROVIDER_LABEL[provider]}</span>
        </>
      )}
    </motion.button>
  );
}
