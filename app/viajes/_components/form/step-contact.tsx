"use client";

import type { StepCommon } from "./form-shell";
import { Field } from "./field";
import { normalizeWhatsapp } from "../../_lib/form-schema";

export function StepContact({ state, errors, onChange }: StepCommon) {
  return (
    <div>
      <h1 className="text-display-md font-display text-fg">
        ¿Cómo te contactamos?
      </h1>
      <p className="mt-3 text-body-lg text-fg-muted">
        Un asesor te escribirá en menos de 24 horas con una propuesta
        personalizada.
      </p>

      <div className="mt-10 space-y-6">
        <Field
          label="Nombre completo"
          error={errors.nombre}
          inputProps={{
            id: "nombre",
            name: "nombre",
            type: "text",
            autoComplete: "name",
            value: state.nombre ?? "",
            placeholder: "Ana López",
            onChange: (e) => onChange({ nombre: e.target.value }),
          }}
        />
        <Field
          label="WhatsApp"
          error={errors.whatsapp}
          hint="A 10 dígitos, formato MX."
          inputProps={{
            id: "whatsapp",
            name: "whatsapp",
            type: "tel",
            inputMode: "tel",
            autoComplete: "tel-national",
            value: state.whatsapp ?? "",
            placeholder: "55 1234 5678",
            onChange: (e) => onChange({ whatsapp: e.target.value }),
            onBlur: (e) =>
              onChange({ whatsapp: normalizeWhatsapp(e.target.value) }),
          }}
        />
        <Field
          label="Correo electrónico"
          error={errors.email}
          inputProps={{
            id: "email",
            name: "email",
            type: "email",
            autoComplete: "email",
            value: state.email ?? "",
            placeholder: "ana@ejemplo.com",
            onChange: (e) => onChange({ email: e.target.value }),
          }}
        />
      </div>

      <p className="mt-8 text-body-sm text-fg-muted">
        Tus datos están seguros. Solo los usamos para enviarte tu cotización.
      </p>
    </div>
  );
}
