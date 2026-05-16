import type {
  AvailabilityRule,
  BlockedPeriod,
  Booking,
  Doctor,
  Service,
} from "./types";

export const SOFIA_ID = "sofia-ramirez";

export const SEED_DOCTOR: Doctor = {
  id: SOFIA_ID,
  slug: "dra-sofia-ramirez",
  name: "Dra. Sofía Ramírez",
  specialty: "Psicóloga clínica",
  bio:
    "Soy psicóloga clínica con ocho años de práctica privada. Mi formación combina la terapia cognitivo-conductual con enfoques somáticos y de trauma; trabajo con personas adultas que llegan a consulta por ansiedad, duelo, vínculos difíciles, transiciones de vida, o por la sensación de que algo se desacomodó y no terminan de poner en palabras qué. Mi trabajo es ayudarte a nombrarlo, entender su origen, y construir contigo herramientas concretas. Atiendo en consultorio en Roma Norte y mantengo agenda limitada — prefiero acompañar a pocas personas con presencia plena, en lugar de muchas en automático. La primera sesión es una consulta inicial: nos conocemos, te cuento cómo trabajo, y decidimos juntas si tiene sentido continuar.",
  photoUrl: "/projects/vera/sofia.jpg",
  cedula: "98765432",
  yearsOfPractice: 8,
  languages: ["Español", "Inglés"],
  location: {
    type: "in_person",
    address: "Av. Álvaro Obregón 145, interior 304\nColonia Roma Norte\n06700, Cuauhtémoc, CDMX",
    city: "Ciudad de México",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Av. Álvaro Obregón 145, Roma Norte, Cuauhtémoc, 06700 Ciudad de México, CDMX"),
  },
  timezone: "America/Mexico_City",
  instagram: "@drasofiaramirez",
  whatsapp: "+525512345678",
};

export const SEED_SERVICES: Service[] = [
  {
    id: "consulta-inicial",
    doctorId: SOFIA_ID,
    name: "Consulta inicial",
    durationMin: 60,
    priceMxn: 1200,
    description:
      "Una primera sesión para conocernos. Hablamos de qué te trae a consulta, cómo trabajo, y decidimos juntas si tiene sentido continuar.",
  },
  {
    id: "sesion-seguimiento",
    doctorId: SOFIA_ID,
    name: "Sesión de seguimiento",
    durationMin: 50,
    priceMxn: 950,
    description:
      "Sesión individual de continuidad para personas que ya iniciaron proceso terapéutico conmigo.",
  },
  {
    id: "sesion-pareja",
    doctorId: SOFIA_ID,
    name: "Sesión de pareja",
    durationMin: 75,
    priceMxn: 1500,
    description:
      "Sesión para parejas que quieren trabajar dinámicas de comunicación, conflictos recurrentes o decisiones compartidas.",
  },
];

export const SEED_AVAILABILITY: AvailabilityRule[] = (() => {
  const rules: AvailabilityRule[] = [];
  for (let weekday = 1; weekday <= 5; weekday += 1) {
    rules.push({ doctorId: SOFIA_ID, weekday, startMinute: 10 * 60, endMinute: 14 * 60 });
    rules.push({ doctorId: SOFIA_ID, weekday, startMinute: 16 * 60, endMinute: 19 * 60 });
  }
  return rules;
})();

const MX_TZ = "America/Mexico_City";

/**
 * Returns "today at 00:00 in Mexico City time", as a UTC Date.
 * Anchors all relative seed dates so that server SSR and client hydration
 * produce the same values for the same calendar day.
 */
export function getSeedReferenceDate(now: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: MX_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  const y = get("year");
  const m = get("month");
  const d = get("day");
  // 06:00Z is 00:00 Mexico City (UTC-6, no DST since 2022).
  return new Date(`${y}-${m}-${d}T06:00:00.000Z`);
}

