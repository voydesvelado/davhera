export type DoctorId = string;
export type ServiceId = string;

export type LocationInPerson = {
  type: "in_person";
  address: string;
  city: string;
  mapsUrl: string;
};

export type LocationOnline = {
  type: "online";
  platform: string;
  joinUrl?: string;
};

export type Location = LocationInPerson | LocationOnline;

export interface Doctor {
  id: DoctorId;
  slug: string;
  name: string;
  specialty: string;
  bio: string;
  photoUrl: string;
  cedula: string;
  yearsOfPractice: number;
  languages: string[];
  location: Location;
  timezone: string;
  instagram?: string;
  whatsapp: string;
}

export interface Service {
  id: ServiceId;
  doctorId: DoctorId;
  name: string;
  durationMin: number;
  priceMxn: number;
  description: string;
}

export interface AvailabilityRule {
  doctorId: DoctorId;
  weekday: number;
  startMinute: number;
  endMinute: number;
}

export interface BlockedPeriod {
  doctorId: DoctorId;
  startsAt: string;
  endsAt: string;
  reason?: string;
}

export type BookingStatus = "confirmed" | "cancelled";

export interface Booking {
  token: string;
  doctorId: DoctorId;
  serviceId: ServiceId;
  startsAt: string;
  endsAt: string;
  status: BookingStatus;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientNote?: string;
  createdAt: string;
  cancelledAt?: string;
  isSeed: boolean;
}

export interface Slot {
  startsAt: Date;
  endsAt: Date;
}

export interface VisitorData {
  version: number;
  bookings: Booking[];
}

export const VISITOR_DATA_VERSION = 1 as const;
