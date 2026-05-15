import type { Metadata } from "next";
import Link from "next/link";
import {
  Check, X as IconX,
} from "lucide-react";

import { PageShell } from "../_components/PageShell";
import { TopNav } from "../_components/marketing/TopNav";
import { MarketingFooter } from "../_components/marketing/MarketingFooter";
import { MarketingHero } from "../_components/marketing/MarketingHero";

import { SideNav, type NavItem } from "../_components/sistema/SideNav";
import { ColorGrid, type ColorGroup } from "../_components/sistema/ColorGrid";
import { ThemeWrapper } from "../_components/sistema/ThemeWrapper";
import { SurfaceLayers } from "../_components/sistema/SurfaceLayers";
import { ShadowSamples } from "../_components/sistema/ShadowSamples";
import { TypeScale } from "../_components/sistema/TypeScale";
import { WeightSamples } from "../_components/sistema/WeightSamples";
import { MonoSample } from "../_components/sistema/MonoSample";
import { SpacingBars } from "../_components/sistema/SpacingBar";
import { RadiusGrid } from "../_components/sistema/RadiusGrid";
import { MotionSampler } from "../_components/sistema/MotionSampler";
import { MicroInteractionDemo } from "../_components/sistema/MicroInteractionDemo";
import { IconGrid } from "../_components/sistema/IconGrid";
import { ComponentSample } from "../_components/sistema/ComponentSample";
import { PatternDiagram } from "../_components/sistema/PatternDiagram";
import { ReferenceTable } from "../_components/sistema/ReferenceTable";

import { Button } from "../_components/ui/Button";
import { Input } from "../_components/ui/Input";
import { Label } from "../_components/ui/Label";
import { Badge } from "../_components/ui/Badge";
import { IconButton } from "../_components/ui/IconButton";
import { ThemeToggle } from "../_components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: "Sistema · Vera",
  description:
    "Tokens, tipografía, componentes y patrones. La fuente de verdad del sistema de diseño Vera v0.3.",
};

const NAV: NavItem[] = [
  { id: "referencias",      label: "Referencias",      num: "I" },
  { id: "color",            label: "Color",            num: "II" },
  { id: "superficies",      label: "Superficies",      num: "III" },
  { id: "tipografia",       label: "Tipografía",       num: "IV" },
  { id: "espaciado",        label: "Espaciado",        num: "V" },
  { id: "radios",           label: "Radios",           num: "VI" },
  { id: "movimiento",       label: "Movimiento",       num: "VII" },
  { id: "microinteracciones", label: "Microinteracciones", num: "VIII" },
  { id: "iconografia",      label: "Iconografía",      num: "IX" },
  { id: "componentes",      label: "Componentes",      num: "X" },
  { id: "patrones",         label: "Patrones",         num: "XI" },
  { id: "accesibilidad",    label: "Accesibilidad",    num: "XII" },
  { id: "no-es",            label: "Lo que no es",     num: "XIII" },
];