function dayOffset(reference: Date, days: number, hour: number, minute: number): Date {
  const d = new Date(reference.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  // hour is local Mexico time; offset by +6h to UTC
  d.setUTCHours(hour + 6, minute, 0, 0);
  return d;
}

function isoAt(reference: Date, days: number, hour: number, minute: number): string {
  return dayOffset(reference, days, hour, minute).toISOString();
}

export function getSeedBlockedPeriods(now?: Date): BlockedPeriod[] {
  const ref = getSeedReferenceDate(now);
  return [
    {
      doctorId: SOFIA_ID,
      startsAt: isoAt(ref, 12, 0, 0),
      endsAt: isoAt(ref, 16, 0, 0),
      reason: "Puente largo",
    },
    {
      doctorId: SOFIA_ID,
      startsAt: isoAt(ref, 24, 9, 0),
      endsAt: isoAt(ref, 24, 19, 0),
      reason: "Congreso de psicoterapia",
    },
  ];
}

interface SeedBookingSpec {
  patientName: string;
  serviceId: string;
  dayOffset: number;
  hour: number;
  minute: number;
}

const SEED_SPECS: SeedBookingSpec[] = [
  { patientName: "Laura M.",    serviceId: "sesion-seguimiento", dayOffset: 0,  hour: 11, minute: 0 },
  { patientName: "Patricia G.", serviceId: "sesion-seguimiento", dayOffset: 1,  hour: 16, minute: 0 },
  { patientName: "Andrés R.",   serviceId: "consulta-inicial",   dayOffset: 1,  hour: 17, minute: 30 },
  { patientName: "Mariana T.",  serviceId: "sesion-seguimiento", dayOffset: 2,  hour: 10, minute: 0 },
  { patientName: "Diego F. y Carmen L.", serviceId: "sesion-pareja", dayOffset: 2, hour: 17, minute: 0 },
  { patientName: "Roberto S.",  serviceId: "sesion-seguimiento", dayOffset: 3,  hour: 11, minute: 0 },
  { patientName: "Valeria P.",  serviceId: "consulta-inicial",   dayOffset: 4,  hour: 12, minute: 0 },
  { patientName: "Ernesto C.",  serviceId: "sesion-seguimiento", dayOffset: 4,  hour: 18, minute: 0 },
  { patientName: "Lucía B.",    serviceId: "sesion-seguimiento", dayOffset: 7,  hour: 10, minute: 30 },
  { patientName: "Camila V.",   serviceId: "consulta-inicial",   dayOffset: 8,  hour: 16, minute: 30 },
  { patientName: "Tomás H.",    serviceId: "sesion-seguimiento", dayOffset: 9,  hour: 11, minute: 0 },
  { patientName: "Renata J. y Iván Q.", serviceId: "sesion-pareja", dayOffset: 10, hour: 17, minute: 0 },
];

export function getSeedBookings(now?: Date): Booking[] {
  const ref = getSeedReferenceDate(now);
  const serviceById = new Map(SEED_SERVICES.map((s) => [s.id, s]));

  return SEED_SPECS.map((spec, idx) => {
    const service = serviceById.get(spec.serviceId);
    if (!service) throw new Error(`Seed references unknown service ${spec.serviceId}`);
    const startsAt = dayOffset(ref, spec.dayOffset, spec.hour, spec.minute);
    const endsAt = new Date(startsAt.getTime() + service.durationMin * 60 * 1000);
    const tokenNum = String(idx + 1).padStart(3, "0");
    return {
      token: `SEED-${tokenNum}`,
      doctorId: SOFIA_ID,
      serviceId: spec.serviceId,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      status: "confirmed",
      patientName: spec.patientName,
      patientPhone: "+525500000000",
      patientEmail: "demo@vera.app",
      createdAt: new Date(ref.getTime() - 7 * 86_400_000).toISOString(),
      isSeed: true,
    } satisfies Booking;
  });
}

export const ALL_DOCTORS: Doctor[] = [SEED_DOCTOR];
