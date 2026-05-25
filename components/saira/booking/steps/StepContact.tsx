"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useBooking } from "@/lib/saira/booking/context";

type FieldKey = "name" | "whatsapp" | "email";

const RE = {
  whatsapp: /^\+?[\d\s\-()]{8,}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export function StepContact() {
  const t = useTranslations("wizard.contact");
  const tErr = useTranslations("wizard.contact.errors");
  const { state, dispatch } = useBooking();

  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});

  const validate = (field: FieldKey, value: string) => {
    let error: string | undefined;
    if (field === "name" && value.trim().length < 2) error = tErr("name");
    else if (field === "whatsapp" && !RE.whatsapp.test(value.trim()))
      error = tErr("whatsapp");
    else if (field === "email" && !RE.email.test(value.trim()))
      error = tErr("email");
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: FieldKey, value: string) => {
    dispatch({ type: "SET_CONTACT", field, value });
    if (touched[field]) validate(field, value);
  };

  const handleBlur = (field: FieldKey) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate(field, state.contact[field]);
  };

  return (
    <div className="saira-step saira-step-contact">
      <h2 className="saira-step-title">{t("title")}</h2>
      <p className="saira-step-subtitle">{t("subtitle")}</p>

      <div className="saira-step-contact-fields">
        <Field
          label={t("name")}
          value={state.contact.name}
          onChange={(v) => handleChange("name", v)}
          onBlur={() => handleBlur("name")}
          error={touched.name ? errors.name : undefined}
          placeholder={t("namePlaceholder")}
          autoComplete="name"
        />
        <Field
          label={t("whatsapp")}
          value={state.contact.whatsapp}
          onChange={(v) => handleChange("whatsapp", v)}
          onBlur={() => handleBlur("whatsapp")}
          error={touched.whatsapp ? errors.whatsapp : undefined}
          placeholder="+55 21 99999-9999"
          autoComplete="tel"
          inputMode="tel"
        />
        <Field
          label={t("email")}
          value={state.contact.email}
          onChange={(v) => handleChange("email", v)}
          onBlur={() => handleBlur("email")}
          error={touched.email ? errors.email : undefined}
          placeholder="voce@email.com"
          autoComplete="email"
          inputMode="email"
        />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  autoComplete,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email";
}) {
  return (
    <div className="saira-field">
      <label className="saira-input-label">{label}</label>
      <input
        className={"saira-input" + (error ? " has-error" : "")}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
      />
      {error && <span className="saira-field-error">{error}</span>}
    </div>
  );
}
