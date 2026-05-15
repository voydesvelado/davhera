# Design System — `{{PROJECT_NAME}}`
**v0.3 · Premium Product**

> **Working codename suggestions:** Cita · Vera · Aurelia · Nido · Cura · Trama
> Supersedes v0.1 and v0.2. The editorial mode has been removed entirely. The system is now a single premium product surface with light and dark variants, built against the bar set by Linear, Cal.com, Cron, Mercury, and Vercel.

---

## 0 · Context & scoping

This project lives inside the `davhera.com` Next.js repository as a routed portfolio piece (route: `/proyectos/{{PROJECT_SLUG}}`). The portfolio site has its own conventions. **This design system must coexist with, not collide with, the parent site.**

The strategy is **scoped isolation**:

- All project styles are namespaced under a root class — `.proj-{{PROJECT_SLUG}}` — applied at the project's root layout.
- Design tokens are exposed as CSS custom properties scoped to that class, never on `:root`.
- Project fonts load via `next/font` inside the project layout, not globally.
- The project's Tailwind theme extension reads from CSS variables, so utilities resolve to project tokens only inside the scope.

If a value isn't tokenized in this document, don't invent one — extend the system first.

---

## 1 · Design references

The bar. These are the products this system benchmarks against, with the specific contribution of each.

| Reference | What we take from it |
|-----------|---------------------|
| **Linear** | The defining premium product UI of the current era. Surface layering, snap motion (100–200ms), dense information without clutter, dark mode mastery, restraint in chrome, one accent color used with discipline. |
| **Cal.com** | Modern booking UX vocabulary. Clean component library. Proof that scheduling UI can feel premium without feeling clinical. |
| **Cron / Notion Calendar** | Typographic precision at small sizes, calmness, glass-like surface treatment, motion at small scales. |
| **Mercury** | Banking-grade restraint. Confident neutral palette. Generous whitespace alongside dense data. Premium feel through type alone. |
| **Vercel / v0** | Geometric purity. The discipline of fewer choices made better. Geist as a workhorse typeface across an entire product surface. |
| **Arc** | Polished microinteractions. The detail level that separates "designed" from "premium." |
| **Raycast** | Command palette UX. Keyboard-first design. Animation timing for fast interactions. |
| **One Medical** | Healthcare UI that doesn't feel clinical. The proof that this category can be made warm without being soft. |

**The synthesis we are after:** Linear's surface discipline and motion quality, applied to a booking product, in Spanish, for the brand-conscious Mexican solo practitioner — with the keyboard-first sensibility of Raycast on the doctor side and the openness of Cal.com on the patient side.

**Not editorial.** This system does not lean on serif type, italic flourishes, paper grain, drop caps, pull quotes, or magazine-style covers. Premium reads as: confident neutrals, one accent used sparingly, immaculate sans-serif typography, surface layering doing the work shadows used to do, snap-tight motion.

---

## 2 · Light & Dark

A single product surface with two variants. Both are first-class — every screen must render in both with equal care.

- **Light** — confident off-white with pure white raised surfaces. Cool, slightly blue-undertoned neutral. Reads as expensive paper, not craft paper.
- **Dark** — deep cool dark (not pure black) with slightly raised cards. Comfortable for extended use, never harsh.

**Implementation:** the project root carries `.proj-{{slug}}`. The dark variant is applied via `.theme-dark` on the same root or a child. The default theme respects `prefers-color-scheme` and is overrideable via a `ThemeToggle` that persists to `localStorage`.

```tsx
<div className={`proj-${slug} ${theme === 'dark' ? 'theme-dark' : ''}`}>
```

There is no separate "marketing mode" or "editorial mode." Marketing pages share the product surface. Cal.com's site-and-app continuity is the model — the marketing pages, the patient surface, and the doctor surface all live in one visual system.

---

## 3 · Product principles

Eight principles. Each is a decision filter, not a slogan.

1. **One accent, used sparingly.** Terracotta. It appears on primary actions and a handful of moments per screen. Two accent colors is one too many.
2. **Surfaces over shadows.** Depth is communicated by the contrast between `--bg` and `--bg-raised`, not by drop shadows. Shadows are reserved for floating surfaces only.
3. **Sans-serif throughout.** Geist Sans for UI, Geist Mono for technical content. No serif. No italic in display type. No SOFT axis choreography.
4. **Compact by default.** Information density is a feature, not a problem to be solved with whitespace. Reserve whitespace for moments.
5. **Snap, not glide.** Motion completes before you finish thinking about it. 100ms for hover, 200ms for transitions, 240ms for sheets. The Linear school.
6. **Keyboard-first on dense surfaces.** The doctor's dashboard supports `⌘K`, arrow-key navigation in lists, and visible keyboard hints. The patient surface remains touch-first.
7. **The product is the proof.** No marketing chrome that the app doesn't earn. If the landing page has a feature that the app doesn't deliver, the landing page is wrong.
8. **Calm, not decorative.** A premium product earns trust through restraint. No gradients, no glow effects, no decorative SVG flourishes, no illustration sets. The chrome is invisible; the content is the experience.

---

## 4 · Voice & copy

- **Spanish-native, Mexican.** All product copy in Mexican Spanish. No translated Anglicisms — *agenda*, not *calendario digital*; *cita*, not *appointment*.
- **Direct, not literary.** Product copy is short, structural, and confident. "Tu agenda online" beats "Tu consultorio en una sola página." The first is product copy; the second is essay copy.
- **No exclamation marks** in product copy. The user is a professional, not a target.
- **No imperative shouts.** "Reservar" not "¡Reserva ahora!"
- **No emoji** in transactional messages. One emoji maximum in reminders, only if it adds clarity (a calendar emoji before a date).
- **Confidence over warmth.** The tone is closer to a competent operator than to a friendly brand. Friendliness shows up in the design, not in the copy.

