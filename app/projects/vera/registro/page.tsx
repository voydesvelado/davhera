"use client";

import { useMemo, useReducer, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Copy, ExternalLink } from "lucide-react";

import {
  OnboardingShell,
  OnboardingHeading,
  OnboardingLede,
} from "../_components/product/onboarding/OnboardingShell";
import { FloatingLabelInput } from "../_components/product/onboarding/FloatingLabelInput";
import { SpecialtyAutocombobox } from "../_components/product/onboarding/SpecialtyAutocombobox";
import { SlugPreview } from "../_components/product/onboarding/SlugPreview";
import { EmbeddedProfilePreview } from "../_components/product/onboarding/EmbeddedProfilePreview";
import { Button } from "../_components/ui/Button";
import { IconButton } from "../_components/ui/IconButton";
import { Spinner } from "../_components/ui/Spinner";
import { PhoneInput } from "../_components/ui/PhoneInput";
import { Input } from "../_components/ui/Input";
import { useToast } from "../_components/ui/Toast";
import { ServiceCard } from "../_components/product/ServiceCard";
import { WhatsAppPreview } from "../_components/product/booking/WhatsAppPreview";
import { AvailabilityGrid } from "../_components/product/doctor/AvailabilityGrid";
import { AvailabilitySummary } from "../_components/product/doctor/AvailabilitySummary";
import { SEED_DOCTOR, SOFIA_ID } from "../_lib/seed";
import type { AvailabilityRule, Booking, Service } from "../_lib/types";

type Step = 1 | 2 | 3 | 4 | 5 | 6;
const TOTAL = 6 as const;

interface State {
  step: Step;
  email: string;
  name: string;
  specialty: string;
  serviceName: string;
  serviceDuration: number;
  servicePrice: number;
  whatsappDigits: string;
  availability: AvailabilityRule[];
  loading: boolean;
}

type Action =
  | { type: "GOTO"; step: Step }
  | { type: "PATCH"; values: Partial<State> }
  | { type: "AVAIL"; rules: AvailabilityRule[] }
  | { type: "LOADING"; loading: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "GOTO":
      return { ...state, step: action.step };
    case "PATCH":
      return { ...state, ...action.values };
    case "AVAIL":
      return { ...state, availability: action.rules };
    case "LOADING":
      return { ...state, loading: action.loading };
    default:
      return state;
  }
}

const DEFAULT_AVAILABILITY: AvailabilityRule[] = (() => {
  const rules: AvailabilityRule[] = [];
  for (let weekday = 1; weekday <= 5; weekday += 1) {
    rules.push({ doctorId: SOFIA_ID, weekday, startMinute: 9 * 60, endMinute: 18 * 60 });
  }
  return rules;
})();

const initialState: State = {
  step: 1,
  email: "",
  name: "",
  specialty: "",
  serviceName: "",
  serviceDuration: 60,
  servicePrice: 1000,
  whatsappDigits: "",
  availability: DEFAULT_AVAILABILITY,
  loading: false,
};

function slugFromName(name: string): string {
  if (!name.trim()) return "";
  const lower = name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const cleaned = lower.replace(/[^a-z0-9\s-]/g, "").trim();
  const hyph = cleaned.replace(/\s+/g, "-");
  // Smart guess: prepend "dra-" by default. Real product would let user choose.
  if (/^(dra|dr)-/.test(hyph)) return hyph;
  return `dra-${hyph}`;
}

