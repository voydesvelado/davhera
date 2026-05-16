import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageShell } from "./_components/PageShell";
import { Button } from "./_components/ui/Button";
import { ModePicker } from "./_components/ModePicker";

import { TopNav } from "./_components/marketing/TopNav";
import { MarketingHero } from "./_components/marketing/MarketingHero";
import { FeatureBlock } from "./_components/marketing/FeatureBlock";
import { LiveList } from "./_components/marketing/LiveList";
import { MarketingFooter } from "./_components/marketing/MarketingFooter";
import { Eyebrow } from "./_components/marketing/Eyebrow";
import {
  PublicProfileVisual,
  BookingVisual,
  ReminderVisual,
  DesignVisual,
} from "./_components/marketing/FeatureVisuals";

export const metadata: Metadata = {
  title: "Vera · Reservas para profesionales independientes",
  description:
    "Una página pública, un sistema de citas, recordatorios automáticos por WhatsApp. Hecho para psicólogos, nutriólogos, dentistas y demás independientes en México.",
};

const FEATURES = [
  {
    eyebrow: "Página pública",
    title: "Una página, no un directorio",
    body:
      "Tu perfil es tuyo. Sin anuncios de otros doctores. Sin «doctores similares». Sin venta de leads.",
    visual: <PublicProfileVisual />,
  },
  {
    eyebrow: "Reservas",
    title: "Sesenta segundos, sin cuenta",
    body:
      "El paciente elige servicio, día y hora, y deja sus datos. No descarga nada. No crea una cuenta.",
    visual: <BookingVisual />,
  },
  {
    eyebrow: "Recordatorios",
    title: "WhatsApp, no email",
    body:
      "Confirmaciones y recordatorios por el canal donde tus pacientes ya viven. Sin tener que escribir cada uno a mano.",
    visual: <ReminderVisual />,
  },
  {
    eyebrow: "Diseño",
    title: "Modo claro y oscuro, desde el primer día",
    body:
      "Construido como un producto premium, no como un MVP. El sistema de diseño está documentado en /sistema.",
    visual: <DesignVisual />,
  },
];

const LIVE_ITEMS = [
  "El perfil público de la Dra. Sofía Ramírez",
  "El flujo de reserva en sesenta segundos",
  "El panel de la doctora — hoy, semana, disponibilidad",
  "El onboarding de dos minutos",
  "Confirmaciones y reagendamientos tokenizados, sin cuenta",
];

export default function VeraLandingPage() {
  return (
    <>
      <TopNav />
      <PageShell width="wide">
        <MarketingHero
          eyebrow="Proyecto en concepto · Davhera 2026"
          title="Reservas para profesionales independientes."
          body="Una página pública, un sistema de citas, recordatorios automáticos por WhatsApp. Hecho para psicólogos, nutriólogos, dentistas y demás independientes en México."
          actions={
            <>
              <Link href="#demo">
                <Button size="md">Probar el demo</Button>
              </Link>
              <Link href="/projects/vera/sistema">
                <Button size="md" variant="ghost">
                  Ver el sistema →
                </Button>
              </Link>
            </>
          }
        />

        {/* MODE PICKER */}
        <section
          id="demo"
          style={{
            paddingTop: "var(--space-16)",
            paddingBottom: "var(--space-16)",
            borderTop: "1px solid var(--rule)",
            borderBottom: "1px solid var(--rule)",
            scrollMarginTop: "var(--space-16)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--space-3)",
              textAlign: "center",
              marginBottom: "var(--space-8)",
            }}
          >
            <Eyebrow>Dos formas de probarlo</Eyebrow>
            <p
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--ink-soft)",
                maxWidth: "520px",
                margin: 0,
              }}
            >
              Como doctora o como paciente. El estado se guarda entre sesiones.
            </p>
          </div>
          <ModePicker />
        </section>

        {/* FEATURES */}
        <section
          className="density-comfortable"
          style={{
            paddingTop: "var(--space-20)",
            paddingBottom: "var(--space-16)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-20)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Eyebrow>Lo que hace</Eyebrow>
          </div>
          {FEATURES.map((f, idx) => (
            <FeatureBlock
              key={f.title}
              eyebrow={f.eyebrow}
              title={f.title}
              body={f.body}
              visual={f.visual}
              imageSide={idx % 2 === 0 ? "right" : "left"}
            />
          ))}
        </section>

        {/* LIVE LIST */}
        <section
          style={{
            paddingTop: "var(--space-16)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-6)",
          }}
        >
          <Eyebrow>Lo que está construido</Eyebrow>
          <div style={{ maxWidth: "560px", width: "100%" }}>
            <LiveList items={[...LIVE_ITEMS]} />
          </div>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--muted)",
              marginTop: "var(--space-2)",
              textAlign: "center",
            }}
          >
            Demo persistente en tu navegador · Sin backend · Cero costos en producción
          </p>
          <Link href="#demo" style={{ marginTop: "var(--space-4)" }}>
            <Button size="md">
              Probar el demo
              <ArrowRight size={16} strokeWidth={1.75} />
            </Button>
          </Link>
        </section>

        <MarketingFooter />
      </PageShell>
    </>
  );
}
