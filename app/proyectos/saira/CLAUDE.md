# Saira Demo · Project Context

## Qué es

Prototipo demo (Wave 1) de un sitio de reservas directas para **Saira Ecotour**
(Rio de Janeiro). Sin backend real. Dirigido a una stakeholder única (Saraí,
dueña de Saira) para mostrarle cómo se vería su sitio reemplazando plataformas
intermediarias.

Vive 100% bajo `/app/proyectos/saira/*` dentro del repo `davhera`. NO comparte
componentes, tokens ni layout con el resto del portafolio.

## Stack

- Next.js **16.2.1** (App Router · `params` async)
- React 19.2.4
- TypeScript 5 (strict, sin `any`)
- Tailwind v4 (CSS-first, sin `tailwind.config.ts`) — Saira no extiende el
  theme global; usa CSS puro con tokens scopeados a `.saira`
- next-intl **4.12.x** (API v4: `defineRouting` + `requestLocale`)
- Framer Motion 12 · Lucide React · date-fns 4

## Estructura del proyecto

```
app/proyectos/saira/
  [locale]/          ← se crea en M4. Layout y page viven aquí.
    layout.tsx
    page.tsx
  lib/
    fonts.ts
    i18n/{routing,navigation,request}.ts
  styles/
    tokens.css       ← variables scopeadas a `.saira`
    base.css         ← reset y defaults dentro de `.saira`
    components.css   ← estilos de los componentes Saira
  CLAUDE.md          ← este archivo

components/saira/
  header/{Header,LanguageSwitcher,SairaLogo}.tsx
  footer/Footer.tsx
  landing/{Hero,FeaturedTours,ValueProp}.tsx
  tour/{TourCard,DifficultyPill}.tsx

lib/saira/
  types.ts · tours.ts · format.ts · index.ts

messages/
  pt.json  ← fuente de verdad
  es.json  ← traducción (LatAm, sesgo MX)
  en.json  ← traducción (US, conciso)

public/saira/
  hero/{poster.jpg, reel-mobile.{mp4,webm}, reel-desktop.{mp4,webm}}
  tours/{slug}/...

middleware.ts        ← raíz, scopeado a `/proyectos/saira/:path*`
next.config.ts       ← envuelto con `withNextIntl(...)`
```

## Convenciones

- **Aislamiento**: nada fuera de `/app/proyectos/saira/`, `/components/saira/`,
  `/lib/saira/`, `/messages/`, `/public/saira/`. Excepciones controladas:
  `middleware.ts`, `next.config.ts`, `package.json`.
- **Naming**: kebab-case para archivos, PascalCase para componentes React,
  camelCase para funciones/variables.
- **Idioma fuente**: pt-BR. Cuando se agrega una key nueva: primero en
  `pt.json`, después en `es.json` y `en.json` (paridad estricta de keys).
- **Nombres propios brasileños no se traducen**: Pedra da Gávea, Pão de
  Açúcar, Mata Atlântica son iguales en los tres idiomas.
- **Español neutro LatAm con sesgo mexicano**: prohibido voseo argentino
  (`vos/tenés/podés/querés/acá`). Usar `tú/tienes/puedes/aquí`.
- **Inglés americano conciso**: sin floridez ni adjetivos en cadena.
- **Voz Editorial Ecotour**: restraint, calma, frases cortas, naturaleza
  protagonista. Sin emojis, sin exclamaciones múltiples, sin mayúsculas para
  énfasis.
- **Color**: `--terracotta` es acento puntual (ej. mark de ahorro), nunca
  background ni borde dominante. Nada gris por defecto: todo `--surface` /
  `--surface-deep`.

## Dark mode (scoped)

Davhera tiene su propio dark mode via `@custom-variant dark (&:is(.dark *))`.
Saira tiene el suyo, **independiente**, mediante la clase `saira-dark`
aplicada sobre el mismo wrapper que ya tiene `.saira`. Nunca se toca
`<html>` ni `<body>`. La detección de `prefers-color-scheme` se hace en M2
con un script inline antes del paint.

> Trade-off conocido: el `<html lang="en">` del root layout de Davhera no
> puede sobrescribirse desde un nested layout; Saira pone `lang={locale}`
> en su wrapper `.saira` (suficiente para a11y de screen readers que
> respetan el `lang` más cercano).

## Scope de Wave 1

6 pantallas: landing · catálogo · detalle de tour · reserva (wizard) ·
checkout mock · confirmación. Mobile-first. Estos 10 prompts (M1–M10)
cubren la **landing** completa + fundamentos + i18n.

## Fuente de verdad visual

`saira-design-system.html` (entregado fuera del repo). Léelo antes de tomar
decisiones de UI. Tokens, paleta, escala tipográfica, componentes, motion
y patrones están todos ahí.

## TODOs y pendientes

- [ ] Validar con Saraí los 3 tours "featured" (M8: actualmente
      `pedra-da-gavea`, `cerro-dois-irmaos`, `parapente`).
- [ ] Validar con Saraí los `comparablePlatformPriceBRL` (estimados como
      ~1.42× del precio directo; pueden cambiar con datos reales).
- [ ] David: entregar video drone definitivo para el hero (`reel-mobile.mp4`,
      `reel-desktop.mp4`, `poster.jpg`). Mientras tanto se usan placeholders.
- [ ] David: imágenes definitivas para cada tour (`public/saira/tours/{slug}/`).
- [ ] Toggle manual de dark mode en header (Wave 2).
