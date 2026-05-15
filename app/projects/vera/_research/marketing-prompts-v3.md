# Claude Code Prompts — Marketing Pages (v0.3 Migration)

> **Working codename: `vera`** (same as previous prompt sets). Find/replace before running.
> **This prompt set replaces the marketing pages built under design system v0.1.** The editorial mode has been removed. These prompts handle the migration and rebuild against design-system-v3.md.

---

## Context: what changed and what we're doing about it

The earlier marketing prompts (Prompts 0–3) produced an editorial-style landing, manifesto, and style guide using Fraunces, Newsreader, paper grain, drop caps, pull quotes, and a warm cream palette. **All of that is gone in v0.3.**

The new system is a single premium product surface with light and dark themes, Geist Sans throughout, cooler neutrals, surface-based depth, and snap-tight motion. Marketing pages now share the product surface — Cal.com's site-and-app continuity is the model.

What this means for the existing repo:

- The old `/proyectos/vera/page.tsx`, `/proyectos/vera/manifesto/page.tsx`, and `/proyectos/vera/sistema/page.tsx` will be replaced.
- The `/manifesto` route is retired entirely — replaced by `/sobre`, which is shorter, product-coded, and not essay-like.
- Editorial-only components (DropCap, PullQuote, Sidenote, OrnamentRule, EditorialCover, Footnote, paper grain overlay, the editorial Eyebrow variant) are deleted.
- `tokens.css` is rewritten with v0.3 OKLCH values. The font loader drops Fraunces and Newsreader.
- Dark mode becomes first-class. A `ThemeProvider` and `ThemeToggle` are added.

---

## How to use this document

Four prompts, run sequentially, in this order:

- **Prompt M0 — Migration & Foundation Reset.** Updates tokens, removes editorial files, deletes old marketing pages, sets up dark mode. The build will briefly break and then recover.
- **Prompt M1 — New Landing Page (`/`).** Premium product marketing.
- **Prompt M2 — New `/sobre` page.** Replaces `/manifesto`.
- **Prompt M3 — New `/sistema` page.** Rebuilt against v0.3 tokens and components.

**Before running any prompt, ensure these files are accessible:**

- `design-system-v3.md` (the new source of truth — v0.1 and v0.2 are superseded)
- `portfolio-build-scope.html` (Document № 004 — still accurate for what the routes are)

---

## Prompt M0 — Migration & Foundation Reset