### Marketing copy examples

**Landing hero (do this):**
> Reservas para profesionales independientes.
> Una página, un sistema de citas, recordatorios automáticos por WhatsApp.

**Landing hero (not this — editorial-coded):**
> Tu consultorio. En una sola página.
> Una plataforma de reservas diseñada para el profesional de la salud independiente en México.

**Feature header (do this):**
> Recordatorios por WhatsApp
> Cada paciente recibe un recordatorio 24 horas antes. Tú no escribes nada.

**Feature header (not this — too essay):**
> El recordatorio es el momento más importante.
> En una categoría donde el no-show es una pérdida directa de ingresos, el recordatorio bien hecho es la microinteracción de mayor apalancamiento.

The first version of each shows the product. The second version describes the product. We show.

---

## 5 · Color system

All colors are defined in **OKLCH** for perceptual uniformity across light and dark variants. Hex equivalents are documentation only — the source of truth is OKLCH.

### Light

Cool, neutral, restrained. Reads as expensive paper.

```css
.proj-{{slug}} {
  /* Surfaces — layered from base to floating */
  --bg:          oklch(0.985 0.002 250);  /* #FAFAFB — base canvas, slight cool undertone */
  --bg-raised:   oklch(1.000 0 0);        /* #FFFFFF — cards, sheets (pure white) */
  --bg-sunken:   oklch(0.965 0.003 250);  /* #F3F4F5 — inset (filled inputs, code) */
  --bg-overlay:  oklch(0.995 0.001 250);  /* #FCFCFD — popovers, menus */

  /* Ink — text and content */
  --ink:         oklch(0.18 0.005 250);   /* #16181C — primary text */
  --ink-soft:    oklch(0.32 0.005 250);   /* #2E3239 — secondary */
  --ink-faint:   oklch(0.48 0.005 250);   /* #545962 — tertiary */
  --muted:       oklch(0.58 0.005 250);   /* #717680 — meta, labels */

  /* Lines */
  --rule:        oklch(0.92 0.003 250);   /* #E5E6E8 — default border */
  --rule-strong: oklch(0.85 0.005 250);   /* #D2D4D7 — emphasized */
  --rule-faint:  oklch(0.95 0.003 250);   /* #EFF0F1 — light divider */

  /* Accent — primary action, used sparingly */
  --accent:      oklch(0.52 0.17 32);     /* #A6402F — confident terracotta */
  --accent-soft: oklch(0.62 0.15 32);     /* #C46550 — hover */
  --accent-pale: oklch(0.94 0.025 32);    /* #F5E8E3 — tinted background */
  --accent-ink:  oklch(0.99 0.005 32);    /* #FCFAF9 — text on accent */

  /* Semantic */
  --success:     oklch(0.58 0.13 150);    /* #4E8B5C */
  --warning:     oklch(0.72 0.14 75);     /* #BE9028 */
  --danger:      oklch(0.55 0.20 27);     /* #B33B26 */

  /* Focus */
  --focus-ring:  oklch(0.52 0.17 32 / 0.45);
}
```

### Dark

Deep, cool, warm-tinted. Never pure black.

```css
.proj-{{slug}}.theme-dark {
  /* Surfaces — lighter as they rise (Material 3 / Linear convention) */
  --bg:          oklch(0.17 0.005 250);   /* #1B1D21 — base canvas */
  --bg-raised:   oklch(0.21 0.005 250);   /* #25272B — cards */
  --bg-sunken:   oklch(0.14 0.005 250);   /* #16181B — inset */
  --bg-overlay:  oklch(0.24 0.005 250);   /* #2C2E33 — popovers */

  /* Ink */
  --ink:         oklch(0.96 0.003 250);   /* #F2F3F5 — primary text */
  --ink-soft:    oklch(0.82 0.003 250);   /* #CFD0D3 — secondary */
  --ink-faint:   oklch(0.65 0.005 250);   /* #9CA0A6 — tertiary */
  --muted:       oklch(0.55 0.005 250);   /* #7C808A — meta */

  /* Lines */
  --rule:        oklch(0.28 0.005 250);   /* #3D4045 — default border */
  --rule-strong: oklch(0.38 0.005 250);   /* #55585E — emphasized */
  --rule-faint:  oklch(0.22 0.005 250);   /* #2D2F33 — divider */

  /* Accent — brightens for dark to maintain perceived contrast */
  --accent:      oklch(0.68 0.17 32);     /* #D87560 — terracotta */
  --accent-soft: oklch(0.58 0.15 32);     /* #B85F4A — hover */
  --accent-pale: oklch(0.30 0.05 32);     /* #4A2A23 — tinted background */
  --accent-ink:  oklch(0.12 0.005 32);    /* #1A1614 — text on accent */

  /* Semantic */
  --success:     oklch(0.72 0.13 150);
  --warning:     oklch(0.80 0.14 75);
  --danger:      oklch(0.70 0.20 27);

  /* Focus */
  --focus-ring:  oklch(0.68 0.17 32 / 0.55);
}
```

### Semantic naming rule

Components reference `var(--ink)`, `var(--accent)`, etc. — never raw hex. The semantic name carries through to dark mode without component changes.

The accent is used **deliberately**, not decoratively. A typical screen should have one to three accent-colored elements: usually the primary CTA, a status indicator, and a focus state. If more than three accent elements appear in a viewport, something is wrong.

---

## 6 · Surfaces & elevation

The surface system is the **primary visual identity** of this design system. Without editorial chrome, surfaces carry the work that paper grain and serif type used to do.

