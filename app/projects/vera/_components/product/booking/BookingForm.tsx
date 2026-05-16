"use client";

import { useState, type FormEvent } from "react";
import { Input } from "../../ui/Input";
import { Textarea } from "../../ui/Textarea";
import { PhoneInput } from "../../ui/PhoneInput";
import { Button } from "../../ui/Button";
import { Spinner } from "../../ui/Spinner";

export interface BookingFormValues {
  name: string;
  /** 10-digit Mexican number, no prefix. */
  phoneDigits: string;
  email: string;
  note: string;
}

interface BookingFormProps {
  initial?: Partial<BookingFormValues>;
  submitting: boolean;
  onSubmit: (v: BookingFormValues) => void;
  submitLabel?: string;
}

interface Errors {
  name?: string;
  phoneDigits?: string;
  email?: string;
}

function validate(v: BookingFormValues): Errors {
  const errors: Errors = {};
  if (v.name.trim().length < 2) errors.name = "Escribe tu nombre completo.";
  if (v.phoneDigits.replace(/\D/g, "").length !== 10) {
    errors.phoneDigits = "Tu WhatsApp debe tener 10 dígitos.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) {
    errors.email = "Necesitamos un email válido.";
  }
  return errors;
}

export function BookingForm({ initial, submitting, onSubmit, submitLabel = "Confirmar reserva" }: BookingFormProps) {
  const [values, setValues] = useState<BookingFormValues>({
    name: initial?.name ?? "",
    phoneDigits: initial?.phoneDigits ?? "",
    email: initial?.email ?? "",
    note: initial?.note ?? "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState(false);

  const errors = validate(values);
  const showError = (field: keyof Errors) => (showAll || touched[field]) && errors[field];

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setShowAll(true);
    if (Object.keys(errors).length > 0) return;
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <Field label="Nombre completo" htmlFor="bf-name" error={showError("name") ? errors.name : undefined}>
        <Input
          id="bf-name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          placeholder="Tu nombre"
        />
      </Field>

      <Field label="WhatsApp" htmlFor="bf-phone" error={showError("phoneDigits") ? errors.phoneDigits : undefined}>
        <PhoneInput
          id="bf-phone"
          value={values.phoneDigits}
          onChange={(digits) => setValues((v) => ({ ...v, phoneDigits: digits }))}
          onBlur={() => setTouched((t) => ({ ...t, phoneDigits: true }))}
        />
      </Field>

      <Field label="Email" htmlFor="bf-email" error={showError("email") ? errors.email : undefined}>
        <Input
          id="bf-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          placeholder="tu@email.com"
        />
      </Field>

      <Field label="Algo que la doctora deba saber" htmlFor="bf-note" optional>
        <Textarea
          id="bf-note"
          name="note"
          value={values.note}
          onChange={(e) => setValues((v) => ({ ...v, note: e.target.value }))}
          placeholder="Opcional"
          rows={2}
        />
      </Field>

      <Button type="submit" size="md" disabled={submitting} style={{ marginTop: "var(--space-2)" }}>
        {submitting ? (
          <>
            <Spinner size={14} color="var(--accent-ink)" />
            Confirmando…
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  optional,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1_5)" }}>
      <label
        htmlFor={htmlFor}
        style={{
          fontSize: "var(--text-xs)",
          fontWeight: 500,
          letterSpacing: "var(--tracking-wider)",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        {label}
        {optional ? (
          <span style={{ marginLeft: "var(--space-1)", textTransform: "none", letterSpacing: 0, color: "var(--ink-faint)" }}>
            (opcional)
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--danger)" }}>{error}</p>
      ) : null}
    </div>
  );
}
