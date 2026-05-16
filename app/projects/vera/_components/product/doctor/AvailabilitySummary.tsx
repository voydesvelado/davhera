import type { AvailabilityRule } from "../../../_lib/types";

interface AvailabilitySummaryProps {
  rules: AvailabilityRule[];
}

export function AvailabilitySummary({ rules }: AvailabilitySummaryProps) {
  const totalMinutes = rules.reduce((sum, r) => sum + (r.endMinute - r.startMinute), 0);
  const totalHours = Math.round(totalMinutes / 60);
  const slots = rules.length;
  return (
    <p
      style={{
        margin: 0,
        fontSize: "var(--text-sm)",
        color: "var(--ink-soft)",
        fontFeatureSettings: '"tnum" 1',
      }}
    >
      Total: <strong style={{ color: "var(--ink)", fontWeight: 600 }}>{totalHours} horas</strong> a la
      semana, en {slots} {slots === 1 ? "hueco" : "huecos"} de tiempo.
    </p>
  );
}
