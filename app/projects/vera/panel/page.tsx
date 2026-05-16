"use client";

import { useMemo, useState } from "react";
import { DoctorPageHeader } from "../_components/product/doctor/DoctorPageHeader";
import { WeekStrip } from "../_components/product/doctor/WeekStrip";
import { AppointmentRow } from "../_components/product/doctor/AppointmentRow";
import { EmptyDay } from "../_components/product/doctor/EmptyDay";
import { NextSlotPill } from "../_components/product/NextSlotPill";
import { useBookings } from "../_hooks/useBookings";
import { SEED_SERVICES, SOFIA_ID } from "../_lib/seed";
import {
  formatDate,
  ymdInMx,
  formatDayName,
  formatDayNumber,
} from "../_lib/date-format";

const MX_TZ = "America/Mexico_City";

function todayInMx(): Date {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: MX_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return new Date(`${get("year")}-${get("month")}-${get("day")}T06:00:00.000Z`);
}

export default function PanelHoyPage() {
  const todayYmd = useMemo(() => ymdInMx(todayInMx()), []);
  const [selectedDay, setSelectedDay] = useState<string>(todayYmd);

  const bookings = useBookings(SOFIA_ID);
  const servicesById = useMemo(() => new Map(SEED_SERVICES.map((s) => [s.id, s])), []);

  const dayBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "confirmed" && ymdInMx(b.startsAt) === selectedDay)
        .sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    [bookings, selectedDay],
  );

  const nextUpcomingToken = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    const nowMs = Date.now();
    const upcoming = dayBookings.find((b) => new Date(b.startsAt).getTime() >= nowMs);
    return upcoming?.token ?? null;
  }, [dayBookings]);

  const selectedDate = useMemo(() => {
    const ymd = selectedDay;
    return new Date(`${ymd}T06:00:00.000Z`);
  }, [selectedDay]);

  const isToday = selectedDay === todayYmd;
  const subtitle = isToday
    ? formatDate(selectedDate)
    : `${formatDayName(selectedDate)} ${formatDayNumber(selectedDate)}`;

  return (
    <>
      <DoctorPageHeader
        title={isToday ? "Hoy" : formatDayName(selectedDate)}
        subtitle={subtitle}
      />

      <WeekStrip selectedDay={selectedDay} onSelect={setSelectedDay} bookings={bookings} />

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
          marginTop: "var(--space-4)",
        }}
      >
        {dayBookings.length === 0 ? (
          <EmptyDay message={isToday ? "Sin citas hoy." : "Sin citas este día."} />
        ) : (
          dayBookings.map((b) => {
            const service = servicesById.get(b.serviceId);
            if (!service) return null;
            return (
              <AppointmentRow
                key={b.token}
                booking={b}
                service={service}
                isNext={b.token === nextUpcomingToken}
              />
            );
          })
        )}
      </section>

      <div
        className="vera-pill-perch"
        style={{
          position: "sticky",
          bottom: 76,
          marginTop: "var(--space-8)",
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 5,
        }}
      >
        <span style={{ pointerEvents: "auto" }}>
          <NextSlotPill doctorId={SOFIA_ID} />
        </span>
        <style>{`
          @media (min-width: 768px) {
            .vera-pill-perch {
              position: static;
              justify-content: flex-start;
              margin-top: var(--space-12);
            }
          }
        `}</style>
      </div>
    </>
  );
}
