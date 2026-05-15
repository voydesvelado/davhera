import type { Metadata } from "next";
import { PageShell } from "../_components/PageShell";
import { EditorialCover } from "../_components/EditorialCover";
import { SectionHeader } from "../_components/SectionHeader";
import { ProseBlock } from "../_components/ProseBlock";
import { TableOfContents } from "../_components/TableOfContents";
import { BackLink } from "../_components/BackLink";
import { Colophon } from "../_components/Colophon";
import { Eyebrow } from "../_components/Eyebrow";
import { PullQuote } from "../_components/PullQuote";
import { Sidenote } from "../_components/Sidenote";
import { OrnamentRule } from "../_components/Ornament";

import { ColorSwatch } from "../_components/sistema/ColorSwatch";
import { TypeSpecimen } from "../_components/sistema/TypeSpecimen";
import { SpacingBar } from "../_components/sistema/SpacingBar";
import { RadiusBox } from "../_components/sistema/RadiusBox";
import { ShadowCard } from "../_components/sistema/ShadowCard";
import { MotionSampler } from "../_components/sistema/MotionSampler";
import { IconGrid } from "../_components/sistema/IconGrid";
import { ComponentSample } from "../_components/sistema/ComponentSample";
import { Sketch } from "../_components/sistema/Sketch";

import { Button } from "../_components/ui/Button";
import { Input } from "../_components/ui/Input";
import { Label } from "../_components/ui/Label";
import { Badge } from "../_components/ui/Badge";

export const metadata: Metadata = {
  title: "Sistema · Vera",
  description:
    "Tokens, tipografía, movimiento y biblioteca de componentes que componen el producto Vera.",
};

// ── Color palettes ───────────────────────────────────────────────
const EDITORIAL_COLORS = [
  { token: "--bg",          hex: "#F4EFE4" },
  { token: "--bg-2",        hex: "#EBE4D3" },
  { token: "--bg-3",        hex: "#E4DBC5" },
  { token: "--ink",         hex: "#1A1816" },
  { token: "--ink-soft",    hex: "#2C2924" },
  { token: "--muted",       hex: "#6E665A" },
  { token: "--rule",        hex: "#CFC6B3" },
  { token: "--rule-soft",   hex: "#DDD4C1" },
  { token: "--accent",      hex: "#8B2E1F" },
  { token: "--accent-soft", hex: "#B85940" },
  { token: "--accent-pale", hex: "#F1E3DE" },
];

const PRODUCT_COLORS = [
  { token: "--bg",          hex: "#FAFAF7" },
  { token: "--bg-2",        hex: "#F2F0EA" },
  { token: "--bg-3",        hex: "#E8E5DD" },
  { token: "--ink",         hex: "#0F1418" },
  { token: "--ink-soft",    hex: "#2A2F35" },
  { token: "--muted",       hex: "#6B7280" },
  { token: "--rule",        hex: "#E3DFD5" },
  { token: "--rule-soft",   hex: "#EEEAE0" },
  { token: "--accent",      hex: "#A04030" },
  { token: "--accent-soft", hex: "#C76957" },
  { token: "--accent-pale", hex: "#F5E8E3" },
  { token: "--success",     hex: "#4A6B3F" },
  { token: "--warning",     hex: "#B8851F" },
  { token: "--danger",      hex: "#8B2E1F" },
];

const TYPE_SCALE: Array<{ token: string; px: number; sample: string }> = [
  { token: "--text-caption", px: 12, sample: "Etiqueta o metadato" },
  { token: "--text-small",   px: 13, sample: "Información secundaria" },
  { token: "--text-sm",      px: 15, sample: "Cuerpo compacto" },
  { token: "--text-base",    px: 17, sample: "Cuerpo del producto" },
  { token: "--text-body",    px: 19, sample: "Cuerpo editorial" },
  { token: "--text-lead",    px: 22, sample: "Párrafo de apertura" },
  { token: "--text-h4",      px: 24, sample: "Encabezado pequeño" },
  { token: "--text-h3",      px: 28, sample: "Encabezado medio" },
  { token: "--text-h2",      px: 38, sample: "Encabezado de sección" },
  { token: "--text-h1",      px: 54, sample: "Título de página" },
  { token: "--text-display", px: 72, sample: "Vera" },
];

