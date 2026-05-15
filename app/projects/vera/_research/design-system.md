# Design System — `{{PROJECT_NAME}}`

> **Working codename suggestions:** Cita · Vera · Aurelia · Nido · Cura · Trama
> Replace `{{PROJECT_NAME}}` throughout once decided.

---

## 0 · Context

This project lives inside the `davhera.com` Next.js repository as a routed portfolio piece (suggested route: `/proyectos/{{PROJECT_SLUG}}`). The portfolio site already has its own typography, color, and component conventions. **This design system must coexist with, not collide with, the parent site.**

The strategy is **scoped isolation**:

- All project styles are namespaced under a root class (e.g. `.proj-{{PROJECT_SLUG}}`) applied at the project's root layout.
- Design tokens are exposed as **CSS custom properties** scoped to that root class — never on `:root`.
- The project's fonts are loaded via `next/font` inside the project layout, not globally.
- The project has its own Tailwind theme extension exposed via CSS variables, so Tailwind utilities like `text-ink` or `bg-bg` resolve to the project's palette only inside the scope.

If a value isn't tokenized in this document, don't invent one — extend the system first.

---

## 1 · The two visual modes

The project speaks in two voices that share a single skeleton.

### Mode A — **Editorial** (Marketing surface)

For `/`, `/manifesto`, `/sistema`, and any long-form content. Inherits the language of the research documents in this series. Warm cream paper, deep terracotta accent, serif throughout, generous whitespace. Reads like a published essay.

### Mode B — **Product** (Application surface)

For the doctor's public profile, the booking flow, the dashboard, the onboarding. Cooler off-white, softer accent, mixed serif/sans typography, denser information. Reads like a calm, premium product designed for someone brand-conscious.

The two modes share the same display typeface (Fraunces) and the same accent hue at different saturations. The seam between them is intentional — switching modes should feel like turning a page in the same book, not opening a different book.

**Implementation:** Mode is set via a class on the project root: `.mode-editorial` or `.mode-product`. Each mode redefines a subset of the CSS variables.

---

## 2 · Brand voice

Brief enough to be remembered, opinionated enough to be useful.

- **Doctor-first, never directory.** Copy never positions the platform above the doctor. The product is her tool.
- **Calm, not clinical.** The tone is closer to a thoughtful assistant than to a healthcare brand.
- **Spanish-native.** All product copy in Mexican Spanish. No translated Anglicisms — *agenda*, not *calendario digital*; *cita*, not *appointment*.
- **One emoji maximum** in any reminder; zero in transactional confirmations.
- **No exclamation marks in product copy.** They read as marketing.

---

## 3 · Color

### Editorial mode

Warm, paper-like, intentionally limited. Five hues, used at varying saturations.

```css
.mode-editorial {
  --bg:          #F4EFE4;  /* warm cream paper */
  --bg-2:        #EBE4D3;  /* deeper paper, for cards */
  --bg-3:        #E4DBC5;  /* deepest, for ornament */
  --ink:         #1A1816;  /* near-black, warmed */
  --ink-soft:    #2C2924;  /* body text */
  --muted:       #6E665A;  /* metadata, captions */
  --rule:        #CFC6B3;  /* dividers */
  --rule-soft:   #DDD4C1;  /* light dividers */
  --accent:      #8B2E1F;  /* deep terracotta */
  --accent-soft: #B85940;  /* hover, links */
  --accent-pale: #F1E3DE;  /* tinted backgrounds */
}
```

### Product mode

Cooler, brighter, more clinical-adjacent — but still warm enough to feel human. Sofía's brand could plausibly live here.

```css
.mode-product {
  --bg:          #FAFAF7;  /* off-white */
  --bg-2:        #F2F0EA;  /* card surface */
  --bg-3:        #E8E5DD;  /* depth */
  --ink:         #0F1418;  /* near-black, cooled */
  --ink-soft:    #2A2F35;  /* body */
  --muted:       #6B7280;  /* metadata */
  --rule:        #E3DFD5;  /* dividers */
  --rule-soft:   #EEEAE0;  /* light dividers */
  --accent:      #A04030;  /* terracotta, slightly lighter than editorial */
  --accent-soft: #C76957;  /* hover */
  --accent-pale: #F5E8E3;  /* tinted surfaces */

  /* semantic states (product only) */
  --success:     #4A6B3F;  /* booking confirmed */
  --warning:     #B8851F;  /* slot taken, rescheduled */
  --danger:      #8B2E1F;  /* cancellation, errors */
}
```

### Semantic naming rule

