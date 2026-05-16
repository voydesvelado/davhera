"use client";

import { useState } from "react";
import { DoctorPageHeader } from "../../_components/product/doctor/DoctorPageHeader";
import { AvailabilityGrid } from "../../_components/product/doctor/AvailabilityGrid";
import { AvailabilitySummary } from "../../_components/product/doctor/AvailabilitySummary";
import { BlockedPeriodCard } from "../../_components/product/doctor/BlockedPeriodCard";
import { BlockTimeSheet } from "../../_components/product/doctor/BlockTimeSheet";
import { Button } from "../../_components/ui/Button";
import { useToast } from "../../_components/ui/Toast";
import { useEphemeralSave } from "../../_components/ui/EphemeralSaveToast";
import { Eyebrow } from "../../_components/product/Eyebrow";
import { SEED_AVAILABILITY, SOFIA_ID, getSeedBlockedPeriods } from "../../_lib/seed";
import type { AvailabilityRule, BlockedPeriod } from "../../_lib/types";

const DEFAULT_RULES: AvailabilityRule[] = (() => {
  const rules: AvailabilityRule[] = [];
  for (let weekday = 1; weekday <= 5; weekday += 1) {
    rules.push({ doctorId: SOFIA_ID, weekday, startMinute: 9 * 60, endMinute: 18 * 60 });
  }
  return rules;
})();

export default function DisponibilidadPage() {
  const [rules, setRules] = useState<AvailabilityRule[]>(SEED_AVAILABILITY);
  const [blocked, setBlocked] = useState<BlockedPeriod[]>(() => getSeedBlockedPeriods());
  const [blockOpen, setBlockOpen] = useState(false);
  const toast = useToast();
  const ephemeral = useEphemeralSave();

  function handleRulesChange(next: AvailabilityRule[]) {
    setRules(next);
    ephemeral.notify();
  }

  function reset() {
    setRules(DEFAULT_RULES);
    toast.show({ tone: "default", message: "Restablecido al horario predeterminado." });
  }

  function deleteBlocked(idx: number) {
    setBlocked((cur) => cur.filter((_, i) => i !== idx));
    toast.show({ tone: "default", message: "Bloqueo eliminado (no se guarda en el demo)" });
  }

  function addBlocked(period: BlockedPeriod) {
    setBlocked((cur) => [...cur, period].sort((a, b) => a.startsAt.localeCompare(b.startsAt)));
  }

  return (
    <>
      <DoctorPageHeader title="Disponibilidad" subtitle="Cuándo aceptas reservas" />

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
          paddingBottom: "var(--space-12)",
        }}
      >
        <Eyebrow>Horario semanal</Eyebrow>
        <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--muted)" }}>
          Define los días y horas en que aceptas reservas. Esto se repite todas las semanas.
        </p>

        <AvailabilityGrid rules={rules} doctorId={SOFIA_ID} onChange={handleRulesChange} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "var(--space-3)",
            flexWrap: "wrap",
          }}
        >
          <AvailabilitySummary rules={rules} />
          <Button size="sm" variant="ghost" onClick={reset} style={{ color: "var(--accent)" }}>
            Restablecer al horario predeterminado
          </Button>
        </div>
      </section>

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
          marginTop: "var(--space-12)",
          paddingBottom: "var(--space-16)",
        }}
      >
        <Eyebrow>Días bloqueados</Eyebrow>
        <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--muted)" }}>
          Vacaciones, congresos o días que necesitas cerrar fuera de tu horario habitual.
        </p>

        {blocked.length === 0 ? (
          <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--ink-faint)" }}>
            Sin días bloqueados.{" "}
            <button
              type="button"
              onClick={() => setBlockOpen(true)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                color: "var(--accent)",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Bloquear tiempo →
            </button>
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {blocked.map((p, idx) => (
              <BlockedPeriodCard key={p.startsAt + p.endsAt} period={p} onDelete={() => deleteBlocked(idx)} />
            ))}
          </div>
        )}

        <div style={{ marginTop: "var(--space-3)" }}>
          <Button size="md" onClick={() => setBlockOpen(true)}>
            Bloquear tiempo
          </Button>
        </div>
      </section>

      <BlockTimeSheet open={blockOpen} onOpenChange={setBlockOpen} onCreate={addBlocked} />
    </>
  );
}
