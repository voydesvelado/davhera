"use client";

import { useMemo } from "react";
import { ymdInMx, formatDayName, formatDayNumber } from "../../../_lib/date-format";
import type { Booking } from "../../../_lib/types";

interface WeekStripProps {
  selectedDay: string;
  onSelect: (day: string) => void;
  bookings: Booking[];
}

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

function startOfWeek(d: Date): Date {
  // ISO week: Monday-start
  const dow = new Intl.DateTimeFormat("en-US", { timeZone: MX_TZ, weekday: "short" }).format(d);
  const idx = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(dow);
  const out = new Date(d.getTime() - idx * 86_400_000);
  return out;
}

export function WeekStrip({ selectedDay, onSelect, bookings }: WeekStripProps) {
  const days = useMemo(() => {
    const monday = startOfWeek(todayInMx());
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday.getTime() + i * 86_400_000);
      return { ymd: ymdInMx(d), date: d };
    });
  }, []);

  const todayYmd = ymdInMx(todayInMx());

  const countsByDay = useMemo(() => {
    const m = new Map<string, number>();
    for (const b of bookings) {
      if (b.status !== "confirmed") continue;
      const day = ymdInMx(b.startsAt);
      m.set(day, (m.get(day) ?? 0) + 1);
    }
    return m;
  }, [bookings]);

  return (
    <div
      role="group"
      aria-label="Semana"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "var(--space-1)",
        padding: "var(--space-2) 0",
      }}
    >
      {days.map((d) => {
        const isSelected = d.ymd === selectedDay;
        const isToday = d.ymd === todayYmd;
        const count = countsByDay.get(d.ymd) ?? 0;
        return (
          <button
            key={d.ymd}
            type="button"
            onClick={() => onSelect(d.ymd)}
            aria-pressed={isSelected}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "var(--space-2) 0 var(--space-1)",
              background: isSelected ? "var(--bg-sunken)" : "transparent",
              border: "1px solid",
              borderColor: isSelected ? "var(--rule)" : "transparent",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              fontFamily: "var(--font-geist), system-ui, sans-serif",
              transition: "background var(--dur-quick) var(--ease-snap)",
            }}
            className="vera-week-day"
          >
            <span
              style={{
                fontSize: "var(--text-2xs)",
                fontWeight: 500,
                letterSpacing: "var(--tracking-wide)",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              {formatDayName(d.date).slice(0, 3)}
            </span>
            <span
              style={{
                fontSize: "var(--text-md)",
                fontFeatureSettings: '"tnum" 1',
                color: isToday ? "var(--accent)" : "var(--ink)",
                fontWeight: isToday ? 600 : 500,
                borderBottom: isToday ? "2px solid var(--accent)" : "none",
                paddingBottom: isToday ? 1 : 3,
              }}
            >
              {formatDayNumber(d.date)}
            </span>
            <DotDensity count={count} />
            <style>{`.vera-week-day:hover { background: var(--bg-sunken); }`}</style>
          </button>
        );
      })}
    </div>
  );
}

function DotDensity({ count }: { count: number }) {
  if (count === 0) {
    return <span style={{ display: "inline-block", height: 6 }} aria-hidden />;
  }
  if (count >= 4) {
    return (
      <span aria-label={`${count} citas`} style={{ display: "inline-flex", gap: 2 }}>
        <Dot />
        <Dot />
      </span>
    );
  }
  return (
    <span aria-label={`${count} citas`}>
      <Dot />
    </span>
  );
}

function Dot() {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: "var(--accent)",
      }}
    />
  );
}
