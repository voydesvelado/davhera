"use client";

import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AuthInput } from "./AuthInput";
import { SocialButton } from "./SocialButton";

interface RegisterScreenProps {
  onRegister: (user: { name: string; email: string }) => void;
  onGoToLogin: () => void;
  onBack: () => void;
}

interface Errors {
  name?: string | null;
  email?: string | null;
  password?: string | null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SIMULATED_DUPLICATE = "duplicado@test.com";

function validateField(field: keyof Errors, value: string): string | null {
  if (field === "name") {
    if (!value.trim()) return "Ingresa tu nombre";
    if (value.trim().length < 2) return "Ingresa tu nombre";
    return null;
  }
  if (field === "email") {
    if (!value.trim()) return "Ingresa un email válido";
    if (!EMAIL_RE.test(value.trim())) return "Ingresa un email válido";
    if (value.trim().toLowerCase() === SIMULATED_DUPLICATE) {
      return "Este email ya está registrado";
    }
    return null;
  }
  if (field === "password") {
    if (!value) return "Mínimo 6 caracteres";
    if (value.length < 6) return "Mínimo 6 caracteres";
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

export function RegisterScreen({ onRegister, onGoToLogin, onBack }: RegisterScreenProps) {
  const reduced = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<null | "google" | "apple">(null);

  const formIncomplete = !name.trim() || !email.trim() || !password;

  const handleBlur = useCallback(
    (field: keyof Errors, value: string) => {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    },
    [],
  );

  const handleChange = useCallback(
    (field: keyof Errors, setter: (v: string) => void) => (value: string) => {
      setter(value);
      // Clear an existing error as soon as the user edits the field — feels less punitive.
      setErrors((prev) => (prev[field] ? { ...prev, [field]: null } : prev));
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (submitting) return;
      const next: Errors = {
        name: validateField("name", name),
        email: validateField("email", email),
        password: validateField("password", password),
      };
      setErrors(next);
      if (next.name || next.email || next.password) return;

      setSubmitting(true);
      window.setTimeout(() => {
        setSubmitting(false);
        onRegister({ name: name.trim(), email: email.trim() });
      }, 800);
    },
    [name, email, password, submitting, onRegister],
  );

  const handleSocial = useCallback(
    (provider: "google" | "apple") => {
      if (socialLoading || submitting) return;
      setSocialLoading(provider);
      window.setTimeout(() => {
        setSocialLoading(null);
        onRegister({ name: "María C.", email: "maria@gmail.com" });
      }, 1000);
    },
    [socialLoading, submitting, onRegister],
  );

  const duplicateError = errors.email === "Este email ya está registrado";

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
        Crea tu cuenta
      </h1>
      <p className="mt-2 px-6 text-sm text-stadium-text-secondary">
        Solo 3 datos y estás dentro
      </p>

      <form
        role="form"
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-4 px-6"
        noValidate
      >
        <AuthInput
          label="Tu nombre"
          type="text"
          placeholder="¿Cómo te llaman?"
          value={name}
          onChange={handleChange("name", setName)}
          onBlur={() => handleBlur("name", name)}
          error={errors.name}
          autoFocus
          autoComplete="given-name"
        />
        <AuthInput
          label="Email o celular"
          type="email"
          inputMode="email"
          placeholder="tu@email.com"
          value={email}
          onChange={handleChange("email", setEmail)}
          onBlur={() => handleBlur("email", email)}
          error={errors.email}
          autoComplete="email"
        />
        {duplicateError && (
          <p className="-mt-2 text-xs text-stadium-text-secondary">
            ¿Quieres{" "}
            <button
              type="button"
              onClick={onGoToLogin}
              className="font-medium text-stadium-electric hover:underline cursor-pointer"
            >
              iniciar sesión
            </button>
            ?
          </p>
        )}
        <AuthInput
          label="Contraseña"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={handleChange("password", setPassword)}
          onBlur={() => handleBlur("password", password)}
          error={errors.password}
          autoComplete="new-password"
        />

        <motion.button
          type="submit"
          disabled={formIncomplete || submitting}
          whileHover={reduced || formIncomplete || submitting ? undefined : { y: -1 }}
          whileTap={reduced || formIncomplete || submitting ? undefined : { scale: 0.98 }}
          transition={{ duration: 0.15 }}
          aria-label="Crear cuenta y participar en la quiniela"
          className="mt-2 flex w-full items-center justify-center rounded-[14px] bg-gradient-to-br from-stadium-pitch to-stadium-pitch-dark text-[17px] font-bold text-stadium-text-inverse shadow-[0_4px_20px_rgb(0_230_118_/_0.25)] hover:shadow-[0_6px_28px_rgb(0_230_118_/_0.35)] transition-shadow cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-midnight"
          style={{ minHeight: 56 }}
        >
          {submitting ? <LoadingDots /> : "CREAR CUENTA Y PARTICIPAR"}
        </motion.button>
      </form>

      <div className="mt-6 flex items-center gap-3 px-6">
        <span aria-hidden="true" className="h-px flex-1 bg-stadium-border-subtle" />
        <span className="whitespace-nowrap text-xs text-stadium-text-muted">
          o regístrate con
        </span>
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
        ¿Ya tienes cuenta?{" "}
        <button
          type="button"
          onClick={onGoToLogin}
          className="font-medium text-stadium-electric hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-midnight rounded"
        >
          Inicia sesión
        </button>
      </p>
    </div>
  );
}
