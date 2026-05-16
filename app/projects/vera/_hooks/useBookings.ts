"use client";

import { useMemo } from "react";
import { getSeedBookings } from "../_lib/seed";
import type { Booking, DoctorId } from "../_lib/types";
import { useVisitorData } from "./useVisitorData";

/**
 * Combined seed + visitor bookings, optionally filtered by doctor, sorted
 * chronologically by `startsAt`.
 *
 * SSR returns seed-only because visitor data lives in localStorage. After
 * hydration, the full set is returned and re-renders are wired through
 * useVisitorData's external store subscription.
 */
export function useBookings(doctorId?: DoctorId): Booking[] {
  const visitor = useVisitorData();

  return useMemo(() => {
    const seed = getSeedBookings();
    const merged = [...seed, ...visitor.bookings];
    const filtered = doctorId ? merged.filter((b) => b.doctorId === doctorId) : merged;
    return filtered.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }, [visitor, doctorId]);
}
