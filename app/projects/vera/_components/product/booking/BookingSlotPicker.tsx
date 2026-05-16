"use client";

import { useMemo, useState } from "react";
import { SEED_AVAILABILITY, getSeedBlockedPeriods } from "../../../_lib/seed";
import { generateAvailableSlots } from "../../../_lib/slots";
import { ymdInMx } from "../../../_lib/date-format";
import type { Doctor, Service, Slot } from "../../../_lib/types";
import { useBookings } from "../../../_hooks/useBookings";
import { DateStrip } from "./DateStrip";
import { SlotList } from "./SlotList";

interface BookingSlotPickerProps {
  doctor: Doctor;
  service: Service;
  selectedIso: string | null;
  onSelectSlot: (slot: Slot) => void;
  /** ISO of the visitor's existing slot (rendered as "tu horario actual"). */
  currentIso?: string | null;
  /** Initial day to focus the strip on (YYYY-MM-DD in MX). */
  initialDay?: string | null;
}

export function BookingSlotPicker({
  doctor,
  service,
  selectedIso,
  onSelectSlot,
  currentIso,
  initialDay,
}: BookingSlotPickerProps) {
  const bookings = useBookings(doctor.id);

  const slots = useMemo(
    () =>
      generateAvailableSlots({
        doctor,
        service,
        availability: SEED_AVAILABILITY,
        bookings,
        blockedPeriods: getSeedBlockedPeriods(),
        fromDate: new Date(),
        daysAhead: 30,
      }),
    [doctor, service, bookings],
  );

  const slotsByDay = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of slots) {
      const day = ymdInMx(s.startsAt);
      const arr = map.get(day) ?? [];
      arr.push(s);
      map.set(day, arr);
    }
    return map;
  }, [slots]);

  const enabledDays = useMemo(() => new Set(slotsByDay.keys()), [slotsByDay]);

  const [chosenDay, setChosenDay] = useState<string | null>(initialDay ?? null);

  // Resolve which day is actually shown: the explicitly chosen one if still
  // valid, otherwise the first enabled day. Computed in render — no effect.
  const selectedDay =
    chosenDay && enabledDays.has(chosenDay)
      ? chosenDay
      : (enabledDays.values().next().value as string | undefined) ?? null;

  const visibleSlots = (selectedDay && slotsByDay.get(selectedDay)) || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <div>
        <DateStrip
          enabledDays={enabledDays}
          selectedDay={selectedDay}
          onSelect={setChosenDay}
        />
        <p
          style={{
            margin: "var(--space-2) 0 0",
            fontSize: "var(--text-sm)",
            color: "var(--muted)",
          }}
        >
          Horarios en Ciudad de México (GMT-6)
        </p>
      </div>
      <SlotList
        slots={visibleSlots}
        selectedIso={selectedIso}
        onSelect={onSelectSlot}
        currentIso={currentIso ?? null}
      />
    </div>
  );
}