```
We're migrating the Vera project from design system v0.1 to v0.3. The full v0.3 spec is in design-system-v3.md — read it before doing anything. The biggest changes: editorial mode is removed entirely, marketing pages now share the product surface, the system uses only Geist Sans + Geist Mono (Fraunces and Newsreader are gone), dark mode is first-class, and the palette shifts cooler.

This session is foundation-only: update tokens, remove editorial scaffolding, delete the old marketing pages (which will be replaced in subsequent prompts), and add the dark mode infrastructure. The build will fail temporarily for any patient or doctor pages that referenced old patterns — flag those at the end of the session so they can be migrated separately.

Read first: design-system-v3.md sections 5 (color), 6 (surfaces), 7 (typography), 10 (radii), 11 (motion), 12 (microinteractions), and 17 (file structure).

Deliverables:

═══ Files to UPDATE ═══

1. app/proyectos/vera/_styles/tokens.css — replace entirely with v0.3 values. Use the OKLCH declarations from design-system-v3.md section 5. Keep everything scoped under .proj-vera. Light mode is the default; dark mode lives in dark.css. Include all spacing, radii, typography sizes, motion durations, and easing curves from the relevant sections.

2. app/proyectos/vera/layout.tsx — remove the Fraunces and Newsreader imports. Keep only Geist Sans and Geist Mono via next/font/google. Wrap children in the new ThemeProvider (built below).

3. tailwind.config.ts — in the extend block for the project's tokens, remove the fraunces and newsreader font family entries. Keep only sans (Geist) and mono (Geist Mono). Update fontSize tokens to match the v0.3 type scale (2xs through 7xl). Remove any token references that no longer exist.

4. app/proyectos/vera/_components/PageShell.tsx — simplify. Remove the mode prop entirely. The component now just provides consistent page padding and the optional density variant (default compact). If it previously toggled .mode-editorial vs .mode-product classes, remove that logic — there's only one mode now.

═══ Files to CREATE ═══

5. app/proyectos/vera/_styles/dark.css — the .theme-dark overrides from design-system-v3.md section 5 (Dark subsection) and section 6 (dark shadows). Scoped to .proj-vera.theme-dark.

6. app/proyectos/vera/_styles/microinteractions.css — focus rings, selection colors, scrollbar styling, cursor states from design-system-v3.md section 12. Scoped under .proj-vera.

7. app/proyectos/vera/_lib/theme.ts — a ThemeProvider client component and useTheme hook:
   - Reads localStorage.vera_theme (values: 'light', 'dark', 'auto'), defaults to 'auto'
   - When 'auto', reads prefers-color-scheme
   - Applies .theme-dark to the .proj-vera root when resolved theme is dark
   - Provides context { theme, resolvedTheme, setTheme } for child components
   - SSR-safe: includes a small inline <script> in the root that runs before hydration to apply the correct class, preventing FOUC
   - Uses 'use client' directive

8. app/proyectos/vera/_components/ui/ThemeToggle.tsx — small icon-only button cycling through light → dark → auto (or just light ↔ dark if you prefer a simpler binary). Use Lucide Sun, Moon, MonitorSmartphone icons. Size: sm (32px). aria-label appropriate to current state. Persists via the ThemeProvider's setTheme.

9. app/proyectos/vera/page.tsx — a temporary placeholder until M1 runs. Single centered block: small "Vera" wordmark, paragraph "Migración completa. Reconstruyendo páginas." in --muted, theme toggle visible in the top right. This proves the foundation works end-to-end before the real landing arrives.

═══ Files to DELETE ═══

10. app/proyectos/vera/_styles/editorial.css
11. app/proyectos/vera/_styles/product.css (its content is now consolidated into tokens.css + dark.css + microinteractions.css)
12. app/proyectos/vera/_styles/grain.css
13. The entire app/proyectos/vera/_components/editorial/ folder (DropCap, PullQuote, Sidenote, OrnamentRule, EditorialCover, Footnote, TableOfContents, and any other editorial-only components)
14. app/proyectos/vera/manifesto/ folder entirely (the route is retired)
15. app/proyectos/vera/sistema/page.tsx (will be rebuilt in M3 — delete only the page file, keep the folder for M3 to populate)

═══ Components to AUDIT (potentially update) ═══

After the above, grep the repo for:

- font-fraunces, font-newsreader (anywhere outside the deleted files — these should produce zero results)
- mode-editorial, mode="editorial", mode-product, mode="product" (PageShell shouldn't be receiving a mode prop anymore — any callsite passing one needs cleanup)
- Any reference to deleted editorial components (DropCap, PullQuote, etc.)
- Any reference to --accent-pale at the old terracotta value, --moment, --moment-soft, --moment-pale (the moment/sage secondary accent is removed in v0.3)

Report findings at the end. Don't fix patient/doctor surface usages in this session — they need their own migration prompt. Just list them.

Quality bar:

- After this session, /proyectos/vera shows the placeholder page with a working theme toggle. Switching theme produces an immediately visible change. The placeholder respects both light and dark.
- davhera.com pages outside /proyectos/vera render pixel-identical to before. Verify by opening one in a separate tab.
- npm run build must succeed. If patient/doctor pages reference deleted components, this prompt does not fix them — instead, list them in the output so the user knows a follow-up migration is needed for those surfaces.
- No FOUC on theme application — the dark mode applies before paint, not after.
- The scope class .proj-vera contains every token. Nothing leaks to :root.

Constraints:

- Do not modify any file outside app/proyectos/vera/ except tailwind.config.ts (additive changes only — never remove tokens used by the parent davhera site).
- Do not install new packages. next/font, lucide-react, and framer-motion should already be present from previous sessions. If something is missing, install it.
- All Spanish copy in the placeholder uses the new direct voice (per design-system-v3.md section 4). No literary phrasing.

Output: diff summary including (a) files deleted, (b) files created, (c) files updated, (d) a grep report of any remaining v0.1/v0.2 references in patient/doctor pages so they can be migrated separately.
```

---

## Prompt M1 — New Landing Page (`/proyectos/vera`)

