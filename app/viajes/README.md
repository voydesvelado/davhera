# `/viajes` — travel agency landing

Premium minimalist landing for a Mexican travel agency. All UI copy is in
neutral Latin-American Spanish (Mexican-leaning, `tú`). All code, file names,
and component names are in English.

## Route map

| Path                              | Type        | Purpose                                          |
| --------------------------------- | ----------- | ------------------------------------------------ |
| `/viajes`                         | Server      | Landing — hero, catalog grid, testimonials, CTA  |
| `/viajes/[slug]`                  | SSG         | Trip detail (hero, overview, highlights, itin.)  |
| `/viajes/cotizar/[slug]`          | SSG         | Multi-step quote form for a specific trip        |

Pages are server components by default. The filter pills, form, exit-intent
modal, and floating WhatsApp button are the only client islands.

## File layout

```
app/viajes/
  layout.tsx                 // nav + footer + WhatsApp FAB
  page.tsx                   // landing
  viajes.css                 // tokens scoped to .viajes-scope
  [slug]/page.tsx            // trip detail
  cotizar/
    layout.tsx               // minimal (no FAB / no Footer)
    [slug]/page.tsx          // form page
  _components/
    nav | footer | whatsapp-fab | button | eyebrow | section
    hero | trip-card | trip-grid | testimonials | trip-hero-image
    form/
      form-shell             // state machine + 55/45 layout
      step-progress | field | date-range-picker | number-stepper
      step-trip | step-contact | step-details | step-confirmation
      exit-intent
  _lib/
    fonts.ts                 // next/font Fraunces + Inter
    trips.ts                 // mock catalog (6 trips)
    form-schema.ts           // zod per-step schemas + parseStep()
    lead-store.ts            // session id + saveLeadStep + sendLeadStep stub
```

## Design tokens

Defined in `app/viajes/viajes.css`. Tailwind v4 reads `@theme` tokens and
emits the utilities below. `.viajes-scope` is the runtime hook that overrides
the global `--font-display` and `--color-accent` for `/viajes` only — the
rest of the site keeps its orange + Plus Jakarta brand.

**Colors:** `bg`, `bg-elevated`, `fg`, `fg-muted`, `fg-subtle`, `border-token`,
`accent`, `accent-hover`, `accent-fg`.

**Type scale:** `text-display-2xl`, `text-display-xl`, `text-display-lg`,
`text-display-md`, `text-heading-lg`, `text-heading-md`, `text-body-lg`,
`text-body`, `text-body-sm`, `text-eyebrow`.

**Fonts:** `font-display` = Fraunces (italic axis enabled), `font-sans` = Inter.

## Lead-store contract

The form persists progress to `localStorage` so closing the tab and reopening
restores the in-progress quote. Each Continuar call triggers `saveLeadStep()`,
which both writes locally and (today, a stub) would `fetch()` the partial lead
to the backend. **Step 2 of the form is the partial-lead milestone** — the
contact info is already captured before the user finishes.

```ts
// app/viajes/_lib/lead-store.ts
type LeadState = {
  session_id: string;
  step: 1 | 2 | 3 | 4;
  status: "partial" | "completo";
  trip_slug?: string; trip_name?: string;
  fecha_salida?: string; fecha_regreso?: string;
  nombre?: string; whatsapp?: string; email?: string;
  personas_adultos?: number; personas_ninos?: number;
  presupuesto_rango?: string; notas?: string;
  updated_at?: string;
};

saveLeadStep(step, partial) // merge + persist + sendLeadStep()
```

### Swapping in the Apps Script endpoint

When the backend is ready, replace the stub in `sendLeadStep()`. Nothing else
needs to change.

```ts
async function sendLeadStep(state: LeadState) {
  await fetch(ENDPOINT, {
    method: "POST",
    body: JSON.stringify(state),
    headers: { "Content-Type": "text/plain;charset=utf-8" },
  });
  notify();
}
```

## Pre-launch checklist

- [ ] Replace WhatsApp placeholder `525500000000` everywhere
      (`grep -r 525500000000 app/viajes`)
- [ ] Replace Unsplash photography with the agency's own / licensed shots
- [ ] Decide on pricing display ("Desde $X,XXX MXN" vs. "Bajo cotización")
- [ ] Add LFPDPPP consent checkbox to step 2 + a real privacy page
- [ ] Wire GA4 + Meta Pixel: `view_trip`, `start_quote`,
      `complete_step_2`, `complete_quote`
- [ ] Confirm agency wordmark + replace the `VIAJES` placeholder in
      `nav.tsx` and `footer.tsx`
