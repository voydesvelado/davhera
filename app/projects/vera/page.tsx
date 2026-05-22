import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageShell } from "./_components/PageShell";
import { Button } from "./_components/ui/Button";
import { ModePicker } from "./_components/ModePicker";

import { TopNav } from "./_components/marketing/TopNav";
import { MarketingHero } from "./_components/marketing/MarketingHero";
import { FeatureBlock } from "./_components/marketing/FeatureBlock";
import { MarketingFooter } from "./_components/marketing/MarketingFooter";
import { Eyebrow } from "./_components/marketing/Eyebrow";
import { DualColumnLists } from "./_components/marketing/DualColumnLists";
import { LinkCardRow } from "./_components/marketing/LinkCardRow";
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
      "Tu perfil vive en vera.app/tu-nombre. Sin anuncios de otros doctores arriba del tuyo. Sin «doctores similares» al pie. Sin venta de leads a la mejor postura.",
    details: [
      "Servicios, precios y duración visibles",
      "Disponibilidad real en tiempo real",
      "Sin pagar por aparecer arriba",
    ],
    visual: <PublicProfileVisual />,
  },
  {
    eyebrow: "Reservas",
    title: "Sesenta segundos, sin cuenta",
    body:
      "El paciente elige servicio, día y hora, y deja sus datos. No descarga una app. No crea una cuenta. No verifica un email. Cierra la pestaña y ya está agendado.",
    details: [
      "Tres pasos: servicio, hora, datos",
      "Token de un solo uso por cita",
      "Reagendar o cancelar con un link",
    ],
    visual: <BookingVisual />,
  },
  {
    eyebrow: "Recordatorios",
    title: "WhatsApp, no email",
    body:
      "Las confirmaciones y los recordatorios llegan al canal donde tus pacientes ya viven. No tienes que escribir cada uno a mano la noche anterior. No se pierden en spam.",
    details: [
      "Confirmación al reservar",
      "Recordatorio T-24h, automático",
      "Link de reagendamiento incluido",
    ],
    visual: <ReminderVisual />,
  },
  {
    eyebrow: "Diseño",
    title: "Modo claro y oscuro, desde el primer día",
    body:
      "Construido como un producto premium, no como un MVP. Tipografía, color y espaciado pensados con el mismo cuidado que tu trabajo. El sistema completo está documentado en /sistema.",
    details: [
      "Un solo acento de color — terracota",
      "Geist Sans en toda la jerarquía",
      "Sistema de diseño documentado en vivo",
    ],
    visual: <DesignVisual />,
  },
];

const WORKS = [
  "Página pública de la Dra. Sofía Ramírez",
  "Flujo de reserva tokenizado, sin cuenta",
  "Panel — agenda de hoy y semana, disponibilidad",
  "Onboarding de dos minutos",
  "Previsualización de WhatsApp como artefacto",
  "Sistema de diseño documentado en /sistema",
  "Light + dark mode, ciudadanos de primera clase",
];

const NEXT = [
  "Case study en davhera.com",
  "Pulido de edge cases en reagendamiento",
  "Conexión real a la WhatsApp Business API",
  "Pagos con Stripe / Mercado Pago para depósitos",
  "Reviews opt-in post-PMF",
];

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2
    style={{
      fontSize: "var(--text-3xl)",
      fontWeight: 600,
      letterSpacing: "var(--tracking-snug)",
      lineHeight: "var(--leading-snug)",
      color: "var(--ink)",
      margin: 0,
    }}
  >
    {children}
  </h2>
);

const Para = ({ children }: { children: React.ReactNode }) => (
  <p
    style={{
      fontSize: "var(--text-md)",
      lineHeight: "var(--leading-normal)",
      color: "var(--ink-soft)",
      margin: 0,
      maxWidth: "640px",
    }}
  >
    {children}
  </p>
);

const STATS = [
  { value: "$500–$1,500", label: "por sesión" },
  { value: "15–25", label: "pacientes por semana" },
  { value: "1", label: "sola persona detrás del negocio" },
];

const DESIGN_DECISIONS = [
  {
    title: "Un solo acento de color",
    body: "Terracota. Aparece en acciones primarias y en máximo tres elementos por pantalla.",
  },
  {
    title: "Superficies sobre sombras",
    body: "La profundidad viene del contraste entre fondos. Las sombras se reservan para superficies flotantes.",
  },
  {
    title: "Sans-serif en todo",
    body: "Geist Sans. La jerarquía se construye con peso, tamaño y tracking — no cambiando de tipografía.",
  },
];

