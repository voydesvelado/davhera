import { MapPin } from "lucide-react";
import type { Booking, Doctor, Service } from "../../_lib/types";
import { formatDate, formatTime, formatDuration, formatPrice } from "../../_lib/date-format";

interface BookingDetailCardProps {
  booking: Booking;
  doctor: Doctor;
  service: Service;
  /** Render in a slightly muted style (used by the cancel-confirm screen). */
  muted?: boolean;
}

export function BookingDetailCard({ booking, doctor, service, muted = false }: BookingDetailCardProps) {
  const startsAt = new Date(booking.startsAt);
  const inkColor = muted ? "var(--ink-soft)" : "var(--ink)";

  return (
    <article
      style={{
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
        padding: "var(--space-6)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        opacity: muted ? 0.92 : 1,
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
        <h2
          style={{
            margin: "var(--space-2) 0 0",
            fontSize: "var(--text-2xl)",
            fontWeight: 600,
            letterSpacing: "var(--tracking-snug)",
            color: inkColor,
            lineHeight: 1.2,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              color: muted ? "var(--ink-soft)" : "var(--accent)",
              fontFeatureSettings: '"tnum" 1',
            }}
          >
            {formatTime(startsAt)}
          </span>{" "}
          · {formatDate(startsAt)}
        </h2>
      </div>

      <Row label="Duración" value={`${formatDuration(service.durationMin)} · ${formatPrice(service.priceMxn)}`} mono />

      <Row
        label="Dónde"
        value={
          doctor.location.type === "in_person" ? (
            <div style={{ whiteSpace: "pre-line", lineHeight: "var(--leading-snug)" }}>
              <MapPin size={14} strokeWidth={1.5} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
              {doctor.location.address}
              <a
                href={doctor.location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  marginTop: "var(--space-1)",
                  fontSize: "var(--text-sm)",
                  color: "var(--accent)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Cómo llegar →
              </a>
            </div>
          ) : (
            `Sesión en línea por ${doctor.location.platform}`
          )
        }
      />

      <Row label="A nombre de" value={booking.patientName} />

      <p
        style={{
          margin: 0,
          paddingTop: "var(--space-3)",
          borderTop: "1px solid var(--rule-faint)",
          fontSize: "var(--text-2xs)",
          color: "var(--muted)",
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          letterSpacing: "var(--tracking-wide)",
        }}
      >
        Referencia: {booking.token}
      </p>
    </article>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
      <span
        style={{
          fontSize: "var(--text-xs)",
          fontWeight: 500,
          letterSpacing: "var(--tracking-widest)",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        {label}
      </span>
      <div
        style={{
          fontSize: "var(--text-md)",
          color: "var(--ink-soft)",
          fontFamily: mono
            ? "var(--font-geist-mono), ui-monospace, monospace"
            : "var(--font-geist), system-ui, sans-serif",
          fontFeatureSettings: mono ? '"tnum" 1' : undefined,
        }}
      >
        {value}
      </div>
    </div>
  );
}
