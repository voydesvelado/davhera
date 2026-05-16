"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { PageShell } from "../../../_components/PageShell";
import { TopNav } from "../../../_components/marketing/TopNav";
import { DemoRibbon } from "../../../_components/ui/DemoRibbon";
import { Button } from "../../../_components/ui/Button";
import { useToast } from "../../../_components/ui/Toast";

import { Eyebrow } from "../../../_components/product/Eyebrow";
import { HechoConVera } from "../../../_components/product/HechoConVera";
import { BookingSkeleton } from "../../../_components/product/BookingSkeleton";
import { BookingNotFound } from "../../../_components/product/BookingNotFound";
import { BookingDetailCard } from "../../../_components/product/BookingDetailCard";

import { useBookingByToken } from "../../../_hooks/useBookingByToken";
import { useDoctorById } from "../../../_hooks/useDoctor";
import { SEED_SERVICES } from "../../../_lib/seed";
import { cancelBooking, ReadOnlyBookingError } from "../../../_lib/bookings";

interface Props {
  token: string;
}

export function CancelarPageClient({ token }: Props) {
  return (
    <>
      <TopNav />
      <DemoRibbon />
      <PageShell width="content">
        <CancelarInner token={token} />
        <HechoConVera />
      </PageShell>
    </>
  );
}

function CancelarInner({ token }: { token: string }) {
  const router = useRouter();
  const toast = useToast();
  const { booking, ready } = useBookingByToken(token);
  const doctor = useDoctorById(booking?.doctorId ?? "");
  const service = useMemo(
    () => (booking ? SEED_SERVICES.find((s) => s.id === booking.serviceId) ?? null : null),
    [booking],
  );

  const [submitting, setSubmitting] = useState(false);

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

  function handleConfirm() {
    setSubmitting(true);
    try {
      cancelBooking(token);
      router.push(`/projects/vera/cita/${token}`);
    } catch (err) {
      setSubmitting(false);
      if (err instanceof ReadOnlyBookingError) {
        toast.show({
          tone: "warning",
          message: "Esta es una cita de muestra. No se puede cancelar.",
        });
        return;
      }
      toast.show({
        tone: "danger",
        message: "No pudimos cancelar tu cita. Inténtalo de nuevo.",
      });
    }
  }

  return (
    <div style={containerStyle}>
      <Link
        href={`/projects/vera/cita/${token}`}
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
        Volver a la cita
        <style>{`.vera-back:hover { text-decoration: underline; }`}</style>
      </Link>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <Eyebrow>Cancelar</Eyebrow>
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
          ¿Confirmas que quieres cancelar?
        </h1>
      </div>

      <BookingDetailCard booking={booking} doctor={doctor} service={service} muted />

      <p
        style={{
          margin: 0,
          fontSize: "var(--text-md)",
          color: "var(--ink-soft)",
          lineHeight: "var(--leading-normal)",
        }}
      >
        El horario quedará disponible para otros pacientes. Si necesitas reagendar en lugar de
        cancelar,{" "}
        <Link
          href={`/projects/vera/cita/${token}/reagendar`}
          style={{ color: "var(--accent)", textDecoration: "underline" }}
        >
          puedes hacerlo aquí
        </Link>
        .
      </p>

      <div
        className="vera-cancel-actions"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "var(--space-2)",
          marginTop: "var(--space-2)",
        }}
      >
        <Button
          size="md"
          variant="destructive"
          disabled={submitting}
          onClick={handleConfirm}
        >
          {submitting ? "Cancelando…" : "Sí, cancelar la cita"}
        </Button>
        <Link href={`/projects/vera/cita/${token}`}>
          <Button size="md" variant="secondary" style={{ width: "100%" }}>
            Mantener mi cita
          </Button>
        </Link>
      </div>

      <style>{`
        @media (min-width: 480px) {
          .vera-cancel-actions {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
