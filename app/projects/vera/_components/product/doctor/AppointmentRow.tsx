"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle, Mail } from "lucide-react";
import { Button } from "../../ui/Button";
import { useToast } from "../../ui/Toast";
import { formatTime, formatDuration } from "../../../_lib/date-format";
import type { Booking, Service } from "../../../_lib/types";

interface AppointmentRowProps {
  booking: Booking;
  service: Service;
  /** Subtle accent tint to mark the next-upcoming row. */
  isNext?: boolean;
}

export function AppointmentRow({ booking, service, isNext = false }: AppointmentRowProps) {
  const [open, setOpen] = useState(false);
  const toast = useToast();
  const startsAt = new Date(booking.startsAt);

  const ephemeralAction = (label: string) => () => {
    toast.show({
      tone: "default",
      message: `${label} (no se guarda en el demo)`,
    });
  };

  return (
    <div
      style={{
        background: isNext ? "color-mix(in oklch, var(--accent-pale) 60%, var(--bg-raised))" : "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        transition: "border-color var(--dur-quick) var(--ease-snap)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
          width: "100%",
          minHeight: "var(--row-height-base)",
          padding: "var(--space-2) var(--space-3)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          color: "var(--ink)",
          fontFamily: "var(--font-geist), system-ui, sans-serif",
        }}
        className="vera-appt-row"
      >
        <span
          style={{
            fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
            fontSize: "var(--text-md)",
            fontWeight: 500,
            color: "var(--accent)",
            fontFeatureSettings: '"tnum" 1',
            minWidth: 52,
          }}
        >
          {formatTime(startsAt)}
        </span>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              fontSize: "var(--text-md)",
              color: "var(--ink)",
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {booking.patientName}
          </span>
          <span
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--muted)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {service.name}
          </span>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "2px 8px",
            background: "var(--bg-sunken)",
            color: "var(--ink-soft)",
            border: "1px solid var(--rule-faint)",
            borderRadius: "var(--radius-pill)",
            fontSize: "var(--text-xs)",
            fontFeatureSettings: '"tnum" 1',
          }}
        >
          {formatDuration(service.durationMin)}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.75}
          color="var(--muted)"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform var(--dur-base) var(--ease-snap)",
          }}
        />
        <style>{`
          .vera-appt-row:hover { background: var(--bg-sunken); }
        `}</style>
      </button>

      <div
        style={{
          maxHeight: open ? 280 : 0,
          overflow: "hidden",
          transition: "max-height var(--dur-snap) var(--ease-snap)",
        }}
      >
        <div
          style={{
            padding: "0 var(--space-4) var(--space-4)",
            borderTop: "1px solid var(--rule-faint)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
            paddingTop: "var(--space-3)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <a
              href={`https://wa.me/${booking.patientPhone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                fontSize: "var(--text-sm)",
                color: "var(--accent)",
                textDecoration: "none",
                width: "fit-content",
              }}
            >
              <MessageCircle size={14} strokeWidth={1.75} />
              {booking.patientPhone}
            </a>
            <a
              href={`mailto:${booking.patientEmail}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                fontSize: "var(--text-sm)",
                color: "var(--ink-soft)",
                textDecoration: "none",
                width: "fit-content",
              }}
            >
              <Mail size={14} strokeWidth={1.75} />
              {booking.patientEmail}
            </a>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: "var(--text-sm)",
              color: booking.patientNote ? "var(--ink-soft)" : "var(--muted)",
              lineHeight: "var(--leading-snug)",
              padding: "var(--space-2) var(--space-3)",
              background: "var(--bg-sunken)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {booking.patientNote || "Sin notas"}
          </p>

          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <Button size="xs" variant="ghost" onClick={ephemeralAction("Cita marcada como completada")}>
              Marcar completada
            </Button>
            <Button size="xs" variant="ghost" onClick={ephemeralAction("Cita marcada como no asistió")}>
              Marcar no asistió
            </Button>
            <Button size="xs" variant="ghost" onClick={ephemeralAction("Reagendar abierto")}>
              Reagendar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