### Surface hierarchy

| Token | Light | Dark | Used for |
|-------|-------|------|----------|
| `--bg` | Off-white canvas | Deep dark canvas | Page background |
| `--bg-sunken` | Slightly darker than canvas | Slightly darker than canvas | Inset surfaces: filled inputs, code blocks, secondary panels |
| `--bg-raised` | Pure white | Lighter than canvas | Cards, sheets, primary content containers |
| `--bg-overlay` | Slightly lighter than canvas | Lightest layer | Floating: popovers, dropdowns, tooltips, command palettes |

**In light mode, raised surfaces are pure white against an off-white canvas.** The contrast is subtle but powerful. This is the paper-on-paper effect that defines Linear, Cron, Mercury, and Cal.com.

**In dark mode, raised surfaces are lighter than the canvas.** This is the convention established by Material 3 and Linear. Premium products do not "darken to elevate" — they brighten.

### Borders

Every raised or sunken surface gets a 1px border in `--rule`. This is non-negotiable in light mode where the surface contrast can be subtle. In dark mode, the border is often visible against the brighter raised surface.

### Shadows

Used **only** on floating surfaces. Never on cards in light mode — the surface contrast is sufficient. Never in editorial mode (which no longer exists). Shadows are subtle, multi-layer, and cool-toned.

```css
.proj-{{slug}} {
  --shadow-sm: 0 1px 2px oklch(0.18 0.005 250 / 0.04),
               0 1px 1px oklch(0.18 0.005 250 / 0.03);
  --shadow-md: 0 4px 12px oklch(0.18 0.005 250 / 0.06),
               0 2px 4px oklch(0.18 0.005 250 / 0.04);
  --shadow-lg: 0 12px 32px oklch(0.18 0.005 250 / 0.10),
               0 4px 8px oklch(0.18 0.005 250 / 0.06);
  --shadow-xl: 0 24px 64px oklch(0.18 0.005 250 / 0.12),
               0 8px 16px oklch(0.18 0.005 250 / 0.08);
}

.proj-{{slug}}.theme-dark {
  --shadow-sm: 0 1px 2px oklch(0 0 0 / 0.4);
  --shadow-md: 0 4px 12px oklch(0 0 0 / 0.5),
               0 2px 4px oklch(0 0 0 / 0.3);
  --shadow-lg: 0 12px 32px oklch(0 0 0 / 0.6),
               0 4px 8px oklch(0 0 0 / 0.4);
  --shadow-xl: 0 24px 64px oklch(0 0 0 / 0.7),
               0 8px 16px oklch(0 0 0 / 0.5);
}
```

---

## 7 · Typography

**Two typefaces. That's the whole system.**

| Role | Typeface |
|------|----------|
| Everything (UI, marketing, content) | **Geist Sans** (variable) |
| Numerics, code, technical content | **Geist Mono** |

No serif. No display font. Geist handles every typographic role through weight, size, tracking, and color. This is the disciplined choice and what Linear, Vercel, Cron, and Mercury all do.

Why Geist: free, modern, neutral, optical-sized variable axis, designed by Vercel for product UI specifically. It reads beautifully from 11px to 80px. The mono companion is hand-tuned to match.

### Type scale

```css
--text-2xs:    11px;   /* meta, kbd shortcuts */
--text-xs:     12px;   /* labels, eyebrows, small caps */
--text-sm:     13px;   /* tertiary text */
--text-base:   14px;   /* default product body */
--text-md:     15px;   /* slightly emphasized body */
--text-lg:     16px;   /* lede body, prominent UI text */
--text-xl:     18px;   /* h5, card titles */
--text-2xl:    22px;   /* h4 */
--text-3xl:    28px;   /* h3 */
--text-4xl:    36px;   /* h2 */
--text-5xl:    48px;   /* h1 */
--text-6xl:    64px;   /* hero display */
--text-7xl:    80px;   /* extra-large hero */
```

Product body sits at 14px. This is the modern premium SaaS convention — Linear, Cal.com, Cron all use 13–14px body. Reading-heavy contexts (rare in this product) bump to 16px.

Headlines scale fluidly between breakpoints using `clamp()`. The values above are desktop ceilings.

### Weights

Geist Sans uses six weights. We use four.

```css
--weight-regular:  400;  /* body, default UI text */
--weight-medium:   500;  /* emphasized inline, button text, table headers */
--weight-semibold: 600;  /* headings, card titles, prominent labels */
--weight-bold:     700;  /* reserved for the largest display sizes only */
```

Never bolder than 700. Heavy display weights (800, 900) read marketing-y. The hero on a premium landing page uses 600 or 700, never 800+.

### Tracking

```css
--tracking-tight:   -0.04em;  /* 5xl–7xl display */
--tracking-snug:    -0.02em;  /* 2xl–4xl headings */
--tracking-normal:  -0.005em; /* body — slight negative for Geist */
--tracking-wide:    0.04em;   /* small caps emphasis */
--tracking-wider:   0.10em;   /* labels */
--tracking-widest:  0.18em;   /* eyebrows, kbd */
```

The slight negative tracking on body matches what Linear and Vercel use. Geist looks subtly wrong at 0 — it wants the `-0.005em` nudge.

### Line height

```css
--leading-none:    1.00;   /* large display */
--leading-tight:   1.10;   /* hero headlines */
--leading-snug:    1.25;   /* h2–h4 */
--leading-normal:  1.45;   /* body */
--leading-relaxed: 1.6;    /* reading-heavy body (rare) */
```

### Numerics — tabular figures

Anywhere numbers align (tables, prices, times, durations), use `font-feature-settings: "tnum"` for tabular figures. Currency and time alignment must be visibly correct.

