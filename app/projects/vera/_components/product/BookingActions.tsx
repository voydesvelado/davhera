"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";
import { Button } from "../ui/Button";
import { useToast } from "../ui/Toast";
import { downloadIcs } from "../../_lib/ics";
import { isSeedToken } from "../../_lib/tokens";
import type { Booking, Doctor, Service } from "../../_lib/types";

interface BookingActionsProps {
  booking: Booking;
  doctor: Doctor;
  service: Service;
}

export function BookingActions({ booking, doctor, service }: BookingActionsProps) {
  const toast = useToast();
  const isSeed = isSeedToken(booking.token);

  const showSeedToast = (action: "reschedule" | "cancel") => {
    toast.show({
      tone: "warning",
      message:
        action === "reschedule"
          ? "Esta es una cita de muestra. No se puede reagendar."
          : "Esta es una cita de muestra. No se puede cancelar.",
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <div
        className="vera-actions-row"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "var(--space-2)",
        }}
      >
        {isSeed ? (
          <>
            <Button size="md" variant="secondary" onClick={() => showSeedToast("reschedule")}>
              Reagendar
            </Button>
            <Button
              size="md"
              variant="ghost"
              onClick={() => showSeedToast("cancel")}
              style={{ color: "var(--danger)" }}
            >
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <Link href={`/projects/vera/cita/${booking.token}/reagendar`}>
              <Button size="md" variant="secondary" style={{ width: "100%" }}>
                Reagendar
              </Button>
            </Link>
            <Link href={`/projects/vera/cita/${booking.token}/cancelar`}>
              <Button size="md" variant="ghost" style={{ width: "100%", color: "var(--danger)" }}>
                Cancelar
              </Button>
            </Link>
          </>
        )}
      </div>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => downloadIcs({ booking, doctor, service })}
        style={{ alignSelf: "center", color: "var(--ink-soft)" }}
      >
        <Calendar size={14} strokeWidth={1.75} />
        Agregar a mi calendario
      </Button>

      {isSeed ? (
        <p
          style={{
            margin: "var(--space-2) 0 0",
            padding: "var(--space-3)",
            background: "var(--bg-sunken)",
            border: "1px solid var(--rule-faint)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-sm)",
            color: "var(--ink-soft)",
            textAlign: "center",
          }}
        >
          Esta es una cita pre-cargada en el demo. Las reservas que tú hagas sí son gestionables.
        </p>
      ) : null}

      <style>{`
        @media (min-width: 480px) {
          .vera-actions-row {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