/* Color palette data — light mode (the dark variant is rendered via ThemeWrapper). */
const COLOR_GROUPS: ColorGroup[] = [
  {
    label: "Superficies",
    swatches: [
      { token: "--bg",          oklch: "oklch(0.985 0.002 250)", hex: "#FAFAFB" },
      { token: "--bg-raised",   oklch: "oklch(1.000 0 0)",       hex: "#FFFFFF" },
      { token: "--bg-sunken",   oklch: "oklch(0.965 0.003 250)", hex: "#F3F4F5" },
      { token: "--bg-overlay",  oklch: "oklch(0.995 0.001 250)", hex: "#FCFCFD" },
    ],
  },
  {
    label: "Ink",
    swatches: [
      { token: "--ink",       oklch: "oklch(0.18 0.005 250)", hex: "#16181C" },
      { token: "--ink-soft",  oklch: "oklch(0.32 0.005 250)", hex: "#2E3239" },
      { token: "--ink-faint", oklch: "oklch(0.48 0.005 250)", hex: "#545962" },
      { token: "--muted",     oklch: "oklch(0.58 0.005 250)", hex: "#717680" },
    ],
  },
  {
    label: "Líneas",
    swatches: [
      { token: "--rule",        oklch: "oklch(0.92 0.003 250)", hex: "#E5E6E8" },
      { token: "--rule-strong", oklch: "oklch(0.85 0.005 250)", hex: "#D2D4D7" },
      { token: "--rule-faint",  oklch: "oklch(0.95 0.003 250)", hex: "#EFF0F1" },
    ],
  },
  {
    label: "Acento",
    swatches: [
      { token: "--accent",      oklch: "oklch(0.52 0.17 32)",  hex: "#A6402F" },
      { token: "--accent-soft", oklch: "oklch(0.62 0.15 32)",  hex: "#C46550" },
      { token: "--accent-pale", oklch: "oklch(0.94 0.025 32)", hex: "#F5E8E3" },
      { token: "--accent-ink",  oklch: "oklch(0.99 0.005 32)", hex: "#FCFAF9" },
    ],
  },
  {
    label: "Semántica",
    swatches: [
      { token: "--success", oklch: "oklch(0.58 0.13 150)", hex: "#4E8B5C" },
      { token: "--warning", oklch: "oklch(0.72 0.14 75)",  hex: "#BE9028" },
      { token: "--danger",  oklch: "oklch(0.55 0.20 27)",  hex: "#B33B26" },
    ],
  },
];

const DARK_COLOR_GROUPS: ColorGroup[] = [
  {
    label: "Superficies",
    swatches: [
      { token: "--bg",          oklch: "oklch(0.17 0.005 250)", hex: "#1B1D21" },
      { token: "--bg-raised",   oklch: "oklch(0.21 0.005 250)", hex: "#25272B" },
      { token: "--bg-sunken",   oklch: "oklch(0.14 0.005 250)", hex: "#16181B" },
      { token: "--bg-overlay",  oklch: "oklch(0.24 0.005 250)", hex: "#2C2E33" },
    ],
  },
  {
    label: "Ink",
    swatches: [
      { token: "--ink",       oklch: "oklch(0.96 0.003 250)", hex: "#F2F3F5" },
      { token: "--ink-soft",  oklch: "oklch(0.82 0.003 250)", hex: "#CFD0D3" },
      { token: "--ink-faint", oklch: "oklch(0.65 0.005 250)", hex: "#9CA0A6" },
      { token: "--muted",     oklch: "oklch(0.55 0.005 250)", hex: "#7C808A" },
    ],
  },
  {
    label: "Líneas",
    swatches: [
      { token: "--rule",        oklch: "oklch(0.28 0.005 250)", hex: "#3D4045" },
      { token: "--rule-strong", oklch: "oklch(0.38 0.005 250)", hex: "#55585E" },
      { token: "--rule-faint",  oklch: "oklch(0.22 0.005 250)", hex: "#2D2F33" },
    ],
  },
  {
    label: "Acento",
    swatches: [
      { token: "--accent",      oklch: "oklch(0.68 0.17 32)", hex: "#D87560" },
      { token: "--accent-soft", oklch: "oklch(0.58 0.15 32)", hex: "#B85F4A" },
      { token: "--accent-pale", oklch: "oklch(0.30 0.05 32)", hex: "#4A2A23" },
      { token: "--accent-ink",  oklch: "oklch(0.12 0.005 32)", hex: "#1A1614" },
    ],
  },
  {
    label: "Semántica",
    swatches: [
      { token: "--success", oklch: "oklch(0.72 0.13 150)", hex: "#7FB088" },
      { token: "--warning", oklch: "oklch(0.80 0.14 75)",  hex: "#D9B056" },
      { token: "--danger",  oklch: "oklch(0.70 0.20 27)",  hex: "#D86A52" },
    ],
  },
];

const DONTS = [
  "introducir tipografías adicionales — dos es el techo",
  "agregar gradientes — los productos premium los ganan, no los toman",
  "usar iconos sin etiqueta en flujos de producto",
  "usar serif en cualquier lugar del producto",
  "usar itálica en display — lee editorial",
  "introducir azul, verde o morado como colores primarios",
  "usar emoji en copy de producto",
  "replicar componentes de davhera.com — construir fresco dentro del scope",
  "usar negro puro o blanco puro (excepto --bg-raised en modo claro)",
  "shipear solo modo claro — ambos son de primera clase",
  "usar sombras en cards en modo claro — el contraste de superficie es suficiente",
  "usar ease-in-out del navegador — usa los easings nombrados",
  "escribir copy de marketing en estilo ensayo",
  "agregar overlays de grano, drop caps, pull quotes — toda decoración editorial",
];

