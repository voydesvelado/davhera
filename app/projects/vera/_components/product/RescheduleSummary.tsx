import { ArrowRight } from "lucide-react";
import { formatDate, formatTime } from "../../_lib/date-format";

interface RescheduleSummaryProps {
  fromStartsAt: Date;
  toStartsAt: Date | null;
}

export function RescheduleSummary({ fromStartsAt, toStartsAt }: RescheduleSummaryProps) {
  return (
    <div
      style={{
        background: "var(--bg-sunken)",
        border: "1px solid var(--rule-faint)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-4)",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto 1fr",
        alignItems: "center",
        gap: "var(--space-3)",
        fontSize: "var(--text-sm)",
      }}
    >
      <span
        style={{
          fontSize: "var(--text-2xs)",
          fontWeight: 500,
          letterSpacing: "var(--tracking-wider)",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        De
      </span>
      <span style={{ color: "var(--ink-soft)" }}>
        {formatDate(fromStartsAt)}, {formatTime(fromStartsAt)}
      </span>
      <ArrowRight size={16} strokeWidth={1.75} color="var(--muted)" />
      {toStartsAt ? (
        <span style={{ color: "var(--accent)", fontWeight: 500 }}>
          {formatDate(toStartsAt)}, {formatTime(toStartsAt)}
        </span>
      ) : (
        <span style={{ color: "var(--muted)" }}>Elige un nuevo horario abajo</span>
      )}
    </div>
  );
}