```
Build the new landing page at /proyectos/vera, replacing the placeholder from M0. This is the marketing entry — the first thing a reviewer sees after clicking the project link in your portfolio case study. The bar is Cal.com's marketing site or Linear's landing: confident product copy, generous-but-disciplined whitespace, restrained accent use, immaculate type.

Required reading: design-system-v3.md (especially sections 4 voice, 7 typography, 14 components, 15 patterns), and the relevant content patterns from previous research documents for the strategic substance (just translate the substance to product copy — do not import the literary tone).

The page uses the product surface (the only surface that exists in v0.3). Default density is compact for navigation and supporting copy; .density-comfortable applies to the hero and feature blocks where whitespace is the point.

Page structure (top to bottom):

1. Top nav. Sticky. Transparent at top, applies --bg/0.8 + backdrop-blur-md after scroll past 40px.
   - Left: small "Vera" wordmark, Geist Sans semibold, --text-lg, --ink. Links to /proyectos/vera.
   - Right: a row of small ghost links — "Sobre" (→ /proyectos/vera/sobre), "Sistema" (→ /proyectos/vera/sistema) — then ThemeToggle, then a Primary Button (sm size): "Ver el demo" anchored to the ModePicker section below.
   - Mobile: same layout, links collapse into an IconButton menu (kebab or hamburger Lucide icon) that opens a Sheet.

2. Hero block (.density-comfortable). --space-24 top padding, --space-20 bottom padding.
   - Optional small eyebrow above the headline: "Proyecto en concepto · Davhera 2026" — --text-xs, --weight-medium, --muted, --tracking-widest, uppercase.
   - Headline (h1): --text-6xl on mobile up to --text-7xl on desktop, --weight-semibold, --tracking-tight, --ink. Single sentence:
     "Reservas para profesionales independientes."
   - Supporting paragraph: --text-lg, --ink-soft, --leading-normal, max-width ~640px. Two short sentences:
     "Una página pública, un sistema de citas, recordatorios automáticos por WhatsApp. Hecho para psicólogos, nutriólogos, dentistas y demás independientes en México."
   - CTA row, --space-6 below the paragraph: Primary Button (md) "Probar el demo" + Ghost Button (md) "Ver el sistema →" linking to /sistema.

3. ModePicker section. --space-16 top padding. Subtle --bg-sunken background or just plain --bg with a thin --rule top/bottom divider.
   - Small eyebrow centered above: "Dos formas de probarlo"
   - Subheadline: "Como doctora o como paciente. El estado se guarda entre sesiones."
   - Two cards side-by-side on desktop (max width ~960px combined), stacked on mobile:
     - Card 1 — "Como paciente": title (--text-2xl, --weight-semibold), two-line description "Reserva una cita con la Dra. Sofía Ramírez. Sesenta segundos de principio a fin.", small arrow icon (Lucide ArrowRight, 20px). Links to /proyectos/vera/dra-sofia-ramirez.
     - Card 2 — "Como doctora": title, description "Entra al panel. Mira la agenda de hoy, gestiona disponibilidad, previsualiza recordatorios.", arrow icon. Links to /proyectos/vera/panel.
   - Each card uses --bg-raised, --rule border (1px), --radius-lg, --space-6 padding. Hover state: border shifts to --accent. No shadow in light mode (the surface contrast is enough). Tap targets are the whole card.

4. Features section. --space-20 top padding. .density-comfortable.
   - Small centered eyebrow: "Lo que hace"
   - Four FeatureBlocks. Each is a two-column layout on desktop (text left ~50%, visual placeholder right ~50%), stacked on mobile. Alternating sides on desktop (block 1: text left; block 2: text right; etc.) for visual rhythm.
   - Each FeatureBlock has:
     - Eyebrow (--text-xs, --weight-medium, uppercase, --accent, --tracking-wider) — short feature category label
     - Headline (--text-3xl, --weight-semibold, --tracking-snug, --ink)
     - Body (--text-md, --ink-soft, --leading-normal, max-width ~480px)
     - Right column: a "Boceto" badge with a placeholder. For each block, generate a simple, refined visual approximation — a screenshot-style div with rounded corners, --bg-raised, --rule border, --shadow-md, suggesting what the feature looks like. Don't try to render actual product UI yet — use small abstract representations (a thin calendar grid, a slot list silhouette, a message bubble shape). These get replaced with real screenshots later.

   The four features:
   a. Eyebrow "Página pública" · Headline "Una página, no un directorio" · Body "Tu perfil es tuyo. Sin anuncios de otros doctores. Sin 'doctores similares'. Sin venta de leads."
   b. Eyebrow "Reservas" · Headline "Sesenta segundos, sin cuenta" · Body "El paciente elige servicio, día y hora, y deja sus datos. No descarga nada. No crea una cuenta."
   c. Eyebrow "Recordatorios" · Headline "WhatsApp, no email" · Body "Confirmaciones y recordatorios por el canal donde tus pacientes ya viven. Sin tener que escribir cada uno a mano."
   d. Eyebrow "Diseño" · Headline "Modo claro y oscuro, desde el primer día" · Body "Construido como un producto premium, no como un MVP. El sistema de diseño está documentado en /sistema."

5. "Lo que está vivo" section. --space-16 top padding. Compact density.
   - Eyebrow centered: "Lo que está construido"
   - A simple vertical list (max width ~560px, centered). Each row: small Check icon in --success on the left, --text-md text in --ink. --space-3 between rows.
     - El perfil público de la Dra. Sofía Ramírez
     - El flujo de reserva en sesenta segundos
     - El panel de la doctora — hoy, semana, disponibilidad
     - El onboarding de dos minutos
     - Confirmaciones y reagendamientos tokenizados, sin cuenta
   - Below the list, --space-6 below: a single line in --text-sm --muted: "Demo persistente · Supabase free tier · Cero costos en producción."

6. Footer. --space-16 top padding. Thin --rule top border. Light footer in product style.
   - Left: "Vera · Una pieza de portafolio de Davhera"
   - Right: small links — "Sobre", "Sistema", "GitHub" (placeholder href), and the ThemeToggle.
   - Below (centered, --text-xs, --muted): "Diseñado y construido en Rio de Janeiro · 2026"

Components to BUILD (new, in _components/marketing/):

- MarketingHero — composition: eyebrow, h1, paragraph, CTA row. Handles the .density-comfortable internally.
- FeatureBlock — accepts eyebrow, title, body, and a visual prop (ReactNode for the right-column representation). Handles the alternating layout via an "imageSide" prop.
- LiveList — the check-row list pattern.
- TopNav — the sticky nav with scroll-aware backdrop.
- MarketingFooter — the footer pattern.

Components to BUILD (new, in _components/ui/ if not present from M0):

- ModePicker (refactor if a v0.1 version exists with editorial styling; build fresh for v0.3 if not).

Reuse from M0: PageShell, ThemeToggle, Button.

Quality bar:

- The hero must hold up against Cal.com's, Linear's, and Mercury's landings. If a reviewer lands here and thinks "this looks like a real product," the bar is met.
- No grain, no serif type, no italic emphasis, no editorial flourishes. Just Geist Sans, the surface system, and the accent used once per section maximum.
- Both themes must look intentional. Toggle between them — neither should feel like an afterthought.
- Mobile: the hero scales gracefully. The h1 hits --text-5xl on a 375px viewport (still confident, not shrunken). The ModePicker stacks. Feature blocks stack with the visual below the text.
- Animation: hero entrance is opacity + 8px translate up, --dur-smooth --ease-snap. Feature blocks animate in on scroll via IntersectionObserver (stagger 60ms). Nothing else animates on this page. Honor prefers-reduced-motion.
- Tap targets ≥ 44×44px. Focus rings visible on keyboard nav.

Constraints:

- No "Sign up" or "Create account" CTAs. The demo is the entire conversion goal.
- No social proof section, no logo wall, no testimonials. The product is too new for any of that and pretending otherwise reads as marketing-y.
- No animated illustrations. Visuals in feature blocks are static abstractions.
- All copy in Spanish, in the direct product voice from design-system-v3.md section 4. Re-read the copy do/don't examples before writing.

Output: diff summary plus screenshots (or descriptions) of the page at 375px (mobile), 768px (tablet), and 1280px (desktop), in both light and dark.
```