```css
.tabular {
  font-feature-settings: "tnum" 1, "cv11" 1;
}
```

For technical content (booking tokens, IDs, timestamps), use Geist Mono.

### Common applications

| Element | Size | Weight | Tracking |
|---------|------|--------|----------|
| Page title (h1) | `--text-4xl` | `--weight-semibold` | `--tracking-snug` |
| Section title (h2) | `--text-2xl` | `--weight-semibold` | `--tracking-snug` |
| Card title (h3) | `--text-xl` | `--weight-semibold` | `--tracking-normal` |
| Body | `--text-base` | `--weight-regular` | `--tracking-normal` |
| Button (md) | `--text-base` | `--weight-medium` | `--tracking-normal` |
| Label / Eyebrow | `--text-xs` | `--weight-medium` | `--tracking-widest` (uppercase) |
| Meta / Caption | `--text-sm` | `--weight-regular` | `--tracking-normal` |
| Marketing hero | `--text-6xl` to `--text-7xl` | `--weight-semibold` | `--tracking-tight` |

---

## 8 · Spacing

4-pixel base. Components reference named tokens, never raw pixels.

```css
--space-0:    0;
--space-0_5:  2px;
--space-1:    4px;
--space-1_5:  6px;
--space-2:    8px;
--space-3:    12px;
--space-4:    16px;
--space-5:    20px;
--space-6:    24px;
--space-8:    32px;
--space-10:   40px;
--space-12:   48px;
--space-16:   64px;
--space-20:   80px;
--space-24:   96px;
```

### Spacing patterns

- **Inline (within a row):** `--space-1` to `--space-3`
- **Compact stack (form fields, list rows):** `--space-3` to `--space-4`
- **Default stack (between siblings):** `--space-4` to `--space-6`
- **Section gaps:** `--space-8` to `--space-12`
- **Hero whitespace:** `--space-16` to `--space-24`

Note the shift from v0.2: section gaps drop from 12–20 to 8–12. Premium product surfaces are tighter than editorial ones. Whitespace is a tool for moments, not a default.

---

## 9 · Layout & density

### Container widths

| Token | Width | Use |
|-------|-------|-----|
| `--max-narrow` | 560px | Focused content: confirmation pages, single-form flows |
| `--max-content` | 720px | Default content surfaces |
| `--max-wide` | 1080px | Marketing pages, multi-column layouts |
| `--max-dashboard` | 1440px | Doctor dashboard with sidebar |
| `--max-full` | 100% | Edge-to-edge backgrounds |

### Page padding

```css
--px-mobile:  16px;
--px-tablet:  20px;
--px-desktop: 24px;
```

Tighter than v0.2. Premium product surfaces use restrained page padding — the content reaches closer to the edges, which reads more confident.

### Density

The product defaults to **compact density**. The dashboard, lists, and most data-display surfaces use:

```css
--row-height-base: 40px;     /* default row */
--row-height-compact: 32px;  /* dense lists */
--field-height-base: 36px;   /* default form field */
--field-height-compact: 32px; /* compact form field */
```

A `.density-comfortable` class can be applied to specific surfaces (hero sections, marketing pages, the onboarding flow) where breathing room is the point.

---

## 10 · Radii

Refined. More restrained than v0.2.

```css
--radius-xs:   4px;    /* small UI: badges, kbd */
--radius-sm:   6px;    /* buttons, inputs */
--radius-md:   8px;    /* cards, sheets, dropdowns */
--radius-lg:   12px;   /* large cards, modals */
--radius-xl:   16px;   /* phone frames, hero cards */
--radius-pill: 9999px; /* badges, status pills */
```

There is no `--radius-none` in this system. Everything has at least a subtle radius. Sharp right angles read as utilitarian or editorial; premium reads as gently rounded.

Default radii by component:
- Buttons, inputs: `--radius-sm`
- Cards, sheets, dropdowns: `--radius-md`
- Modals, hero containers: `--radius-lg`
- Phone frame in `WhatsAppPreview`: `--radius-xl`
- Avatars: `--radius-pill` (round) or `--radius-md` (rounded square)

---

## 11 · Motion

**Snap-tight.** Linear is the reference. Every interaction completes before you finish thinking about it.

### Durations

```css
--dur-instant:  60ms;   /* state flips */
--dur-quick:    100ms;  /* hover, focus */
--dur-base:     180ms;  /* most transitions */
--dur-snap:     240ms;  /* sheet entry, layout shifts */
--dur-smooth:   400ms;  /* hero moments, page entrance */
--dur-ambient:  800ms;  /* loading, breath */
```

Significantly faster than v0.2. Premium product motion is fast and confident.

### Easing curves

```css
/* Default — snappy out, slight acceleration */
--ease-out:      cubic-bezier(0.2, 0.0, 0.0, 1.0);

/* Snap — Linear's signature, the default for most interactions */
--ease-snap:     cubic-bezier(0.32, 0.72, 0.0, 1.0);

/* Glide — smooth, for hero moments only */
--ease-glide:    cubic-bezier(0.4, 0.0, 0.2, 1.0);

/* Emphasis — slight dramatic curve, used sparingly */
--ease-emphasis: cubic-bezier(0.16, 1.0, 0.3, 1.0);
```

`--ease-snap` is the default for most interactions. `--ease-glide` is reserved for occasional hero moments. Never `ease-in-out` from the browser default — it lacks character.

### Patterns

