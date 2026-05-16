"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DoctorPageHeader } from "../../_components/product/doctor/DoctorPageHeader";
import { WeekCalendar } from "../../_components/product/doctor/WeekCalendar";
import { DensityLegend } from "../../_components/product/doctor/DensityLegend";
import { IconButton } from "../../_components/ui/IconButton";
import { Button } from "../../_components/ui/Button";
import { useBookings } from "../../_hooks/useBookings";
import {
  SEED_AVAILABILITY,
  SEED_SERVICES,
  SOFIA_ID,
  getSeedBlockedPeriods,
} from "../../_lib/seed";
import { formatDateNoYearShort } from "../../_lib/date-format";

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
  const dow = new Intl.DateTimeFormat("en-US", { timeZone: MX_TZ, weekday: "short" }).format(d);
  const idx = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(dow);
  return new Date(d.getTime() - idx * 86_400_000);
}

export default function PanelSemanaPage() {
  const todayWeekStart = useMemo(() => startOfWeek(todayInMx()), []);
  const [weekStart, setWeekStart] = useState<Date>(todayWeekStart);
  const bookings = useBookings(SOFIA_ID);
  const blockedPeriods = useMemo(() => getSeedBlockedPeriods(), []);

  const sunday = new Date(weekStart.getTime() + 6 * 86_400_000);
  const subtitle = `del ${formatDateNoYearShort(weekStart)} al ${formatDateNoYearShort(sunday)}`;

  return (
    <>
      <DoctorPageHeader title="Semana" subtitle={subtitle} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          paddingBottom: "var(--space-3)",
        }}
      >
        <IconButton
          aria-label="Semana anterior"
          onClick={() => setWeekStart((w) => new Date(w.getTime() - 7 * 86_400_000))}
        >
          <ChevronLeft size={16} strokeWidth={1.75} />
        </IconButton>
        <IconButton
          aria-label="Semana siguiente"
          onClick={() => setWeekStart((w) => new Date(w.getTime() + 7 * 86_400_000))}
        >
          <ChevronRight size={16} strokeWidth={1.75} />
        </IconButton>
        {weekStart.getTime() !== todayWeekStart.getTime() ? (
          <Button size="xs" variant="ghost" onClick={() => setWeekStart(todayWeekStart)}>
            Hoy
          </Button>
        ) : null}
      </div>

      <div style={{ overflowX: "auto", paddingBottom: "var(--space-2)" }}>
        <div style={{ minWidth: 720 }}>
          <WeekCalendar
            weekStart={weekStart}
            bookings={bookings}
            blockedPeriods={blockedPeriods}
            availability={SEED_AVAILABILITY}
            services={SEED_SERVICES}
            doctorId={SOFIA_ID}
          />
        </div>
      </div>

      <DensityLegend />
    </>
  );
}
