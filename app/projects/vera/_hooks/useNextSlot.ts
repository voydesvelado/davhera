"use client";

import { useMemo } from "react";
import { SEED_AVAILABILITY, SEED_SERVICES, getSeedBlockedPeriods } from "../_lib/seed";
import { getNextAvailableSlot } from "../_lib/slots";
import type { DoctorId, Slot } from "../_lib/types";
import { useBookings } from "./useBookings";
import { useDoctorById } from "./useDoctor";

/**
 * Returns the next available slot for the given doctor's first service.
 * Memoized over bookings; "now" is rounded to the minute upstream so this
 * doesn't recompute on every tick.
 */
export function useNextSlot(doctorId: DoctorId): Slot | null {
  const doctor = useDoctorById(doctorId);
  const bookings = useBookings(doctorId);

  return useMemo(() => {
    if (!doctor) return null;
    const service = SEED_SERVICES.find((s) => s.doctorId === doctorId);
    if (!service) return null;
    return getNextAvailableSlot({
      doctor,
      service,
      availability: SEED_AVAILABILITY,
      bookings,
      blockedPeriods: getSeedBlockedPeriods(),
      fromDate: new Date(),
      daysAhead: 30,
    });
  }, [doctor, doctorId, bookings]);
}