const TECH_DECISIONS = [
  {
    title: "Sin backend",
    body: "Toda la persistencia vive en el localStorage del visitante. Cada quien tiene su propia experiencia. Cuesta cero al mes.",
  },
  {
    title: "Datos seed hardcoded",
    body: "La Dra. Sofía Ramírez y su agenda viven en un archivo TypeScript del repositorio. Es la fuente canónica del demo.",
  },
  {
    title: "Ediciones efímeras",
    body: "Cambiar un servicio o editar el perfil en modo doctora dura una sesión. Reload y vuelve al seed — honesto sobre la naturaleza del demo.",
  },
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
              <Link href="/projects/vera/sobre">
                <Button size="md" variant="ghost">
                  Leer la historia →
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

        {/* EL PROBLEMA */}
        <section
          style={{
            paddingTop: "var(--space-20)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
            maxWidth: "var(--max-content)",
          }}
        >
          <Eyebrow accent>El problema</Eyebrow>
          <SectionHeading>
            El profesional independiente no tiene su propia herramienta.
          </SectionHeading>
          <Para>
            Doctoralia y similares funcionan como directorios. Tu perfil aparece rodeado de competidores. Si quieres aparecer arriba, pagas. El doctor es inventario, no cliente.
          </Para>
          <Para>
            Los sistemas clínicos como Nimbo-X están diseñados para clínicas con recepcionista. Para el profesional solo, son sobrediseñados y caros.
          </Para>
          <Para>
            El resultado: el profesional gestiona su agenda por WhatsApp, en el mismo teléfono donde habla con su mamá. Vera asume que esa fricción no es necesaria.
          </Para>
        </section>

        {/* PARA QUIÉN */}
        <section
          style={{
            paddingTop: "var(--space-20)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-6)",
            maxWidth: "var(--max-content)",
          }}
        >
          <Eyebrow accent>Para quién es</Eyebrow>
          <SectionHeading>
            La psicóloga con cuatro mil seguidores en Instagram.
          </SectionHeading>
          <Para>
            El nutriólogo en Guadalajara que cobra $700 por consulta y quiere verse profesional sin pagar por un directorio. El fisioterapeuta móvil en Puebla que necesita su agenda visible y bien organizada. El perfil ideal es independiente, con presencia activa en redes, y le importa cómo se ve.
          </Para>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "var(--space-6)",
              marginTop: "var(--space-4)",
              paddingTop: "var(--space-6)",
              borderTop: "1px solid var(--rule)",
            }}
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-1)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "var(--text-2xl)",
                    fontWeight: 600,
                    color: "var(--ink)",
                    letterSpacing: "var(--tracking-tight)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--muted)",
                    lineHeight: "var(--leading-snug)",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section
          className="density-comfortable"
          style={{
            paddingTop: "var(--space-24)",
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
              details={f.details}
              visual={f.visual}
              imageSide={idx % 2 === 0 ? "right" : "left"}
            />
          ))}
        </section>

        {/* DECISIONES */}
        <section
          style={{
            paddingTop: "var(--space-16)",
            paddingBottom: "var(--space-16)",
            borderTop: "1px solid var(--rule)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-8)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
              maxWidth: "var(--max-content)",
            }}
          >
            <Eyebrow accent>Decisiones detrás del producto</Eyebrow>
            <SectionHeading>
              Construido como producto, no como mockup.
            </SectionHeading>
            <Para>
              Cada decisión visible — el acento de color, la tipografía, la arquitectura del demo — se eligió con intención. No es un Figma exportado: es código en producción.
            </Para>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-10)",
              marginTop: "var(--space-4)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              <Eyebrow>Diseño</Eyebrow>
              {DESIGN_DECISIONS.map((d) => (
                <div
                  key={d.title}
                  style={{ display: "flex", flexDirection: "column", gap: "var(--space-1_5)" }}
                >
                  <h3
                    style={{
                      fontSize: "var(--text-md)",
                      fontWeight: 600,
                      color: "var(--ink)",
                      margin: 0,
                      letterSpacing: "var(--tracking-normal)",
                    }}
                  >
                    {d.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      lineHeight: "var(--leading-normal)",
                      color: "var(--ink-soft)",
                      margin: 0,
                    }}
                  >
                    {d.body}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              <Eyebrow>Técnico</Eyebrow>
              {TECH_DECISIONS.map((d) => (
                <div
                  key={d.title}
                  style={{ display: "flex", flexDirection: "column", gap: "var(--space-1_5)" }}
                >
                  <h3
                    style={{
                      fontSize: "var(--text-md)",
                      fontWeight: 600,
                      color: "var(--ink)",
                      margin: 0,
                      letterSpacing: "var(--tracking-normal)",
                    }}
                  >
                    {d.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      lineHeight: "var(--leading-normal)",
                      color: "var(--ink-soft)",
                      margin: 0,
                    }}
                  >
                    {d.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ESTADO ACTUAL */}
        <section
          style={{
            paddingTop: "var(--space-16)",
            paddingBottom: "var(--space-12)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-8)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
              maxWidth: "var(--max-content)",
            }}
          >
            <Eyebrow accent>Estado actual</Eyebrow>
            <SectionHeading>Lo que ya está y lo que sigue.</SectionHeading>
          </div>
          <DualColumnLists
            left={{ label: "Lo que funciona", items: [...WORKS], marker: "check" }}
            right={{ label: "Lo que sigue", items: [...NEXT], marker: "arrow" }}
          />
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--muted)",
              margin: 0,
            }}
          >
            Demo persistente en tu navegador · Sin backend · Cero costos en producción
          </p>
          <div style={{ marginTop: "var(--space-2)" }}>
            <Link href="#demo">
              <Button size="md">
                Probar el demo
                <ArrowRight size={16} strokeWidth={1.75} />
              </Button>
            </Link>
          </div>
        </section>

        {/* LINKS */}
        <section
          style={{
            paddingTop: "var(--space-12)",
            paddingBottom: "var(--space-8)",
            borderTop: "1px solid var(--rule)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-6)",
          }}
        >
          <Eyebrow>Sigue explorando</Eyebrow>
          <LinkCardRow
            cards={[
              {
                href: "/projects/vera/sobre",
                title: "La historia completa",
                description: "Por qué construimos Vera — investigación, decisiones y quién está detrás",
              },
              {
                href: "/projects/vera/sistema",
                title: "Sistema de diseño",
                description: "Tokens, tipografía, componentes — renderizado en vivo",
              },
              {
                href: "/",
                title: "Davhera.com",
                description: "El portafolio completo",
              },
            ]}
          />
        </section>

        <MarketingFooter />
      </PageShell>
    </>
  );
}
