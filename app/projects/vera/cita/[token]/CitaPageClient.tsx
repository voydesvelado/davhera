"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, Calendar as CalendarIcon, MessageCircle, MapPin } from "lucide-react";

import { PageShell } from "../../_components/PageShell";
import { TopNav } from "../../_components/marketing/TopNav";
import { DemoRibbon } from "../../_components/ui/DemoRibbon";
import { Button } from "../../_components/ui/Button";

import { ConfirmationHeader } from "../../_components/product/ConfirmationHeader";
import { BookingDetailCard } from "../../_components/product/BookingDetailCard";
import { BookingActions } from "../../_components/product/BookingActions";
import { BookingSkeleton } from "../../_components/product/BookingSkeleton";
import { BookingNotFound } from "../../_components/product/BookingNotFound";
import { ChangeBanner } from "../../_components/product/ChangeBanner";
import { WhatNextRow } from "../../_components/product/WhatNextRow";
import { Eyebrow } from "../../_components/product/Eyebrow";
import { HechoConVera } from "../../_components/product/HechoConVera";
import { WhatsAppPreview } from "../../_components/product/booking/WhatsAppPreview";

import { useBookingByToken } from "../../_hooks/useBookingByToken";
import { useDoctorById } from "../../_hooks/useDoctor";
import { SEED_SERVICES } from "../../_lib/seed";
import { formatDate, formatTime } from "../../_lib/date-format";

interface CitaPageClientProps {
  token: string;
}

export function CitaPageClient({ token }: CitaPageClientProps) {
  return (
    <>
      <TopNav />
      <DemoRibbon />
      <PageShell width="content">
        <Suspense fallback={null}>
          <CitaInner token={token} />
        </Suspense>
        <HechoConVera />
      </PageShell>
    </>
  );
}

function CitaInner({ token }: { token: string }) {
  const { booking, ready } = useBookingByToken(token);
  const searchParams = useSearchParams();
  const wasRescheduled = searchParams.get("rescheduled") === "1";

  const doctor = useDoctorById(booking?.doctorId ?? "");
  const service = useMemo(
    () => (booking ? SEED_SERVICES.find((s) => s.id === booking.serviceId) ?? null : null),
    [booking],
  );

  const containerStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--space-5)",
    paddingTop: "var(--space-8)",
    paddingBottom: "var(--space-8)",
    maxWidth: "var(--max-narrow)",
    margin: "0 auto",
    width: "100%",
  };

  if (!ready) {
    return (
      <div style={containerStyle}>
        <BookingSkeleton />
      </div>
    );
  }

  if (!booking || !doctor || !service) {
    return (
      <div style={containerStyle}>
        <BookingNotFound />
      </div>
    );
  }

  const startsAt = new Date(booking.startsAt);
  const isCancelled = booking.status === "cancelled";

  return (
    <div style={containerStyle}>
      <Link
        href="/projects/vera/dra-sofia-ramirez"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-1)",
          fontSize: "var(--text-sm)",
          color: "var(--accent)",
          textDecoration: "none",
          fontWeight: 500,
        }}
        className="vera-back"
      >
        <ChevronLeft size={16} strokeWidth={1.75} />
        Volver al perfil
        <style>{`.vera-back:hover { text-decoration: underline; }`}</style>
      </Link>

      {wasRescheduled && !isCancelled ? (
        <ChangeBanner
          storageKey={`vera:reschedule-banner-dismissed:${token}`}
          message={`Tu cita fue reagendada · ${formatDate(startsAt)}, ${formatTime(startsAt)}`}
        />
      ) : null}

      {isCancelled ? (
        <ConfirmationHeader
          status="cancelled"
          title="Esta cita fue cancelada"
          subtitle={
            booking.cancelledAt
              ? `Cancelada el ${formatDate(booking.cancelledAt)}.`
              : undefined
          }
        />
      ) : (
        <ConfirmationHeader
          status="confirmed"
          title="Tu cita está confirmada"
          subtitle={
            <>
              {service.name} con {doctor.name} · {formatDate(startsAt)} a las {formatTime(startsAt)}
            </>
          }
        />
      )}

      <BookingDetailCard booking={booking} doctor={doctor} service={service} muted={isCancelled} />

      {!isCancelled ? (
        <>
          <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", paddingTop: "var(--space-4)" }}>
            <Eyebrow>Tu confirmación por WhatsApp</Eyebrow>
            <WhatsAppPreview
              variant="confirmation"
              recipient="patient"
              booking={booking}
              doctor={doctor}
              service={service}
            />
            <p
              style={{
                margin: 0,
                fontSize: "var(--text-sm)",
                color: "var(--muted)",
                textAlign: "center",
                maxWidth: "440px",
                marginInline: "auto",
              }}
            >
              En el demo no se envían mensajes reales — esta es una vista previa de la plantilla.
            </p>
          </section>

          <section
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
              paddingTop: "var(--space-4)",
            }}
          >
            <Eyebrow>Qué sigue</Eyebrow>
            <WhatNextRow icon={<CalendarIcon size={14} strokeWidth={1.75} />}>
              Te enviaremos un recordatorio por WhatsApp el día anterior.
            </WhatNextRow>
            <WhatNextRow icon={<MessageCircle size={14} strokeWidth={1.75} />}>
              Puedes reagendar o cancelar desde ese mensaje, o desde esta página.
            </WhatNextRow>
            <WhatNextRow icon={<MapPin size={14} strokeWidth={1.75} />}>
              Confirma la ubicación 30 minutos antes de salir.
            </WhatNextRow>
          </section>

          <section style={{ paddingTop: "var(--space-4)" }}>
            <BookingActions booking={booking} doctor={doctor} service={service} />
          </section>
        </>
      ) : (
        <section style={{ paddingTop: "var(--space-4)" }}>
          <Link href="/projects/vera/dra-sofia-ramirez">
            <Button size="md" style={{ width: "100%" }}>
              Reservar otra cita →
            </Button>
          </Link>
        </section>
      )}
    </div>
  );
}
