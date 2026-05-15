import type { Metadata } from "next";

import { PageShell } from "../_components/PageShell";
import { TopNav } from "../_components/marketing/TopNav";
import { MarketingHero } from "../_components/marketing/MarketingHero";
import { MarketingFooter } from "../_components/marketing/MarketingFooter";
import { NumberedSection } from "../_components/marketing/NumberedSection";
import { LinkCardRow } from "../_components/marketing/LinkCardRow";
import { DualColumnLists } from "../_components/marketing/DualColumnLists";

export const metadata: Metadata = {
  title: "Sobre · Vera",
  description:
    "Por qué construimos Vera — la herramienta que el profesional independiente merece, sin convertirla en un directorio.",
};

const STEPS = [
  {
    title: "Página pública",
    body:
      "La doctora tiene un perfil propio en vera.app/su-nombre. Servicios, precios, disponibilidad, ubicación. Sin anuncios.",
  },
  {
    title: "Flujo de reserva",
    body:
      "El paciente elige servicio, día y hora, deja sus datos, confirma. Sesenta segundos. Sin cuenta.",
  },
  {
    title: "Panel y notificaciones",
    body:
      "La doctora ve su agenda. Cada nueva reserva llega por WhatsApp. Los recordatorios se envían automáticamente.",
  },
];

const WORKS = [
  "Página pública de la Dra. Sofía Ramírez",
  "Flujo de reserva tokenizado, sin cuenta",
  "Panel — agenda de hoy y semana, disponibilidad",
  "Onboarding de dos minutos",
  "Previsualización de mensajes de WhatsApp como artefacto",
  "Sistema de diseño documentado en /sistema",
  "Light + dark mode, ciudadanos de primera clase",
];

const NEXT = [
  "Case study en davhera.com",
  "Pasada de pulido sobre los edge cases de reagendamiento",
  "Conexión real a la WhatsApp Business API",
  "Pagos con Stripe / Mercado Pago para depósitos opcionales",
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
    }}
  >
    {children}
  </p>
);

export default function VeraSobre() {
  return (
    <>
      <TopNav />
      <PageShell width="content">
        <MarketingHero
          eyebrow="Sobre el proyecto"
          title="Por qué construimos Vera."
          body="El profesional de la salud independiente en México vive entre dos mundos: tiene un negocio, pero opera con WhatsApp y una libreta. Vera es la herramienta que ese profesional merece, sin convertirla en un directorio donde paga para aparecer arriba de su competencia."
        />

        {/* El problema */}
        <section
          style={{
            paddingTop: "var(--space-12)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
          }}
        >
          <SectionHeading>El problema.</SectionHeading>
          <Para>
            Doctoralia y similares funcionan como directorios. Tu perfil aparece rodeado de competidores. Si quieres aparecer arriba, pagas. El doctor es inventario, no cliente.
          </Para>
          <Para>
            Los sistemas clínicos (Nimbo-X y otros) están diseñados para clínicas con recepcionista. Para el profesional solo, son sobrediseñados y caros.
          </Para>
          <Para>
            El resultado: el profesional independiente gestiona su agenda por WhatsApp, en el mismo teléfono donde habla con su mamá. Vera asume que esa fricción no es necesaria.
          </Para>
        </section>

        {/* Para quién es */}
        <section
          style={{
            paddingTop: "var(--space-12)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
          }}
        >
          <SectionHeading>Para quién es.</SectionHeading>
          <Para>
            Para la psicóloga en Roma Norte que tiene 4mil seguidores en Instagram y maneja todo por WhatsApp. Para el nutriólogo en Guadalajara que cobra $700 por consulta y quiere verse profesional sin pagar por un directorio. Para el fisioterapeuta móvil en Puebla que necesita su agenda visible y bien organizada.
          </Para>
          <Para>
            El perfil ideal: independiente, presencia activa en redes, cobra entre $500 y $1,500 por sesión, ve entre 15 y 25 pacientes por semana, valora cómo se ve.
          </Para>
        </section>

        {/* Cómo funciona */}
        <section
          style={{
            paddingTop: "var(--space-12)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-6)",
          }}
        >
          <SectionHeading>Cómo funciona.</SectionHeading>
          <Para>Tres superficies.</Para>
          <NumberedSection items={STEPS} />
        </section>

        {/* Decisiones de diseño */}
        <section
          style={{
            paddingTop: "var(--space-12)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
          }}
        >
          <SectionHeading>Decisiones de diseño.</SectionHeading>
          <Para>
            <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Un solo acento de color.</strong> Terracota. Aparece en acciones primarias y en máximo tres elementos por pantalla.
          </Para>
          <Para>
            <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Superficies sobre sombras.</strong> La profundidad viene del contraste entre fondos blancos puros y un canvas levemente off-white. Las sombras se reservan para superficies flotantes.
          </Para>
          <Para>
            <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Modo claro y oscuro, desde el primer día.</strong> Ambos son ciudadanos de primera clase.
          </Para>
          <Para>
            <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Sans-serif en todo.</strong> Geist Sans. La jerarquía se construye con peso, tamaño y tracking — no cambiando de tipografía.
          </Para>
        </section>

        {/* Estado actual */}
        <section
          style={{
            paddingTop: "var(--space-12)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-6)",
          }}
        >
          <SectionHeading>Estado actual.</SectionHeading>
          <DualColumnLists
            left={{ label: "Lo que funciona", items: [...WORKS], marker: "check" }}
            right={{ label: "Lo que sigue", items: [...NEXT], marker: "arrow" }}
          />
        </section>

        {/* Quién hizo esto */}
        <section
          style={{
            paddingTop: "var(--space-12)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
          }}
        >
          <SectionHeading>Quién hizo esto.</SectionHeading>
          <Para>
            Diseñado y construido por David Hera, diseñador de producto basado en Rio de Janeiro. Vera es una pieza de portafolio — un producto en concepto, investigado, diseñado y construido en código de principio a fin. La investigación completa y el sistema de diseño están enlazados abajo.
          </Para>
        </section>

        {/* Closing link cards */}
        <section style={{ paddingTop: "var(--space-12)" }}>
          <LinkCardRow
            cards={[
              {
                href: "/projects/vera/sistema",
                title: "Sistema de diseño",
                description: "Tokens, tipografía, componentes — renderizado en vivo",
              },
              {
                href: "/projects/vera",
                title: "El demo",
                description: "Volver al landing y entrar a la demo",
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