---

## Prompt M2 — New `/sobre` Page (`/proyectos/vera/sobre`)

```
Build /proyectos/vera/sobre, the about page that replaces the retired /manifesto route. Same product surface, more content density, less ceremony than the old manifesto. The old manifesto was an essay; this is a refined product-marketing about page — closer to Linear's "About" or Cal.com's company pages than to a magazine article.

Required reading: design-system-v3.md (section 4 voice especially — re-read the do/don't examples), the strategic substance from the original research docs (translate the ideas to direct product prose; do not import the essay tone), and M1's output (reuse its TopNav, MarketingFooter).

Use the product surface. Default density compact for body, .density-comfortable for the hero only. Max content width: --max-content (720px) for body sections.

Page structure:

1. TopNav (reused from M1). Active state can be subtle — none of the nav items get visible "active" treatment in this design system; the current page is communicated by URL.

2. Hero block (.density-comfortable). --space-20 top padding, --space-12 bottom.
   - Eyebrow: "Sobre el proyecto"
   - h1 (--text-5xl on mobile, --text-6xl on desktop, --weight-semibold, --tracking-tight):
     "Por qué construimos Vera."
   - Supporting paragraph (--text-lg, --ink-soft, max-width 600px):
     "El profesional de la salud independiente en México vive entre dos mundos: tiene un negocio, pero opera con WhatsApp y una libreta. Vera es la herramienta que ese profesional merece, sin convertirla en un directorio donde paga para aparecer arriba de su competencia."

3. Section: "El problema". --space-12 top padding. Compact density. Max-w 720px.
   - h2 (--text-3xl, --weight-semibold, --tracking-snug)
   - Three short paragraphs (--text-md, --ink-soft):
     - "Doctoralia y similares funcionan como directorios. Tu perfil aparece rodeado de competidores. Si quieres aparecer arriba, pagas. El doctor es inventario, no cliente."
     - "Los sistemas clínicos (Nimbo-X y otros) están diseñados para clínicas con recepcionista. Para el profesional solo, son sobrediseñados y caros."
     - "El resultado: el profesional independiente gestiona su agenda por WhatsApp, en el mismo teléfono donde habla con su mamá. Vera asume que esa fricción no es necesaria."

4. Section: "Para quién es". Same pattern. h2 + 2-3 paragraphs.
   - h2: "Para quién es."
   - "Para la psicóloga en Roma Norte que tiene 4mil seguidores en Instagram y maneja todo por WhatsApp. Para el nutriólogo en Guadalajara que cobra $700 por consulta y quiere verse profesional sin pagar por un directorio. Para el fisioterapeuta móvil en Puebla que necesita su agenda visible y bien organizada."
   - "El perfil ideal: independiente, presencia activa en redes, cobra entre $500 y $1,500 por sesión, ve entre 15 y 25 pacientes por semana, valora cómo se ve."

5. Section: "Cómo funciona". h2 + structured content.
   - h2: "Cómo funciona."
   - Lead paragraph: "Tres superficies."
   - A numbered list (custom-styled, not browser default). Each item: a large number (--text-2xl, --weight-semibold, --accent, Geist Mono with tabular figures) + title + one-line description. --space-6 between items.
     1. "Página pública" — La doctora tiene un perfil propio en vera.app/su-nombre. Servicios, precios, disponibilidad, ubicación. Sin anuncios.
     2. "Flujo de reserva" — El paciente elige servicio, día y hora, deja sus datos, confirma. Sesenta segundos. Sin cuenta.
     3. "Panel y notificaciones" — La doctora ve su agenda. Cada nueva reserva llega por WhatsApp. Los recordatorios se envían automáticamente.

6. Section: "Decisiones de diseño". h2 + 3-4 short paragraphs articulating the principles from design-system-v3.md section 3 in product prose:
   - h2: "Decisiones de diseño."
   - "Un solo acento de color. Terracota. Aparece en acciones primarias y en máximo tres elementos por pantalla."
   - "Superficies sobre sombras. La profundidad viene del contraste entre fondos blancos puros y un canvas levemente off-white. Las sombras se reservan para superficies flotantes."
   - "Modo claro y oscuro, desde el primer día. Ambos son ciudadanos de primera clase."
   - "Sans-serif en todo. Geist Sans. La jerarquía se construye con peso, tamaño y tracking — no cambiando de tipografía."

7. Section: "Estado actual". Compact density. h2 + a structured list of what's live vs. in progress.
   - h2: "Estado actual."
   - Two columns on desktop (stacked on mobile):
     - Left: "Lo que funciona" with a check-row list (reuse LiveList from M1).
     - Right: "Lo que sigue" with a similar list but using Lucide ArrowRight icons in --muted instead of checks: case study page on davhera.com, polish pass on edge cases, doctor surface end-to-end, etc.

8. Section: "Quién hizo esto". h2 + short paragraph crediting David.
   - h2: "Quién hizo esto."
   - "Diseñado y construido por David Hera, diseñador de producto basado en Rio de Janeiro. Vera es una pieza de portafolio — un producto en concepto, investigado, diseñado y construido en código de principio a fin. La investigación completa y el sistema de diseño están enlazados abajo."

9. Closing block. --space-12 top padding.
   - A row of three small link cards:
     - "Sistema de diseño" → /sistema
     - "El demo" → /proyectos/vera (back to landing)
     - "Davhera.com" → / (root portfolio)
   - Each card: --bg-raised, --rule border, --radius-md, --space-4 padding. Two lines: title (--text-md, semibold) + small description (--text-sm, --muted).

10. MarketingFooter (reused from M1).

Components to BUILD (new):

- NumberedSection — the large-number list pattern used in "Cómo funciona". Number, title, body.
- LinkCardRow — the row of three closing cards.
- DualColumnLists — the "Lo que funciona" / "Lo que sigue" pattern.

Reuse from M1: TopNav, MarketingFooter, LiveList, ThemeToggle.

Quality bar:

- The page is information-dense compared to the landing — lots of content per scroll — but it breathes through generous --space-12 between sections, not through gigantic margins.
- No essay rhythm. Sentences are short. Paragraphs are 2-4 lines maximum. The voice is structural, not literary.
- No pull quotes. No drop caps. No ornaments. No italic emphasis in headings. None of the editorial chrome from v0.1.
- Both themes render with care. Read each section in light and then dark — both should feel intentional.

Constraints:

- No imagery. No illustrations. No team photos. The content is the substance.
- No "Subscribe to newsletter" or "Stay updated" CTAs.
- No timeline / roadmap with future dates. The "Lo que sigue" list is descriptive, not promissory.
- All copy in Spanish, direct voice.

Output: diff summary plus an honest assessment of how the page reads in light vs. dark. If one mode feels less considered than the other, flag it.
```