const SPACES = [
  { token: "--space-1",  px: 4 },
  { token: "--space-2",  px: 8 },
  { token: "--space-3",  px: 12 },
  { token: "--space-4",  px: 16 },
  { token: "--space-5",  px: 20 },
  { token: "--space-6",  px: 24 },
  { token: "--space-8",  px: 32 },
  { token: "--space-10", px: 40 },
  { token: "--space-12", px: 48 },
  { token: "--space-16", px: 64 },
  { token: "--space-20", px: 80 },
  { token: "--space-24", px: 96 },
  { token: "--space-32", px: 128 },
];

const RADII = [
  { token: "--radius-none", radius: "0" },
  { token: "--radius-xs",   radius: "2px" },
  { token: "--radius-sm",   radius: "4px" },
  { token: "--radius-md",   radius: "8px" },
  { token: "--radius-lg",   radius: "12px" },
  { token: "--radius-pill", radius: "9999px" },
];

const SHADOWS = [
  { token: "--shadow-sm", shadow: "0 1px 2px rgba(15, 20, 24, 0.04), 0 1px 3px rgba(15, 20, 24, 0.06)" },
  { token: "--shadow-md", shadow: "0 4px 12px rgba(15, 20, 24, 0.06), 0 2px 4px rgba(15, 20, 24, 0.04)" },
  { token: "--shadow-lg", shadow: "0 16px 40px rgba(15, 20, 24, 0.08), 0 4px 12px rgba(15, 20, 24, 0.04)" },
];

const TOC = [
  { id: "identidad", label: "Identidad" },
  { id: "color",     label: "Color" },
  { id: "tipografia",label: "Tipografía" },
  { id: "espaciado", label: "Espaciado" },
  { id: "radios",    label: "Radios" },
  { id: "elevacion", label: "Elevación" },
  { id: "movimiento",label: "Movimiento" },
  { id: "iconografia", label: "Iconografía" },
  { id: "componentes", label: "Componentes" },
  { id: "layout",    label: "Layout & páginas" },
  { id: "no-es",     label: "Lo que el sistema no es" },
];

const DONTS = [
  { do_: "No", say: "introducir tipografías adicionales", note: "Tres es el techo." },
  { do_: "No", say: "agregar fondos con gradiente en modo producto", note: "La atmósfera vive en el tipo y en el espacio." },
  { do_: "No", say: "usar iconos sin etiqueta en flujos de producto", note: "Lucide es decorativo, no navegacional." },
  { do_: "No", say: "usar botones completamente redondos", note: "El radio máximo de contenido es --radius-lg." },
  { do_: "No", say: "introducir azul, verde o morado", note: "La paleta es cálida. Las únicas excepciones son los estados semánticos." },
  { do_: "No", say: "usar emoji en las páginas de marketing", note: "El modo editorial está libre de emojis." },
  { do_: "No", say: "replicar los componentes de davhera.com", note: "Construir fresco dentro del scope." },
];

