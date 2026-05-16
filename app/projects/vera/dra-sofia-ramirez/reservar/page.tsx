"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Calendar } from "lucide-react";

import { PageShell } from "../../_components/PageShell";
import { TopNav } from "../../_components/marketing/TopNav";
import { DemoRibbon } from "../../_components/ui/DemoRibbon";
import { Button } from "../../_components/ui/Button";
import { useToast } from "../../_components/ui/Toast";
import { Eyebrow } from "../../_components/product/Eyebrow";
import { ServiceCard } from "../../_components/product/ServiceCard";
import { ConfirmationCard } from "../../_components/product/ConfirmationCard";
import { HechoConVera } from "../../_components/product/HechoConVera";

import { StepIndicator } from "../../_components/product/booking/StepIndicator";
import { BookingSlotPicker } from "../../_components/product/booking/BookingSlotPicker";
import { BookingForm, type BookingFormValues } from "../../_components/product/booking/BookingForm";
import { BookingSummaryRow } from "../../_components/product/booking/BookingSummaryRow";
import { WhatsAppPreview } from "../../_components/product/booking/WhatsAppPreview";

import { SEED_DOCTOR, SEED_SERVICES } from "../../_lib/seed";
import {
  createBooking,
  SlotTakenError,
  getBookingByToken,
} from "../../_lib/bookings";
import { downloadIcs } from "../../_lib/ics";
import type { Booking, Service, Slot } from "../../_lib/types";

const PROFILE_HREF = "/projects/vera/dra-sofia-ramirez";
const TOTAL_VISIBLE_STEPS = 4;

type Step = "service" | "date" | "form" | "success";

interface State {
  step: Step;
  service: Service | null;
  selectedSlot: Slot | null;
  formValues: Partial<BookingFormValues>;
  bookingToken: string | null;
  submitting: boolean;
}

type Action =
  | { type: "PICK_SERVICE"; service: Service }
  | { type: "PICK_SLOT"; slot: Slot }
  | { type: "GOTO"; step: Step }
  | { type: "SET_FORM"; values: Partial<BookingFormValues> }
  | { type: "SUBMITTING"; submitting: boolean }
  | { type: "BOOKED"; token: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "PICK_SERVICE":
      return { ...state, service: action.service, step: "date" };
    case "PICK_SLOT":
      return { ...state, selectedSlot: action.slot };
    case "GOTO":
      return { ...state, step: action.step };
    case "SET_FORM":
      return { ...state, formValues: { ...state.formValues, ...action.values } };
    case "SUBMITTING":
      return { ...state, submitting: action.submitting };
    case "BOOKED":
      return { ...state, step: "success", bookingToken: action.token, submitting: false };
    default:
      return state;
  }
}

const initialState: State = {
  step: "service",
  service: null,
  selectedSlot: null,
  formValues: {},
  bookingToken: null,
  submitting: false,
};

export default function ReservarPage() {
  return (
    <Suspense fallback={null}>
      <ReservarInner />
    </Suspense>
  );
}

function ReservarInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [bookingResult, setBookingResult] = useState<Booking | null>(null);

  // Pre-fill from URL — service or token (when reloading on the success state).
  useEffect(() => {
    const serviceParam = searchParams.get("service");
    const tokenParam = searchParams.get("token");

    if (tokenParam) {
      const existing = getBookingByToken(tokenParam);
      if (existing) {
        const svc = SEED_SERVICES.find((s) => s.id === existing.serviceId) ?? null;
        setBookingResult(existing);
        dispatch({ type: "BOOKED", token: tokenParam });
        if (svc) dispatch({ type: "PICK_SERVICE", service: svc });
        return;
      }
    }

    if (serviceParam) {
      const svc = SEED_SERVICES.find((s) => s.id === serviceParam);
      if (svc) dispatch({ type: "PICK_SERVICE", service: svc });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stepNumber = useMemo<number>(() => {
    if (state.step === "service") return 1;
    if (state.step === "date") return 2;
    if (state.step === "form") return 3;
    return 4;
  }, [state.step]);

  const handleSubmit = useCallback(
    (values: BookingFormValues) => {
      if (!state.service || !state.selectedSlot) return;
      dispatch({ type: "SUBMITTING", submitting: true });
      try {
        const booking = createBooking({
          doctorId: SEED_DOCTOR.id,
          serviceId: state.service.id,
          startsAt: state.selectedSlot.startsAt,
          patientName: values.name,
          patientPhone: `+52${values.phoneDigits}`,
          patientEmail: values.email,
          patientNote: values.note,
        });
        setBookingResult(booking);
        dispatch({ type: "SET_FORM", values });
        dispatch({ type: "BOOKED", token: booking.token });
        const params = new URLSearchParams();
        params.set("token", booking.token);
        router.replace(`?${params.toString()}`);
      } catch (err) {
        dispatch({ type: "SUBMITTING", submitting: false });
        if (err instanceof SlotTakenError) {
          toast.show({
            tone: "warning",
            message: "Ese horario acaba de tomarse. Elige otro.",
          });
          dispatch({ type: "GOTO", step: "date" });
          dispatch({ type: "PICK_SLOT", slot: state.selectedSlot });
          return;
        }
        toast.show({
          tone: "danger",
          message: "No pudimos confirmar tu cita. Inténtalo de nuevo.",
        });
      }
    },
    [router, state.service, state.selectedSlot, toast],
  );

  return (
    <>
      <TopNav />
      <DemoRibbon />
      <PageShell width="content">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
            paddingTop: "var(--space-8)",
            paddingBottom: "var(--space-8)",
            maxWidth: "var(--max-narrow)",
            margin: "0 auto",
            width: "100%",
          }}
        >
          {state.step !== "success" ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--space-3)",
              }}
            >
              <BackLink
                onClick={() => {
                  if (state.step === "service") {
                    router.push(PROFILE_HREF);
                  } else if (state.step === "date") {
                    dispatch({ type: "GOTO", step: "service" });
                  } else if (state.step === "form") {
                    dispatch({ type: "GOTO", step: "date" });
                  }
                }}
              >
                {state.step === "service" ? "Volver al perfil" : "Atrás"}
              </BackLink>
              <StepIndicator current={stepNumber} total={TOTAL_VISIBLE_STEPS} />
            </div>
          ) : (
            <BackLink onClick={() => router.push(PROFILE_HREF)}>Volver al perfil</BackLink>
          )}

          {state.step === "service" ? (
            <StepWrapper>
              <h1
                style={{
                  margin: 0,
                  fontSize: "var(--text-2xl)",
                  fontWeight: 600,
                  letterSpacing: "var(--tracking-snug)",
                  color: "var(--ink)",
                }}
              >
                ¿Qué tipo de consulta?
              </h1>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                  marginTop: "var(--space-3)",
                }}
              >
                {SEED_SERVICES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => dispatch({ type: "PICK_SERVICE", service: s })}
                    style={{
                      all: "unset",
                      cursor: "pointer",
                      display: "block",
                    }}
                  >
                    <ServiceCard service={s} href="#" />
                  </button>
                ))}
              </div>
            </StepWrapper>
          ) : null}

          {state.step === "date" && state.service ? (
            <StepWrapper>
              <h1
                style={{
                  margin: 0,
                  fontSize: "var(--text-2xl)",
                  fontWeight: 600,
                  letterSpacing: "var(--tracking-snug)",
                  color: "var(--ink)",
                }}
              >
                Elige día y horario
              </h1>
              <BookingSlotPicker
                doctor={SEED_DOCTOR}
                service={state.service}
                selectedIso={state.selectedSlot?.startsAt.toISOString() ?? null}
                onSelectSlot={(slot) => {
                  dispatch({ type: "PICK_SLOT", slot });
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--space-3)" }}>
                <Button
                  size="md"
                  disabled={!state.selectedSlot}
                  onClick={() => dispatch({ type: "GOTO", step: "form" })}
                >
                  Continuar →
                </Button>
              </div>
            </StepWrapper>
          ) : null}

          {state.step === "form" && state.service && state.selectedSlot ? (
            <StepWrapper>
              <h1
                style={{
                  margin: 0,
                  fontSize: "var(--text-2xl)",
                  fontWeight: 600,
                  letterSpacing: "var(--tracking-snug)",
                  color: "var(--ink)",
                }}
              >
                Tus datos
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--text-sm)",
                  color: "var(--muted)",
                }}
              >
                Solo necesitamos esto para confirmar.
              </p>
              <BookingSummaryRow service={state.service} startsAt={state.selectedSlot.startsAt} />
              <BookingForm
                initial={state.formValues}
                submitting={state.submitting}
                onSubmit={handleSubmit}
              />
            </StepWrapper>
          ) : null}

          {state.step === "success" && bookingResult ? (
            <SuccessView booking={bookingResult} />
          ) : null}
        </div>

        <HechoConVera />
      </PageShell>
    </>
  );
}