const A11Y = [
  "Focus rings visibles en todos los elementos interactivos",
  "Contraste mínimo AA contra la superficie correspondiente; AAA para --ink sobre --bg",
  "Tap targets mínimo 44×44px en touch",
  "HTML semántico — <button>, <nav>, <main>",
  "Skip-to-content link en todas las plantillas de página",
  "Las etiquetas de formulario nunca se reemplazan por placeholders solos",
  "aria-label en todos los botones icon-only",
  "aria-live=\"polite\" en regiones de toast",
  "Focus trap en sheets, dialogs, drawers — retorna foco al trigger al desmontar",
  "ESC cierra todos los overlays",
  "prefers-reduced-motion respetado en todo el sistema",
  "El color nunca es la única señal — siempre acompañado de texto o icono",
  "Ambos temas cumplen mínimos de contraste de manera independiente",
];

const H2 = ({ id, num, children }: { id: string; num: string; children: React.ReactNode }) => (
  <div
    id={id}
    style={{
      display: "flex",
      alignItems: "baseline",
      gap: "var(--space-4)",
      paddingBottom: "var(--space-4)",
      borderBottom: "1px solid var(--rule)",
      marginBottom: "var(--space-6)",
      scrollMarginTop: "var(--space-16)",
    }}
  >
    <span
      style={{
        fontFamily: "var(--font-geist-mono), monospace",
        fontSize: "var(--text-sm)",
        color: "var(--accent)",
        letterSpacing: "var(--tracking-wider)",
      }}
    >
      {num}
    </span>
    <h2
      style={{
        fontSize: "var(--text-3xl)",
        fontWeight: 600,
        letterSpacing: "var(--tracking-snug)",
        color: "var(--ink)",
        margin: 0,
      }}
    >
      {children}
    </h2>
  </div>
);

const Intro = ({ children }: { children: React.ReactNode }) => (
  <p
    style={{
      fontSize: "var(--text-md)",
      color: "var(--ink-soft)",
      lineHeight: "var(--leading-normal)",
      margin: "0 0 var(--space-6)",
      maxWidth: "var(--max-content)",
    }}
  >
    {children}
  </p>
);

const SubLabel = ({ children }: { children: React.ReactNode }) => (
  <h3
    style={{
      fontSize: "var(--text-md)",
      fontWeight: 600,
      color: "var(--ink)",
      margin: "var(--space-6) 0 var(--space-4)",
    }}
  >
    {children}
  </h3>
);

