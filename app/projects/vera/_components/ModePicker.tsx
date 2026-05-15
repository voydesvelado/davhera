import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface ModeCardProps {
  href: string;
  label: string;
  title: string;
  description: ReactNode;
}

function ModeCard({ href, label, title, description }: ModeCardProps) {
  return (
    <Link
      href={href}
      className="vera-mode-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
        padding: "var(--space-6)",
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-lg)",
        textDecoration: "none",
        color: "inherit",
        transition:
          "border-color var(--dur-quick) var(--ease-snap), background var(--dur-quick) var(--ease-snap)",
        minHeight: "180px",
      }}
    >
      <span
        style={{
          fontSize: "var(--text-xs)",
          fontWeight: 500,
          letterSpacing: "var(--tracking-widest)",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        {label}
      </span>

      <h3
        style={{
          fontSize: "var(--text-2xl)",
          fontWeight: 600,
          letterSpacing: "var(--tracking-snug)",
          color: "var(--ink)",
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: "var(--text-md)",
          lineHeight: "var(--leading-normal)",
          color: "var(--ink-soft)",
          margin: 0,
        }}
      >
        {description}
      </p>

      <span
        aria-hidden
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-2)",
          marginTop: "auto",
          paddingTop: "var(--space-3)",
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          color: "var(--accent)",
        }}
      >
        Entrar
        <ArrowRight size={16} strokeWidth={1.75} />
      </span>

      <style>{`
        .vera-mode-card:hover {
          border-color: var(--accent) !important;
        }
      `}</style>
    </Link>
  );
}

export function ModePicker() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "var(--space-4)",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      <ModeCard
        href="/projects/vera/dra-sofia-ramirez"
        label="Paciente · Demo"
        title="Como paciente"
        description="Reserva una cita con la Dra. Sofía Ramírez. Sesenta segundos de principio a fin."
      />
      <ModeCard
        href="/projects/vera/panel"
        label="Doctora · Demo"
        title="Como doctora"
        description="Entra al panel. Mira la agenda de hoy, gestiona disponibilidad, previsualiza recordatorios."
      />
    </div>
  );
}
