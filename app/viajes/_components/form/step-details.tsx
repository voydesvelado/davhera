"use client";

import type { StepCommon } from "./form-shell";
import { NumberStepper } from "./number-stepper";
import { cn } from "@/lib/utils";

const BUDGET_OPTIONS: { value: string; label: string }[] = [
  { value: "20000-40000", label: "$20,000 – $40,000 MXN" },
  { value: "40000-80000", label: "$40,000 – $80,000 MXN" },
  { value: "80000-150000", label: "$80,000 – $150,000 MXN" },
  { value: "150000+", label: "+$150,000 MXN" },
];

export function StepDetails({ state, errors, onChange }: StepCommon) {
  const adults = state.personas_adultos ?? 2;
  const kids = state.personas_ninos ?? 0;
  const budget = state.presupuesto_rango ?? "";

  return (
    <div>
      <h1 className="text-display-md font-display text-fg">
        Algunos detalles más
      </h1>
      <p className="mt-3 text-body-lg text-fg-muted">
        Esto nos ayuda a diseñar la propuesta a tu medida.
      </p>

      <div className="mt-10">
        <NumberStepper
          id="personas_adultos"
          label="Adultos"
          value={adults}
          onChange={(v) => onChange({ personas_adultos: v })}
          min={1}
          max={12}
        />
        <NumberStepper
          id="personas_ninos"
          label="Niños"
          value={kids}
          onChange={(v) => onChange({ personas_ninos: v })}
          min={0}
          max={8}
        />
        {errors.personas_adultos ? (
          <p className="mt-2 text-body-sm text-accent" role="alert">
            {errors.personas_adultos}
          </p>
        ) : null}
      </div>

      <fieldset className="mt-10">
        <legend className="block text-eyebrow text-fg-muted mb-4">
          Presupuesto aproximado por persona
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BUDGET_OPTIONS.map((opt) => {
            const checked = budget === opt.value;
            const id = `presupuesto_${opt.value}`;
            return (
              <label
                key={opt.value}
                htmlFor={id}
                className={cn(
                  "block cursor-pointer rounded-md border px-5 py-4 text-body transition-colors duration-200 outline-none focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent",
                  checked
                    ? "border-accent bg-accent/5 text-fg"
                    : "border-border-token bg-transparent text-fg hover:bg-fg/5",
                )}
              >
                <input
                  id={id}
                  type="radio"
                  name="presupuesto_rango"
                  value={opt.value}
                  checked={checked}
                  onChange={() => onChange({ presupuesto_rango: opt.value })}
                  className="sr-only"
                  data-form-trigger="false"
                />
                {opt.label}
              </label>
            );
          })}
        </div>
        {errors.presupuesto_rango ? (
          <p className="mt-3 text-body-sm text-accent" role="alert">
            {errors.presupuesto_rango}
          </p>
        ) : null}
      </fieldset>

      <div className="mt-10">
        <label
          htmlFor="notas"
          className="block text-eyebrow text-fg-muted mb-2"
        >
          ¿Algo más que quieras contarnos?
        </label>
        <textarea
          id="notas"
          name="notas"
          rows={4}
          value={state.notas ?? ""}
          onChange={(e) => onChange({ notas: e.target.value })}
          placeholder="Aniversario, dieta especial, accesibilidad, sorpresas para alguien…"
          className="w-full rounded-md border border-border-token bg-bg-elevated p-4 text-body text-fg placeholder:text-fg-subtle min-h-[120px] resize-y outline-none focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </div>
    </div>
  );
}