export default function RegistroPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const toast = useToast();
  const slug = useMemo(() => slugFromName(state.name), [state.name]);

  const goto = (step: Step) => dispatch({ type: "GOTO", step });

  return (
    <OnboardingShell
      step={state.step}
      total={TOTAL}
      hideActions={state.step === 6 || state.step === 1}
      back={
        state.step > 1 && state.step !== 6 ? (
          <Button size="sm" variant="ghost" onClick={() => goto((state.step - 1) as Step)}>
            ← Atrás
          </Button>
        ) : null
      }
      primary={renderPrimary({ state, goto, slug })}
    >
      <div key={state.step} className="vera-onb-step">
        {state.step === 1 ? <StepWelcome state={state} dispatch={dispatch} /> : null}
        {state.step === 2 ? <StepNameSpecialty state={state} dispatch={dispatch} slug={slug} /> : null}
        {state.step === 3 ? <StepService state={state} dispatch={dispatch} /> : null}
        {state.step === 4 ? <StepAvailability state={state} dispatch={dispatch} /> : null}
        {state.step === 5 ? <StepWhatsApp state={state} dispatch={dispatch} /> : null}
        {state.step === 6 ? <StepCelebration state={state} slug={slug} router={router} toast={toast} /> : null}
      </div>
      <style>{`
        .vera-onb-step {
          animation: vera-onb-in var(--dur-snap) var(--ease-snap) both;
        }
        @keyframes vera-onb-in {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .vera-onb-step { animation: none; }
        }
      `}</style>
    </OnboardingShell>
  );
}

function renderPrimary({
  state,
  goto,
  slug,
}: {
  state: State;
  goto: (s: Step) => void;
  slug: string;
}) {
  if (state.step === 1) return null;
  if (state.step === 6) return null;

  const labels: Record<2 | 3 | 4 | 5, string> = {
    2: "Siguiente",
    3: "Siguiente",
    4: "Siguiente",
    5: "Listo, mi página está lista",
  };

  const valid =
    state.step === 2
      ? state.name.trim().length >= 2 && state.specialty.trim().length >= 2 && slug.length > 4
      : state.step === 3
        ? state.serviceName.trim().length >= 2 && state.serviceDuration > 0 && state.servicePrice > 0
        : state.step === 4
          ? state.availability.length > 0
          : state.whatsappDigits.length === 10;

  return (
    <Button
      size="md"
      disabled={!valid}
      onClick={() => goto(((state.step + 1) as Step))}
    >
      {labels[state.step as 2 | 3 | 4 | 5]}
      <ArrowRight size={16} strokeWidth={1.75} />
    </Button>
  );
}

/* ================================ STEPS ================================ */

function StepWelcome({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const [emailMode, setEmailMode] = useState(false);
  const [emailDraft, setEmailDraft] = useState(state.email);

  function fakeAuth() {
    dispatch({ type: "LOADING", loading: true });
    setTimeout(() => {
      dispatch({ type: "PATCH", values: { email: emailDraft || "demo@vera.app", loading: false, step: 2 } });
    }, 600);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <OnboardingHeading>Tu consultorio digital, en dos minutos.</OnboardingHeading>
        <OnboardingLede>Sin descargar nada. Sin tarjeta. Seis pasos.</OnboardingLede>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
        <Button
          size="lg"
          variant="secondary"
          disabled={state.loading}
          onClick={() => fakeAuth()}
          style={{ width: "100%" }}
        >
          {state.loading ? (
            <>
              <Spinner size={14} />
              Conectando…
            </>
          ) : (
            <>
              <GoogleGlyph />
              Continuar con Google
            </>
          )}
        </Button>

        {emailMode ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <Input
              type="email"
              autoFocus
              value={emailDraft}
              placeholder="tu@email.com"
              onChange={(e) => setEmailDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && emailDraft.includes("@")) fakeAuth();
              }}
            />
            <Button size="md" disabled={!emailDraft.includes("@") || state.loading} onClick={fakeAuth}>
              {state.loading ? (
                <>
                  <Spinner size={14} color="var(--accent-ink)" />
                  Conectando…
                </>
              ) : (
                "Continuar"
              )}
            </Button>
          </div>
        ) : (
          <Button size="lg" variant="ghost" onClick={() => setEmailMode(true)} style={{ width: "100%" }}>
            Continuar con email
          </Button>
        )}
      </div>

      <p
        style={{
          margin: 0,
          fontSize: "var(--text-xs)",
          color: "var(--muted)",
          textAlign: "center",
        }}
      >
        Al continuar aceptas nuestros términos y aviso de privacidad.
      </p>
    </div>
  );
}