export default function VeraSistema() {
  return (
    <>
      <TopNav />
      <PageShell width="wide">
        <MarketingHero
          eyebrow="Sistema de diseño · v0.3"
          title="El sistema completo."
          body="Tokens, tipografía, componentes y patrones. Renderizado en vivo desde el código. Cambia con el sistema."
          actions={
            <div
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "var(--text-xs)",
                color: "var(--muted)",
                letterSpacing: "var(--tracking-widest)",
                textTransform: "uppercase",
              }}
            >
              Light & Dark · v0.3 — Premium Product
            </div>
          }
        />

        {/* Two-column layout — sticky nav left, content right */}
        <div
          className="vera-sistema-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-12)",
            paddingTop: "var(--space-8)",
          }}
        >
          <aside className="vera-sistema-nav">
            <SideNav items={NAV} />
          </aside>

          <main
            style={{
              minWidth: 0,
              maxWidth: "var(--max-content)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-16)",
            }}
          >
            {/* I — Referencias */}
            <section>
              <H2 id="referencias" num="I">Las referencias.</H2>
              <Intro>
                El bar. Los productos contra los que este sistema se mide, con la contribución específica de cada uno.
              </Intro>
              <ReferenceTable />
            </section>

            {/* II — Color */}
            <section>
              <H2 id="color" num="II">Color.</H2>
              <Intro>
                Todos los colores se definen en OKLCH para uniformidad perceptual entre temas. El acento es un solo color —
                terracota — usado con disciplina: máximo tres elementos por viewport.
              </Intro>
              <SubLabel>Modo claro</SubLabel>
              <ColorGrid groups={COLOR_GROUPS} />
              <SubLabel>Modo oscuro</SubLabel>
              <Intro>
                Los swatches de abajo aplican <code style={{ fontFamily: "var(--font-geist-mono), monospace" }}>.theme-dark</code> localmente, así puedes verlos en su valor oscuro
                sin cambiar el tema de la página.
              </Intro>
              <ThemeWrapper theme="dark" style={{ padding: "var(--space-5)", border: "1px solid var(--rule)" }}>
                <ColorGrid groups={DARK_COLOR_GROUPS} />
              </ThemeWrapper>
            </section>

            {/* III — Superficies */}
            <section>
              <H2 id="superficies" num="III">Superficies y elevación.</H2>
              <Intro>
                El sistema de superficies es la identidad visual primaria. La profundidad viene del contraste entre
                <code style={{ fontFamily: "var(--font-geist-mono), monospace" }}> --bg</code> y
                <code style={{ fontFamily: "var(--font-geist-mono), monospace" }}> --bg-raised</code>, no de sombras.
              </Intro>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "var(--space-4)",
                }}
                className="vera-surface-grid"
              >
                <SurfaceLayers />
                <ThemeWrapper theme="dark" style={{ padding: "var(--space-1)" }}>
                  <SurfaceLayers />
                </ThemeWrapper>
              </div>
              <SubLabel>Sombras (solo modo producto, superficies flotantes)</SubLabel>
              <ShadowSamples />
            </section>

            {/* IV — Tipografía */}
            <section>
              <H2 id="tipografia" num="IV">Tipografía.</H2>
              <Intro>
                Dos tipografías. Geist Sans para todo: UI, marketing, contenido. Geist Mono para numéricos, código y
                contenido técnico. La jerarquía se construye con peso, tamaño y tracking.
              </Intro>
              <SubLabel>Tipo display</SubLabel>
              <div
                style={{
                  fontSize: "clamp(48px, 9vw, 80px)",
                  fontWeight: 600,
                  letterSpacing: "var(--tracking-tight)",
                  lineHeight: 1.05,
                  color: "var(--ink)",
                  margin: "var(--space-4) 0 var(--space-8)",
                }}
              >
                Reservas para profesionales independientes.
              </div>
              <SubLabel>Escala de tipos</SubLabel>
              <TypeScale />
              <SubLabel>Pesos</SubLabel>
              <WeightSamples />
              <SubLabel>Mono</SubLabel>
              <MonoSample />
            </section>

            {/* V — Espaciado */}
            <section>
              <H2 id="espaciado" num="V">Espaciado.</H2>
              <Intro>
                Unidad base de 4 píxeles. Los componentes referencian tokens nombrados, nunca valores crudos. Las
                superficies de producto premium son más densas que las editoriales — el whitespace es para momentos.
              </Intro>
              <SpacingBars />
            </section>

            {/* VI — Radios */}
            <section>
              <H2 id="radios" num="VI">Radios.</H2>
              <Intro>
                Cinco valores. No hay <code style={{ fontFamily: "var(--font-geist-mono), monospace" }}>--radius-none</code> —
                todo en este sistema tiene al menos un radio sutil. Ángulos rectos leen utilitario.
              </Intro>
              <RadiusGrid />
            </section>

            {/* VII — Movimiento */}
            <section>
              <H2 id="movimiento" num="VII">Movimiento.</H2>
              <Intro>
                Snap-tight. Linear es la referencia. Cada interacción se completa antes de que termines de pensarla.
              </Intro>
              <MotionSampler />
            </section>

            {/* VIII — Microinteracciones */}
            <section>
              <H2 id="microinteracciones" num="VIII">Microinteracciones.</H2>
              <Intro>
                Los detalles que separan «bien diseñado» de «se siente premium». Focus rings, selección, scrollbars,
                skeletons.
              </Intro>
              <MicroInteractionDemo />
            </section>

            {/* IX — Iconografía */}
            <section>
              <H2 id="iconografia" num="IX">Iconografía.</H2>
              <Intro>
                Lucide a 1.5px de stroke. 20px standalone es el default; 16px y 24px para inline y prominent. Color
                heredado, nunca como única señal de interacción.
              </Intro>
              <IconGrid />
            </section>

            {/* X — Componentes */}
            <section>
              <H2 id="componentes" num="X">Componentes.</H2>
              <Intro>
                Marcados como <Badge tone="success" dot>Implementado</Badge> cuando viven en el código que renderiza esta
                página, o como <Badge>Boceto</Badge> cuando solo está documentado su contrato visual.
              </Intro>

              <SubLabel>Foundation</SubLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <ComponentSample
                  name="Button"
                  status="implementado"
                  description="Primary, secondary, ghost, destructive. Tamaños xs / sm / md / lg."
                >
                  <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
                    <Button>Reservar cita</Button>
                    <Button variant="secondary">Cancelar</Button>
                    <Button variant="ghost">Más opciones</Button>
                    <Button variant="destructive">Eliminar</Button>
                    <Button size="sm">Sm</Button>
                    <Button size="lg">Lg</Button>
                  </div>
                </ComponentSample>

                <ComponentSample
                  name="IconButton"
                  status="implementado"
                  description="Botón icon-only con aria-label requerido. Tamaños xs / sm / md."
                >
                  <div style={{ display: "flex", gap: "var(--space-2)" }}>
                    <IconButton aria-label="Buscar">
                      <Check size={16} strokeWidth={1.75} />
                    </IconButton>
                    <ThemeToggle />
                  </div>
                </ComponentSample>

                <ComponentSample
                  name="Input + Label"
                  status="implementado"
                  description="Border completo, focus shifts to --accent, focus ring aparece."
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: "320px" }}>
                    <Label htmlFor="vera-sample-input">Teléfono</Label>
                    <Input id="vera-sample-input" type="tel" placeholder="+52 · 55 · 1234 5678" />
                  </div>
                </ComponentSample>

                <ComponentSample
                  name="Badge"
                  status="implementado"
                  description="Pill con tracking ancho. Variantes neutral, accent, success, warning, danger."
                >
                  <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                    <Badge>Neutral</Badge>
                    <Badge tone="accent">Acento</Badge>
                    <Badge tone="success" dot>Confirmada</Badge>
                    <Badge tone="warning" dot>Reagendada</Badge>
                    <Badge tone="danger" dot>Cancelada</Badge>
                  </div>
                </ComponentSample>

                <ComponentSample
                  name="Sheet · Dialog · Drawer"
                  status="boceto"
                  description="Bottom-sheet en móvil, modal centrado en desktop. Backdrop con blur."
                >
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--ink-soft)" }}>
                    Boceto · spec en design-system-v3.md §14, se implementa cuando lo requiera la superficie de producto.
                  </div>
                </ComponentSample>

                <ComponentSample
                  name="Toast · Tooltip · Popover · Menu"
                  status="boceto"
                  description="Superficies flotantes con --bg-overlay, --shadow-md, microinteractions cuidadas."
                >
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--ink-soft)" }}>
                    Boceto · se construyen en los prompts de panel y onboarding.
                  </div>
                </ComponentSample>

                <ComponentSample
                  name="Kbd"
                  status="implementado"
                  description="Indicador de tecla. Geist Mono, --bg-sunken, --rule border."
                >
                  <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                    {["⌘", "K"].map((k) => (
                      <span
                        key={k}
                        style={{
                          fontFamily: "var(--font-geist-mono), monospace",
                          fontSize: "var(--text-2xs)",
                          padding: "2px 6px",
                          background: "var(--bg-sunken)",
                          border: "1px solid var(--rule)",
                          borderRadius: "var(--radius-xs)",
                          color: "var(--ink)",
                        }}
                      >
                        {k}
                      </span>
                    ))}
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--ink-soft)", marginLeft: "var(--space-2)" }}>
                      abre el command palette
                    </span>
                  </div>
                </ComponentSample>
              </div>

              <SubLabel>Producto · superficie de reserva</SubLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <ComponentSample
                  name="ServiceCard"
                  status="boceto"
                  description="Nombre, duración · precio, descripción, chevron afford."
                >
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--ink-soft)" }}>
                    Renderiza en la superficie pública del paciente. Spec viva en design-system-v3.md §14.
                  </div>
                </ComponentSample>
                <ComponentSample
                  name="DateStrip · SlotList · BookingForm · ConfirmationCard"
                  status="boceto"
                  description="Componentes del flujo de reserva. Selected state invierte color al --accent."
                >
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--ink-soft)" }}>
                    Bocetos · construir junto con la superficie de paciente.
                  </div>
                </ComponentSample>
                <ComponentSample
                  name="WhatsAppPreview"
                  status="boceto"
                  description="La pieza central del portafolio. Marco de iPhone, header verde de WhatsApp, burbujas de mensaje."
                >
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--ink-soft)" }}>
                    Tres variantes: confirmación, recordatorio, reagendamiento. Spec en design-system-v3.md §14.
                  </div>
                </ComponentSample>
              </div>

              <SubLabel>Producto · superficie de doctora</SubLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <ComponentSample
                  name="AppointmentRow · WeekCalendar · AvailabilityGrid"
                  status="boceto"
                  description="Los componentes del panel. Compact-density por defecto."
                >
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--ink-soft)" }}>
                    Bocetos · viven en /panel cuando esa superficie se construya.
                  </div>
                </ComponentSample>
                <ComponentSample
                  name="NextSlotPill"
                  status="boceto"
                  description="Indicador persistente en el footer: «Próximo hueco libre: jueves 11:00»."
                >
                  <div
                    style={{
                      display: "inline-flex",
                      gap: "var(--space-2)",
                      padding: "var(--space-2) var(--space-3)",
                      background: "var(--bg-sunken)",
                      borderRadius: "var(--radius-pill)",
                      fontSize: "var(--text-sm)",
                      color: "var(--ink-soft)",
                    }}
                  >
                    Próximo hueco libre:
                    <span
                      style={{
                        color: "var(--accent)",
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontWeight: 500,
                      }}
                    >
                      jueves 11:00
                    </span>
                  </div>
                </ComponentSample>
              </div>

              <SubLabel>Marketing &amp; meta</SubLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <ComponentSample
                  name="MarketingHero · FeatureBlock"
                  status="implementado"
                  description="Compuestos de marketing. Densidad comfortable, hero scale clamp(48–80px)."
                >
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--ink-soft)" }}>
                    Vivos en /projects/vera y /projects/vera/sobre.
                  </div>
                </ComponentSample>
                <ComponentSample
                  name="ModePicker"
                  status="implementado"
                  description="«Como paciente / Como doctora» — dos cards lado a lado en desktop, apiladas en móvil."
                >
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--ink-soft)" }}>
                    Vivo en el landing. Hover lifts border to --accent.
                  </div>
                </ComponentSample>
                <ComponentSample
                  name="ThemeToggle"
                  status="implementado"
                  description="Ciclo light → dark → auto. Persiste a localStorage. Sin FOUC gracias al script inline."
                >
                  <ThemeToggle />
                </ComponentSample>
              </div>
            </section>

            {/* XI — Patrones */}
            <section>
              <H2 id="patrones" num="XI">Patrones.</H2>
              <Intro>Composiciones consistentes entre superficies.</Intro>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <PatternDiagram
                  title="Header de página"
                  caption="Sticky on scroll. Transparente arriba; aplica --bg/0.8 + backdrop-blur después de 40px. Border-bottom aparece simultáneamente."
                >
                  <pre
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "var(--text-xs)",
                      color: "var(--ink-soft)",
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
{`┌──────────────────────────────────────┐
│ Vera   Sobre  Sistema  ☼   Reservar  │   ← transparente arriba
└──────────────────────────────────────┘
        ↓ scroll > 40px
┌──────────────────────────────────────┐
│ Vera   Sobre  Sistema  ☼   Reservar  │   ← bg/0.8 + blur
└──────────────────────────────────────┘`}
                  </pre>
                </PatternDiagram>
                <PatternDiagram
                  title="Sheet / Modal"
                  caption="Móvil < 768px: bottom-sheet con drag handle, 90vh máx, drag-to-dismiss. Desktop ≥ 768px: modal centrado, max-w varía sm/md/lg."
                >
                  <pre
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "var(--text-xs)",
                      color: "var(--ink-soft)",
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
{`Móvil:                        Desktop:
┌────────────┐                ┌──────────────────┐
│            │                │     ┌──────┐     │
│            │                │     │ modal│     │
│            │                │     └──────┘     │
│ ━━━━━━━━━━ │  ← handle      │                  │
│ ▼ Sheet ▼  │                │                  │
└────────────┘                └──────────────────┘`}
                  </pre>
                </PatternDiagram>
                <PatternDiagram
                  title="Densidad"
                  caption="Compact por defecto en superficies de producto. .density-comfortable se aplica al hero del landing, al onboarding y a la pantalla de celebración."
                >
                  <pre
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "var(--text-xs)",
                      color: "var(--ink-soft)",
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
{`compact:        --row-height-base: 40px · --field-height-base: 36px
comfortable:    --row-height-base: 48px · --field-height-base: 44px`}
                  </pre>
                </PatternDiagram>
              </div>
            </section>

            {/* XII — Accesibilidad */}
            <section>
              <H2 id="accesibilidad" num="XII">Accesibilidad.</H2>
              <Intro>Baseline no negociable. Verificado independientemente para ambos temas.</Intro>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {A11Y.map((item, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "var(--space-3)",
                      fontSize: "var(--text-md)",
                      lineHeight: 1.5,
                      color: "var(--ink)",
                    }}
                  >
                    <span style={{ paddingTop: "3px", color: "var(--success)", flexShrink: 0 }}>
                      <Check size={16} strokeWidth={2} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* XIII — Lo que el sistema no es */}
            <section>
              <H2 id="no-es" num="XIII">Lo que el sistema no es.</H2>
              <Intro>
                La lista corta de elecciones que romperían el sistema. Cada vez que el producto crece, la primera pregunta
                es: ¿estamos a punto de hacer una de estas?
              </Intro>
              <ol
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  counterReset: "dont",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-2_5)",
                }}
              >
                {DONTS.map((d, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "24px 24px 1fr",
                      gap: "var(--space-3)",
                      alignItems: "baseline",
                      padding: "var(--space-3) 0",
                      borderBottom: idx === DONTS.length - 1 ? "none" : "1px solid var(--rule-faint)",
                      fontSize: "var(--text-md)",
                      lineHeight: 1.5,
                      color: "var(--ink)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontSize: "var(--text-xs)",
                        color: "var(--muted)",
                      }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span style={{ paddingTop: "3px", color: "var(--danger)" }}>
                      <IconX size={16} strokeWidth={2} />
                    </span>
                    <span><strong style={{ color: "var(--ink)", fontWeight: 600 }}>No</strong> {d}.</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Closing colophon */}
            <section
              style={{
                marginTop: "var(--space-12)",
                paddingTop: "var(--space-8)",
                borderTop: "1px solid var(--rule)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--space-3)",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--muted)",
                }}
              >
                Documentación viva. Cambia con el código.
              </span>
              <span
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "var(--text-xs)",
                  color: "var(--muted)",
                  letterSpacing: "var(--tracking-wider)",
                }}
              >
                v0.3 (Premium Product) · v0.2 (Dark mode) · v0.1 (inicial)
              </span>
              <Link
                href="/projects/vera"
                style={{
                  marginTop: "var(--space-4)",
                  fontSize: "var(--text-sm)",
                  color: "var(--accent)",
                }}
              >
                ← Volver al landing
              </Link>
            </section>
          </main>
        </div>

        <MarketingFooter />

        <style>{`
          @media (min-width: 1024px) {
            .vera-sistema-layout {
              grid-template-columns: 220px minmax(0, 1fr) !important;
              gap: var(--space-12);
            }
          }
          @media (max-width: 1023px) {
            .vera-sistema-nav { display: none; }
          }
          @media (min-width: 640px) {
            .vera-surface-grid { grid-template-columns: 1fr 1fr !important; }
          }
        `}</style>
      </PageShell>
    </>
  );
}
