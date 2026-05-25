"use client";

import { useTranslations, useLocale } from "next-intl";
import type { ConfirmedBookingSnapshot } from "@/lib/saira/booking/context";

// Único lugar en todo el sitio donde se permiten emojis. Razón: el preview
// simula un mensaje real de WhatsApp, contexto donde son la norma.

export function WhatsAppPreview({
  booking,
  bookingId,
}: {
  booking: ConfirmedBookingSnapshot;
  bookingId: string;
}) {
  const t = useTranslations("confirmation.whatsappMessage");
  const locale = useLocale();

  const date = booking.date ? new Date(booking.date) : null;
  const dateStr =
    date?.toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    }) ?? "—";
  const timeStr = new Date().toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const firstName = booking.contact.name.trim().split(/\s+/)[0] || "amigo";
  const peopleWord = booking.people === 1 ? t("personSingular") : t("personPlural");

  return (
    <div className="saira-whatsapp" aria-hidden="true">
      <div className="saira-whatsapp-header">
        <div className="saira-whatsapp-avatar">S</div>
        <div className="saira-whatsapp-meta">
          <div className="saira-whatsapp-name">Saira Ecotour</div>
          <div className="saira-whatsapp-status">online</div>
        </div>
      </div>

      <div className="saira-whatsapp-body">
        <div className="saira-whatsapp-bubble">
          <p>{t("greeting", { name: firstName })}</p>
          <p>{t("confirmed", { tour: booking.tour.name })}</p>
          <p>
            📅 <strong>{dateStr}</strong>
            <br />
            👥{" "}
            <strong>
              {booking.people} {peopleWord}
            </strong>
            <br />
            🆔 <strong>{bookingId}</strong>
          </p>
          <p>{t("details")}</p>
          <span className="saira-whatsapp-time">{timeStr}</span>
        </div>
      </div>
    </div>
  );
}
