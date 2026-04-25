"use client";

import { useEffect, useState } from "react";

export interface Countdown {
  remainingMs: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

export function useCountdown(endsAt: number | null, onExpired?: () => void): Countdown {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (endsAt == null) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  const remainingMs = endsAt == null ? 0 : Math.max(0, endsAt - now);
  const expired = endsAt != null && remainingMs === 0;

  useEffect(() => {
    if (expired) onExpired?.();
  }, [expired, onExpired]);

  const totalSeconds = Math.floor(remainingMs / 1000);
  return {
    remainingMs,
    minutes: Math.floor(totalSeconds / 60),
    seconds: totalSeconds % 60,
    expired,
  };
}

export function formatCountdown(c: Countdown): string {
  const m = String(c.minutes).padStart(2, "0");
  const s = String(c.seconds).padStart(2, "0");
  return `${m}:${s}`;
}
