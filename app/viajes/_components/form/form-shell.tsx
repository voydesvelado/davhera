"use client";

import Link from "next/link";
import Image from "next/image";
import {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Trip } from "../../_lib/trips";
import {
  loadLeadState,
  saveLeadStep,
  subscribeLeadState,
  type LeadStep,
  type LeadState,
} from "../../_lib/lead-store";
import { parseStep } from "../../_lib/form-schema";
import { StepProgress } from "./step-progress";
import { StepTrip } from "./step-trip";
import { StepContact } from "./step-contact";
import { StepDetails } from "./step-details";
import { StepConfirmation } from "./step-confirmation";
import { ExitIntent } from "./exit-intent";
import { Button } from "../button";

const EASE = [0.22, 1, 0.36, 1] as const;

const PRICE_FORMAT = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export type StepCommon = {
  state: LeadState;
  errors: Record<string, string>;
  onChange: (patch: Partial<LeadState>) => void;
};

function ssrFallback(): LeadState {
  return { session_id: "", step: 1, status: "partial" };
}

export function FormShell({ trip }: { trip: Trip }) {
  const prefersReducedMotion = useReducedMotion();

  // Persisted state from localStorage. SSR returns the fallback; the client
  // re-renders with the real value automatically — no setState-in-effect.
  const persisted = useSyncExternalStore(
    subscribeLeadState,
    loadLeadState,
    ssrFallback,
  );

  // In-progress edits the user has typed but not yet pressed Continuar on.
  // Cleared each time we successfully save a step.
  const [draft, setDraft] = useState<Partial<LeadState>>({
    personas_adultos: 2,
    personas_ninos: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [summaryOpen, setSummaryOpen] = useState(false);

  // Effective state = persisted + draft + trip-from-URL (URL wins for trip,
  // so a stale localStorage record can't lock the user on a different trip).
  const state: LeadState = useMemo(
    () => ({
      ...persisted,
      ...draft,
      trip_slug: trip.slug,
      trip_name: trip.name,
    }),
    [persisted, draft, trip.slug, trip.name],
  );

  const step = state.step;

  const onChange = useCallback((patch: Partial<LeadState>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(patch)) delete next[key];
      return next;
    });
  }, []);

  const next = useCallback(() => {
    if (step === 4) return;
    const stepNumber = step as 1 | 2 | 3;
    const result = parseStep(
      stepNumber,
      state as unknown as Record<string, unknown>,
    );
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    const nextStep = (step + 1) as LeadStep;
    saveLeadStep(nextStep, {
      ...state,
      step: nextStep,
      status: nextStep === 4 ? "completo" : "partial",
    });
    setDraft({});
    setErrors({});
  }, [step, state]);

  const back = useCallback(() => {
    if (step === 1) return;
    saveLeadStep((step - 1) as LeadStep, { ...state, step: (step - 1) as LeadStep });
    setErrors({});
  }, [step, state]);

  // Enter-key submits the active step (skip on textarea — Enter is newline there).
  useEffect(() => {
    if (step === 4) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const tag = target.tagName?.toLowerCase();
      if (tag === "textarea") return;
      if (target.getAttribute("data-form-trigger") === "false") return;
      e.preventDefault();
      next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, next]);

  const common: StepCommon = useMemo(
    () => ({ state, errors, onChange }),
    [state, errors, onChange],
  );

  const ctaLabel = step === 3 ? "Enviar" : "Continuar";

  const stepValid = useMemo(() => {
    if (step === 4) return true;
    const result = parseStep(
      step as 1 | 2 | 3,
      state as unknown as Record<string, unknown>,
    );
    return result.success;
  }, [step, state]);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <header className="h-16 lg:h-20 border-b border-border-token flex items-center px-6 lg:px-12">
        <Link href="/viajes" className="text-display-md font-display text-fg">
          VIAJES
        </Link>
        <Link
          href={`/viajes/${trip.slug}`}
          aria-label="Cerrar y volver al viaje"
          className="ml-auto inline-flex items-center justify-center h-11 w-11 rounded-md text-fg hover:bg-fg/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <X className="h-6 w-6" strokeWidth={1.5} />
        </Link>
      </header>

      <div className="lg:hidden border-b border-border-token bg-bg-elevated">
        <button
          type="button"
          onClick={() => setSummaryOpen((v) => !v)}
          className="w-full px-6 py-4 flex items-center justify-between text-left"
          aria-expanded={summaryOpen}
          data-form-trigger="false"
        >
          <span>
            <span className="block text-eyebrow text-fg-muted">Cotizando</span>
            <span className="block text-body font-medium text-fg mt-1">
              {trip.name}
            </span>
          </span>
          <span className="text-body-sm text-fg-muted inline-flex items-center gap-1">
            Ver detalle
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                summaryOpen && "rotate-180",
              )}
              strokeWidth={1.75}
            />
          </span>
        </button>
        <AnimatePresence initial={false}>
          {summaryOpen ? (
            <motion.div
              key="summary-detail"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <TripSummaryBody trip={trip} compact />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[55%_45%]">
        <div className="flex flex-col px-6 lg:px-16 py-10 lg:py-16">
          {step !== 4 ? (
            <div className="max-w-xl mx-auto w-full">
              <StepProgress current={step} />
            </div>
          ) : null}

          <div className="flex-1 max-w-xl mx-auto w-full mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 8 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -8 }
                }
                transition={{ duration: 0.35, ease: EASE, delay: 0.05 }}
              >
                {step === 1 ? <StepTrip {...common} trip={trip} /> : null}
                {step === 2 ? <StepContact {...common} /> : null}
                {step === 3 ? <StepDetails {...common} /> : null}
                {step === 4 ? (
                  <StepConfirmation {...common} trip={trip} />
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>

          {step !== 4 ? (
            <div className="max-w-xl mx-auto w-full mt-12 flex items-center justify-between gap-4">
              {step > 1 ? (
                <Button variant="ghost" size="md" onClick={back} type="button">
                  Atrás
                </Button>
              ) : (
                <span />
              )}
              <Button
                variant="primary"
                size="md"
                onClick={next}
                type="button"
                disabled={!stepValid}
              >
                {ctaLabel}
              </Button>
            </div>
          ) : null}
        </div>

        <aside className="hidden lg:block border-l border-border-token bg-bg-elevated">
          <TripSummaryBody trip={trip} />
        </aside>
      </div>

      <ExitIntent activeStep={step} />
    </div>
  );
}

function TripSummaryBody({ trip, compact = false }: { trip: Trip; compact?: boolean }) {
  return (
    <div className={cn("p-6 lg:p-10", compact && "py-6")}>
      <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden bg-fg/5">
        <Image
          src={trip.coverImage}
          alt={`${trip.name} — ${trip.destination}.`}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="mt-6 space-y-2">
        <p className="text-eyebrow text-fg-muted">{trip.country}</p>
        <h2 className="text-display-md font-display text-fg">{trip.name}</h2>
        <p className="text-body-sm text-fg-muted">{trip.duration}</p>
        <p className="text-body text-fg">
          Desde {PRICE_FORMAT.format(trip.priceFrom)} MXN
        </p>
      </div>
      <p className="mt-6 text-body text-fg-muted leading-relaxed">
        {trip.tagline}
      </p>
    </div>
  );
}
