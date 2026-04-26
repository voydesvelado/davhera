"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AuthInput } from "./AuthInput";
import { SocialButton } from "./SocialButton";

interface LoginScreenProps {
  onLogin: (user: { name: string; email: string }) => void;
  onGoToRegister: () => void;
  onBack: () => void;
}

interface Errors {
  email?: string | null;
  password?: string | null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Demo-only canary: this email pretends the credentials don't match.
const SIMULATED_INVALID = "wrong@test.com";

function validateField(field: keyof Errors, value: string): string | null {
  if (field === "email") {
    if (!value.trim() || !EMAIL_RE.test(value.trim())) return "Ingresa un email válido";
    return null;
  }
  if (field === "password") {
    if (!value) return "Ingresa tu contraseña";
    return null;
  }
  return null;
}

function LoadingDots() {
  const reduced = useReducedMotion();
  return (
    <span className="flex items-center gap-1.5" aria-label="Cargando">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-stadium-text-inverse"
          animate={reduced ? undefined : { scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={
            reduced
              ? undefined
              : { duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }
          }
        />
      ))}
    </span>
  );
}

export function LoginScreen({ onLogin, onGoToRegister, onBack }: LoginScreenProps) {
  const reduced = useReducedMotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [socialLoading, setSocialLoading] = useState<null | "google" | "apple">(null);

  const formIncomplete = !email.trim() || !password;

  const handleBlur = useCallback((field: keyof Errors, value: string) => {
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  }, []);

  const handleChange = useCallback(
    (field: keyof Errors, setter: (v: string) => void) => (value: string) => {
      setter(value);
      setErrors((prev) => (prev[field] ? { ...prev, [field]: null } : prev));
      if (generalError) setGeneralError(null);
    },
    [generalError],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (submitting) return;
      const next: Errors = {
        email: validateField("email", email),
        password: validateField("password", password),
      };
      setErrors(next);
      if (next.email || next.password) return;

      setSubmitting(true);
      setGeneralError(null);
      window.setTimeout(() => {
        setSubmitting(false);
        if (email.trim().toLowerCase() === SIMULATED_INVALID) {
          setGeneralError("Email o contraseña incorrectos");
          return;
        }
        onLogin({ name: "María C.", email: email.trim() });
      }, 800);
    },
    [email, password, submitting, onLogin],
  );

  const handleSocial = useCallback(
    (provider: "google" | "apple") => {
      if (socialLoading || submitting) return;
      setSocialLoading(provider);
      window.setTimeout(() => {
        setSocialLoading(null);
        onLogin({ name: "María C.", email: "maria@gmail.com" });
      }, 1000);
    },
    [socialLoading, submitting, onLogin],
  );

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-stadium-midnight">
      <div className="px-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 rounded text-sm text-stadium-text-secondary hover:text-stadium-text-primary transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-midnight"
        >
          <span aria-hidden="true">←</span>
          <span>Volver</span>
        </button>
      </div>

      <h1 className="mt-8 px-6 text-[28px] font-extrabold leading-tight text-stadium-text-primary">
        Bienvenido de vuelta
      </h1>
      <p className="mt-2 px-6 text-sm text-stadium-text-secondary">
        Inicia sesión para participar
      </p>

      <form
        role="form"
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-4 px-6"
        noValidate
      >
        <AuthInput
          label="Email o celular"
          type="email"
          inputMode="email"
          placeholder="tu@email.com"
          value={email}
          onChange={handleChange("email", setEmail)}
          onBlur={() => handleBlur("email", email)}
          error={errors.email}
          autoFocus
          autoComplete="email"
        />
        <AuthInput
          label="Contraseña"
          type="password"
          placeholder="Tu contraseña"
          value={password}
          onChange={handleChange("password", setPassword)}
          onBlur={() => handleBlur("password", password)}
          error={errors.password}
          autoComplete="current-password"
        />

        <motion.button
          type="submit"
          disabled={formIncomplete || submitting}
          whileHover={reduced || formIncomplete || submitting ? undefined : { y: -1 }}
          whileTap={reduced || formIncomplete || submitting ? undefined : { scale: 0.98 }}
          transition={{ duration: 0.15 }}
          aria-label="Iniciar sesión en la quiniela"
          className="mt-2 flex w-full items-center justify-center rounded-[14px] bg-gradient-to-br from-stadium-pitch to-stadium-pitch-dark text-[17px] font-bold text-stadium-text-inverse shadow-[0_4px_20px_rgb(0_230_118_/_0.25)] hover:shadow-[0_6px_28px_rgb(0_230_118_/_0.35)] transition-shadow cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-midnight"
          style={{ minHeight: 56 }}
        >
          {submitting ? <LoadingDots /> : "INICIAR SESIÓN"}
        </motion.button>

        <AnimatePresence>
          {generalError && (
            <motion.p
              role="alert"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1 text-center text-sm text-stadium-coral"
            >
              {generalError}
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      <div className="mt-6 flex items-center gap-3 px-6">
        <span aria-hidden="true" className="h-px flex-1 bg-stadium-border-subtle" />
        <span className="whitespace-nowrap text-xs text-stadium-text-muted">o</span>
        <span aria-hidden="true" className="h-px flex-1 bg-stadium-border-subtle" />
      </div>

      <div className="mt-4 flex flex-col gap-3 px-6">
        <SocialButton
          provider="google"
          onClick={() => handleSocial("google")}
          loading={socialLoading === "google"}
        />
        <SocialButton
          provider="apple"
          onClick={() => handleSocial("apple")}
          loading={socialLoading === "apple"}
        />
      </div>

      <p className="mt-6 pb-8 text-center text-sm text-stadium-text-secondary">
        ¿No tienes cuenta?{" "}
        <button
          type="button"
          onClick={onGoToRegister}
          className="font-medium text-stadium-electric hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-midnight rounded"
        >
          Regístrate
        </button>
      </p>
    </div>
  );
}
