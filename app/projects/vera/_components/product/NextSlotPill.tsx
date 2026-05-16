"use client";

import { useNextSlot } from "../../_hooks/useNextSlot";
import { useHasMounted } from "../../_hooks/useHasMounted";
import { formatRelative } from "../../_lib/date-format";
import type { DoctorId } from "../../_lib/types";

interface NextSlotPillProps {
  doctorId: DoctorId;
}

export function NextSlotPill({ doctorId }: NextSlotPillProps) {
  const slot = useNextSlot(doctorId);
  const mounted = useHasMounted();

  // Avoid hydration mismatch — formatRelative depends on a "now" that differs
  // very slightly between server and client. Render a placeholder until mount.
  if (!mounted) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-2)",
          padding: "6px 12px",
          background: "var(--bg-sunken)",
          color: "var(--ink-soft)",
          borderRadius: "var(--radius-pill)",
          fontSize: "var(--text-sm)",
          minHeight: 28,
          minWidth: 200,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--rule-strong)",
          }}
        />
        Cargando próxima disponibilidad…
      </span>
    );
  }

  if (!slot) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-2)",
          padding: "6px 12px",
          background: "var(--bg-sunken)",
          color: "var(--muted)",
          borderRadius: "var(--radius-pill)",
          fontSize: "var(--text-sm)",
        }}
      >
        Sin disponibilidad próxima
      </span>
    );
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        padding: "6px 12px",
        background: "var(--bg-sunken)",
        color: "var(--ink-soft)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-pill)",
        fontSize: "var(--text-sm)",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "var(--success)",
        }}
      />
      Próxima disponibilidad{" "}
      <span style={{ color: "var(--accent)", fontWeight: 500 }}>{formatRelative(slot.startsAt)}</span>
    </span>
  );
}
