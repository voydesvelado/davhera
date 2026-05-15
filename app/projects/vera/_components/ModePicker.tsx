import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface ModeCardProps {
  href: string;
  role: string;
  title: string;
  description: ReactNode;
}

function ModeCard({ href, role, title, description }: ModeCardProps) {
  return (
    <Link
      href={href}
      className="vera-mode-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        padding: "var(--space-7)",
        background: "var(--bg-2)",
        border: "1px solid var(--rule)",
        textDecoration: "none",
        color: "inherit",
        transition: "border-color var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-fraunces), serif",
          fontVariationSettings: '"opsz" 9, "SOFT" 0',
          fontWeight: 600,
          fontSize: "10px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        {role}
      </span>

      <h3
        style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontVariationSettings: '"opsz" 72, "SOFT" 80',
          fontStyle: "italic",
          fontWeight: 380,
          fontSize: "30px",
          lineHeight: 1.05,
          letterSpacing: "-0.01em",
          margin: 0,
          color: "var(--ink)",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontFamily: "var(--font-newsreader), Georgia, serif",
          fontSize: "16px",
          lineHeight: 1.5,
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
          marginTop: "var(--space-3)",
          fontFamily: "var(--font-fraunces), serif",
          fontVariationSettings: '"opsz" 9, "SOFT" 0',
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--accent)",
        }}
      >
        Entrar
        <ArrowRight size={14} strokeWidth={1.5} />
      </span>
    </Link>
  );
}

export function ModePicker() {
  return (
    <>
      <style>{`
        .vera-mode-card:hover {
          border-color: var(--accent) !important;
          transform: translateY(-2px);
        }
      `}</style>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "var(--space-5)",
          marginTop: "var(--space-8)",
        }}
      >
        <ModeCard
          href="/projects/vera/panel"
          role="Doctora · Demo"
          title="Ver como doctora"
          description={
            <>
              El panel de hoy, la vista de semana, la disponibilidad y el onboarding de dos minutos. Estado persistente por sesión.
            </>
          }
        />
        <ModeCard
          href="/projects/vera/dra-sofia-ramirez"
          role="Paciente · Demo"
          title="Ver como paciente"
          description={
            <>
              El perfil público de la Dra. Sofía Ramírez, el flujo de reserva de 60 segundos y los enlaces tokenizados para reagendar.
            </>
          }
        />
      </div>
    </>
  );
}