export default function VeraSistema() {
  return (
    <PageShell mode="editorial">
      <BackLink href="/projects/vera">Volver al inicio</BackLink>

      <EditorialCover
        metaLeft={[
          <span key="1">Vera · Sistema de Diseño</span>,
          <span key="2">v0.1 · Mayo 2026</span>,
        ]}
        metaRight={[
          <span key="1">Davhera · 2026</span>,
          <span key="2">Renderizado en vivo</span>,
        ]}
        eyebrow="El sistema"
        titleLines={[
          "La",
          { before: "", emphasis: "gramática", after: " del producto." },
        ]}
        title=""
        deck="Los tokens, las tipografías, las decisiones de movimiento y la biblioteca de componentes que componen el producto. Una sola fuente de verdad, visible y navegable."
        footMeta="Renderizado en vivo desde tokens.css"
      />

      <TableOfContents
        entries={TOC.map((t) => ({ label: t.label, href: `#${t.id}` }))}
      />

      {/* SECTION — Identidad */}
      <section id="identidad" style={{ marginTop: "var(--space-20)", scrollMarginTop: "var(--space-12)" }}>
        <SectionHeader num="Sección II" title={{ before: "", emphasis: "Identidad" }} />
        <ProseBlock>
          <p>
            El sistema habla en dos voces que comparten un solo esqueleto. <strong>Modo editorial</strong> para
            las superficies de marketing —landing, manifesto, este mismo guide—. <strong>Modo producto</strong>{" "}
            para las superficies de la aplicación: el perfil público, el panel de la doctora, el flujo de reserva.
          </p>
          <p>
            Las dos modalidades comparten la misma tipografía display (Fraunces) y el mismo matiz de acento a
            distintas saturaciones. Cambiar entre ellas debería sentirse como pasar una página dentro del mismo
            libro, no abrir un libro distinto.
          </p>
        </ProseBlock>
      </section>

      {/* SECTION — Color */}
      <section id="color" style={{ marginTop: "var(--space-20)", scrollMarginTop: "var(--space-12)" }}>
        <SectionHeader num="Sección III" title={{ before: "", emphasis: "Color" }} />
        <ProseBlock>
          <p>
            Cinco familias de matices por modo, cada una a una saturación específica. Los componentes
            referencian <code>var(--ink)</code>, <code>var(--accent)</code>, nunca hexadecimales crudos.
          </p>
        </ProseBlock>

        <div style={{ marginTop: "var(--space-8)" }}>
          <Eyebrow>Modo editorial</Eyebrow>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "var(--space-4)",
            marginTop: "var(--space-5)",
          }}
        >
          {EDITORIAL_COLORS.map((c) => (
            <ColorSwatch key={c.token} token={c.token} hex={c.hex} mode="editorial" />
          ))}
        </div>

        <div style={{ marginTop: "var(--space-12)" }}>
          <Eyebrow>Modo producto</Eyebrow>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "var(--space-4)",
            marginTop: "var(--space-5)",
          }}
        >
          {PRODUCT_COLORS.map((c) => (
            <ColorSwatch key={c.token} token={c.token} hex={c.hex} mode="product" />
          ))}
        </div>
      </section>

      {/* SECTION — Tipografía */}
      <section id="tipografia" style={{ marginTop: "var(--space-20)", scrollMarginTop: "var(--space-12)" }}>
        <SectionHeader num="Sección IV" title={{ before: "", emphasis: "Tipografía" }} />
        <ProseBlock>
          <p>
            Tres tipografías con roles definidos. Fraunces es la voz —display, énfasis, encabezados—. Newsreader
            es el cuerpo del modo editorial. Geist Sans es el cuerpo del modo producto. JetBrains Mono aparece
            solo para etiquetas técnicas y código.
          </p>
        </ProseBlock>

        <div style={{ marginTop: "var(--space-8)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <div
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontVariationSettings: '"opsz" 144, "SOFT" 30',
              fontSize: "64px",
              lineHeight: 1,
              color: "var(--ink)",
              letterSpacing: "-0.025em",
            }}
          >
            Fraunces<span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100', fontStyle: "italic", color: "var(--accent)" }}> display</span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-newsreader), serif",
              fontSize: "19px",
              lineHeight: 1.55,
              color: "var(--ink-soft)",
              maxWidth: "560px",
            }}
          >
            Newsreader sostiene el cuerpo editorial. Una fuente serif moderna, con eje óptico, que lee como una
            revista bien impresa. Aparece en este párrafo a 19 píxeles, line-height 1.55.
          </div>
          <div
            style={{
              fontFamily: "var(--font-geist), system-ui, sans-serif",
              fontSize: "17px",
              lineHeight: 1.5,
              color: "var(--ink-soft)",
              maxWidth: "560px",
            }}
          >
            Geist Sans sostiene el cuerpo del producto. Una sans neutra, moderna, densa, pensada para
            interfaces. Notablemente no es Inter —que se sentiría genérica para un portafolio de design
            engineering—.
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono-vera), monospace",
              fontSize: "14px",
              lineHeight: 1.5,
              color: "var(--ink)",
              background: "var(--bg-2)",
              padding: "var(--space-3) var(--space-4)",
              maxWidth: "560px",
            }}
          >
            {`SELECT id, starts_at FROM bookings WHERE doctor_id = $1;`}
          </div>
        </div>

        <div style={{ marginTop: "var(--space-12)" }}>
          <Eyebrow>Escala tipográfica</Eyebrow>
        </div>
        <div style={{ marginTop: "var(--space-5)" }}>
          {TYPE_SCALE.map((t) => (
            <TypeSpecimen
              key={t.token}
              token={t.token}
              px={t.px}
              sample={t.sample}
              sampleStyle={
                t.token === "--text-display"
                  ? {
                      fontFamily: "var(--font-fraunces), serif",
                      fontVariationSettings: '"opsz" 144, "SOFT" 30',
                      lineHeight: 0.95,
                    }
                  : t.token === "--text-h1" || t.token === "--text-h2"
                    ? {
                        fontFamily: "var(--font-fraunces), serif",
                        fontVariationSettings: '"opsz" 72, "SOFT" 50',
                      }
                    : undefined
              }
            />
          ))}
        </div>
      </section>

      {/* SECTION — Espaciado */}
      <section id="espaciado" style={{ marginTop: "var(--space-20)", scrollMarginTop: "var(--space-12)" }}>
        <SectionHeader num="Sección V" title={{ before: "", emphasis: "Espaciado" }} />
        <ProseBlock>
          <p>
            Unidad base de cuatro píxeles. Los componentes referencian tokens nombrados, no valores crudos.
            <em> Inline</em> (entre elementos en línea) usa 4–12px. <em>Stacked</em> (entre hermanos) usa
            16–24px. Secciones usan 48–80px. Cubierta y márgenes muy generosos usan 96px y más.
          </p>
        </ProseBlock>
        <div style={{ marginTop: "var(--space-6)" }}>
          {SPACES.map((s) => (
            <SpacingBar key={s.token} token={s.token} px={s.px} />
          ))}
        </div>
      </section>

      {/* SECTION — Radios */}
      <section id="radios" style={{ marginTop: "var(--space-20)", scrollMarginTop: "var(--space-12)" }}>
        <SectionHeader num="Sección VI" title={{ before: "", emphasis: "Radios" }} />
        <ProseBlock>
          <p>
            El modo editorial usa casi sin radio —el silueteado angular es parte de su voz—. El modo producto
            usa radios gentiles para sentirse táctil. <code>--radius-pill</code> se reserva para badges.
          </p>
        </ProseBlock>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "var(--space-5)",
            marginTop: "var(--space-6)",
            padding: "var(--space-6) 0",
          }}
        >
          {RADII.map((r) => (
            <RadiusBox key={r.token} token={r.token} radius={r.radius} />
          ))}
        </div>
      </section>

      {/* SECTION — Elevación */}
      <section id="elevacion" style={{ marginTop: "var(--space-20)", scrollMarginTop: "var(--space-12)" }}>
        <SectionHeader num="Sección VII" title={{ before: "", emphasis: "Elevación" }} />
        <ProseBlock>
          <p>
            El modo editorial usa <strong>cero sombras</strong> —la profundidad se comunica con líneas y
            cambios de fondo—. El modo producto usa tres niveles cálidos.
          </p>
        </ProseBlock>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "var(--space-5)",
            marginTop: "var(--space-6)",
          }}
        >
          {SHADOWS.map((s) => (
            <ShadowCard key={s.token} token={s.token} shadow={s.shadow} />
          ))}
        </div>
      </section>

      {/* SECTION — Movimiento */}
      <section id="movimiento" style={{ marginTop: "var(--space-20)", scrollMarginTop: "var(--space-12)" }}>
        <SectionHeader num="Sección VIII" title={{ before: "", emphasis: "Movimiento" }} />
        <ProseBlock>
          <p>
            Lenguaje de movimiento restringido —rápido para utilidad, lento para atmósfera, nunca rebotando—.
            Las entradas son fundido + 8px de desplazamiento vertical. Las salidas son fundido solo. Hover es
            color u opacidad. Todo respeta <code>prefers-reduced-motion</code>.
          </p>
        </ProseBlock>
        <MotionSampler />
      </section>

      {/* SECTION — Iconografía */}
      <section id="iconografia" style={{ marginTop: "var(--space-20)", scrollMarginTop: "var(--space-12)" }}>
        <SectionHeader num="Sección IX" title={{ before: "", emphasis: "Iconografía" }} />
        <ProseBlock>
          <p>
            Lucide a 1.5px de stroke, 18px o 20px, color heredado (<code>currentColor</code>). Nunca como
            única señal de interacción —siempre acompañados de etiqueta, salvo en barras de herramientas con
            <code>aria-label</code>—.
          </p>
        </ProseBlock>
        <IconGrid />
      </section>

      {/* SECTION — Componentes */}
      <section id="componentes" style={{ marginTop: "var(--space-20)", scrollMarginTop: "var(--space-12)" }}>
        <SectionHeader num="Sección X" title={{ before: "", emphasis: "Componentes" }} />
        <ProseBlock>
          <p>
            Los componentes están etiquetados como <Badge tone="success">Implementado</Badge> cuando viven en el
            código que renderiza esta página, o como <Badge>Boceto</Badge> cuando su contrato visual está
            documentado pero su versión interactiva se construye en los prompts subsecuentes.
          </p>
        </ProseBlock>

        {/* ── Foundation ───────────────────────────────────────── */}
        <div style={{ marginTop: "var(--space-10)" }}>
          <Eyebrow>Foundation</Eyebrow>
        </div>

        <ComponentSample
          name="Button"
          status="implementado"
          description="Primary, secondary, ghost. Tres tamaños. Modo editorial sin radio, modo producto con --radius-sm."
        >
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
            <Button variant="primary">Reservar cita</Button>
            <Button variant="secondary">Cancelar</Button>
            <Button variant="ghost">Más opciones</Button>
            <Button variant="primary" size="sm">Sm</Button>
            <Button variant="primary" size="lg">Lg</Button>
          </div>
        </ComponentSample>

        <ComponentSample
          name="Input"
          status="implementado"
          description="Texto, email, teléfono. Borde inferior en modo editorial; borde completo en modo producto."
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: "320px" }}>
            <Label htmlFor="demo-input">Teléfono</Label>
            <Input id="demo-input" type="tel" placeholder="+52 · 55 · 1234 5678" />
          </div>
        </ComponentSample>

        <ComponentSample
          name="Label"
          status="implementado"
          description="Small caps Fraunces, tracking ancho, color muted. Usado como etiqueta de campo y de sección."
        >
          <Label>Próxima disponibilidad</Label>
        </ComponentSample>

        <ComponentSample
          name="Badge"
          status="implementado"
          description="Pill con tracking ancho. Estado, etiquetas y la cinta de demo."
        >
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <Badge>Demo · concepto</Badge>
            <Badge tone="success" dot>Confirmada</Badge>
            <Badge tone="warning" dot>Reagendada</Badge>
            <Badge tone="danger" dot>Cancelada</Badge>
          </div>
        </ComponentSample>

        <ComponentSample
          name="Sheet"
          status="boceto"
          description="Bottom-sheet en móvil, modal en desktop. Mismo componente, comportamiento responsivo."
        >
          <Sketch caption="Sheet · 90vh máx en móvil, max-w-md en desktop. Backdrop con backdrop-blur-sm." />
        </ComponentSample>

        <ComponentSample
          name="Toast"
          status="boceto"
          description="Top-right en desktop, top-center en móvil. Auto-dismiss a 4s."
        >
          <Sketch caption="Toast · success, info, error. Animado con framer-motion." />
        </ComponentSample>

        {/* ── Editorial-only ─────────────────────────────────── */}
        <div style={{ marginTop: "var(--space-10)" }}>
          <Eyebrow>Editorial</Eyebrow>
        </div>

        <ComponentSample
          name="Eyebrow"
          status="implementado"
          description="Etiqueta small caps en --accent con un subrayado del mismo color."
        >
          <Eyebrow>Sección de muestra</Eyebrow>
        </ComponentSample>

        <ComponentSample
          name="DropCap (Lede)"
          status="implementado"
          description="La inicial Fraunces 76px en --accent flota a la izquierda del párrafo de apertura."
        >
          <div style={{ maxWidth: "560px" }}>
            <p
              style={{
                fontFamily: "var(--font-newsreader), serif",
                fontSize: "20px",
                lineHeight: 1.45,
                color: "var(--ink)",
                margin: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontVariationSettings: '"opsz" 144, "SOFT" 50',
                  fontSize: "72px",
                  lineHeight: 0.85,
                  float: "left",
                  margin: "6px 12px 0 0",
                  color: "var(--accent)",
                }}
              >
                E
              </span>
              n una categoría donde la confianza es todo el producto, la calidad visual del perfil es la señal
              más fuerte que se puede transmitir. Tipografía, fotografía, espacio generoso.
            </p>
          </div>
        </ComponentSample>

        <ComponentSample
          name="PullQuote"
          status="implementado"
          description="Itálica Fraunces con un borde izquierdo en --accent. Atribución opcional en small caps."
        >
          <PullQuote attribution="Hipótesis de trabajo">
            El trabajo no es construir el producto correctamente. El trabajo es saber para qué es.
          </PullQuote>
        </ComponentSample>

        <ComponentSample
          name="Sidenote"
          status="implementado"
          description="Bloque con fondo --bg-2 y borde izquierdo --rule. Etiqueta italicizada en --accent."
        >
          <Sidenote label="Realidad operativa">
            La WhatsApp Business API requiere verificación de Meta y aprobación de plantillas. Hay que reservar
            dos semanas de margen para la primera aprobación.
          </Sidenote>
        </ComponentSample>

        <ComponentSample
          name="OrnamentRule"
          status="implementado"
          description="Divisor centrado de tres puntos. Reemplaza al hr estándar entre secciones."
        >
          <OrnamentRule />
        </ComponentSample>

        {/* ── Product-only ───────────────────────────────────── */}
        <div style={{ marginTop: "var(--space-10)" }}>
          <Eyebrow>Producto</Eyebrow>
        </div>

        <ComponentSample
          name="ProfileHero"
          status="boceto"
          description="Foto, nombre, especialidad, pill de próxima disponibilidad, CTA primario. Above the fold en /dra-sofia-ramirez."
        >
          <Sketch tall caption="ProfileHero · foto redondeada · nombre · especialidad · próxima disponibilidad · «Reservar cita»" />
        </ComponentSample>

        <ComponentSample
          name="ServiceCard"
          status="boceto"
          description="Nombre, duración · precio, descripción, CTA de reserva. Apilado en listas con altura consistente."
        >
          <Sketch caption="ServiceCard · Consulta inicial · 60 min · $1,200 · primera sesión con evaluación completa." />
        </ComponentSample>

        <ComponentSample
          name="DateStrip"
          status="boceto"
          description="Selector horizontal de fechas. Hoy resaltado con --accent. Días sin disponibilidad atenuados."
        >
          <Sketch caption="DateStrip · scroll horizontal · lun, mar, mié, jue · highlight en hoy" />
        </ComponentSample>

        <ComponentSample
          name="SlotList"
          status="boceto"
          description="Lista vertical de horarios disponibles. Tap selecciona; selección invierte el color."
        >
          <Sketch caption="SlotList · 09:00 · 10:00 · 11:00 · 14:00 · 15:00 — el seleccionado en --accent" />
        </ComponentSample>

        <ComponentSample
          name="BookingForm"
          status="boceto"
          description="Nombre, teléfono, email, nota opcional. Validación en línea, no en toast."
        >
          <Sketch caption="BookingForm · tres campos visibles + un opcional · botón --accent · sin crear cuenta" />
        </ComponentSample>

        <ComponentSample
          name="ConfirmationCard"
          status="boceto"
          description="Estado post-reserva. Servicio, fecha, hora, ubicación. «Agregar al calendario» + reagendar/cancelar."
        >
          <Sketch tall caption="ConfirmationCard · «Tu cita está confirmada» · detalles · acciones tokenizadas" />
        </ComponentSample>

        <ComponentSample
          name="WhatsAppPreview"
          status="boceto"
          description="La pieza central del portafolio. Marco de teléfono realista, bubble de mensaje, microcopy real."
        >
          <Sketch tall caption="WhatsAppPreview · status bar · header verde · burbuja · plantilla de confirmación o recordatorio" />
        </ComponentSample>

        <ComponentSample
          name="AppointmentRow"
          status="boceto"
          description="Hora, nombre, servicio, duración. Tap expande en línea revelando teléfono, nota, acciones."
        >
          <Sketch caption="AppointmentRow · 16:00 · Laura G. · Consulta inicial · 60 min" />
        </ComponentSample>

        <ComponentSample
          name="WeekCalendar"
          status="boceto"
          description="Grilla de 7 columnas y filas por hora. Slots reservados con fondo --accent-pale."
        >
          <Sketch tall caption="WeekCalendar · 7 cols · density visible en --accent-pale · bloqueados en --rule-soft" />
        </ComponentSample>

        <ComponentSample
          name="AvailabilityGrid"
          status="boceto"
          description="Variante editor del WeekCalendar. Toggle por celda para abrir o cerrar ventanas de disponibilidad."
        >
          <Sketch caption="AvailabilityGrid · tap para alternar · defaults lun–vie 09:00–18:00" />
        </ComponentSample>

        <ComponentSample
          name="NextSlotPill"
          status="boceto"
          description="Indicador persistente en el footer del panel: «Próximo hueco libre: jueves 11:00»."
        >
          <Sketch caption="NextSlotPill · --bg-2 · «Próximo hueco libre: jueves 11:00» — texto en --accent" />
        </ComponentSample>

        <ComponentSample
          name="BlockTimeSheet"
          status="boceto"
          description="Selector de rango + razón opcional. Muestra reservas afectadas con un mensaje WhatsApp pre-escrito por cada una."
        >
          <Sketch caption="BlockTimeSheet · rango · razón interna · lista de citas afectadas con borrador de aviso" />
        </ComponentSample>

        <ComponentSample
          name="DemoRibbon"
          status="boceto"
          description="Indicador persistente en la esquina. Tappable, abre una hoja explicando qué es real y qué es artefacto."
        >
          <Sketch caption="DemoRibbon · esquina inferior · «Demo · concepto» · sheet on-tap" />
        </ComponentSample>

        <ComponentSample
          name="ModePicker"
          status="implementado"
          description="En la landing: las dos CTA «Ver como doctora» / «Ver como paciente». Lado a lado en desktop."
        >
          <Sketch caption="ModePicker · ver el componente vivo en /projects/vera" />
        </ComponentSample>
      </section>

      {/* SECTION — Layout */}
      <section id="layout" style={{ marginTop: "var(--space-20)", scrollMarginTop: "var(--space-12)" }}>
        <SectionHeader num="Sección XI" title={{ before: "", emphasis: "Layout", after: " & páginas" }} />
        <ProseBlock>
          <p>
            La página editorial mantiene una columna única de 680px, centrada, con un padding generoso arriba.
            La página de producto usa 720px y densidad mayor —menos whitespace vertical, encabezados más
            pequeños sin floreos de itálica, fondo sólido sin grano—.
          </p>
        </ProseBlock>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "var(--space-5)",
            marginTop: "var(--space-6)",
          }}
        >
          <div
            style={{
              padding: "var(--space-6)",
              background: "var(--bg-2)",
              border: "1px solid var(--rule-soft)",
              fontFamily: "var(--font-mono-vera), monospace",
              fontSize: "12px",
              lineHeight: 1.6,
              color: "var(--ink-soft)",
              whiteSpace: "pre",
            }}
          >
{`Editorial · max-prose 680px
┌────────────────────────┐
│ meta · left  meta · rt │
│                        │
│ EYEBROW                │
│                        │
│ Title with             │
│ italic emphasis.       │
│                        │
│ Deck in italic.        │
│                        │
│ ─────────────────────  │
│ foot · italic · muted  │
└────────────────────────┘`}
          </div>
          <div
            style={{
              padding: "var(--space-6)",
              background: "var(--bg-2)",
              border: "1px solid var(--rule-soft)",
              fontFamily: "var(--font-mono-vera), monospace",
              fontSize: "12px",
              lineHeight: 1.6,
              color: "var(--ink-soft)",
              whiteSpace: "pre",
            }}
          >
{`Producto · max-product 720px
┌────────────────────────┐
│ Sticky header          │
│                        │
│ ProfileHero            │
│                        │
│ ServiceCard            │
│ ServiceCard            │
│                        │
│ NextSlotPill (sticky)  │
└────────────────────────┘`}
          </div>
        </div>
      </section>

      {/* SECTION — Lo que el sistema no es */}
      <section id="no-es" style={{ marginTop: "var(--space-20)", scrollMarginTop: "var(--space-12)" }}>
        <SectionHeader num="Sección XII" title={{ before: "Lo que el sistema ", emphasis: "no es", after: "." }} />
        <ProseBlock>
          <p>
            La lista corta de elecciones que romperían el sistema. Cada vez que el producto crece, la primera
            pregunta es: ¿estamos a punto de hacer una de estas?
          </p>
        </ProseBlock>
        <ol
          style={{
            listStyle: "none",
            counterReset: "dont",
            padding: 0,
            margin: "var(--space-6) 0 0",
          }}
        >
          {DONTS.map((d, idx) => (
            <li
              key={idx}
              style={{
                counterIncrement: "dont",
                padding: "var(--space-4) 0 var(--space-4) var(--space-10)",
                borderBottom: idx === DONTS.length - 1 ? "none" : "1px solid var(--rule-soft)",
                position: "relative",
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontSize: "17px",
                lineHeight: 1.5,
                color: "var(--ink-soft)",
              }}
            >
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  top: "var(--space-4)",
                  fontFamily: "var(--font-fraunces), serif",
                  fontVariationSettings: '"opsz" 9, "SOFT" 0',
                  fontWeight: 500,
                  fontSize: "12px",
                  letterSpacing: "0.12em",
                  color: "var(--accent)",
                }}
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
              {d.do_}{" "}
              <em style={{ color: "var(--ink)" }}>{d.say}</em>. {d.note}
            </li>
          ))}
        </ol>
      </section>

      <Colophon>
        Documentación viva. Cambia con el código. Set in Fraunces, Newsreader y Geist Sans. Quinto documento de
        la serie · Mayo 2026.
      </Colophon>
    </PageShell>
  );
}