---

## Prompt M3 — New `/sistema` Page (`/proyectos/vera/sistema`)

```
Build /proyectos/vera/sistema, the living style guide. This page is the strongest single portfolio asset — it tours the design system as a navigable, inspectable artifact that proves the system was designed, not just the screens.

The old v0.1 sistema page (now deleted in M0) followed an editorial structure. This rebuild reflects v0.3 entirely: a product-coded style guide, like Vercel's docs or Linear's design system reference. Long-scrolling, anchored sections, both themes shown for every color and component.

Required reading: design-system-v3.md in full — every section. This page is the visual rendering of that document. Also read the section list at the top of design-system-v3.md to confirm the structure.

Use the product surface. Default density compact for navigation and listings, .density-comfortable for the cover and section openings.

Page structure (top to bottom):

1. TopNav (reused from M1).

2. Cover block (.density-comfortable). --space-16 top padding, --space-12 bottom.
   - Eyebrow: "Sistema de diseño · v0.3"
   - h1 (--text-5xl on desktop, --text-4xl on mobile, --weight-semibold, --tracking-tight):
     "El sistema completo."
   - Supporting paragraph (--text-lg, --ink-soft, max-width 600px):
     "Tokens, tipografía, componentes y patrones. Renderizado en vivo desde el código. Cambia con el sistema."
   - Below paragraph, --space-6: a small metadata row (--text-xs, --muted, --tracking-widest, uppercase):
     "Última actualización: [build date] · Light & Dark · Versión v0.3"

3. Layout shift: from here down, the page uses a two-column layout on desktop (≥ 1024px):
   - Left column: sticky navigation with section anchor links. ~200px wide. --space-8 from the top of the page. List of sections (I through XIII). Active section highlighted (--accent text). Smooth scroll on click.
   - Right column: the content. Max width --max-content (720px).
   - Mobile: nav becomes a horizontal scrollable strip at the top, sticky just below the TopNav. Or a sheet triggered by a "Navegar el sistema" button.

4. Section I — Referencias. Eyebrow "I", h2 "Las referencias.", brief intro paragraph, then a clean table or list rendering the eight references from design-system-v3.md section 1 (Linear, Cal.com, Cron, Mercury, Vercel, Arc, Raycast, One Medical) with their contributions. Use a structured pattern — table on desktop, stacked cards on mobile.

5. Section II — Color. Eyebrow "II", h2 "Color.", intro paragraph about OKLCH and the single-accent discipline.
   - Subsection a: "Modo claro" — a grid of ColorSwatch components (3 columns on desktop, 2 on tablet, 1 on mobile). Each swatch: a 140px-tall color block, the token name in Geist Mono (--text-sm), the OKLCH value in Geist Mono (--text-xs --muted), the hex equivalent in Geist Mono (--text-xs --ink-faint). Group with subheadings: "Superficies", "Ink", "Líneas", "Acento", "Semántica".
   - Subsection b: "Modo oscuro" — same grid, same tokens, but the swatches render with the dark mode values. Use a wrapper with `.theme-dark` applied locally so the swatches show their dark variants without affecting the rest of the page. (This is a key technical move — proves the theme system is composable.)

6. Section III — Superficies y elevación. h2 + intro about the surface system being the primary visual identity.
   - A SurfaceLayers visual: a stack of four rectangles representing --bg, --bg-sunken, --bg-raised, --bg-overlay, each labeled with the token name and OKLCH. The visual shows the actual contrast between them. Render both light and dark variants side-by-side (stacked on mobile).
   - A ShadowSamples row showing the four shadow levels (sm, md, lg, xl) as four cards floating against the canvas. Each card labeled.

7. Section IV — Tipografía. h2 + intro about the two-typeface system.
   - Subsection: "Tipo display" — a large Geist Sans sample at --text-7xl, --weight-semibold, --tracking-tight, showing a real phrase: "Reservas para profesionales independientes."
   - Subsection: "Escala de tipos" — a TypeScale component rendering every size from --text-2xs through --text-7xl, each line showing the name, the value, and the sample text. Use Spanish sample sentences that say something about the system.
   - Subsection: "Pesos" — render the four weights (400, 500, 600, 700) at --text-2xl size, each labeled.
   - Subsection: "Mono" — a Geist Mono sample showing tabular numbers and a code snippet. Example: a price column with $1,200 MXN aligned across rows.

8. Section V — Espaciado. h2 + intro. Visualize the spacing scale as horizontal bars (the SpacingBar component from v0.2 sistema, adapted). Each row: token name (mono), pixel value (mono), and a horizontal --accent bar at that exact width.

9. Section VI — Radios. h2 + a RadiusGrid. Five boxes (60×60px each), each demonstrating one radius value (xs, sm, md, lg, xl). Labels below.

10. Section VII — Movimiento. h2 + a MotionSampler. A small playable demo: four "Reproducir" buttons that trigger sample animations showing each named easing curve (out, snap, glide, emphasis). Below, a table of durations (instant, quick, base, snap, smooth, ambient) with their ms values. Use the matrix pattern with mono font for values.

11. Section VIII — Microinteracciones. h2 + small demo blocks:
   - Focus rings: a small Input with the focus ring shown (use :focus-visible programmatically or add a "Mostrar foco" toggle).
   - Selection: a text block highlighting the ::selection style on hover.
   - Scrollbars: a small scrollable div showing the project's custom scrollbar.
   - Skeleton: a pulsing skeleton block demonstrating the loading state.

12. Section IX — Iconografía. h2 + an IconGrid showing ~16 Lucide icons at the standard product sizes (16, 20, 24). Include: Calendar, Clock, MapPin, Phone, Mail, MessageCircle, Check, X, ArrowRight, Plus, Settings, User, Sun, Moon, Search, Command.

13. Section X — Componentes. The largest section. Each component from design-system-v3.md section 14, rendered as a sample with a brief description.
   - Subsections: Foundation, Producto — superficie de reserva, Producto — superficie de doctora, Marketing & meta.
   - Each component sample: small heading (--text-lg, semibold) + one-line description (--text-sm, --ink-soft) + the rendered component (or a refined "Boceto" approximation for product components not yet built).
   - Render each component in both light and dark side-by-side where possible (small components like Buttons, Badges, Inputs). Larger components (WhatsAppPreview, ProfileHero) get rendered once per theme below each other.
   - Add a small badge to each: "Implementado" (--success styling) or "Boceto" (--muted styling) honestly indicating which components are wired vs. previewed.

14. Section XI — Patrones. h2 + visual diagrams of the layout patterns from design-system-v3.md section 15: page header behavior, sheet/modal responsiveness, density variants. Use simple SVG or bordered div layouts to communicate the patterns. Captions describe each.

15. Section XII — Accesibilidad. h2 + a clean list of the accessibility commitments from design-system-v3.md section 16. Each item: small Check icon + text.

16. Section XIII — Lo que el sistema no es. h2 + the "what not to do" list from design-system-v3.md section 18 rendered as a numbered list with prohibitions in roman + italic mixing... no wait, no italic. Render as a clean numbered list with --danger color on the X icons before each item.

17. Closing colophon. --space-12 top padding.
   - Centered, --text-sm --muted: "Documentación viva. Cambia con el código."
   - Below, --text-xs --muted, italic: "Versionado: v0.3 (Premium Product) · v0.2 (Dark mode añadido) · v0.1 (inicial)"

18. MarketingFooter (reused).

Components to BUILD (new, in _components/sistema/):

- SideNav — the sticky left navigation for the long-scroll layout.
- ColorSwatch — color tile (140px tall block + token name + OKLCH + hex).
- ColorGrid — wraps ColorSwatch grid with subheadings.
- ThemeWrapper — a div that applies .theme-dark locally to its children so dark variants can be shown in light pages.
- SurfaceLayers — the stacked-rectangles visual showing the surface hierarchy.
- ShadowSamples — the four-card shadow row.
- TypeScale — the type scale ladder.
- WeightSamples — the weight comparison row.
- MonoSample — the Geist Mono showcase with tabular figures.
- SpacingBar — horizontal bar visualizing one spacing value.
- RadiusGrid — the five-box radius demo.
- MotionSampler — the playable easing demo.
- MicroInteractionDemo — small wrapper for focus/selection/scrollbar/skeleton samples.
- IconGrid — the Lucide grid.
- ComponentSample — wraps any component sample with title, description, and implementation badge.
- PatternDiagram — the simple SVG/div layouts for patterns.
- ReferenceTable — the references table from section I.

Reuse: TopNav, MarketingFooter, ThemeToggle, every component being demonstrated.

Quality bar:

- This page is the strongest single portfolio asset. Treat it accordingly. Spend extra polish on layout precision, alignment, and the live-rendering quality.
- The sticky SideNav must work flawlessly. Active section highlight via IntersectionObserver. Smooth scroll on click. Mobile fallback is clean.
- ColorSwatch values render exactly. If a swatch says --accent oklch(0.52 0.17 32), that block must be that color. No theming bugs.
- Theme-isolated dark mode renderings (the ThemeWrapper trick) must not bleed. Verify by toggling the page theme — dark variants in the color section stay dark even when the page is light.
- The MotionSampler actually plays. This is the one place on the surface where animation isn't ambient — the user is asking to see it.
- Components rendered as "Implementado" use the actual production components. Components rendered as "Boceto" are clearly visually distinct (subtle dashed border, --muted "Boceto" badge) so it's honest about what's wired.

Constraints:

- No screenshots. Everything renders from code.
- The long-scroll layout uses real anchor IDs (h2 elements have id attributes matching the SideNav slugs).
- All Spanish copy in the structure (headings, intros, etc.) uses direct voice. The token names themselves stay in English (--bg, --ink, etc.) — they're code.

Output: diff summary, plus a list of components rendered as "Implementado" vs "Boceto" (this list should match the build status of the rest of the project — if patient/doctor surfaces aren't built yet, most product components show as Boceto).
```

