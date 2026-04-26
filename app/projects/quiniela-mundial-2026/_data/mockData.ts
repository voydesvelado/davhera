import type { Match, MatchStatus, Question, WindowInfo } from "../_lib/types";

export const match: Match = {
  id: "mex-vs-kor-2026-06-18",
  homeTeam: { name: "México", code: "MEX", flag: "🇲🇽" },
  awayTeam: { name: "Corea del Sur", code: "KOR", flag: "🇰🇷" },
  score: { home: 1, away: 0 },
  status: "halftime",
  minute: 45,
};

export const landingMatchMeta = {
  venue: "Estadio Azteca, CDMX",
  group: "Grupo A",
  matchday: "Jornada 2",
};

export interface HeroCopy {
  headline: string;
  /** Optional substring inside `headline` to highlight in the pitch color. */
  highlight?: string;
  subheadline: string;
}

export const heroCopy: Record<MatchStatus, HeroCopy> = {
  halftime: {
    headline: "México va ganando.",
    highlight: "México",
    subheadline: "¿Cómo termina? Participa en 60 segundos.",
  },
  live: {
    headline: "El partido está en vivo.",
    highlight: "en vivo",
    subheadline: "¿Quién gana? Participa ahora.",
  },
  upcoming: {
    headline: "¿Quién ganará hoy?",
    subheadline: "Participa en 60 segundos y compite con tus amigos.",
  },
  finished: {
    headline: "El partido terminó.",
    subheadline: "Prepárate para el siguiente. Regístrate ahora.",
  },
};

export interface FriendStub {
  name: string;
  initials: string;
  accent: "pitch" | "electric" | "gold";
}

export const socialProof = {
  activeParticipants: 12_847,
  friends: [
    { name: "Ana", initials: "A", accent: "pitch" as const },
    { name: "Jorge", initials: "J", accent: "electric" as const },
    { name: "Luis", initials: "L", accent: "gold" as const },
  ] satisfies FriendStub[],
};

export interface UpcomingMatch {
  id: string;
  homeCode: string;
  homeFlag: string;
  awayCode: string;
  awayFlag: string;
  when: string;
}

export const upcomingMatches: UpcomingMatch[] = [
  { id: "arg-ger", homeCode: "ARG", homeFlag: "🇦🇷", awayCode: "GER", awayFlag: "🇩🇪", when: "Mañana 12:00" },
  { id: "esp-jpn", homeCode: "ESP", homeFlag: "🇪🇸", awayCode: "JPN", awayFlag: "🇯🇵", when: "Mañana 15:00" },
  { id: "fra-usa", homeCode: "FRA", homeFlag: "🇫🇷", awayCode: "USA", awayFlag: "🇺🇸", when: "Mañana 18:00" },
];

export const questions: Question[] = [
  {
    id: "q1-result",
    type: "prediction",
    text: "¿Cómo termina el partido?",
    options: [
      { id: "home", label: "Gana México" },
      { id: "draw", label: "Empate" },
      { id: "away", label: "Gana Corea del Sur" },
    ],
  },
  {
    id: "q2-second-half-goals",
    type: "prediction",
    text: "¿Cuántos goles habrá en el segundo tiempo?",
    options: [
      { id: "0", label: "0" },
      { id: "1", label: "1" },
      { id: "2", label: "2" },
      { id: "3plus", label: "3 o más" },
    ],
  },
  {
    id: "q3-next-goal",
    type: "tactical",
    text: "¿Quién marca el próximo gol?",
    options: [
      { id: "mex", label: "México" },
      { id: "kor", label: "Corea del Sur" },
      { id: "none", label: "No hay más goles" },
    ],
  },
  {
    id: "q4-red-card",
    type: "tactical",
    text: "¿Habrá tarjeta roja en el segundo tiempo?",
    options: [
      { id: "yes", label: "Sí" },
      { id: "no", label: "No" },
    ],
  },
  {
    id: "q5-what-first",
    type: "fun",
    text: "¿Qué pasa primero?",
    options: [
      { id: "goal", label: "Gol" },
      { id: "yellow", label: "Tarjeta amarilla" },
      { id: "corner", label: "Tiro de esquina" },
      { id: "offside", label: "Fuera de lugar" },
    ],
  },
];

// Halftime window: 12 minutes from page load. Computed lazily on the client so
// SSR doesn't bake a stale timestamp into the bundle.
export function makeWindowInfo(): WindowInfo {
  return {
    type: "halftime",
    endsAt: Date.now() + 12 * 60 * 1000,
  };
}

/** Kickoff target for "upcoming" demo state — 2h15m in the future. */
export function makeUpcomingKickoff(): number {
  return Date.now() + (2 * 60 + 15) * 60 * 1000;
}