function StepWrapper({ children }: { children: ReactNode }) {
  return (
    <div
      className="vera-step"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
      }}
    >
      {children}
      <style>{`
        .vera-step {
          animation: vera-step-in var(--dur-snap) var(--ease-snap) both;
        }
        @keyframes vera-step-in {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .vera-step { animation: none; }
        }
      `}</style>
    </div>
  );
}

function BackLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)",
        padding: 0,
        background: "transparent",
        border: "none",
        color: "var(--accent)",
        fontSize: "var(--text-sm)",
        fontWeight: 500,
        cursor: "pointer",
      }}
      className="vera-back-link"
    >
      <ChevronLeft size={16} strokeWidth={1.75} />
      {children}
      <style>{`.vera-back-link:hover { text-decoration: underline; }`}</style>
    </button>
  );
}

function SuccessView({ booking }: { booking: Booking }) {
  const service = SEED_SERVICES.find((s) => s.id === booking.serviceId);
  if (!service) return null;

  return (
    <div
      className="vera-step"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
        alignItems: "stretch",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <Eyebrow>Confirmada</Eyebrow>
        <h1
          style={{
            margin: 0,
            fontSize: "var(--text-3xl)",
            fontWeight: 600,
            letterSpacing: "var(--tracking-snug)",
            color: "var(--ink)",
            lineHeight: "var(--leading-tight)",
          }}
        >
          Tu cita está confirmada
        </h1>
      </div>
      <ConfirmationCard booking={booking} doctor={SEED_DOCTOR} service={service} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-3)", paddingTop: "var(--space-4)" }}>
        <p
          style={{
            margin: 0,
            fontSize: "var(--text-xs)",
            fontWeight: 500,
            letterSpacing: "var(--tracking-widest)",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Tu confirmación por WhatsApp
        </p>
        <WhatsAppPreview
          variant="confirmation"
          recipient="patient"
          booking={booking}
          doctor={SEED_DOCTOR}
          service={service}
        />
        <p
          style={{
            margin: 0,
            fontSize: "var(--text-sm)",
            color: "var(--muted)",
            textAlign: "center",
            maxWidth: "320px",
          }}
        >
          Así se vería tu confirmación en WhatsApp. En el demo no enviamos mensajes reales.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
          marginTop: "var(--space-4)",
        }}
      >
        <Link href={`/projects/vera/cita/${booking.token}`} style={{ display: "block" }}>
          <Button size="md" style={{ width: "100%" }}>
            Ver mi cita →
          </Button>
        </Link>
        <Button
          size="md"
          variant="ghost"
          onClick={() => downloadIcs({ booking, doctor: SEED_DOCTOR, service })}
          style={{ width: "100%" }}
        >
          <Calendar size={16} strokeWidth={1.75} />
          Agregar a mi calendario
        </Button>
      </div>
    </div>
  );
}
