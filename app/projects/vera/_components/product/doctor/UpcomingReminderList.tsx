"use client";

import { useEffect, useMemo, useState } from "react";
import { UpcomingReminderRow } from "./UpcomingReminderRow";
import { useBookings } from "../../../_hooks/useBookings";
import { SEED_DOCTOR, SEED_SERVICES, SOFIA_ID } from "../../../_lib/seed";
import type { ReminderType } from "./ReminderTypeToggle";

const HOUR = 60 * 60 * 1000;
const MAX_ROWS = 20;

interface UpcomingReminderListProps {
  reminderType: ReminderType;
}

export function UpcomingReminderList({ reminderType }: UpcomingReminderListProps) {
  const [now, setNow] = useState<Date>(() => new Date());

  // Single shared interval. Avoids 20 separate timers.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const bookings = useBookings(SOFIA_ID);
  const servicesById = useMemo(() => new Map(SEED_SERVICES.map((s) => [s.id, s])), []);

  const reminders = useMemo(() => {
    // T-24h: reminder fires 24h before the booking; show bookings whose
    //   reminder fire-time is in the next 25 hours (so reminder shows for
    //   bookings starting between now+23h and now+49h).
    // T-2h: reminders firing in the next 3 hours (bookings now+1h..now+4h).
    const offset = reminderType === "T-24h" ? 24 * HOUR : 2 * HOUR;
    const reminderHorizon = reminderType === "T-24h" ? 25 * HOUR : 3 * HOUR;
    const minStart = now.getTime() - offset + HOUR; // ignore bookings whose reminder already fired
    const maxStart = now.getTime() - offset + reminderHorizon + HOUR;

    return bookings
      .filter((b) => {
        if (b.status !== "confirmed") return false;
        const startMs = new Date(b.startsAt).getTime();
        return startMs >= minStart && startMs <= maxStart;
      })
      .map((b) => ({
        booking: b,
        fireAt: new Date(new Date(b.startsAt).getTime() - offset),
      }))
      .sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime());
  }, [bookings, now, reminderType]);

  const visible = reminders.slice(0, MAX_ROWS);
  const remaining = reminders.length - visible.length;

  if (visible.length === 0) {
    return (
      <div
        style={{
          padding: "var(--space-16) var(--space-4)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
        }}
      >
        <p style={{ margin: 0, fontSize: "var(--text-xl)", color: "var(--muted)" }}>
          {reminderType === "T-24h"
            ? "No hay citas en las próximas 48 horas."
            : "No hay citas en las próximas horas."}
        </p>
        <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--ink-faint)" }}>
          Cuando programes una cita, verás aquí lo que recibirá tu paciente.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      {visible.map(({ booking, fireAt }) => {
        const service = servicesById.get(booking.serviceId);
        if (!service) return null;
        return (
          <UpcomingReminderRow
            key={booking.token}
            booking={booking}
            doctor={SEED_DOCTOR}
            service={service}
            fireAt={fireAt}
            referenceTime={now}
          />
        );
      })}
      {remaining > 0 ? (
        <p
          style={{
            margin: "var(--space-2) 0 0",
            fontSize: "var(--text-sm)",
            color: "var(--muted)",
            textAlign: "center",
          }}
        >
          Y {remaining} {remaining === 1 ? "más" : "más"} en la próxima semana.
        </p>
      ) : null}
    </div>
  );
}
