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

## Decisiones técnicas (M1–M10)

- **`proxy.ts` en lugar de `middleware.ts`**: Next 16 deprecó la
  convención `middleware`. La función se llama `proxy()` y vive en
  `proxy.ts` en la raíz. Scopeada a `/proyectos/saira/:path*` para
  no afectar nada más.
- **No usamos `createMiddleware`/`createNavigation` de next-intl** porque
  asumen que el locale viene en la raíz (`/{locale}/...`). El nuestro
  vive bajo `/proyectos/saira/{locale}/...`. En su lugar:
  - `proxy.ts` hace detección manual de locale (cookie →
    Accept-Language → `pt`).
  - `app/proyectos/saira/lib/i18n/navigation.tsx` (`<Link>`) y
    `client-nav.ts` (`useSairaPathname`, `useSairaRouter`) son
    helpers propios que añaden el basePath y el locale al construir
    URLs.
- **Comparison-card en M9**: hardcodea Pedra da Gávea como ejemplo.
  Si Saraí quiere otro tour como referencia, basta con cambiar las
  3 constantes en `components/saira/landing/ComparisonCard.tsx`.
- **Stagger reveal del Hero sin Framer Motion**: keyframes CSS con
  `animation-delay` escalado. Mantiene el Hero como Server Component
  y respeta `prefers-reduced-motion`.
- **Tour cards usan gradient moss→jade como placeholder visual**
  hasta que David entregue las imágenes de cada slug. Para hacer el
  swap: agregar `<Image fill src={tour.heroImage}>` dentro de
  `.saira-tour-card-media` (mantener el gradient como background
  para fallback de carga).
- **`<source media>` en el video del Hero**: confirmado funcional en
  Chrome/Safari modernos. Si QA encuentra problemas en algún device
  específico, swap a un Client Component con `useEffect` +
  `matchMedia` que renderice un `<source>` por viewport.

## TODOs y pendientes

- [ ] Validar con Saraí los 3 tours "featured" (M8: actualmente
      `pedra-da-gavea`, `cerro-dois-irmaos`, `parapente`).
- [ ] Validar con Saraí los `comparablePlatformPriceBRL` (estimados como
      ~1.42× del precio directo; pueden cambiar con datos reales).
- [ ] **David**: entregar video drone definitivo para el hero
      (`reel-mobile.mp4`, `reel-desktop.mp4`, `poster.jpg`). Por ahora
      hay archivos `.placeholder` que documentan los assets esperados.
      Compresión sugerida cuando llegue el RAW:
      ```
      ffmpeg -i raw.mov -vf "scale=-2:1080,fps=24" \
        -c:v libx264 -preset slow -crf 26 -an -movflags +faststart \
        public/saira/hero/reel-desktop.mp4
      ffmpeg -i raw.mov -vf "scale=720:-2,fps=24" \
        -c:v libx264 -preset slow -crf 26 -an -movflags +faststart \
        public/saira/hero/reel-mobile.mp4
      ```
      (target ≤ 8MB desktop, ≤ 6MB mobile).
- [ ] **David**: imágenes definitivas para cada tour
      (`public/saira/tours/{slug}/hero.jpg` + 3–5 más). Cuando lleguen,
      swap del placeholder de `.saira-tour-card-media` a `<Image fill>`.
- [ ] Toggle manual de dark mode en header (Wave 2 — por ahora solo
      `prefers-color-scheme`).
- [ ] Rutas downstream que el M5/M8 ya enlazan pero que aún no existen:
      `/tours`, `/tours/{slug}`, `/reservar/{slug}`, `/reserva/confirmada`.
      Vendrán en próximos prompts (M11+).

## Verificación final M10

| Check | Estado |
|---|---|
| `npm run build` clean | ✓ 33 páginas (3 locales prerender estáticos) |
| `npm run lint` en archivos Saira | ✓ 0 issues |
| `/`, `/projects/menura`, `/case-studies/trilha-rio` intactos | ✓ 200 |
| `/proyectos/saira` → redirect por Accept-Language | ✓ pt/es/en |
| `/proyectos/saira/{pt,es,en}` renderiza | ✓ |
| Cookie `NEXT_LOCALE` persiste y overridea | ✓ |
| Hero · FeaturedTours · ValueProp · Footer mounted | ✓ |
| WhatsApp / email / Instagram links | ✓ con `noopener noreferrer` |
| `--terracotta` aparece solo en savings de la comparison card | ✓ |
| Heading hierarchy (h1 en Hero, h2 en secciones) | ✓ |
| Focus rings visibles vía `--moss` | ✓ |
| `prefers-reduced-motion` respetado en reveals | ✓ Hero CSS |
