"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Link } from "@/app/proyectos/saira/lib/i18n/navigation";
import { useSairaRouter } from "@/app/proyectos/saira/lib/i18n/client-nav";
import {
  CONFIRMED_BOOKING_KEY,
  type ConfirmedBookingSnapshot,
} from "@/lib/saira/booking/context";
import { formatBRL } from "@/lib/saira/format";
import { WhatsAppPreview } from "./WhatsAppPreview";

function generateBookingId(): string {
  return `SAR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function buildGoogleCalendarUrl({
  title,
  description,
  location,
  startDate,
  durationMinutes,
}: {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  durationMinutes: number;
}): string {
  const formatDate = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    details: description,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function ConfirmationView() {
  const t = useTranslations("confirmation");
  const locale = useLocale();
  const router = useSairaRouter();
  const [booking, setBooking] = useState<ConfirmedBookingSnapshot | null>(null);
  const [missing, setMissing] = useState(false);
  const bookingId = useMemo(generateBookingId, []);

  useEffect(() => {
    const raw =
      typeof window !== "undefined"
        ? sessionStorage.getItem(CONFIRMED_BOOKING_KEY)
        : null;
    if (raw) {
      try {
        setBooking(JSON.parse(raw) as ConfirmedBookingSnapshot);
        return;
      } catch {
        // fallthrough
      }
    }
    setMissing(true);
    const id = setTimeout(() => router.push("/"), 2400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!booking) {
    return (
      <main className="saira-confirmation saira-confirmation-empty">
        <p className="saira-notfound-body">
          {missing ? t("noBookingFound") : t("loading")}
        </p>
      </main>
    );
  }

  const date = booking.date ? new Date(booking.date) : null;
  const total = booking.tour.priceBRL * booking.people;
  const totalLabel = booking.tour.priceOnRequest
    ? t("priceOnRequest")
    : formatBRL(total);
  const firstName = booking.contact.name.trim().split(/\s+/)[0] || "—";

  const calendarUrl = date
    ? buildGoogleCalendarUrl({
        title: `${booking.tour.name} · Saira Ecotour`,
        description: t("calendarDescription", {
          tour: booking.tour.name,
          people: booking.people,
          bookingId,
        }),
        location: "Rio de Janeiro, Brasil",
        startDate: date,
        durationMinutes: booking.tour.durationMinutes ?? 180,
      })
    : null;

  return (
    <main className="saira-confirmation">
      <motion.div
        className="saira-confirmation-icon"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <div className="saira-confirmation-circle">
          <svg viewBox="0 0 24 24" width="32" height="32">
            <motion.path
              d="M5 12l5 5 9-11"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            />
          </svg>
        </div>
      </motion.div>

      <motion.h1
        className="saira-confirmation-title"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        {t("title")}
      </motion.h1>

      <motion.p
        className="saira-confirmation-lede"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.95 }}
      >
        {t("lede", { name: firstName })}
      </motion.p>

      <motion.div
        className="saira-confirmation-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1 }}
      >
        <div className="saira-confirmation-id">
          <span className="saira-confirmation-id-label">{t("bookingId")}</span>
          <span className="saira-confirmation-id-value">{bookingId}</span>
        </div>

        <div className="saira-confirmation-divider" />

        <h2 className="saira-confirmation-tour">{booking.tour.name}</h2>
        <div className="saira-confirmation-rows">
          <Row
            label={t("date")}
            value={
              date
                ? date.toLocaleDateString(locale, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—"
            }
          />
          <Row
            label={t("people")}
            value={`${booking.people} ${
              booking.people === 1 ? t("person") : t("peoplePlural")
            }`}
          />
          <Row label={t("total")} value={totalLabel} highlight />
        </div>

        {calendarUrl && (
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="saira-btn saira-btn-secondary saira-btn-md saira-confirmation-calendar"
          >
            <Calendar size={16} aria-hidden="true" />
            {t("addToCalendar")}
          </a>
        )}
      </motion.div>

      <motion.div
        className="saira-confirmation-whatsapp"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        <h3 className="saira-confirmation-whatsapp-title">
          {t("whatsappTitle")}
        </h3>
        <p className="saira-confirmation-whatsapp-sub">
          {t("whatsappSub", { phone: booking.contact.whatsapp })}
        </p>
        <WhatsAppPreview booking={booking} bookingId={bookingId} />
      </motion.div>

      <motion.div
        className="saira-confirmation-actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.5 }}
      >
        <Link href="/" className="saira-btn saira-btn-ghost saira-btn-md">
          {t("backToHome")}
        </Link>
      </motion.div>
    </main>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        "saira-confirmation-row" + (highlight ? " is-highlight" : "")
      }
    >
      <span className="saira-confirmation-row-label">{label}</span>
      <span className="saira-confirmation-row-value">{value}</span>
    </div>
  );
}
