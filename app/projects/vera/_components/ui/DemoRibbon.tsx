"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Sheet } from "./Sheet";

export function DemoRibbon() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="vera-demo-ribbon"
        aria-label="Sobre este demo"
        style={{
          position: "fixed",
          top: "var(--space-3)",
          right: "var(--space-3)",
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-1_5)",
          padding: "4px 10px",
          background: "var(--accent)",
          color: "var(--accent-ink)",
          border: "none",
          borderRadius: "var(--radius-pill)",
          fontSize: "var(--text-2xs)",
          fontWeight: 500,
          letterSpacing: "var(--tracking-wide)",
          textTransform: "uppercase",
          cursor: "pointer",
          boxShadow: "var(--shadow-sm)",
          zIndex: 20,
          transition: "filter var(--dur-quick) var(--ease-snap)",
        }}
      >
        <Sparkles size={12} strokeWidth={2} />
        Demo · concepto
        <style>{`
          .vera-demo-ribbon:hover { filter: brightness(1.05); }
          .vera-demo-ribbon:active { transform: scale(0.97); }
          @media (min-width: 768px) {
            .vera-demo-ribbon { top: var(--space-4); right: var(--space-4); }
          }
        `}</style>
      </button>

      <Sheet
        open={open}
        onOpenChange={setOpen}
        size="md"
        title="Sobre este demo"
        description="Vera es una pieza de portafolio en concepto. Esto es lo que es real y lo que está simulado."
      >
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
            fontSize: "var(--text-base)",
            color: "var(--ink-soft)",
            lineHeight: "var(--leading-normal)",
          }}
        >
          <li>
            <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Tus reservas son reales —</strong>{" "}
            se guardan solo en este navegador. No se sincronizan entre dispositivos ni con otras
            personas que abran el demo.
          </li>
          <li>
            <strong style={{ color: "var(--ink)", fontWeight: 600 }}>WhatsApp es una vista previa.</strong>{" "}
            En el demo no se envían mensajes reales — verás cómo se vería la confirmación o el
            recordatorio en el teléfono del paciente.
          </li>
          <li>
            <strong style={{ color: "var(--ink)", fontWeight: 600 }}>La Dra. Sofía Ramírez</strong> es un
            personaje de demostración. Su perfil, servicios, y disponibilidad están diseñados para
            mostrar el sistema.
          </li>
          <li>
            <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Algunas citas en la agenda</strong>{" "}
            están pre-cargadas para que el calendario se sienta vivo. No se pueden reagendar ni
            cancelar.
          </li>
          <li>
            <strong style={{ color: "var(--ink)", fontWeight: 600 }}>En modo doctora,</strong> las
            ediciones (servicios, disponibilidad, perfil) no se guardan. Solo las reservas que
            hagas como paciente persisten entre sesiones.
          </li>
        </ul>
      </Sheet>
    </>
  );
}