---

## After running all four prompts

The marketing surface is complete in v0.3:

- `/proyectos/vera` — new landing
- `/proyectos/vera/sobre` — new about page (replaces /manifesto)
- `/proyectos/vera/sistema` — new style guide

Old routes that no longer exist:

- `/proyectos/vera/manifesto` — 404 by design (was retired)

If patient or doctor pages were built against v0.1/v0.2, they need their own migration before they'll build cleanly. The grep report from M0 lists what needs updating. A focused migration session would:

1. Update PageShell usages to drop the `mode` prop
2. Replace any Fraunces usage (probably in ProfileHero, possibly in onboarding) with Geist semibold at the appropriate weight/size
3. Remove any reference to deleted editorial components
4. Verify product components against the v0.3 tokens (color values shifted)

---

## Quality checks before merging each prompt's output

1. **Scope leak** — open any non-Vera page on davhera.com. Identical to before?
2. **Theme toggle works** — switching between light, dark, and auto applies immediately and persists across reload.
3. **No FOUC** — refresh in dark mode. The page does not briefly flash light before applying dark.
4. **Mobile** — every new surface viewed at 375px width. Holds up in both themes.
5. **Sticky nav behavior** — scroll on the landing — the nav transitions from transparent to backdrop-blurred at the right scroll position. Same on `/sobre` and `/sistema`.
6. **Anchor links** — on `/sistema`, clicking a SideNav item smooth-scrolls and updates the URL hash.
7. **Reduced motion** — toggle prefers-reduced-motion: reduce — entrance animations become fades, the MotionSampler still plays (it's user-initiated), staggered children become simultaneous.
8. **Accessibility** — keyboard nav through the landing's CTAs. Focus rings visible. Tab order logical.
9. **Both themes equally cared for** — view every new page in dark mode specifically and check that nothing looks like an afterthought.
10. **No editorial chrome remaining** — no italic display type, no drop caps, no pull quotes, no paper grain, no Fraunces, no Newsreader anywhere.

If any check fails, the next prompt opens with "Before we start: fix [issue] from the previous session."

---

*Claude Code Prompt Set № 001-R — Marketing Pages, v0.3 Migration · Vera · May 2026*
