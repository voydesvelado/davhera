"use client";

import { Button } from "../../ui/Button";
import { useToast } from "../../ui/Toast";
import { formatDateNoYearShort } from "../../../_lib/date-format";
import type { BlockedPeriod } from "../../../_lib/types";

interface BlockedPeriodCardProps {
  period: BlockedPeriod;
  onDelete: () => void;
}

export function BlockedPeriodCard({ period, onDelete }: BlockedPeriodCardProps) {
  const toast = useToast();
  const startsAt = new Date(period.startsAt);
  const endsAt = new Date(period.endsAt);
  const sameDay = startsAt.toDateString() === endsAt.toDateString();
  const range = sameDay
    ? formatDateNoYearShort(startsAt)
    : `${formatDateNoYearShort(startsAt)} — ${formatDateNoYearShort(endsAt)}`;

  return (
    <article
      style={{
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--space-3)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: "var(--text-md)", fontWeight: 600, color: "var(--ink)" }}>
          {range}
        </p>
        {period.reason ? (
          <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--muted)" }}>
            {period.reason}
          </p>
        ) : null}
      </div>
      <div style={{ display: "flex", gap: "var(--space-2)", flexShrink: 0 }}>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => toast.show({ tone: "default", message: "Edición no guardada (demo)" })}
        >
          Editar
        </Button>
        <Button size="xs" variant="ghost" onClick={onDelete} style={{ color: "var(--danger)" }}>
          Eliminar
        </Button>
      </div>
    </article>
  );
}
