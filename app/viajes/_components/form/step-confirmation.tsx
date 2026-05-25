"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import type { StepCommon } from "./form-shell";
import type { Trip } from "../../_lib/trips";
import { resetLeadState } from "../../_lib/lead-store";
import { Button } from "../button";

const EASE = [0.22, 1, 0.36, 1] as const;

const BUDGET_LABEL: Record<string, string> = {
  "20000-40000": "$20,000 – $40,000 MXN",
  "40000-80000": "$40,000 – $80,000 MXN",
  "80000-150000": "$80,000 – $150,000 MXN",
  "150000+": "+$150,000 MXN",
};

function formatDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function StepConfirmation({
  state,
  trip,
}: StepCommon & { trip: Trip }) {
  const prefersReducedMotion = useReducedMotion();
  const firstName = (state.nombre ?? "").trim().split(/\s+/)[0] || "viajero";

  useEffect(() => {
    const id = window.setTimeout(() => resetLeadState(), 30_000);
    return () => window.clearTimeout(id);
  }, []);

  const waText = encodeURIComponent(
    `Acabo de enviar mi cotización para "${trip.name}". Mi nombre es ${state.nombre ?? ""}.`,
  );
  const waHref = `https://wa.me/525500000000?text=${waText}`;

  return (
    <motion.div
      initial={
        prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <span
        aria-hidden
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent"
      >
        <Check className="h-6 w-6" strokeWidth={1.75} />
      </span>

      <h1 className="mt-6 text-display-md lg:text-display-lg font-display text-fg">
        Gracias, {firstName}.
      </h1>
      <p className="mt-4 text-body-lg text-fg-muted">
        Recibimos tu solicitud para <span className="text-fg">{trip.name}</span>.
        Un asesor te escribirá por WhatsApp en menos de 24 horas.
      </p>

      <dl className="mt-10 rounded-md border border-border-token bg-bg-elevated divide-y divide-border-token">
        <Row label="Viaje" value={trip.name} />
        <Row
          label="Fechas"
          value={`${formatDate(state.fecha_salida)} → ${formatDate(state.fecha_regreso)}`}
        />
        <Row
          label="Personas"
          value={`${state.personas_adultos ?? 0} ${
            (state.personas_adultos ?? 0) === 1 ? "adulto" : "adultos"
          }${
            state.personas_ninos
              ? `, ${state.personas_ninos} ${
                  state.personas_ninos === 1 ? "niño" : "niños"
                }`
              : ""
          }`}
        />
        <Row
          label="Presupuesto"
          value={BUDGET_LABEL[state.presupuesto_rango ?? ""] ?? "—"}
        />
        <Row label="Contacto" value={state.nombre ?? "—"} />
        <Row label="WhatsApp" value={state.whatsapp ?? "—"} />
        <Row label="Correo" value={state.email ?? "—"} />
      </dl>

      <div className="mt-10 flex flex-wrap gap-4">
        <Button href="/viajes" variant="primary" size="md">
          Volver al inicio
        </Button>
        <Button
          href={waHref}
          variant="secondary"
          size="md"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hablar con un asesor ahora
        </Button>
      </div>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-4 px-5 py-4">
      <dt className="text-eyebrow text-fg-muted col-span-1 self-center">
        {label}
      </dt>
      <dd className="col-span-2 text-body text-fg">{value}</dd>
    </div>
  );
}