- **Hover:** color/opacity shift only. `--dur-quick` `--ease-snap`. No transforms.
- **Press:** `scale(0.97)` + brightness shift. `--dur-instant` `--ease-snap`.
- **Focus ring:** appears at `--dur-quick`.
- **Sheet/modal entry:** opacity 0→1 + translateY(8px)→0. `--dur-snap` `--ease-snap`. Backdrop fades over `--dur-base`.
- **Sheet/modal exit:** opacity 1→0 only. `--dur-base` `--ease-out`.
- **Page transitions:** opacity + translateY(6px). Staggered children at 40ms. `--dur-smooth` `--ease-snap`.
- **Toast entry:** translateY(-12px)→0 + opacity. `--dur-base` `--ease-snap`.
- **Step transitions (booking, onboarding):** translateX(±20px) + opacity. `--dur-snap` `--ease-snap`.
- **Theme toggle:** instant. No animated color crossfade — the visual disruption is greater than the polish gained.

### Reduced motion

All non-essential motion respects `prefers-reduced-motion: reduce`:

- Transforms become opacity-only
- Durations cut by 50%
- Staggered children become simultaneous
- Ambient/loading animations pause

---

## 12 · Microinteractions

The details that separate "good design" from "premium feel."

### Focus rings

A consistent focus ring across every interactive element. The browser default is replaced.

```css
--focus-ring-width: 2px;
--focus-ring-offset: 2px;

:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
  border-radius: inherit;
}
```

Focus is visible on keyboard navigation, hidden on mouse click (via `:focus-visible`, not `:focus`).

### Hover

Interactive elements shift one or more of: background opacity, foreground color, border weight. Hover **never** uses transforms — transforms are reserved for press feedback.

- Card hover: border shifts from `--rule` to `--rule-strong`. No background change.
- Button hover (primary): `--accent` → `--accent-soft`.
- Link hover: underline appears (was none) or shifts color.

### Press / active

`transform: scale(0.97)` on press, with `--dur-instant` snap-out. Buttons and tappable cards only.

### Selection

```css
::selection {
  background: var(--accent-pale);
  color: var(--accent);
}

.theme-dark ::selection {
  background: var(--accent-soft);
  color: var(--accent-ink);
}
```

### Scrollbars

```css
* {
  scrollbar-width: thin;
  scrollbar-color: var(--rule) transparent;
}

*::-webkit-scrollbar { width: 10px; height: 10px; }
*::-webkit-scrollbar-thumb {
  background: var(--rule);
  border-radius: var(--radius-pill);
  border: 2px solid transparent;
  background-clip: content-box;
}
*::-webkit-scrollbar-thumb:hover {
  background: var(--rule-strong);
  background-clip: content-box;
}
```

### Cursors

- Interactive elements: `cursor: pointer` only on actual buttons, links, and tappable cards. Never on text.
- Disabled state: `cursor: not-allowed` + 40% opacity + no hover response.
- Loading state on action buttons: `cursor: wait` + spinner replaces text content.

### Loading states

**Skeletons over spinners** for content. Skeletons match the shape of the eventual content with a subtle pulse (70%–100% opacity over `--dur-ambient`). Spinners are reserved for action buttons during submission — never for page-level loading.

### Keyboard hints

On the doctor surface, keyboard shortcuts are surfaced visually using the `Kbd` component. Common shortcuts:

- `⌘K` — open command palette
- `?` — show all shortcuts
- `J` / `K` — navigate list down/up
- `Esc` — dismiss any overlay
- `Enter` — confirm primary action

These are visible affordances, not Easter eggs.

---

## 13 · Iconography

**Lucide icons** with carefully chosen stroke weights.

| Size | Stroke | Use |
|------|--------|-----|
| 14px | 1.75 | Inline with text |
| 16px | 1.75 | Inline emphasis, button icons |
| 20px | 1.5 | Standalone, default UI |
| 24px | 1.5 | Section headers, prominent |
| 32px | 1.25 | Empty states, large UI |

- Color: `currentColor` (inherits from text)
- Never the sole interaction signal — always paired with a label, unless space is impossible (toolbar icons with `aria-label`)
- No icon families mixed
- No custom illustrations in V1. The `WhatsAppPreview` component contains bespoke SVG details for the phone frame — those are product UI, not iconography.

---

## 14 · Components

The component layer. Visual contracts. Implementation is the engineer's call.

### Foundation

**`Button`** — Primary, Secondary, Ghost, Destructive, Icon-only. Sizes: xs (28px), sm (32px), md (36px), lg (44px). Primary uses `--accent` bg with `--accent-ink` text; Secondary uses `--bg-raised` with `--rule` border; Ghost uses transparent; Destructive uses `--danger`. All buttons use `--radius-sm`.

**`IconButton`** — Square icon-only button. xs/sm/md sizes. Always paired with `aria-label`. Common pattern in dense UI.

**`Input`** — Text, email, phone, number, search. Sizes match Button height. Full border, `--rule`. On focus: border shifts to `--accent`, focus ring appears. Placeholder uses `--ink-faint`. Filled state has subtle `--bg-sunken` background.

**`Textarea`** — Same chrome as Input, auto-grows up to a max height. Resize handle hidden.

**`SearchInput`** — Input variant with a Lucide Search icon on the left and an optional `Kbd` hint on the right (e.g., `⌘K`). Used in the doctor dashboard.

**`Label`** — `--text-xs`, `--weight-medium`, uppercase, `--tracking-widest`, `--muted` color.

**`Select`** — Custom dropdown. Same chrome as Input. Uses the `Dropdown` mechanics underneath.

**`Combobox`** — Input + filterable dropdown list. Used for specialty selection in onboarding.

**`Checkbox` / `Radio`** — 16px box, `--rule` border, `--accent` fill on check, white checkmark. Custom-styled, never browser-default. The check icon uses a Lucide Check at 12px.

