import { getSeedBookings, SEED_SERVICES } from "./seed";
import { readVisitorData, writeVisitorData } from "./storage";
import { generateBookingToken, isSeedToken } from "./tokens";
import type { Booking, DoctorId, ServiceId } from "./types";

export class SlotTakenError extends Error {
  constructor(message = "Ese horario ya está tomado.") {
    super(message);
    this.name = "SlotTakenError";
  }
}

export class NotFoundError extends Error {
  constructor(message = "No encontramos esa cita.") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ReadOnlyBookingError extends Error {
  constructor(message = "Esta es una cita de muestra. No se puede modificar.") {
    super(message);
    this.name = "ReadOnlyBookingError";
  }
}

export interface CreateBookingInput {
  doctorId: DoctorId;
  serviceId: ServiceId;
  startsAt: Date;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientNote?: string;
}

function allBookings(): Booking[] {
  return [...getSeedBookings(), ...readVisitorData().bookings];
}

function hasConflict(
  doctorId: DoctorId,
  startsAt: Date,
  endsAt: Date,
  excludeToken?: string,
): boolean {
  const start = startsAt.getTime();
  const end = endsAt.getTime();
  return allBookings().some((b) => {
    if (b.doctorId !== doctorId) return false;
    if (b.status !== "confirmed") return false;
    if (excludeToken && b.token === excludeToken) return false;
    const bStart = new Date(b.startsAt).getTime();
    const bEnd = new Date(b.endsAt).getTime();
    return start < bEnd && bStart < end;
  });
}

export function createBooking(input: CreateBookingInput): Booking {
  const service = SEED_SERVICES.find((s) => s.id === input.serviceId);
  if (!service) throw new NotFoundError("No existe ese servicio.");

  const endsAt = new Date(input.startsAt.getTime() + service.durationMin * 60 * 1000);

  if (hasConflict(input.doctorId, input.startsAt, endsAt)) {
    throw new SlotTakenError();
  }

  const booking: Booking = {
    token: generateBookingToken(),
    doctorId: input.doctorId,
    serviceId: input.serviceId,
    startsAt: input.startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    status: "confirmed",
    patientName: input.patientName.trim(),
    patientPhone: input.patientPhone.trim(),
    patientEmail: input.patientEmail.trim(),
    patientNote: input.patientNote?.trim() || undefined,
    createdAt: new Date().toISOString(),
    isSeed: false,
  };

  const current = readVisitorData();
  writeVisitorData({ ...current, bookings: [...current.bookings, booking] });

  return booking;
}

export function rescheduleBooking(token: string, newStartsAt: Date): Booking {
  if (isSeedToken(token)) throw new ReadOnlyBookingError();

  const current = readVisitorData();
  const idx = current.bookings.findIndex((b) => b.token === token);
  if (idx === -1) throw new NotFoundError();

  const existing = current.bookings[idx];
  const service = SEED_SERVICES.find((s) => s.id === existing.serviceId);
  if (!service) throw new NotFoundError("Servicio asociado no existe.");

  const newEndsAt = new Date(newStartsAt.getTime() + service.durationMin * 60 * 1000);

  if (hasConflict(existing.doctorId, newStartsAt, newEndsAt, token)) {
    throw new SlotTakenError();
  }

  const updated: Booking = {
    ...existing,
    startsAt: newStartsAt.toISOString(),
    endsAt: newEndsAt.toISOString(),
    status: "confirmed",
  };

  const next = current.bookings.slice();
  next[idx] = updated;
  writeVisitorData({ ...current, bookings: next });

  return updated;
}

export function cancelBooking(token: string): Booking {
  if (isSeedToken(token)) throw new ReadOnlyBookingError();

  const current = readVisitorData();
  const idx = current.bookings.findIndex((b) => b.token === token);
  if (idx === -1) throw new NotFoundError();

  const updated: Booking = {
    ...current.bookings[idx],
    status: "cancelled",
    cancelledAt: new Date().toISOString(),
  };

  const next = current.bookings.slice();
  next[idx] = updated;
  writeVisitorData({ ...current, bookings: next });

  return updated;
}

export function getBookingByToken(token: string): Booking | null {
  return allBookings().find((b) => b.token === token) ?? null;
}
