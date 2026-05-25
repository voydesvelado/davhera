"use client";

import Link from "next/link";
import type { StepCommon } from "./form-shell";
import type { Trip } from "../../_lib/trips";
import { DateRangePicker } from "./date-range-picker";

export function StepTrip({
  state,
  errors,
  onChange,
  trip,
}: StepCommon & { trip: Trip }) {
  return (
    <div>
      <h1 className="text-display-md font-display text-fg">
        Cuéntanos sobre tu viaje
      </h1>
      <p className="mt-3 text-body-lg text-fg-muted">
        Solo dos datos para empezar.
      </p>

      <div className="mt-10 flex items-center justify-between gap-4 p-5 rounded-md border border-border-token bg-bg-elevated">
        <div>
          <p className="text-eyebrow text-fg-muted">Viaje seleccionado</p>
          <p className="mt-1 text-body font-medium text-fg">{trip.name}</p>
          <p className="text-body-sm text-fg-muted">{trip.destination}</p>
        </div>
        <Link
          href="/viajes#catalogo"
          className="text-body-sm text-accent hover:text-accent-hover transition-colors duration-200"
        >
          Cambiar
        </Link>
      </div>

      <div className="mt-8">
        <DateRangePicker
          salida={state.fecha_salida}
          regreso={state.fecha_regreso}
          onChange={onChange}
          errors={errors}
        />
      </div>
    </div>
  );
}
