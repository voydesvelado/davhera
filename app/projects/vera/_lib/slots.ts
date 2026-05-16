import type {
  AvailabilityRule,
  BlockedPeriod,
  Booking,
  Doctor,
  Service,
  Slot,
} from "./types";

interface GenerateArgs {
  doctor: Doctor;
  service: Service;
  availability: AvailabilityRule[];
  bookings: Booking[];
  blockedPeriods: BlockedPeriod[];
  fromDate: Date;
  daysAhead: number;
  slotIncrementMin?: number;
}

const MX_TZ = "America/Mexico_City";

function startOfDayInMx(d: Date): Date {
  // Convert to a UTC date that represents 00:00 Mexico time on the same calendar
  // day as `d` interpreted in Mexico time.
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: MX_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return new Date(`${get("year")}-${get("month")}-${get("day")}T06:00:00.000Z`);
}

function weekdayInMx(d: Date): number {
  const dow = new Intl.DateTimeFormat("en-US", {
    timeZone: MX_TZ,
    weekday: "short",
  }).format(d);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(dow);
}

function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function generateAvailableSlots({
  doctor,
  service,
  availability,
  bookings,
  blockedPeriods,
  fromDate,
  daysAhead,
  slotIncrementMin = 15,
}: GenerateArgs): Slot[] {
  const slots: Slot[] = [];
  const doctorAvailability = availability.filter((r) => r.doctorId === doctor.id);
  const activeBookings = bookings.filter(
    (b) => b.doctorId === doctor.id && b.status === "confirmed",
  );
  const activeBlocks = blockedPeriods.filter((p) => p.doctorId === doctor.id);
  const durationMs = service.durationMin * 60 * 1000;
  const incrementMs = slotIncrementMin * 60 * 1000;
  const now = Date.now();

  const bookingRanges = activeBookings.map((b) => ({
    start: new Date(b.startsAt).getTime(),
    end: new Date(b.endsAt).getTime(),
  }));
  const blockRanges = activeBlocks.map((p) => ({
    start: new Date(p.startsAt).getTime(),
    end: new Date(p.endsAt).getTime(),
  }));

  const dayAnchor = startOfDayInMx(fromDate);

  for (let dayIdx = 0; dayIdx < daysAhead; dayIdx += 1) {
    const day = new Date(dayAnchor.getTime() + dayIdx * 86_400_000);
    const weekday = weekdayInMx(day);
    const todaysWindows = doctorAvailability.filter((r) => r.weekday === weekday);

    for (const window of todaysWindows) {
      const windowStart = day.getTime() + window.startMinute * 60_000;
      const windowEnd = day.getTime() + window.endMinute * 60_000;

      for (
        let candidateStart = windowStart;
        candidateStart + durationMs <= windowEnd;
        candidateStart += incrementMs
      ) {
        const candidateEnd = candidateStart + durationMs;
        if (candidateStart < now) continue;

        const conflictsBooking = bookingRanges.some((r) =>
          rangesOverlap(candidateStart, candidateEnd, r.start, r.end),
        );
        if (conflictsBooking) continue;

        const conflictsBlock = blockRanges.some((r) =>
          rangesOverlap(candidateStart, candidateEnd, r.start, r.end),
        );
        if (conflictsBlock) continue;

        slots.push({
          startsAt: new Date(candidateStart),
          endsAt: new Date(candidateEnd),
        });
      }
    }
  }

  return slots;
}

export function getNextAvailableSlot(args: GenerateArgs): Slot | null {
  const slots = generateAvailableSlots({ ...args, daysAhead: Math.min(args.daysAhead, 30) });
  return slots[0] ?? null;
}
