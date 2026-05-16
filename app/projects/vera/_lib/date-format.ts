const TZ = "America/Mexico_City";
const LOCALE = "es-MX";

const dateFmt = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TZ,
  weekday: "long",
  day: "numeric",
  month: "long",
});

const dateNoYearShortFmt = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TZ,
  weekday: "long",
  day: "numeric",
});

const timeFmt = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TZ,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const dayNameFmt = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TZ,
  weekday: "long",
});

const dayNumberFmt = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TZ,
  day: "numeric",
});

const monthShortFmt = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TZ,
  month: "short",
});

const ymdFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function asDate(input: Date | string): Date {
  return input instanceof Date ? input : new Date(input);
}

export function formatDate(input: Date | string): string {
  return dateFmt.format(asDate(input));
}

export function formatDateNoYearShort(input: Date | string): string {
  return dateNoYearShortFmt.format(asDate(input));
}

export function formatTime(input: Date | string): string {
  return timeFmt.format(asDate(input));
}

export function formatDayName(input: Date | string): string {
  return dayNameFmt.format(asDate(input));
}

export function formatDayNumber(input: Date | string): string {
  return dayNumberFmt.format(asDate(input));
}

export function formatMonthShort(input: Date | string): string {
  return monthShortFmt.format(asDate(input));
}

export function ymdInMx(input: Date | string): string {
  return ymdFmt.format(asDate(input));
}

export function isSameMxDay(a: Date | string, b: Date | string): boolean {
  return ymdInMx(a) === ymdInMx(b);
}

export function formatRelative(input: Date | string, ref: Date = new Date()): string {
  const d = asDate(input);
  const refYmd = ymdInMx(ref);
  const dYmd = ymdInMx(d);
  if (refYmd === dYmd) return `hoy a las ${formatTime(d)}`;

  const tomorrow = new Date(ref.getTime() + 86_400_000);
  if (ymdInMx(tomorrow) === dYmd) return `mañana a las ${formatTime(d)}`;

  // Within next 7 days → use weekday name
  const diffMs = new Date(`${dYmd}T06:00:00Z`).getTime() - new Date(`${refYmd}T06:00:00Z`).getTime();
  const diffDays = Math.round(diffMs / 86_400_000);
  if (diffDays > 0 && diffDays <= 7) {
    return `el ${formatDayName(d)} a las ${formatTime(d)}`;
  }

  return `${formatDate(d)} a las ${formatTime(d)}`;
}

export function formatCountdown(input: Date | string, ref: Date = new Date()): string {
  const d = asDate(input);
  const diffMs = d.getTime() - ref.getTime();
  if (diffMs <= 0) return "Pasó";
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) {
    const mins = Math.max(1, Math.floor(diffMs / 60_000));
    return `Faltan ${mins} min`;
  }
  if (hours < 48) return `Faltan ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Faltan ${days} días`;
}

export function formatPrice(amountMxn: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountMxn);
}

export function formatDuration(minutes: number): string {
  return `${minutes} min`;
}
