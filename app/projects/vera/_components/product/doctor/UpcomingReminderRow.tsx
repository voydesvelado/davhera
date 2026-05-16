"use client";

import { useState } from "react";
import { ChevronDown, MapPin, User } from "lucide-react";
import { CountdownBadge } from "./CountdownBadge";
import { WhatsAppPreview } from "../booking/WhatsAppPreview";
import { formatRelative, formatDate, formatTime, formatDuration, formatPrice } from "../../../_lib/date-format";
import type { Booking, Doctor, Service } from "../../../_lib/types";

interface UpcomingReminderRowProps {
  booking: Booking;
  doctor: Doctor;
  service: Service;
  /** Wall-clock time of the actual reminder send (= booking.startsAt − offset). */
  fireAt: Date;
  referenceTime: Date;
}

export function UpcomingReminderRow({
  booking,
  doctor,
  service,
  fireAt,
  referenceTime,
}: UpcomingReminderRowProps) {
  const [expanded, setExpanded] = useState(false);
  const startsAt = new Date(booking.startsAt);

  return (
    <article
      style={{
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-5) var(--space-5) var(--space-4)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "var(--space-3)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              fontSize: "var(--text-2xs)",
              fontWeight: 500,
              letterSpacing: "var(--tracking-widest)",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Programado para
          </span>
          <span style={{ fontSize: "var(--text-md)", color: "var(--ink)", fontWeight: 500 }}>
            {formatRelative(fireAt, referenceTime)}
          </span>
        </div>
        <CountdownBadge fireAt={fireAt} referenceTime={referenceTime} />
      </header>

      <WhatsAppPreview
        variant="reminder"
        recipient="patient"
        booking={booking}
        doctor={doctor}
        service={service}
        statusBarTime={fireAt}
      />

      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        style={{
          display: "inline-flex",
          alignItems: "center",
          alignSelf: "flex-start",
          gap: "var(--space-1)",
          padding: "var(--space-1) var(--space-2)",
          background: "transparent",
          border: "none",
          color: "var(--muted)",
          fontSize: "var(--text-sm)",
          cursor: "pointer",
          fontFamily: "var(--font-geist), system-ui, sans-serif",
        }}
        className="vera-reminder-disclosure"
      >
        Detalle de la cita
        <ChevronDown
          size={14}
          strokeWidth={1.75}
          style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform var(--dur-base) var(--ease-snap)",
          }}
        />
        <style>{`.vera-reminder-disclosure:hover { color: var(--ink-soft); }`}</style>
      </button>

      {expanded ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
            padding: "var(--space-3)",
            background: "var(--bg-sunken)",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--text-sm)",
            color: "var(--ink-soft)",
          }}
        >
          <DetailRow icon={<User size={14} strokeWidth={1.75} />} label={booking.patientName} />
          <DetailRow
            icon={<span aria-hidden style={{ fontSize: 12 }}>·</span>}
            label={`${service.name} · ${formatDuration(service.durationMin)} · ${formatPrice(service.priceMxn)} · ${formatDate(startsAt)} a las ${formatTime(startsAt)}`}
          />
          <DetailRow
            icon={<MapPin size={14} strokeWidth={1.75} />}
            label={
              doctor.location.type === "in_person"
                ? doctor.location.address.split("\n")[0]
                : `Sesión en línea por ${doctor.location.platform}`
            }
          />
        </div>
      ) : null}
    </article>
  );
}

function DetailRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <p style={{ margin: 0, display: "flex", gap: "var(--space-2)", alignItems: "flex-start" }}>
      <span aria-hidden style={{ flexShrink: 0, marginTop: 2, color: "var(--ink-faint)" }}>
        {icon}
      </span>
      <span>{label}</span>
    </p>
  );
}
