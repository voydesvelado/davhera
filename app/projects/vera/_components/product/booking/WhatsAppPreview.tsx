"use client";

import { ChevronLeft, Video, Phone } from "lucide-react";
import type { Booking, Doctor, Service } from "../../../_lib/types";
import { formatTime, formatDate, formatDayName, formatDateNoYearShort } from "../../../_lib/date-format";

export type WhatsAppVariant = "confirmation" | "reminder" | "reschedule" | "cancellation";
export type WhatsAppRecipient = "patient" | "doctor";

interface WhatsAppPreviewProps {
  variant: WhatsAppVariant;
  recipient: WhatsAppRecipient;
  booking: Booking;
  doctor: Doctor;
  service: Service;
  /** Time shown in the device status bar. Defaults to booking start − 1h. */
  statusBarTime?: Date;
  /** Used by the reschedule variant — the previous startsAt. */
  previousStartsAt?: Date;
}

const WHATSAPP_GREEN_LIGHT = "#075E54";

function buildMessage({
  variant,
  recipient,
  booking,
  doctor,
  service,
  previousStartsAt,
}: WhatsAppPreviewProps): string {
  const start = new Date(booking.startsAt);
  const dateLong = formatDate(start);
  const dateShort = formatDateNoYearShort(start);
  const time = formatTime(start);
  const dayName = formatDayName(start);
  const link = `vera.app/cita/${booking.token}`;
  const profileLink = `vera.app/${doctor.slug}`;
  const addressShort =
    doctor.location.type === "in_person"
      ? doctor.location.address.split("\n").slice(0, 2).join(", ")
      : `Sesión en línea por ${doctor.location.platform}`;

  if (recipient === "doctor") {
    if (variant === "confirmation") {
      return `Nueva cita · ${booking.patientName} · ${service.name} · ${dateShort} a las ${time}. Ver detalles: vera.app/panel`;
    }
    if (variant === "reschedule") {
      const prev = previousStartsAt ? `${formatDateNoYearShort(previousStartsAt)} a las ${formatTime(previousStartsAt)}` : "antes";
      return `Cita reagendada · ${booking.patientName} (${service.name}). De ${prev} a ${dateShort} a las ${time}. Ver detalles: vera.app/panel`;
    }
    if (variant === "cancellation") {
      return `Cita cancelada · ${booking.patientName} (${service.name}, ${dateShort} a las ${time}). Ver detalles: vera.app/panel`;
    }
    return `Recordatorio · ${booking.patientName} · ${service.name} · ${dateShort} a las ${time}.`;
  }

  // patient
  if (variant === "confirmation") {
    return `Tu cita está confirmada. ${service.name} con ${doctor.name}, ${dateLong} a las ${time}. ${addressShort}. Si necesitas reagendar o cancelar, aquí: ${link}`;
  }
  if (variant === "reminder") {
    return `Recordatorio: mañana ${dayName} a las ${time} tienes tu ${service.name} con ${doctor.name}. ${addressShort}. ¿Necesitas reagendar? ${link}`;
  }
  if (variant === "reschedule") {
    return `Tu cita fue reagendada. Nuevo horario: ${dateLong} a las ${time}. ${service.name} con ${doctor.name}. ${link}`;
  }
  // cancellation
  return `Tu cita del ${dateShort} a las ${time} ha sido cancelada. Si quieres reservar otro horario: ${profileLink}`;
}