**`Switch`** — 36×20px pill toggle. Off: `--bg-sunken` bg, `--rule` thumb. On: `--accent` bg, white thumb. Smooth `--dur-base` `--ease-snap` transition.

**`SegmentedControl`** — 2–4 option pill toggle. Active segment uses `--bg-raised` background with `--shadow-sm`; inactive segments are transparent. Common for "T-24h / T-2h" toggles.

**`Sheet`** — Bottom-sheet on mobile (slides up, drag-handle visible, drag-to-dismiss, 90vh max), centered modal on desktop (max-w varies, `--radius-lg`). Backdrop: `oklch(0.15 0.005 250 / 0.5)` with `backdrop-filter: blur(8px)`.

**`Dialog`** — Smaller modal for confirmations. Always centered. Max-w-md.

**`Drawer`** — Side-anchored sheet. Used for the mobile navigation alternative.

**`Toast`** — Top-right on desktop, top-center on mobile. Auto-dismiss at 4s. Variants: default, success, warning, danger. Stack with `--space-2` gap.

**`Tooltip`** — Hover/focus reveal. `--bg-overlay` bg, `--shadow-md`, `--radius-sm`. Appears after 400ms delay, dismisses immediately on leave. `--text-sm` content.

**`Popover`** — Click-triggered, persistent until dismissed. Same chrome as Tooltip but larger.

**`Dropdown` / `Menu`** — `--bg-overlay` bg, `--shadow-lg`, item rows highlight on hover (`--bg-sunken`). Keyboard-navigable with arrow keys, `Enter` to select, `Esc` to dismiss.

**`Badge`** — Pill with `--text-xs`, `--weight-medium`, uppercase. Variants: default (`--rule` border), accent (`--accent-pale` bg, `--accent` text), success, warning, danger.

**`Tag` / `Chip`** — Removable badge. Has an X icon on the right. Used for multi-select inputs.

**`Avatar`** — Round or `--radius-md`. Sizes: xs (24px), sm (32px), md (40px), lg (48px), xl (96px), hero (120px+). Initials fallback uses `--bg-sunken` background and `--ink-soft` text, semibold weight.

**`Tabs`** — Horizontal tab bar. Active tab has `--accent` 2px underline below. Underline animates position on change (`--dur-base` `--ease-snap`). Tab content area has a top border in `--rule`.

**`Progress`** — Linear (4px tall) or circular. `--accent` fill on `--bg-sunken` track. Indeterminate variant uses a sliding gradient animation.

**`Skeleton`** — Block placeholder with pulse animation. `--bg-sunken` background. The pulse is subtle — never a shimmer.

**`Spinner`** — Reserved for action buttons during submission. 16px or 20px. `--accent` color or `--accent-ink` if on an accent background.

**`Divider`** — Hairline `--rule` rule. Horizontal or vertical.

**`Kbd`** — Keyboard key indicator. Geist Mono at `--text-2xs`, `--bg-sunken` bg, `--rule` border, `--radius-xs`, 1px padding. Used in shortcuts.

**`Stat` / `MetricCard`** — Numeric data display. Label (small, muted, uppercase) above value (Geist Mono tabular, larger size). Optional delta indicator.

**`CommandPalette`** — Full-overlay search-and-action interface (`⌘K`). `--bg-overlay` bg, `--shadow-xl`. Filterable list with keyboard navigation. Items have icons, labels, and optional `Kbd` shortcut hints on the right.

### Product — Booking surface

**`ServiceCard`** — Service name (h3 size, semibold), duration · price row (`--ink-soft`, mono for the numbers), description (`--ink-faint`), tap affordance (chevron icon, `--muted`). Hover: border `--rule` → `--rule-strong`.

**`DateStrip`** — Horizontal scrollable date picker. Each date is a button: weekday (xs, uppercase, muted) above day number (lg, semibold). Today has `--accent` underline. Selected has `--accent` background, `--accent-ink` text. Days without availability dim to 50% opacity.

**`SlotList`** — Vertical list of available times. Each slot is a button at `--row-height-base`. Time displayed in Geist Mono (tabular), service end time below in `--ink-faint`. Selected: `--accent` bg, `--accent-ink` text.

**`BookingForm`** — Stacked Inputs with floating labels. Submit button uses `--accent`, full width. Inline validation below each field in `--danger`.

**`ConfirmationCard`** — Post-booking success state. `--bg-raised`, `--radius-lg`, `--shadow-sm` (the only card that gets a shadow). Status icon at top, then details, then actions.

