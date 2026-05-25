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

**Wave 1 está completa (M1–M30).** 6 pantallas mobile-first:

1. **Landing** (M1–M10): Hero video · FeaturedTours · ValueProp · Footer
2. **Catálogo** (M11–M13): grid 16 tours · filtros URL state · empty state animado
3. **Tour detail** (M14–M16): gallery · header · descripción · includes/bring · map · sticky CTA
4. **Wizard de reserva** (M17–M20): 5 pasos (date · people · contact · language · comments) con summary live (money moment)
5. **Checkout** (M21–M22): Pix (QR mock + countdown 15min + copy code) y Tarjeta (preview visual con flip 3D)
6. **Confirmación** (M23): checkmark animado · resumen · WhatsApp preview · Add to Google Calendar

Plus: page transitions globales (M24) · micro-interactions polish (M25) · not-found/error/loading + edge cases (M26).

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

## Decisiones técnicas (M11–M20)

- **Catalog filters en URL state** (M12): `?category=…&difficulty=…` vía
  `useSearchParams` + `router.replace({scroll:false})` envuelto en
  `useTransition` para `opacity: 0.6` mientras pendiente. El `searchParams`
  prop del page es Promise en Next 16 — siempre await.
- **DIFFICULTY_BUCKETS** agrupa las 6 variantes del catálogo en 3 (easy/
  moderate/hard) sólo para la UI; el dato fuente conserva la granularidad.
- **CatalogGrid + EmptyState** son Client Components separados (M13). La
  page sigue siendo Server. Animaciones `layout` + `popLayout` son OK con
  16 tours; si crece a 50+, revisar performance.
- **react-day-picker v10** (M18): API y class names cambiaron vs v8/v9.
  Override CSS via `--rdp-accent-color` + selectors `.rdp-day_button`,
  `.rdp-selected`, etc. Scoped a `.saira` para no afectar otros usos.
- **Wizard state via Context+useReducer** (M17): sin persistencia a
  sessionStorage. Si el usuario refresca durante el wizard, pierde el
  state. Aceptable para Wave 1 (demo). Wave 2 puede agregar persist si
  Saraí lo pide.
- **`useSairaRouter().push('/checkout')` en lugar de `window.location`**:
  spec original usaba `navigator.language` para construir la URL — SSR
  unsafe + no respeta el locale activo de la URL. Sustituido por router
  scopeado.
- **BookingSummary terracotta-only en savings amount**: regla del design
  system. Label en `--ink`, número grande en `--terracotta`. Hide del
  bloque comparison entero cuando `priceOnRequest`.

## Decisiones técnicas (M21–M30)

- **Phase-based wizard** (M21): el booking permanece en `/reservar/[slug]`
  durante checkout — la vista cambia por `state.phase` (`form` →
  `checkout` → `processing`), no por ruta. Preserva todo el state del
  Context sin tener que persistir o pasar por URL. Sólo la pantalla de
  confirmación final navega a `/reserva/confirmada`.
- **`/checkout` page (M17)** queda como placeholder redundante / no
  alcanzable desde el flow normal. Útil sólo si alguien entra a la URL
  directo (404-equivalente con CTA back).
- **QR code Pix es decorativo**: SVG generado client-side con pattern
  determinista + 3 markers en esquinas. NO escaneable. El "código Pix"
  que se copia es un string realista pero no procesa nada. Note
  explícito de demo en cada pantalla.
- **Card visual con flip 3D**: `transform-style: preserve-3d` +
  `backface-visibility: hidden` + motion `rotateY` al focusear CVC.
  500ms ease-in-out-soft. Respeta prefers-reduced-motion.
- **Confirmation page lee de sessionStorage**: si falta (refresh
  directo), muestra "no booking found" y redirige a `/` después de
  2.4s. bookingId generado client-side, formato `SAR-XXXXXX` (useMemo
  stable). Google Calendar URL bien formada con ISO Z dates.
- **WhatsApp preview es el ÚNICO lugar con emojis** en todo el sitio
  (📅 👥 🆔 👋). Razón: simula un mensaje real de WhatsApp donde son
  norma. La regla "sin emojis" sigue aplicando en todo el resto del UI.
  Usa fuente `system-ui` (no Fraunces/Geist) para autenticidad.
- **Page transitions via template.tsx** (M24): re-mounta en cada
  navegación, dispara fade + 8px translate-y en 300ms. Override en
  `/reserva/confirmada/template.tsx` porque ese page tiene su propio
  stagger interno de 6 elementos. Respeta prefers-reduced-motion.
- **Spinner dos variantes**: `.saira-spinner` (sobre fondo --moss, en
  botones de processing) y `.saira-spinner-dark` (en loading.tsx
  sobre fondo claro). Ambos gateados por prefers-reduced-motion.

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
- [ ] **Real-device QA pendiente** (M27/M29): el demo está verificado
      end-to-end programáticamente en producción local pero NO en
      celular físico. Antes del demo con Saraí: probar el flow completo
      en iOS Safari y Android Chrome. Foco especial: autoplay del hero
      video, copy-to-clipboard en Safari, sticky CTA con safe-area,
      flip 3D de la tarjeta en mobile, calendar de date-picker con touch.
- [ ] **Deploy a Vercel** (M28) requiere acceso al dashboard de Vercel —
      no se puede hacer desde este entorno containerizado. Pasos cuando
      el equipo lo ejecute: PR a main → Vercel auto-deploy → Lighthouse
      mobile ≥ 85 perf · ≥ 95 a11y · ≥ 90 SEO. Si video del hero baja
      la Performance, recomprimir con los ffmpeg arriba.
- [ ] Persistencia del wizard state (Wave 2 si Saraí lo pide).

## Verificación final M30

| Check | Estado |
|---|---|
| `npm run build` clean (Next 16 Turbopack) | ✓ 132 páginas |
| Saira prerendera 99 rutas estáticas | ✓ 3 locales × (1 home + 1 checkout + 1 confirmada + 16 tours/[slug] + 16 reservar/[slug]) + 3 dinámicos /tours |
| `npm run lint` en archivos Saira | ✓ 0 issues |
| Davhera intacta (`/`, `/projects/*`, `/case-studies/*`, `/quiniela/*`) | ✓ 200 |
| Accept-Language detection (pt-BR/es-MX/en-US → redirect) | ✓ 307 |
| 6 surfaces × 3 locales = 18 routes | ✓ 200 todos |
| Filter combos del catálogo (incluyendo empty) | ✓ 200 todos |
| i18n parity (pt = es = en) | ✓ 215 keys idénticas, 0 vacíos |
| Mobile-first CSS audit | ✓ 10/10 checks (hover gates, reduced-motion, safe-area, tap-highlight, tabular-nums, line-clamp) |
| A11y básica (aria-*, role, focus-visible, h1/h2 jerarquía) | ✓ |
| `--terracotta` discipline (sólo en savings + errors) | ✓ |
| End-to-end navegable: landing → /tours → filter → empty → detail → /reservar → 5 steps → checkout Pix → /reserva/confirmada → calendar URL bien formada | ✓ verificado |

## Branch + deploy status

- **Branch**: `claude/gifted-meitner-MD2QR` (todos los M1–M30 pushed)
- **Commits**: 30, formato `saira(M{N}): <summary>`
- **Estado**: demo-ready local. Falta deploy a Vercel y real-device QA
  (ver TODOs arriba).
