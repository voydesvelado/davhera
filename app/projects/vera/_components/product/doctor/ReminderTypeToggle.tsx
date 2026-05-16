"use client";

import { SegmentedControl } from "../../ui/SegmentedControl";

export type ReminderType = "T-24h" | "T-2h";

interface ReminderTypeToggleProps {
  value: ReminderType;
  onChange: (v: ReminderType) => void;
}

const CAPTIONS: Record<ReminderType, string> = {
  "T-24h": "Recordatorio universal, 24 horas antes de la cita.",
  "T-2h": "Recordatorio opcional, 2 horas antes. Útil para categorías con alto índice de no-show.",
};

export function ReminderTypeToggle({ value, onChange }: ReminderTypeToggleProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <SegmentedControl<ReminderType>
        ariaLabel="Tipo de recordatorio"
        segments={[
          { value: "T-24h", label: "T-24h" },
          { value: "T-2h", label: "T-2h" },
        ]}
        value={value}
        onChange={onChange}
      />
      <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--muted)" }}>
        {CAPTIONS[value]}
      </p>
    </div>
  );
}