export function WhatsAppPreview(props: WhatsAppPreviewProps) {
  const { recipient, doctor, booking, statusBarTime } = props;
  const message = buildMessage(props);

  const headerName = recipient === "patient" ? doctor.name : "Vera";
  const start = new Date(booking.startsAt);
  const statusTime = statusBarTime ?? new Date(start.getTime() - 3_600_000);
  const messageTime = formatTime(statusTime);

  return (
    <div
      className="vera-wa-frame"
      style={{
        position: "relative",
        width: "min(80vw, 320px)",
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-lg)",
        padding: "8px",
        margin: "0 auto",
      }}
    >
      {/* Notch */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          width: 90,
          height: 22,
          background: "#000",
          borderRadius: 12,
          zIndex: 2,
        }}
      />
      <div
        className="vera-wa-screen"
        style={{
          position: "relative",
          background: "#ECE5DD",
          borderRadius: "calc(var(--radius-xl) - 4px)",
          overflow: "hidden",
          aspectRatio: "9 / 16",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Status bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 18px 6px",
            color: "#fff",
            background: WHATSAPP_GREEN_LIGHT,
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontFeatureSettings: '"tnum" 1',
            minHeight: 28,
          }}
        >
          <span>{messageTime}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <SignalGlyph />
            <WifiGlyph />
            <BatteryGlyph />
          </span>
        </div>

        {/* WhatsApp header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            background: WHATSAPP_GREEN_LIGHT,
            color: "#fff",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <ChevronLeft size={18} strokeWidth={2.25} color="#fff" />
          <Avatar recipient={recipient} doctor={doctor} />
          <div style={{ flex: 1, lineHeight: 1.1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{headerName}</div>
            <div style={{ fontSize: 10, opacity: 0.85 }}>en línea</div>
          </div>
          <Video size={16} strokeWidth={2} color="#fff" />
          <Phone size={16} strokeWidth={2} color="#fff" />
        </div>

        {/* Chat body — diagonal pattern */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#ECE5DD",
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(0,0,0,0.025) 0 2px, transparent 2px 12px)",
            padding: "16px 12px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <div
            style={{
              maxWidth: "78%",
              alignSelf: "flex-start",
              background: "#fff",
              color: "#111B21",
              borderRadius: "8px 8px 8px 2px",
              boxShadow: "0 1px 1px rgba(0,0,0,0.08)",
              padding: "8px 10px 6px",
              fontSize: 12.5,
              lineHeight: 1.4,
              fontFamily: "system-ui, -apple-system, sans-serif",
              wordBreak: "break-word",
            }}
          >
            {message}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 3,
                marginTop: 4,
                fontSize: 9.5,
                color: "#667781",
                fontFeatureSettings: '"tnum" 1',
              }}
            >
              {messageTime}
              <DoubleCheckGlyph />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Avatar({
  recipient,
  doctor,
}: {
  recipient: WhatsAppRecipient;
  doctor: Doctor;
}) {
  if (recipient === "patient") {
    return (
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 12,
          fontWeight: 600,
          flexShrink: 0,
        }}
        aria-hidden
      >
        {doctor.name
          .split(" ")
          .filter((p) => p && p[0] && p[0] === p[0].toUpperCase())
          .slice(0, 2)
          .map((p) => p[0])
          .join("")}
      </div>
    );
  }
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: "var(--accent)",
        color: "var(--accent-ink)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 700,
        flexShrink: 0,
      }}
      aria-hidden
    >
      V
    </div>
  );
}

function SignalGlyph() {
  return (
    <svg width="13" height="9" viewBox="0 0 13 9" aria-hidden>
      <rect x="0" y="6" width="2" height="3" rx="0.5" fill="#fff" />
      <rect x="3.5" y="4" width="2" height="5" rx="0.5" fill="#fff" />
      <rect x="7" y="2" width="2" height="7" rx="0.5" fill="#fff" />
      <rect x="10.5" y="0" width="2" height="9" rx="0.5" fill="#fff" />
    </svg>
  );
}

function WifiGlyph() {
  return (
    <svg width="13" height="9" viewBox="0 0 13 9" aria-hidden>
      <path
        d="M 1 3 Q 6.5 -1 12 3"
        stroke="#fff"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 3 5 Q 6.5 1.5 10 5"
        stroke="#fff"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="6.5" cy="7" r="1" fill="#fff" />
    </svg>
  );
}

function BatteryGlyph() {
  return (
    <svg width="22" height="11" viewBox="0 0 22 11" aria-hidden>
      <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="#fff" fill="none" strokeWidth="1" />
      <rect x="2" y="2" width="13" height="7" rx="1" fill="#fff" />
      <rect x="19.5" y="3.5" width="2" height="4" rx="0.5" fill="#fff" />
    </svg>
  );
}

function DoubleCheckGlyph() {
  return (
    <svg width="14" height="9" viewBox="0 0 14 9" aria-hidden>
      <path d="M 0.5 5 L 3 7.5 L 8 1.5" stroke="#53BDEB" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 5 5 L 7.5 7.5 L 12.5 1.5" stroke="#53BDEB" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