Components reference `var(--ink)`, `var(--accent)`, etc. — never raw hex values. If a component needs a state color, use `--success` / `--warning` / `--danger` (product mode only).

---

## 4 · Typography

### Typefaces

Three typefaces, each with a defined role. All loaded via `next/font/google` inside the project layout to avoid affecting the parent site.

| Role | Typeface | Modes |
|------|----------|-------|
| Display & emphasis | **Fraunces** (variable, opsz + SOFT axes) | Both |
| Editorial body | **Newsreader** (variable) | Editorial only |
| Product UI body | **Geist Sans** (variable) | Product only |
| Code & technical | **JetBrains Mono** | Both, sparingly |

Why three: Fraunces gives the project its voice across modes. Newsreader carries the editorial body — serif, optical-size aware, reads like a magazine. Geist Sans is the product's working voice — neutral, modern, dense-information-friendly, and notably it is *not* Inter (which would feel generic for a design-engineering portfolio).

### Type scale

A modular scale based on a 1.25 minor third. Sizes named by semantic role, not by pixel value.

```css
--text-caption:    12px;   /* labels, meta */
--text-small:      13px;   /* secondary info */
--text-sm:         15px;   /* compact body */
--text-base:       17px;   /* product body */
--text-body:       19px;   /* editorial body */
--text-lead:       22px;   /* lede paragraphs */
--text-h4:         24px;   /* small headings */
--text-h3:         28px;   /* mid headings */
--text-h2:         38px;   /* section headings */
--text-h1:         54px;   /* page titles */
--text-display:    72px;   /* cover titles */
```

Headings scale fluidly between breakpoints using `clamp()`. The values above are desktop ceilings.

### Treatments

**Editorial mode display** uses Fraunces with `font-variation-settings: "opsz" 144, "SOFT" 30` — a soft, contemporary serif feel. Italic emphasis uses `"SOFT" 100` for an even softer optical quality.

**Product mode display** uses Fraunces with `"opsz" 72, "SOFT" 50` — slightly more functional, less editorial. Italic is reserved for emphasis only.

**Drop caps**, **pull quotes**, **sidenotes**, **footnotes**, and **small caps** are editorial-mode-only by default. The product mode is plainer.

### Line height & tracking

```css
--leading-tight:   1.05;   /* display */
--leading-snug:    1.2;    /* headings */
--leading-normal:  1.45;   /* body */
--leading-relaxed: 1.55;   /* editorial body */

--tracking-tight:  -0.025em; /* display */
--tracking-snug:   -0.015em; /* h2 */
--tracking-normal: 0;        /* body */
--tracking-wide:   0.18em;   /* small caps, labels */
--tracking-wider:  0.22em;   /* eyebrows */
```

---

## 5 · Spacing

A 4-pixel base unit, exposed as named tokens. **Components should reference named tokens, not raw pixels.**

```css
--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-5:   20px;
--space-6:   24px;
--space-8:   32px;
--space-10:  40px;
--space-12:  48px;
--space-16:  64px;
--space-20:  80px;
--space-24:  96px;
--space-32:  128px;
```

### Spacing patterns

- **Inline (within a line):** `space-1` to `space-3`
- **Stacked (between siblings):** `space-4` to `space-6`
- **Section gaps:** `space-12` to `space-20`
- **Cover whitespace:** `space-24` and above

---

## 6 · Layout

### Container widths

| Token | Width | Use |
|-------|-------|-----|
| `--max-prose` | 680px | Editorial reading column |
| `--max-product` | 720px | Product surfaces (slightly wider for two-column patterns) |
| `--max-wide` | 1080px | Marketing hero sections, the style guide grid |
| `--max-full` | 100% | Edge-to-edge backgrounds |

### Page padding

```css
--page-px-mobile:  20px;
--page-px-tablet:  28px;
--page-px-desktop: 28px;  /* still narrow — content stays centered */
```

### Grid

The project rarely needs a grid system in the marketing mode (single-column editorial). The product mode uses a 12-column fluid grid for the dashboard week view and a 7-column grid for calendar surfaces. No CSS framework grid — use CSS Grid directly with the spacing tokens.

---

## 7 · Radii

Restrained. The editorial mode uses almost no radius; the product mode uses gentle radii to feel touch-friendly.

```css
--radius-none: 0;
--radius-xs:   2px;   /* hairline detail */
--radius-sm:   4px;   /* product buttons, inputs */
--radius-md:   8px;   /* cards, sheets */
--radius-lg:   12px;  /* hero cards */
--radius-pill: 9999px;
```

