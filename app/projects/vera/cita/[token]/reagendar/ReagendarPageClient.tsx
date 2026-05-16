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
import { RescheduleSummary } from "../../../_components/product/RescheduleSummary";
import { BookingSlotPicker } from "../../../_components/product/booking/BookingSlotPicker";
import { BookingSummaryRow } from "../../../_components/product/booking/BookingSummaryRow";

import { useBookingByToken } from "../../../_hooks/useBookingByToken";
import { useDoctorById } from "../../../_hooks/useDoctor";
import { SEED_SERVICES } from "../../../_lib/seed";
import { ymdInMx } from "../../../_lib/date-format";
import { rescheduleBooking, ReadOnlyBookingError, SlotTakenError } from "../../../_lib/bookings";
import type { Slot } from "../../../_lib/types";

interface Props {
  token: string;
}

export function ReagendarPageClient({ token }: Props) {
  return (
    <>
      <TopNav />
      <DemoRibbon />
      <PageShell width="content">
        <ReagendarInner token={token} />
        <HechoConVera />
      </PageShell>
    </>
  );
}

function ReagendarInner({ token }: { token: string }) {
  const router = useRouter();
  const toast = useToast();
  const { booking, ready } = useBookingByToken(token);
  const doctor = useDoctorById(booking?.doctorId ?? "");
  const service = useMemo(
    () => (booking ? SEED_SERVICES.find((s) => s.id === booking.serviceId) ?? null : null),
    [booking],
  );

  const [picked, setPicked] = useState<Slot | null>(null);
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

  const currentStarts = new Date(booking.startsAt);
  const currentDay = ymdInMx(currentStarts);

  function handleSubmit() {
    if (!picked) return;
    setSubmitting(true);
    try {
      rescheduleBooking(token, picked.startsAt);
      router.push(`/projects/vera/cita/${token}?rescheduled=1`);
    } catch (err) {
      setSubmitting(false);
      if (err instanceof SlotTakenError) {
        toast.show({ tone: "warning", message: "Ese horario acaba de tomarse. Elige otro." });
        setPicked(null);
        return;
      }
      if (err instanceof ReadOnlyBookingError) {
        toast.show({
          tone: "warning",
          message: "Esta es una cita de muestra. No se puede reagendar.",
        });
        return;
      }
      toast.show({
        tone: "danger",
        message: "No pudimos reagendar tu cita. Inténtalo de nuevo.",
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
        <Eyebrow>Reagendar tu cita</Eyebrow>
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
          Elige un nuevo horario
        </h1>
        <BookingSummaryRow service={service} startsAt={currentStarts} suffix="(actual)" />
      </div>

      <BookingSlotPicker
        doctor={doctor}
        service={service}
        selectedIso={picked?.startsAt.toISOString() ?? null}
        onSelectSlot={(slot) => setPicked(slot)}
        currentIso={booking.startsAt}
        initialDay={currentDay}
      />

      <RescheduleSummary fromStartsAt={currentStarts} toStartsAt={picked?.startsAt ?? null} />

      <Button size="md" disabled={!picked || submitting} onClick={handleSubmit}>
        {submitting ? "Reagendando…" : "Confirmar nuevo horario"}
      </Button>
    </div>
  );
}
