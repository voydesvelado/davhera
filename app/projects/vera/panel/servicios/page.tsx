"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { DoctorPageHeader } from "../../_components/product/doctor/DoctorPageHeader";
import { ServiceEditor, type EditableService } from "../../_components/product/doctor/ServiceEditor";
import { Button } from "../../_components/ui/Button";
import { SEED_SERVICES } from "../../_lib/seed";

const SEED_AS_EDITABLE: EditableService[] = SEED_SERVICES.map((s) => ({
  id: s.id,
  name: s.name,
  durationMin: s.durationMin,
  priceMxn: s.priceMxn,
  description: s.description,
  active: true,
}));

function newId(): string {
  return `tmp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export default function ServiciosPage() {
  const [services, setServices] = useState<EditableService[]>(SEED_AS_EDITABLE);
  const [autoFocusId, setAutoFocusId] = useState<string | null>(null);

  function update(idx: number, next: EditableService) {
    setServices((cur) => cur.map((s, i) => (i === idx ? next : s)));
  }

  function remove(idx: number) {
    setServices((cur) => cur.filter((_, i) => i !== idx));
  }

  function add() {
    const id = newId();
    setServices((cur) => [
      ...cur,
      {
        id,
        name: "",
        durationMin: 60,
        priceMxn: 1000,
        description: "",
        active: true,
      },
    ]);
    setAutoFocusId(id);
    setTimeout(() => {
      const el = document.getElementById(`svc-${id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  }

  return (
    <>
      <DoctorPageHeader
        title="Servicios"
        subtitle="Lo que ofreces y a qué precio"
      />
      <p
        style={{
          margin: "0 0 var(--space-5)",
          fontSize: "var(--text-sm)",
          color: "var(--muted)",
          maxWidth: 640,
        }}
      >
        Cada servicio aparece en tu página pública con su nombre, duración y precio. Tus pacientes
        eligen uno al reservar.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {services.map((s, idx) => (
          <div key={s.id} id={`svc-${s.id}`}>
            <ServiceEditor
              service={s}
              onChange={(next) => update(idx, next)}
              onDelete={() => remove(idx)}
              autoFocusName={s.id === autoFocusId}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: "var(--space-6)" }} className="vera-add-svc">
        <Button size="md" variant="secondary" onClick={add}>
          <Plus size={16} strokeWidth={1.75} />
          Agregar servicio
        </Button>
        <style>{`
          @media (max-width: 640px) {
            .vera-add-svc button { width: 100%; }
          }
        `}</style>
      </div>
    </>
  );
}
