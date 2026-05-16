"use client";

import { useMemo, useState } from "react";
import { Sheet } from "../../ui/Sheet";
import { AppointmentRow } from "./AppointmentRow";
import { ymdInMx, formatDayName, formatDayNumber, formatTime } from "../../../_lib/date-format";
import type { AvailabilityRule, BlockedPeriod, Booking, Service } from "../../../_lib/types";

interface WeekCalendarProps {
  weekStart: Date;
  bookings: Booking[];
  blockedPeriods: BlockedPeriod[];
  availability: AvailabilityRule[];
  services: Service[];
  doctorId: string;
}

const MX_TZ = "America/Mexico_City";
const HOUR_START = 8;
const HOUR_END = 21;

function weekdayInMx(d: Date): number {
  const dow = new Intl.DateTimeFormat("en-US", { timeZone: MX_TZ, weekday: "short" }).format(d);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(dow);
}

function dayStartUtc(weekStart: Date, dayOffset: number): number {
  return weekStart.getTime() + dayOffset * 86_400_000;
}

function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function WeekCalendar({
  weekStart,
  bookings,
  blockedPeriods,
  availability,
  services,
  doctorId,
}: WeekCalendarProps) {
  const [openBookingToken, setOpenBookingToken] = useState<string | null>(null);

  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(dayStartUtc(weekStart, i));
      return { date, ymd: ymdInMx(date) };
    });
  }, [weekStart]);

  const todayYmd = useMemo(() => {
    const now = new Date();
    return ymdInMx(now);
  }, []);

  const halfHours = useMemo(() => {
    const slots: { hour: number; minute: number; label: string }[] = [];
    for (let h = HOUR_START; h < HOUR_END; h += 1) {
      slots.push({ hour: h, minute: 0, label: `${String(h).padStart(2, "0")}:00` });
      slots.push({ hour: h, minute: 30, label: "" });
    }
    return slots;
  }, []);

  const doctorBookings = useMemo(
    () => bookings.filter((b) => b.doctorId === doctorId && b.status === "confirmed"),
    [bookings, doctorId],
  );

  const doctorAvailability = useMemo(
    () => availability.filter((a) => a.doctorId === doctorId),
    [availability, doctorId],
  );

  const openBooking = openBookingToken
    ? doctorBookings.find((b) => b.token === openBookingToken) ?? null
    : null;
  const openService = openBooking ? services.find((s) => s.id === openBooking.serviceId) ?? null : null;

  return (
    <>
      <div
        role="grid"
        aria-label="Calendario semanal"
        style={{
          display: "grid",
          gridTemplateColumns: "44px repeat(7, 1fr)",
          background: "var(--bg-raised)",
          border: "1px solid var(--rule)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          fontFamily: "var(--font-geist), system-ui, sans-serif",
        }}
      >
        {/* Header row */}
        <div style={{ background: "var(--bg-sunken)" }} aria-hidden />
        {days.map((d) => {
          const isToday = d.ymd === todayYmd;
          return (
            <div
              key={d.ymd}
              style={{
                background: "var(--bg-sunken)",
                padding: "var(--space-2) var(--space-1)",
                borderLeft: "1px solid var(--rule-faint)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "var(--text-2xs)",
                  fontWeight: 500,
                  letterSpacing: "var(--tracking-wider)",
                  textTransform: "uppercase",
                  color: isToday ? "var(--accent)" : "var(--muted)",
                }}
              >
                {formatDayName(d.date).slice(0, 3)}
              </div>
              <div
                style={{
                  fontSize: "var(--text-md)",
                  fontWeight: 600,
                  color: isToday ? "var(--accent)" : "var(--ink)",
                  fontFeatureSettings: '"tnum" 1',
                  borderBottom: isToday ? "2px solid var(--accent)" : "none",
                  paddingBottom: isToday ? 0 : 2,
                  display: "inline-block",
                }}
              >
                {formatDayNumber(d.date)}
              </div>
            </div>
          );
        })}

        {/* Body rows */}
        {halfHours.map((slot, slotIdx) => {
          const isFullHour = slot.minute === 0;
          return (
            <RowSlots
              key={slotIdx}
              hour={slot.hour}
              minute={slot.minute}
              label={slot.label}
              days={days}
              doctorBookings={doctorBookings}
              doctorAvailability={doctorAvailability}
              blockedPeriods={blockedPeriods}
              services={services}
              isFullHour={isFullHour}
              onOpenBooking={(token) => setOpenBookingToken(token)}
            />
          );
        })}
      </div>

      <Sheet
        open={openBookingToken !== null}
        onOpenChange={(o) => !o && setOpenBookingToken(null)}
        size="sm"
        title="Detalle de la cita"
      >
        {openBooking && openService ? (
          <AppointmentRow booking={openBooking} service={openService} />
        ) : null}
      </Sheet>
    </>
  );
}

