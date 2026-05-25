"use client";

import { Field } from "./field";

const today = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

export function DateRangePicker({
  salida,
  regreso,
  onChange,
  errors,
}: {
  salida: string | undefined;
  regreso: string | undefined;
  onChange: (patch: { fecha_salida?: string; fecha_regreso?: string }) => void;
  errors: Record<string, string>;
}) {
  const min = today();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field
        label="Fecha de salida"
        error={errors.fecha_salida}
        inputProps={{
          id: "fecha_salida",
          name: "fecha_salida",
          type: "date",
          min,
          value: salida ?? "",
          onChange: (e) =>
            onChange({ fecha_salida: e.target.value || undefined }),
        }}
      />
      <Field
        label="Fecha de regreso"
        error={errors.fecha_regreso}
        inputProps={{
          id: "fecha_regreso",
          name: "fecha_regreso",
          type: "date",
          min: salida || min,
          value: regreso ?? "",
          onChange: (e) =>
            onChange({ fecha_regreso: e.target.value || undefined }),
        }}
      />
    </div>
  );
}