Editorial mode defaults to `--radius-none` on most surfaces. Product mode defaults to `--radius-sm` on interactive elements, `--radius-md` on cards.

---

## 8 · Elevation

Editorial mode uses **no shadows**. Depth is communicated through borders, rules, and background shifts.

Product mode uses three elevations, each warm-toned:

```css
--shadow-sm: 0 1px 2px rgba(15, 20, 24, 0.04),
             0 1px 3px rgba(15, 20, 24, 0.06);
--shadow-md: 0 4px 12px rgba(15, 20, 24, 0.06),
             0 2px 4px rgba(15, 20, 24, 0.04);
--shadow-lg: 0 16px 40px rgba(15, 20, 24, 0.08),
             0 4px 12px rgba(15, 20, 24, 0.04);
```

Used on: floating sheets, dropdowns, the WhatsAppPreview phone frame, toast notifications.

---

## 9 · Motion

The project's motion language is restrained — fast for utility, slow for atmosphere. Never bouncy.

### Durations

```css
--dur-instant: 100ms;  /* state changes */
--dur-fast:    150ms;  /* hovers, focus */
--dur-base:    250ms;  /* most transitions */
--dur-slow:    400ms;  /* sheet entry, page transitions */
--dur-ambient: 700ms;  /* atmospheric reveals */
```

### Easing

```css
--ease-out:     cubic-bezier(0.2, 0, 0, 1);    /* default entrance */
--ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1);  /* state transitions */
--ease-emphasis: cubic-bezier(0.16, 1, 0.3, 1); /* hero moments */
```

### Patterns

- **Entrances:** fade + 8px vertical slide, `--dur-slow` `--ease-out`
- **Exits:** fade only, `--dur-base` `--ease-in-out`
- **Hover:** color/opacity only, `--dur-fast` `--ease-out`
- **Page transitions (Framer Motion):** opacity + 12px slide, staggered children at 60ms

### Reduced motion

All non-essential motion respects `prefers-reduced-motion: reduce`. Page transitions become fades; hover micro-movement is removed.

---

## 10 · Iconography

**Lucide icons** at 1.5px stroke. No icon families mixed.

- Default size: 18px (inline) or 20px (standalone)
- Stroke weight: 1.5
- Color: `currentColor` (inherits from text)
- Never used as the sole interaction signal — always paired with a label, unless space is impossible (e.g., toolbar icons with `aria-label`).

No custom illustrations in V1. The WhatsAppPreview component contains its own bespoke SVG details (checkmarks, phone frame) but those aren't iconography — they're product UI.

---

## 11 · Components

The component layer. Each is referenced by name in the Claude Code prompts that follow this document. The intent here is to fix the *visual contract* — the component's API and exact implementation are the engineer's call.

### Foundation

**`Button`** — Primary, Secondary, Ghost. Sizes: sm (32px), md (40px), lg (48px). Primary uses `--accent` background; Secondary uses transparent with `--rule` border; Ghost uses no border/background. Editorial mode buttons have no radius; product mode uses `--radius-sm`.

**`Input`** — Text, email, phone (with MX format affordance: `+52 · 55 · 1234 5678` visual mask), textarea. Height matches Button sizes. Border on bottom only in editorial; full border in product.

**`Label`** — Small caps, `--text-caption`, tracking-wide, `--muted` color.

**`Sheet`** — Bottom-sheet on mobile (slides up from bottom, drag-handle, 90vh max), modal on desktop (centered, max-w-md). Same component, responsive behavior. Backdrop: `rgba(15, 20, 24, 0.4)` with backdrop-blur-sm.

**`Toast`** — Top-right (desktop) or top-center (mobile). Auto-dismiss at 4s. Three states using semantic colors.

**`Badge`** — Small caps text, optional dot indicator. Used for booking status, demo ribbon, credentials.

### Editorial-only

**`DropCap`** — First letter of lede paragraphs. Fraunces 72px, `--accent`, floated left.

**`PullQuote`** — `--accent` left border, italic Fraunces, optional attribution in small caps.

**`Sidenote`** — `--bg-2` background, `--rule` left border, smaller type, italic label.

**`OrnamentRule`** — Centered three-dot divider replacing standard `<hr>`.

**`Eyebrow`** — Small caps section label with `--accent` color and bottom border.

**`Footnote`** — Superscript reference link, footnote list at end of section.

### Product-only

**`ProfileHero`** — Photo (round or rounded-md), name, specialty, "Próxima disponibilidad" pill, primary CTA. Above the fold on `/dra-sofia-ramirez`.