function RowSlots({
  hour,
  minute,
  label,
  days,
  doctorBookings,
  doctorAvailability,
  blockedPeriods,
  services,
  isFullHour,
  onOpenBooking,
}: {
  hour: number;
  minute: number;
  label: string;
  days: { date: Date; ymd: string }[];
  doctorBookings: Booking[];
  doctorAvailability: AvailabilityRule[];
  blockedPeriods: BlockedPeriod[];
  services: Service[];
  isFullHour: boolean;
  onOpenBooking: (token: string) => void;
}) {
  return (
    <>
      <div
        style={{
          padding: "var(--space-1) var(--space-1)",
          textAlign: "right",
          color: "var(--muted)",
          fontSize: "var(--text-2xs)",
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          fontFeatureSettings: '"tnum" 1',
          borderTop: isFullHour ? "1px solid var(--rule-faint)" : "1px dotted var(--rule-faint)",
          minHeight: 24,
        }}
      >
        {label}
      </div>
      {days.map((d) => {
        const cellStartMinutes = hour * 60 + minute;
        const cellEndMinutes = cellStartMinutes + 30;
        const dayWeekday = weekdayInMx(d.date);
        const inAvailability = doctorAvailability.some(
          (a) =>
            a.weekday === dayWeekday &&
            a.startMinute < cellEndMinutes &&
            a.endMinute > cellStartMinutes,
        );

        const cellStartUtc = d.date.getTime() + cellStartMinutes * 60_000;
        const cellEndUtc = d.date.getTime() + cellEndMinutes * 60_000;

        const blockedHere = blockedPeriods.some((p) => {
          if (p.doctorId !== doctorBookings[0]?.doctorId && doctorBookings.length === 0) {
            // fall through; we don't have a doctor reference here so just check overlap
          }
          return rangesOverlap(
            cellStartUtc,
            cellEndUtc,
            new Date(p.startsAt).getTime(),
            new Date(p.endsAt).getTime(),
          );
        });

        const bookingHere = doctorBookings.find((b) =>
          rangesOverlap(
            cellStartUtc,
            cellEndUtc,
            new Date(b.startsAt).getTime(),
            new Date(b.endsAt).getTime(),
          ),
        );
        const isBookingStart =
          bookingHere && new Date(bookingHere.startsAt).getTime() === cellStartUtc;

        let bg = "var(--bg-sunken)";
        if (inAvailability && !blockedHere) bg = "var(--bg-raised)";

        return (
          <div
            key={d.ymd + label}
            style={{
              borderLeft: "1px solid var(--rule-faint)",
              borderTop: isFullHour ? "1px solid var(--rule-faint)" : "1px dotted var(--rule-faint)",
              background: bg,
              backgroundImage: blockedHere
                ? "repeating-linear-gradient(45deg, transparent 0 4px, color-mix(in oklch, var(--muted) 30%, transparent) 4px 5px)"
                : undefined,
              minHeight: 24,
              position: "relative",
            }}
          >
            {bookingHere && isBookingStart ? (
              <BookingBlock
                booking={bookingHere}
                service={services.find((s) => s.id === bookingHere.serviceId)}
                onClick={() => onOpenBooking(bookingHere.token)}
              />
            ) : null}
            {blockedHere && isFullHour && minute === 0 ? (
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "var(--text-2xs)",
                  color: "var(--muted)",
                  letterSpacing: "var(--tracking-wider)",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  pointerEvents: "none",
                }}
              >
                Bloq.
              </span>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

function BookingBlock({
  booking,
  service,
  onClick,
}: {
  booking: Booking;
  service: Service | undefined;
  onClick: () => void;
}) {
  const startsAt = new Date(booking.startsAt);
  const endsAt = new Date(booking.endsAt);
  const durationMin = Math.round((endsAt.getTime() - startsAt.getTime()) / 60_000);
  // Each grid row is 24px tall (the half-hour cell). Compute span in 30-min units.
  const halfHoursSpanned = Math.max(1, Math.ceil(durationMin / 30));
  const heightPx = halfHoursSpanned * 24 - 2;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "absolute",
        top: 1,
        left: 1,
        right: 1,
        height: heightPx,
        background: "var(--accent-pale)",
        borderLeft: "2px solid var(--accent)",
        borderRadius: "var(--radius-sm)",
        padding: "2px 4px",
        textAlign: "left",
        cursor: "pointer",
        overflow: "hidden",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        fontFamily: "var(--font-geist), system-ui, sans-serif",
      }}
      className="vera-booking-block"
      title={`${booking.patientName} · ${service?.name ?? ""} · ${formatTime(startsAt)}`}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "var(--accent)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {booking.patientName}
      </span>
      {heightPx >= 36 ? (
        <span
          style={{
            fontSize: 9,
            color: "var(--ink-soft)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {service?.name}
        </span>
      ) : null}
      <style>{`.vera-booking-block:hover { background: color-mix(in oklch, var(--accent-pale) 80%, var(--accent)); }`}</style>
    </button>
  );
}
