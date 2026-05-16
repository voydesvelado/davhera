"use client";

import { useState, useMemo } from "react";
import { TriangleAlert } from "lucide-react";
import { Sheet } from "../../ui/Sheet";
import { Button } from "../../ui/Button";
import { WhatsAppDraftPreview } from "./WhatsAppDraftPreview";
import { formatTime, formatDateNoYearShort } from "../../../_lib/date-format";
import type { Booking, Service } from "../../../_lib/types";

interface AffectedBookingsWarningProps {
  bookings: Booking[];
  services: Service[];
  /** Used to format the message draft. */
  rangeFrom: Date;
  rangeTo: Date;
}

function buildDraft(booking: Booking, rangeFrom: Date, rangeTo: Date): string {
  const firstName = booking.patientName.split(" ")[0];
  const sameDay = rangeFrom.toDateString() === rangeTo.toDateString();
  const rangeText = sameDay
    ? `el ${formatDateNoYearShort(rangeFrom)}`
    : `del ${formatDateNoYearShort(rangeFrom)} al ${formatDateNoYearShort(rangeTo)}`;
  return `Hola ${firstName}, lamento avisarte que tendré que cerrar el consultorio ${rangeText}. ¿Podemos mover tu cita? Aquí están mis siguientes huecos disponibles: vera.app/dra-sofia-ramirez`;
}

export function AffectedBookingsWarning({
  bookings,
  services,
  rangeFrom,
  rangeTo,
}: AffectedBookingsWarningProps) {
  const [draftFor, setDraftFor] = useState<Booking | null>(null);
  const servicesById = useMemo(() => new Map(services.map((s) => [s.id, s])), [services]);

  if (bookings.length === 0) return null;

  return (
    <section
      style={{
        background: "color-mix(in oklch, var(--warning) 8%, var(--bg-raised))",
        border: "1px solid color-mix(in oklch, var(--warning) 35%, var(--rule))",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-4)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
        <TriangleAlert size={14} strokeWidth={1.75} color="var(--warning)" />
        <p
          style={{
            margin: 0,
            fontSize: "var(--text-xs)",
            fontWeight: 500,
            letterSpacing: "var(--tracking-widest)",
            textTransform: "uppercase",
            color: "var(--warning)",
          }}
        >
          {bookings.length} {bookings.length === 1 ? "cita afectada" : "citas afectadas"}
        </p>
      </div>
      <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--ink-soft)" }}>
        Tendrás que notificar a cada paciente para reagendar.
      </p>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
        }}
      >
        {bookings.map((b) => {
          const svc = servicesById.get(b.serviceId);
          const startsAt = new Date(b.startsAt);
          return (
            <li
              key={b.token}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--space-3)",
                padding: "var(--space-2) var(--space-3)",
                background: "var(--bg-raised)",
                border: "1px solid var(--rule-faint)",
                borderRadius: "var(--radius-sm)",
                fontSize: "var(--text-sm)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                <span style={{ fontWeight: 500, color: "var(--ink)" }}>{b.patientName}</span>
                <span style={{ color: "var(--muted)" }}>
                  {svc?.name} · {formatDateNoYearShort(startsAt)} · {formatTime(startsAt)}
                </span>
              </div>
              <Button size="xs" variant="ghost" onClick={() => setDraftFor(b)}>
                Mensaje pre-escrito →
              </Button>
            </li>
          );
        })}
      </ul>

      <Sheet
        open={draftFor !== null}
        onOpenChange={(o) => !o && setDraftFor(null)}
        size="md"
        title="Mensaje para tu paciente"
        description="Edita y abre WhatsApp para enviarlo."
      >
        {draftFor ? (
          <WhatsAppDraftPreview booking={draftFor} message={buildDraft(draftFor, rangeFrom, rangeTo)} />
        ) : null}
      </Sheet>
    </section>
  );
}
