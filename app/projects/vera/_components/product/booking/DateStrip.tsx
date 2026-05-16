"use client";

import { useMemo } from "react";
import { ymdInMx, formatDayName, formatDayNumber, formatMonthShort } from "../../../_lib/date-format";

interface DateStripProps {
  /** ISO YYYY-MM-DD strings of selectable days. */
  enabledDays: Set<string>;
  /** Currently selected day (YYYY-MM-DD) or null. */
  selectedDay: string | null;
  onSelect: (day: string) => void;
  /** Number of days from today to render. */
  daysAhead?: number;
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

export function DateStrip({ enabledDays, selectedDay, onSelect, daysAhead = 30 }: DateStripProps) {
  const days = useMemo(() => {
    const today = todayInMx();
    const todayYmd = ymdInMx(today);
    return Array.from({ length: daysAhead }).map((_, i) => {
      const d = new Date(today.getTime() + i * 86_400_000);
      const ymd = ymdInMx(d);
      return {
        ymd,
        date: d,
        isToday: ymd === todayYmd,
        enabled: enabledDays.has(ymd),
      };
    });
  }, [enabledDays, daysAhead]);

  return (
    <div
      role="listbox"
      aria-label="Elige un día"
      className="vera-date-strip"
      style={{
        display: "flex",
        gap: "var(--space-2)",
        overflowX: "auto",
        paddingBottom: "var(--space-3)",
        marginLeft: "calc(var(--space-1) * -1)",
        marginRight: "calc(var(--space-1) * -1)",
        scrollSnapType: "x mandatory",
      }}
    >
      {days.map((d) => {
        const selected = selectedDay === d.ymd;
        const interactive = d.enabled;
        return (
          <button
            key={d.ymd}
            type="button"
            role="option"
            aria-selected={selected}
            disabled={!interactive}
            onClick={() => interactive && onSelect(d.ymd)}
            style={{
              flexShrink: 0,
              scrollSnapAlign: "start",
              minWidth: 60,
              padding: "var(--space-2) var(--space-3)",
              background: selected ? "var(--accent-pale)" : "transparent",
              color: !interactive
                ? "var(--ink-faint)"
                : selected
                  ? "var(--accent)"
                  : "var(--ink)",
              border: "1px solid",
              borderColor: selected ? "var(--accent)" : "var(--rule)",
              borderRadius: "var(--radius-md)",
              cursor: interactive ? "pointer" : "not-allowed",
              opacity: interactive ? 1 : 0.4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              transition:
                "background var(--dur-quick) var(--ease-snap), border-color var(--dur-quick) var(--ease-snap), color var(--dur-quick) var(--ease-snap)",
              fontFamily: "var(--font-geist), system-ui, sans-serif",
            }}
          >
            <span
              style={{
                fontSize: "var(--text-2xs)",
                fontWeight: 500,
                letterSpacing: "var(--tracking-wide)",
                textTransform: "uppercase",
                color: !interactive
                  ? "var(--ink-faint)"
                  : selected
                    ? "var(--accent)"
                    : "var(--muted)",
              }}
            >
              {formatDayName(d.date).slice(0, 3)}
            </span>
            <span
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: 600,
                fontFeatureSettings: '"tnum" 1',
                lineHeight: 1,
                marginTop: 2,
                borderBottom: d.isToday && !selected ? "2px solid var(--accent)" : "none",
                paddingBottom: d.isToday && !selected ? 1 : 3,
              }}
            >
              {formatDayNumber(d.date)}
            </span>
            <span
              style={{
                fontSize: "var(--text-2xs)",
                color: !interactive ? "var(--ink-faint)" : "var(--muted)",
                textTransform: "lowercase",
              }}
            >
              {formatMonthShort(d.date).replace(/\.$/, "")}
            </span>
          </button>
        );
      })}
    </div>
  );
}
