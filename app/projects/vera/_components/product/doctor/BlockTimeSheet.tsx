"use client";

import { useMemo, useState } from "react";
import { Sheet } from "../../ui/Sheet";
import { Button } from "../../ui/Button";
import { Switch } from "../../ui/Switch";
import { Input } from "../../ui/Input";
import { Textarea } from "../../ui/Textarea";
import { Label } from "../../ui/Label";
import { useToast } from "../../ui/Toast";
import { AffectedBookingsWarning } from "./AffectedBookingsWarning";
import { useBookings } from "../../../_hooks/useBookings";
import { SEED_SERVICES, SOFIA_ID } from "../../../_lib/seed";
import type { BlockedPeriod } from "../../../_lib/types";

interface BlockTimeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (period: BlockedPeriod) => void;
}

const MX_TZ = "America/Mexico_City";

function todayYmdInMx(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: MX_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function ymdToUtc(ymd: string, hour: number, minute: number): string {
  // Treat hour:minute as Mexico City local time (UTC-6, no DST since 2022)
  // and convert to UTC by adding 6 hours via real Date math (handles overflow).
  const base = new Date(`${ymd}T00:00:00.000Z`);
  base.setUTCHours(hour + 6, minute, 0, 0);
  return base.toISOString();
}

function tomorrowYmd(ymd: string): string {
  const d = new Date(`${ymd}T06:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function BlockTimeSheet({ open, onOpenChange, onCreate }: BlockTimeSheetProps) {
  const toast = useToast();
  const today = todayYmdInMx();
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(tomorrowYmd(today));
  const [allDay, setAllDay] = useState(true);
  const [fromTime, setFromTime] = useState("09:00");
  const [toTime, setToTime] = useState("18:00");
  const [reason, setReason] = useState("");

  const startIso = useMemo(() => {
    if (allDay) return ymdToUtc(fromDate, 0, 0);
    const [h, m] = fromTime.split(":").map(Number);
    return ymdToUtc(fromDate, h, m);
  }, [fromDate, fromTime, allDay]);

  const endIso = useMemo(() => {
    if (allDay) {
      // End of `toDate` at 23:59
      return ymdToUtc(toDate, 23, 59);
    }
    const [h, m] = toTime.split(":").map(Number);
    return ymdToUtc(toDate, h, m);
  }, [toDate, toTime, allDay]);

  const allBookings = useBookings(SOFIA_ID);
  const affectedBookings = useMemo(() => {
    const startMs = new Date(startIso).getTime();
    const endMs = new Date(endIso).getTime();
    return allBookings.filter((b) => {
      if (b.status !== "confirmed") return false;
      const bStart = new Date(b.startsAt).getTime();
      const bEnd = new Date(b.endsAt).getTime();
      return bStart < endMs && bEnd > startMs;
    });
  }, [allBookings, startIso, endIso]);

  const sameDay = fromDate === toDate;
  const submitLabel = useMemo(() => {
    if (sameDay && !allDay) return "Bloquear este horario";
    if (sameDay) return "Bloquear este día";
    return "Bloquear estos días";
  }, [sameDay, allDay]);

  function handleSubmit() {
    onCreate({
      doctorId: SOFIA_ID,
      startsAt: startIso,
      endsAt: endIso,
      reason: reason.trim() || undefined,
    });
    toast.show({
      tone: "success",
      message: "Tiempo bloqueado (no se guarda en el demo)",
    });
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange} size="md" title="Bloquear tiempo">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div
          className="vera-block-dates"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-3)",
          }}
        >
          <DateField label="Desde" value={fromDate} onChange={setFromDate} />
          <DateField label="Hasta" value={toDate} onChange={setToDate} min={fromDate} />
        </div>

        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-3)",
            fontSize: "var(--text-sm)",
            color: "var(--ink)",
          }}
        >
          <Switch checked={allDay} onCheckedChange={setAllDay} label="Todo el día" />
          ¿Todo el día?
        </label>

        {!allDay ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <TimeField label="Desde hora" value={fromTime} onChange={setFromTime} />
            <TimeField label="Hasta hora" value={toTime} onChange={setToTime} />
          </div>
        ) : null}

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1_5)" }}>
          <Label>Motivo (opcional)</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, 60))}
            placeholder="Ej. vacaciones, congreso, día personal"
            rows={2}
            style={{ minHeight: 60 }}
          />
        </div>

        <AffectedBookingsWarning
          bookings={affectedBookings}
          services={SEED_SERVICES}
          rangeFrom={new Date(startIso)}
          rangeTo={new Date(endIso)}
        />

        <Button size="md" onClick={handleSubmit} style={{ width: "100%" }}>
          {submitLabel}
        </Button>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .vera-block-dates { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Sheet>
  );
}

function DateField({
  label,
  value,
  onChange,
  min,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1_5)" }}>
      <Label>{label}</Label>
      <Input type="date" value={value} min={min} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function TimeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1_5)" }}>
      <Label>{label}</Label>
      <Input type="time" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