**`WhatsAppPreview`** — The portfolio centerpiece. iPhone-style phone frame at `--radius-xl`, WhatsApp green header (#075E54), message bubbles. Variants: confirmation, reminder, reschedule, cancellation. The phone always shows light WhatsApp; the surrounding frame respects the page theme. Detailed spec lives in the Claude Code prompts.

### Product — Doctor surface

**`ProfileHero`** — Photo, name, specialty, next-available pill, primary CTA. Photo at xl avatar size (or larger on desktop). Name in `--text-3xl` semibold.

**`CredentialBadge`** — Cédula displayed with a small Check icon in `--success`. Inline with the doctor's name.

**`LocationCard`** — Address + "Cómo llegar" link (or "Online" + platform). MapPin icon, `--bg-raised`, `--radius-md`, `--rule` border.

**`NextSlotPill`** — Persistent footer indicator: "Próximo hueco libre: jueves 11:00." `--bg-sunken` bg, `--accent` text for the time, the rest `--ink-soft`. `--radius-pill`.

**`AppointmentRow`** — Time (mono, accent), patient name + initial, service name, duration badge. Compact-density variant for dashboard. Expandable inline with smooth height transition.

**`WeekCalendar`** — 7-column grid, time-of-day rows in 30-minute increments. Booked slots: `--accent-pale` bg, `--accent` 2px left border. Blocked slots: `--rule-faint` bg with diagonal hatch pattern. Out-of-hours: `--bg-sunken` bg.

**`AvailabilityGrid`** — Editor variant of WeekCalendar. Tap or drag to toggle cells. Tappable cells have visible affordance on hover (border highlight).

**`ServiceEditor`** — Inline-edit row for services. Hover reveals drag handle on the left and kebab menu on the right.

**`BlockTimeSheet`** — Sheet with date range picker, optional reason input, AffectedBookingsWarning section, pre-written WhatsApp draft component.

**`ReminderPreviewCard`** — Wraps `WhatsAppPreview` with metadata: scheduled time, countdown badge ("Faltan 14h").

**`DashboardLayout`** — The shell for `/panel/*` routes. Mobile: bottom tab bar (5 items, fixed). Desktop: left sidebar (240px, sticky). The active route has `--accent` indicator.

### Product — Marketing & meta

**`MarketingHero`** — Large headline (`--text-6xl` to `--text-7xl`, semibold, `--tracking-tight`), supporting paragraph below (`--text-lg`, `--ink-soft`), CTA button row. Sits on `--bg`, no card.

**`FeatureBlock`** — Two-column on desktop (text left, visual right), stacked on mobile. Eyebrow label above headline above body. Used for landing page feature sections.

**`ModePicker`** — The "be the doctor / be a patient" dual CTA. Two cards side-by-side on desktop, stacked on mobile. Each card: small label, title, two-line description, arrow icon. Hover: border `--rule` → `--accent`.

**`DemoRibbon`** — Persistent corner indicator. `--accent` bg, `--accent-ink` text, `--radius-pill`, `--text-2xs` weight medium. Tappable, opens info sheet about the demo.

**`HechoConVera`** — Small footer badge. `--text-sm`, `--muted` color, links back to the marketing landing.

**`ThemeToggle`** — Sun/moon Lucide icon toggle. Icon-only button. Persists choice to `localStorage`.

---

## 15 · Patterns

Composition patterns that should be consistent across the project.

### Page header

Sticky on scroll, condenses from a two-line layout (title + subtitle) to a single-line layout (title only) when scrolled past ~80px. Background transitions from transparent to `--bg/0.8` with `backdrop-filter: blur(12px)` and a `--rule` bottom border.

### Sheet/modal behavior

- **Mobile (< 768px):** bottom sheet, drag-handle visible at top, drag-to-dismiss, 90vh max height.
- **Desktop (≥ 768px):** centered modal. Max-w varies by content: sm (400px), md (560px), lg (720px).
- ESC dismisses on desktop; drag-down or tap-outside dismisses on mobile.
- Focus trap inside, return focus to trigger on dismiss.

### Empty states

Centered, restrained, no illustration. A single line of `--text-lg` `--muted` text, optionally a secondary line in `--text-sm`. No "Get started!" CTAs in empty states — empty is honest, not motivational. Example: "No hay citas hoy."

### Loading

Skeletons match content shape with subtle pulse. Spinners only on action buttons during submission. Page-level loading is a brief shimmer at the top edge (like YouTube's red bar but in `--accent`), 200ms in, persistent until data resolves.

### Errors

Inline within the affected component when possible — form field errors below the field in `--danger`. Page-level errors use a `--bg-raised` card with `--danger` left border (3px), an icon, a brief message, and a retry action. No full-page error screens unless the route literally fails.

### Density

Default compact across all product surfaces. `.density-comfortable` is applied to specific surfaces where breathing room is the point: the onboarding flow, the marketing hero, the celebration screen.

### Marketing pages share the product surface

All marketing pages (`/`, `/sobre` or similar, `/sistema`) use the same `.mode-product` scope. There is no separate marketing aesthetic. The continuity is the point: a visitor moving from `/` to `/dra-sofia-ramirez` should feel like they walked from one room to another in the same building, not like they teleported between two designs.

The only difference between marketing and product pages is the **content** and the **density** — marketing pages use `.density-comfortable` for heroes and feature blocks; product pages stay compact.

---

## 16 · Accessibility

Non-negotiable baseline.

- All interactive elements: visible `:focus-visible` state using `--focus-ring`
- Color contrast: minimum WCAG AA against the appropriate surface for body text; AAA for `--ink` on `--bg`
- Tap targets: minimum 44×44px on touch (extend hit area via padding when visual size is smaller)
- Semantic HTML — `<button>` not `<div onClick>`, `<nav>` for nav, `<main>` once per page
- Skip-to-content link on all page templates
- Form labels never replaced with placeholders alone
- `aria-label` on all icon-only buttons
- `aria-live="polite"` on toast region and dynamic updates
- Focus trap in sheets, dialogs, drawers — return focus to trigger on dismiss
- ESC key dismisses all overlays
- `prefers-reduced-motion` honored everywhere
- Color is never the sole indicator (status badges always paired with text or icon)
- Both themes meet contrast minimums independently (verify dark mode separately)

---

## 17 · File structure & implementation

```
app/
  proyectos/
    {{PROJECT_SLUG}}/
      layout.tsx              ← .proj-{{slug}} root, fonts, default theme
      page.tsx                ← landing
      sobre/page.tsx          ← about (was /manifesto)
      sistema/page.tsx        ← living style guide
      dra-sofia-ramirez/...   ← patient surface
      cita/[token]/...
      panel/...               ← doctor surface
      registro/...            ← onboarding
      _components/
        ui/                   ← foundation (Button, Input, Sheet, etc.)
        product/              ← product-specific (ProfileHero, WhatsAppPreview, etc.)
        marketing/            ← marketing-specific (MarketingHero, FeatureBlock, ModePicker)
        sistema/              ← style guide components
      _lib/
        cn.ts                 ← className utility (clsx + tailwind-merge)
        theme.ts              ← theme toggle, localStorage persistence
        ...
      _styles/
        tokens.css            ← all CSS variables, scoped to .proj-{{slug}}
        dark.css              ← .theme-dark overrides
        microinteractions.css ← focus rings, selection, scrollbars
```

Note the simplification from v0.2: no `editorial.css`, no `product.css` (since there's only product), no `grain.css`. The system has fewer files because it has fewer modes.

### Scoping pattern

```tsx
// app/proyectos/{{slug}}/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google'
import './_styles/tokens.css'
import './_styles/dark.css'
import './_styles/microinteractions.css'
import { ThemeProvider } from './_lib/theme'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export default function ProjectLayout({ children }) {
  return (
    <div className={`proj-{{slug}} ${geist.variable} ${geistMono.variable}`}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </div>
  )
}
```

The `ThemeProvider` is a small client component that:

1. Reads `localStorage.{{slug}}_theme` (values: `light`, `dark`, `auto`)
2. Reads `prefers-color-scheme` when value is `auto`
3. Applies `.theme-dark` to the project root when the resolved theme is dark
4. Provides a context for the `ThemeToggle` component
5. Is SSR-safe: renders nothing in markup, applies the class via `<script>` injection to prevent FOUC

### Tailwind extension

```ts
// tailwind.config.ts excerpt — additions only, never replace
theme: {
  extend: {
    colors: {
      bg: 'var(--bg)',
      'bg-raised': 'var(--bg-raised)',
      'bg-sunken': 'var(--bg-sunken)',
      'bg-overlay': 'var(--bg-overlay)',
      ink: 'var(--ink)',
      'ink-soft': 'var(--ink-soft)',
      'ink-faint': 'var(--ink-faint)',
      muted: 'var(--muted)',
      rule: 'var(--rule)',
      'rule-strong': 'var(--rule-strong)',
      'rule-faint': 'var(--rule-faint)',
      accent: 'var(--accent)',
      'accent-soft': 'var(--accent-soft)',
      'accent-pale': 'var(--accent-pale)',
      'accent-ink': 'var(--accent-ink)',
      success: 'var(--success)',
      warning: 'var(--warning)',
      danger: 'var(--danger)',
    },
    fontFamily: {
      sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
      mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
    },
    fontSize: {
      '2xs': 'var(--text-2xs)',
      xs: 'var(--text-xs)',
      sm: 'var(--text-sm)',
      base: 'var(--text-base)',
      md: 'var(--text-md)',
      lg: 'var(--text-lg)',
      xl: 'var(--text-xl)',
      '2xl': 'var(--text-2xl)',
      '3xl': 'var(--text-3xl)',
      '4xl': 'var(--text-4xl)',
      '5xl': 'var(--text-5xl)',
      '6xl': 'var(--text-6xl)',
      '7xl': 'var(--text-7xl)',
    },
    borderRadius: {
      xs: 'var(--radius-xs)',
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      xl: 'var(--radius-xl)',
    },
    boxShadow: {
      sm: 'var(--shadow-sm)',
      md: 'var(--shadow-md)',
      lg: 'var(--shadow-lg)',
      xl: 'var(--shadow-xl)',
    },
  },
}
```

---

## 18 · What not to do

- Don't introduce additional typefaces. Two is the ceiling.
- Don't add gradients. Premium products earn gradients over years; we have not.
- Don't use icons without labels in product flows. Lucide is decorative, not navigational.
- Don't use serif type anywhere in the product. If you find yourself reaching for Fraunces or any serif, the answer is bolder weight or larger size in Geist.
- Don't use italic display type. It reads editorial; we are not editorial.
- Don't introduce blue, green, or purple as primary palette colors. The accent is terracotta. Semantic colors (success/warning/danger) exist but are used only for their semantic purpose.
- Don't use emoji in product copy.
- Don't replicate davhera.com's components — build fresh inside the scope.
- Don't use pure black (`#000`) or pure white anywhere except the `--bg-raised` token in light mode.
- Don't ship light mode only. Both themes are first-class from day one.
- Don't use shadows on cards in light mode. The surface contrast is enough.
- Don't use `ease-in-out` from the browser default. Use the named easings.
- Don't write essay-style marketing copy. Product copy is direct and structural.
- Don't add paper grain overlays, drop caps, pull quotes, sidenotes, ornament dividers, footnotes, or any other editorial chrome.
- Don't use page padding above 32px on desktop. Premium content reaches closer to the edge.
- Don't use heading weights above 700.

---

## 19 · Maintenance & versioning

This document is the source of truth. When a new component is built or a token is added, **update this document in the same commit**. Drift between the system and the code is what kills design systems.

A `/sistema` page in the project renders this document's tokens visually so the system is inspectable in the running app.

### Versioning

Breaking changes (token name changes, component API changes) require a major version. Token value changes are minor. Documentation refinements are patch.

- **v0.1** — initial system, editorial + product modes
- **v0.2** — added dark mode, OKLCH, surface system, microinteractions
- **v0.3** — *current.* Removed editorial mode entirely. Single product surface, light + dark. Reduced to two typefaces. Compact-by-default density. Snap-tight motion. Marketing pages share the product surface.

If v0.1 or v0.2 prompts have already been run, the values in `tokens.css`, the font loading in `layout.tsx`, and a small handful of components reference the old system. A focused migration commit will update those — see the Claude Code prompt set for migration steps.

---

*Design System v0.3 · {{PROJECT_NAME}} · Series Document № 005 (Premium Product)*