function StepNameSpecialty({
  state,
  dispatch,
  slug,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
  slug: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <OnboardingHeading>¿Cómo te llamas?</OnboardingHeading>
      <FloatingLabelInput
        label="Tu nombre completo"
        value={state.name}
        onChange={(e) => dispatch({ type: "PATCH", values: { name: e.target.value } })}
        autoFocus
        autoComplete="name"
      />
      <SpecialtyAutocombobox
        value={state.specialty}
        onChange={(v) => dispatch({ type: "PATCH", values: { specialty: v } })}
      />
      <SlugPreview slug={slug} />
    </div>
  );
}

function StepService({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const previewService: Service = {
    id: "preview",
    doctorId: SOFIA_ID,
    name: state.serviceName || "Consulta inicial",
    durationMin: state.serviceDuration || 60,
    priceMxn: state.servicePrice || 0,
    description:
      state.serviceName.trim().length > 0
        ? "Así verá este servicio cualquier paciente al entrar a tu página."
        : "Aquí aparecerá el servicio que estás creando.",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <div>
        <OnboardingHeading>Tu primer servicio.</OnboardingHeading>
        <OnboardingLede>
          Puedes agregar más después. Empieza con el que ofreces con más frecuencia.
        </OnboardingLede>
      </div>

      <FloatingLabelInput
        label="Nombre del servicio"
        value={state.serviceName}
        onChange={(e) => dispatch({ type: "PATCH", values: { serviceName: e.target.value } })}
        autoFocus
      />
      <div
        className="vera-svc-grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}
      >
        <FloatingLabelInput
          label="Duración"
          type="number"
          min={5}
          step={5}
          value={state.serviceDuration || ""}
          onChange={(e) =>
            dispatch({ type: "PATCH", values: { serviceDuration: Number(e.target.value) || 0 } })
          }
          suffix="minutos"
        />
        <FloatingLabelInput
          label="Precio"
          type="number"
          min={0}
          step={50}
          value={state.servicePrice || ""}
          onChange={(e) =>
            dispatch({ type: "PATCH", values: { servicePrice: Number(e.target.value) || 0 } })
          }
          prefix="$"
          suffix="MXN"
        />
      </div>

      <div>
        <p
          style={{
            margin: "0 0 var(--space-2)",
            fontSize: "var(--text-xs)",
            fontWeight: 500,
            letterSpacing: "var(--tracking-widest)",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Vista previa
        </p>
        <ServiceCard service={previewService} href="#" />
      </div>

      <style>{`
        @media (max-width: 480px) {
          .vera-svc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function StepAvailability({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <div>
        <OnboardingHeading>¿Cuándo aceptas pacientes?</OnboardingHeading>
        <OnboardingLede>Marca tus días y horas. Puedes ajustarlo después.</OnboardingLede>
      </div>
      <AvailabilityGrid
        rules={state.availability}
        doctorId={SOFIA_ID}
        onChange={(rules) => dispatch({ type: "AVAIL", rules })}
        compact
      />
      <AvailabilitySummary rules={state.availability} />
    </div>
  );
}

function StepWhatsApp({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const previewBooking: Booking = useMemo(() => {
    const startsAt = new Date();
    startsAt.setUTCDate(startsAt.getUTCDate() + 1);
    startsAt.setUTCHours(17, 0, 0, 0); // ~11:00 MX
    const durationMin = state.serviceDuration || 60;
    const endsAt = new Date(startsAt.getTime() + durationMin * 60_000);
    return {
      token: "PREVIEW-001",
      doctorId: SOFIA_ID,
      serviceId: "preview",
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      status: "confirmed",
      patientName: "Laura García",
      patientPhone: "+525500000000",
      patientEmail: "laura@example.com",
      createdAt: new Date().toISOString(),
      isSeed: true,
    };
  }, [state.serviceDuration]);

  const previewService: Service = {
    id: "preview",
    doctorId: SOFIA_ID,
    name: state.serviceName || "Consulta inicial",
    durationMin: state.serviceDuration || 60,
    priceMxn: state.servicePrice || 0,
    description: "",
  };

  const previewDoctor = useMemo(
    () => ({
      ...SEED_DOCTOR,
      name: state.name || SEED_DOCTOR.name,
    }),
    [state.name],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <div>
        <OnboardingHeading>Tu canal con tus pacientes.</OnboardingHeading>
        <OnboardingLede>
          Aquí recibirás cada nueva reserva. Aquí enviaremos cada recordatorio. WhatsApp, no un
          email perdido.
        </OnboardingLede>
      </div>

      <div style={{ maxWidth: 360, margin: "0 auto", width: "100%" }}>
        <PhoneInput
          value={state.whatsappDigits}
          onChange={(d) => dispatch({ type: "PATCH", values: { whatsappDigits: d } })}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", alignItems: "center" }}>
        <WhatsAppPreview
          variant="confirmation"
          recipient="doctor"
          booking={previewBooking}
          doctor={previewDoctor}
          service={previewService}
        />
        <p
          style={{
            margin: 0,
            fontSize: "var(--text-sm)",
            color: "var(--muted)",
            textAlign: "center",
            maxWidth: 320,
          }}
        >
          Te enviaremos un mensaje de prueba ahora. En el demo no se envía realmente.
        </p>
      </div>
    </div>
  );
}

function StepCelebration({
  slug,
  router,
  toast,
}: {
  state: State;
  slug: string;
  router: ReturnType<typeof useRouter>;
  toast: ReturnType<typeof useToast>;
}) {
  const publicUrl = `vera.app/${slug || "dra-sofia-ramirez"}`;
  const previewSlug = "dra-sofia-ramirez";

  function copy() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`https://${publicUrl}`).then(
        () => toast.show({ tone: "success", message: "Enlace copiado." }),
        () => toast.show({ tone: "warning", message: "No se pudo copiar." }),
      );
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-8)",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily: "var(--font-geist), system-ui, sans-serif",
          fontSize: "clamp(48px, 8vw, 80px)",
          fontWeight: 600,
          letterSpacing: "var(--tracking-tight)",
          color: "var(--ink)",
          lineHeight: "var(--leading-tight)",
        }}
      >
        Tu página está en vivo.
      </h1>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-2)",
          fontSize: "var(--text-2xl)",
          color: "var(--accent)",
          fontWeight: 500,
          textDecoration: "underline",
          textUnderlineOffset: 4,
        }}
      >
        {publicUrl}
        <IconButton size="sm" aria-label="Copiar enlace" onClick={copy}>
          <Copy size={16} strokeWidth={1.75} />
        </IconButton>
      </div>

      <EmbeddedProfilePreview src={`/projects/vera/${previewSlug}`} />

      <div
        style={{
          display: "flex",
          gap: "var(--space-3)",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "var(--space-4)",
        }}
      >
        <Link
          href={`/projects/vera/${previewSlug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="md">Ver mi página completa</Button>
        </Link>
        <Button
          size="md"
          variant="secondary"
          onClick={() =>
            toast.show({ tone: "default", message: "Comparte el enlace desde el botón de copiar." })
          }
        >
          <InstagramGlyph />
          Compartir en Instagram
        </Button>
        <Button
          size="md"
          variant="ghost"
          onClick={() => router.push("/projects/vera/panel")}
        >
          Ir a mi panel
          <ArrowRight size={14} strokeWidth={1.75} />
        </Button>
      </div>

      <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--muted)" }}>
        Listo. Eso era todo.
      </p>

      {/* Hidden link kept for potential reference; no-op for accessibility tools */}
      <span hidden>
        <ExternalLink />
      </span>

      <p
        style={{
          margin: "var(--space-6) 0 0",
          maxWidth: 480,
          fontSize: "var(--text-xs)",
          color: "var(--ink-faint)",
          lineHeight: "var(--leading-snug)",
        }}
      >
        Nota del demo: este flujo es una demostración. Al terminar, ves el panel de la Dra. Sofía
        Ramírez, que es nuestra doctora de muestra. Tus datos no se guardan ni se publica una
        página real.
      </p>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.5 12.27c0-.79-.07-1.55-.2-2.27H12v4.31h5.92a5.07 5.07 0 0 1-2.2 3.32v2.76h3.55c2.08-1.92 3.28-4.74 3.28-8.12z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.27-2.66l-3.55-2.76c-.98.66-2.24 1.05-3.72 1.05-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.05H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.95l3.66-2.85z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.46 2.07 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function InstagramGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
