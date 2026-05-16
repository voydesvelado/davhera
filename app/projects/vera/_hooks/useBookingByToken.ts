"use client";

import { useMemo } from "react";
import type { Booking } from "../_lib/types";
import { useBookings } from "./useBookings";
import { useHasMounted } from "./useHasMounted";

interface UseBookingResult {
  booking: Booking | null;
  /** True once client hydration has completed. Use to distinguish "still
   *  hydrating" from "definitely not found" when rendering. */
  ready: boolean;
}

export function useBookingByToken(token: string): UseBookingResult {
  const bookings = useBookings();
  const mounted = useHasMounted();

  const booking = useMemo(() => bookings.find((b) => b.token === token) ?? null, [bookings, token]);

  return { booking, ready: mounted };
}
