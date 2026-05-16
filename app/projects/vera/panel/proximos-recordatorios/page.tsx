"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { DoctorPageHeader } from "../../_components/product/doctor/DoctorPageHeader";
import {
  ReminderTypeToggle,
  type ReminderType,
} from "../../_components/product/doctor/ReminderTypeToggle";
import { UpcomingReminderList } from "../../_components/product/doctor/UpcomingReminderList";

export default function ProximosRecordatoriosPage() {
  const [type, setType] = useState<ReminderType>("T-24h");

  return (
    <>
      <DoctorPageHeader
        title="Próximos recordatorios"
        subtitle="Lo que enviaremos en las próximas 48 horas"
      />

      <section
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "var(--space-3)",
          padding: "var(--space-4)",
          background: "var(--bg-sunken)",
          border: "1px solid var(--rule-faint)",
          borderRadius: "var(--radius-md)",
          marginBottom: "var(--space-6)",
        }}
      >
        <MessageCircle size={20} strokeWidth={1.5} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ margin: 0, fontSize: "var(--text-md)", color: "var(--ink-soft)", lineHeight: "var(--leading-snug)" }}>
          Los recordatorios se envían 24 horas antes de cada cita por WhatsApp. Aquí puedes
          previsualizar exactamente lo que recibirá cada paciente, en orden cronológico.
        </p>
      </section>

      <div style={{ marginBottom: "var(--space-6)" }}>
        <ReminderTypeToggle value={type} onChange={setType} />
      </div>

      <UpcomingReminderList reminderType={type} />

      <p
        style={{
          margin: "var(--space-12) auto 0",
          fontSize: "var(--text-sm)",
          color: "var(--muted)",
          textAlign: "center",
          maxWidth: 480,
        }}
      >
        En el demo, los recordatorios no se envían realmente — esta es una vista previa de las
        plantillas. En producción se envían automáticamente vía WhatsApp Business API.
      </p>
    </>
  );
}