**`ServiceCard`** — Name, duration · price, description, tap-to-book CTA. Stacked in lists; consistent height across the list.

**`DateStrip`** — Horizontal scrollable date selector. Today highlighted with `--accent` underline. Days without availability dimmed but visible.

**`SlotList`** — Vertical list of available times. Tap selects. Selected state inverts colors.

**`BookingForm`** — Name, phone, email, optional note. Submit button uses `--accent`. Validation inline, not in toast.

**`ConfirmationCard`** — Post-booking success state. Service, date, time, location. "Agregar al calendario" + reschedule/cancel actions.

**`WhatsAppPreview`** — The portfolio centerpiece. A realistic phone frame (status bar, WhatsApp green header, message bubbles) rendering the actual template content. Should be more polished than any other component. Three variants: confirmation, reminder, reschedule.

**`AppointmentRow`** — Time, patient name, service, duration. Tap to expand inline (reveals phone, note, actions). Used on dashboard.

**`WeekCalendar`** — 7-column grid, time-of-day rows. Booked slots filled with `--accent-pale` background and `--accent` border. Blocked slots use `--rule-soft` background.

**`AvailabilityGrid`** — Editor variant of WeekCalendar. Tap cells to toggle availability windows.

**`NextSlotPill`** — Persistent footer indicator: "Próximo hueco libre: jueves 11:00." `--bg-2` background, `--accent` text for the time.

**`BlockTimeSheet`** — Date range picker, optional reason, list of affected bookings with pre-written WhatsApp message offered for each.

**`DemoRibbon`** — Persistent corner indicator. `--accent` background, white text, small. Tappable, opens an info sheet.

**`ModePicker`** — On the marketing landing, the dual CTA: "Ver como doctora" / "Ver como paciente." Two cards side-by-side on desktop, stacked on mobile.

---

## 12 · Page surfaces

How the components compose into page-level layouts.

### Editorial page surface (`/`, `/manifesto`, `/sistema`)

- Single 680px reading column, centered
- Page padding: 64px top (desktop) / 44px (mobile)
- Cover block at top: meta line · eyebrow · h1 · deck · meta line
- Section heads: section number (italic, accent) · h2 with mixed italic/roman
- Generous vertical rhythm: `--space-16` between sections
- Subtle paper grain via SVG noise overlay (existing pattern from research docs)
- Subtle radial gradients at corners

### Product page surface (`/dra-sofia-ramirez`, `/panel/*`, `/registro`)

- Wider container (720px) with denser information
- Less vertical whitespace
- Section heads smaller, no italic flourish
- Solid backgrounds; no grain overlay
- Sticky elements: `NextSlotPill` on dashboard, page header on long scrolls

---

## 13 · Accessibility

Non-negotiable baseline.

- All interactive elements: visible focus state (`--accent` outline, 2px offset)
- Color contrast: minimum WCAG AA against `--bg` for body text, AAA for `--ink` on `--bg`
- Tap targets: minimum 44px on touch surfaces
- Semantic HTML always — `<button>` not `<div onClick>`, `<nav>` for nav, `<article>` for editorial content
- Skip-to-content link on all page templates
- Form labels never replaced with placeholders alone — placeholders are hints, not labels
- `aria-label` on all icon-only buttons
- Reduced motion honored throughout

---

## 14 · File structure

The recommended structure inside the davhera.com repo:

```
app/
  proyectos/
    {{PROJECT_SLUG}}/
      layout.tsx              ← applies .proj-{{slug}} class, loads fonts
      page.tsx                ← marketing landing
      manifesto/page.tsx
      sistema/page.tsx        ← style guide
      dra-sofia-ramirez/
        page.tsx              ← profile
        reservar/page.tsx     ← booking sheet
      cita/[token]/
        page.tsx              ← confirmation
        reagendar/page.tsx
        cancelar/page.tsx
      panel/
        page.tsx              ← today view
        semana/page.tsx
        servicios/page.tsx
        disponibilidad/page.tsx
        perfil/page.tsx
        proximos-recordatorios/page.tsx
      registro/page.tsx       ← onboarding flow
      _components/            ← project-only components
      _lib/                   ← project-only utilities
      _styles/
        tokens.css            ← all CSS variables, scoped to .proj-{{slug}}
        editorial.css         ← .mode-editorial overrides
        product.css           ← .mode-product overrides
        grain.svg             ← inline data url, or imported asset
```

### Scoping pattern

The root layout file applies the scope:

```tsx
// app/proyectos/{{slug}}/layout.tsx
import { Fraunces, Newsreader, Geist_Sans, JetBrains_Mono } from 'next/font/google'
import './_styles/tokens.css'
import './_styles/editorial.css'
import './_styles/product.css'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' })
// ... other fonts

export default function ProjectLayout({ children }) {
  return (
    <div className={`proj-{{slug}} ${fraunces.variable} ${newsreader.variable} ${geist.variable}`}>
      {children}
    </div>
  )
}
```

Each page declares its mode:

```tsx
// app/proyectos/{{slug}}/page.tsx
export default function Landing() {
  return <div className="mode-editorial"> ... </div>
}

// app/proyectos/{{slug}}/dra-sofia-ramirez/page.tsx
export default function Profile() {
  return <div className="mode-product"> ... </div>
}
```

This guarantees:
- davhera.com's typography never leaks in (the project class re-anchors fonts via CSS variables)
- The project's typography never leaks out (variables are scoped)
- Tailwind utility classes resolve to project tokens only inside `.proj-{{slug}}` via the `@layer` pattern below

### Tailwind extension pattern

Use Tailwind's CSS-variable theme pattern. In the project's CSS:

```css
/* tokens.css */
.proj-{{slug}} {
  /* base tokens (Editorial mode by default) */
  --bg: #F4EFE4;
  --ink: #1A1816;
  --accent: #8B2E1F;
  /* ...all tokens */
}

.proj-{{slug}}.mode-product,
.proj-{{slug}} .mode-product {
  --bg: #FAFAF7;
  --ink: #0F1418;
  --accent: #A04030;
  /* ...overrides */
}
```

Then in Tailwind config (if v3) or theme CSS (if v4), expose color utilities backed by these variables:

```js
// tailwind.config.ts excerpt — only add inside the project scope if possible
theme: {
  extend: {
    colors: {
      bg: 'var(--bg)',
      ink: 'var(--ink)',
      'ink-soft': 'var(--ink-soft)',
      muted: 'var(--muted)',
      accent: 'var(--accent)',
      'accent-soft': 'var(--accent-soft)',
      // ...
    },
    fontFamily: {
      fraunces: ['var(--font-fraunces)', 'Georgia', 'serif'],
      newsreader: ['var(--font-newsreader)', 'Georgia', 'serif'],
      geist: ['var(--font-geist)', 'system-ui', 'sans-serif'],
      mono: ['var(--font-mono)', 'monospace'],
    },
  },
}
```

If the existing davhera.com Tailwind config uses different token names, **do not rename them globally** — add the project's tokens as additions. The existing site continues to work unchanged.

---

## 15 · Reference: the editorial cover pattern

For consistency across `/`, `/manifesto`, and the style guide, the editorial cover follows a fixed pattern:

```
┌─────────────────────────────────────┐
│ META · LEFT          META · RIGHT   │  ← small caps, --muted
│                                     │
│                                     │
│ EYEBROW                             │  ← small caps, --accent, with underline
│                                     │
│ Title with                          │  ← Fraunces display
│ mixed italic                        │
│ emphasis.                           │
│                                     │
│ Deck paragraph in italic            │  ← Newsreader italic, --ink-soft
│ Newsreader, max 540px.              │
│                                     │
│ ─────────────────────────────────── │
│ Foot meta · italic · --muted        │
└─────────────────────────────────────┘
```

This is the visual identity of the marketing surface.

---

## 16 · What not to do

A short list of choices that would break the system.

- ❌ Don't introduce additional typefaces. Three is the ceiling.
- ❌ Don't add gradient backgrounds in product mode. The atmosphere is in the type and the whitespace.
- ❌ Don't use icons without labels in product flows (Lucide is decorative, not navigational).
- ❌ Don't use rounded-full buttons. The radius scale tops out at `--radius-lg` for content; `--radius-pill` is reserved for badges only.
- ❌ Don't introduce blue, green, or purple anywhere. The palette is warm — terracotta, cream, ink. The only color outside this is the semantic state colors in product mode (sage success, amber warning).
- ❌ Don't use emoji in the marketing pages. The editorial mode is emoji-free.
- ❌ Don't replicate davhera.com's components — build fresh inside the scope.

---

## 17 · Maintenance

This document is the source of truth. When a new component is built or a token is added, **update this document in the same commit**. Drift between the system and the code is what kills design systems.

A `/sistema` page in the project renders this document's tokens visually so the system is inspectable in the running app.

---

*Design System v0.1 · {{PROJECT_NAME}} · Series Document № 005*
