import type { Booking, Doctor, Service } from "../../_lib/types";
import { formatDate, formatTime, formatDuration, formatPrice } from "../../_lib/date-format";

interface ConfirmationCardProps {
  booking: Booking;
  doctor: Doctor;
  service: Service;
}

export function ConfirmationCard({ booking, doctor, service }: ConfirmationCardProps) {
  const startDate = new Date(booking.startsAt);
  const locationLine =
    doctor.location.type === "in_person"
      ? doctor.location.address.split("\n")[0]
      : `Sesión en línea · ${doctor.location.platform}`;

  return (
    <div
      style={{
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
        padding: "var(--space-5)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: "var(--text-xs)",
            fontWeight: 500,
            letterSpacing: "var(--tracking-widest)",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          {service.name}
        </p>
        <p
          style={{
            margin: "var(--space-1) 0 0",
            fontSize: "var(--text-2xl)",
            fontWeight: 600,
            letterSpacing: "var(--tracking-snug)",
            color: "var(--ink)",
            lineHeight: 1.2,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              color: "var(--accent)",
              fontFeatureSettings: '"tnum" 1',
            }}
          >
            {formatTime(startDate)}
          </span>{" "}
          · {formatDate(startDate)}
        </p>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: "var(--text-sm)",
          color: "var(--muted)",
          fontFeatureSettings: '"tnum" 1',
        }}
      >
        {formatDuration(service.durationMin)} · {formatPrice(service.priceMxn)} · {doctor.name}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "var(--space-2)",
          fontSize: "var(--text-sm)",
          color: "var(--ink-soft)",
          paddingTop: "var(--space-2)",
          borderTop: "1px solid var(--rule-faint)",
        }}
      >
        {locationLine}
      </div>

      <p
        style={{
          margin: 0,
          fontSize: "var(--text-2xs)",
          color: "var(--muted)",
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          letterSpacing: "var(--tracking-wide)",
        }}
      >
        REF · {booking.token}
      </p>
    </div>
  );
}
