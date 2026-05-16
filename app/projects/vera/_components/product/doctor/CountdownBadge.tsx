"use client";

import { useEffect, useState } from "react";
import { formatCountdown } from "../../../_lib/date-format";

interface CountdownBadgeProps {
  fireAt: Date;
  /** Shared "now" reference, refreshed by the parent every minute. */
  referenceTime: Date;
}

export function CountdownBadge({ fireAt, referenceTime }: CountdownBadgeProps) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 200);
    return () => clearTimeout(t);
  }, [referenceTime]);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        background: "var(--bg-sunken)",
        color: "var(--ink-soft)",
        border: "1px solid var(--rule-faint)",
        borderRadius: "var(--radius-pill)",
        fontSize: "var(--text-xs)",
        fontFeatureSettings: '"tnum" 1',
        transform: pulse ? "scale(1.04)" : "scale(1)",
        transition: "transform var(--dur-base) var(--ease-snap)",
      }}
    >
      {formatCountdown(fireAt, referenceTime)}
    </span>
  );
}
