import type { Booking, Doctor, Service } from "./types";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatIcsDateUtc(d: Date): string {
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

interface IcsArgs {
  booking: Booking;
  doctor: Doctor;
  service: Service;
}

export function buildIcs({ booking, doctor, service }: IcsArgs): string {
  const start = formatIcsDateUtc(new Date(booking.startsAt));
  const end = formatIcsDateUtc(new Date(booking.endsAt));
  const stamp = formatIcsDateUtc(new Date());
  const summary = escapeIcs(`${service.name} con ${doctor.name}`);
  const location =
    doctor.location.type === "in_person"
      ? escapeIcs(doctor.location.address.replace(/\n/g, ", "))
      : escapeIcs(doctor.location.platform);
  const description = escapeIcs(
    `Cita reservada vía Vera. Referencia: ${booking.token}. ` +
      `Si necesitas reagendar o cancelar: vera.app/cita/${booking.token}`,
  );

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Vera//Demo//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${booking.token}@vera.app`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${summary}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs(args: IcsArgs): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([buildIcs(args)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cita-${args.booking.token}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
