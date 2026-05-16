import type { Service } from "../../../_lib/types";
import { formatDate, formatTime, formatDuration, formatPrice } from "../../../_lib/date-format";

interface BookingSummaryRowProps {
  service: Service;
  startsAt: Date;
  suffix?: string;
}

export function BookingSummaryRow({ service, startsAt, suffix }: BookingSummaryRowProps) {
  return (
    <div
      style={{
        padding: "var(--space-3) var(--space-4)",
        background: "var(--bg-sunken)",
        border: "1px solid var(--rule-faint)",
        borderRadius: "var(--radius-md)",
        fontSize: "var(--text-sm)",
        color: "var(--ink-soft)",
        lineHeight: "var(--leading-snug)",
      }}
    >
      <span style={{ color: "var(--ink)", fontWeight: 500 }}>{service.name}</span>
      {" · "}
      {formatDate(startsAt)}, {formatTime(startsAt)} · {formatDuration(service.durationMin)} ·{" "}
      <span
        style={{
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          fontFeatureSettings: '"tnum" 1',
        }}
      >
        {formatPrice(service.priceMxn)}
      </span>
      {suffix ? <span style={{ color: "var(--muted)" }}> {suffix}</span> : null}
    </div>
  );
}
