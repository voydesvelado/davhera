import type { MatchStatus, Team } from "../_lib/types";

export type Matchday = "J1" | "J2" | "J3";

export interface SelectableMatch {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  time: string;
  status: MatchStatus;
  score?: { home: number; away: number };
  group: string;
  matchday: Matchday;
  hasParticipated?: boolean;
  windowOpen?: boolean;
}

export interface GroupData {
  id: string;
  teams: Team[];
}

export const worldCupGroups: GroupData[] = [
  {
    id: "A",
    teams: [
      { name: "México", code: "MEX", flag: "🇲🇽" },
      { name: "Sudáfrica", code: "RSA", flag: "🇿🇦" },
      { name: "Corea del Sur", code: "KOR", flag: "🇰🇷" },
      { name: "Chequia", code: "CZE", flag: "🇨🇿" },
    ],
  },
  {
    id: "B",
    teams: [
      { name: "Canadá", code: "CAN", flag: "🇨🇦" },
      { name: "Bosnia y Herz.", code: "BIH", flag: "🇧🇦" },
      { name: "Catar", code: "QAT", flag: "🇶🇦" },
      { name: "Suiza", code: "SUI", flag: "🇨🇭" },
    ],
  },
  {
    id: "C",
    teams: [
      { name: "Brasil", code: "BRA", flag: "🇧🇷" },
      { name: "Marruecos", code: "MAR", flag: "🇲🇦" },
      { name: "Haití", code: "HAI", flag: "🇭🇹" },
      { name: "Escocia", code: "SCO", flag: "🏴" },
    ],
  },
  {
    id: "D",
    teams: [
      { name: "Estados Unidos", code: "USA", flag: "🇺🇸" },
      { name: "Paraguay", code: "PAR", flag: "🇵🇾" },
      { name: "Australia", code: "AUS", flag: "🇦🇺" },
      { name: "Turquía", code: "TUR", flag: "🇹🇷" },
    ],
  },
  {
    id: "E",
    teams: [
      { name: "Alemania", code: "GER", flag: "🇩🇪" },
      { name: "Curazao", code: "CUR", flag: "🇨🇼" },
      { name: "Costa de Marfil", code: "CIV", flag: "🇨🇮" },
      { name: "Ecuador", code: "ECU", flag: "🇪🇨" },
    ],
  },
  {
    id: "F",
    teams: [
      { name: "Países Bajos", code: "NED", flag: "🇳🇱" },
      { name: "Japón", code: "JPN", flag: "🇯🇵" },
      { name: "Suecia", code: "SWE", flag: "🇸🇪" },
      { name: "Túnez", code: "TUN", flag: "🇹🇳" },
    ],
  },
  {
    id: "G",
    teams: [
      { name: "Bélgica", code: "BEL", flag: "🇧🇪" },
      { name: "Egipto", code: "EGY", flag: "🇪🇬" },
      { name: "Irán", code: "IRN", flag: "🇮🇷" },
      { name: "Nueva Zelanda", code: "NZL", flag: "🇳🇿" },
    ],
  },
  {
    id: "H",
    teams: [
      { name: "España", code: "ESP", flag: "🇪🇸" },
      { name: "Cabo Verde", code: "CPV", flag: "🇨🇻" },
      { name: "Arabia Saudita", code: "KSA", flag: "🇸🇦" },
      { name: "Uruguay", code: "URU", flag: "🇺🇾" },
    ],
  },
  {
    id: "I",
    teams: [
      { name: "Francia", code: "FRA", flag: "🇫🇷" },
      { name: "Senegal", code: "SEN", flag: "🇸🇳" },
      { name: "Irak", code: "IRQ", flag: "🇮🇶" },
      { name: "Noruega", code: "NOR", flag: "🇳🇴" },
    ],
  },
  {
    id: "J",
    teams: [
      { name: "Argentina", code: "ARG", flag: "🇦🇷" },
      { name: "Argelia", code: "ALG", flag: "🇩🇿" },
      { name: "Austria", code: "AUT", flag: "🇦🇹" },
      { name: "Jordania", code: "JOR", flag: "🇯🇴" },
    ],
  },
  {
    id: "K",
    teams: [
      { name: "Portugal", code: "POR", flag: "🇵🇹" },
      { name: "R.D. Congo", code: "COD", flag: "🇨🇩" },
      { name: "Uzbekistán", code: "UZB", flag: "🇺🇿" },
      { name: "Colombia", code: "COL", flag: "🇨🇴" },
    ],
  },
  {
    id: "L",
    teams: [
      { name: "Inglaterra", code: "ENG", flag: "🏴" },
      { name: "Croacia", code: "CRO", flag: "🇭🇷" },
      { name: "Ghana", code: "GHA", flag: "🇬🇭" },
      { name: "Panamá", code: "PAN", flag: "🇵🇦" },
    ],
  },
];

// Deterministic, seeded pseudo-random so SSR and CSR render identical mocks.
function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function seedFromString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const MATCHDAY_DATES: Record<Matchday, string> = {
  J1: "11 Jun",
  J2: "18 Jun",
  J3: "25 Jun",
};

const TIMES = ["12:00", "15:00", "18:00"];

// Six round-robin pairings ordered into 3 matchdays (J1: 0v1, 2v3 / J2: 0v2, 1v3 / J3: 0v3, 1v2).
const PAIRINGS: { home: number; away: number; matchday: Matchday }[] = [
  { home: 0, away: 1, matchday: "J1" },
  { home: 2, away: 3, matchday: "J1" },
  { home: 0, away: 2, matchday: "J2" },
  { home: 1, away: 3, matchday: "J2" },
  { home: 0, away: 3, matchday: "J3" },
  { home: 1, away: 2, matchday: "J3" },
];

// Status template repeats per group: 2 finished, 1 live-or-halftime, 3 upcoming.
const STATUS_TEMPLATE: MatchStatus[] = [
  "finished",
  "finished",
  "halftime",
  "upcoming",
  "upcoming",
  "upcoming",
];

export function generateGroupMatches(group: GroupData): SelectableMatch[] {
  const rand = seededRandom(seedFromString(group.id));
  return PAIRINGS.map((p, i) => {
    const home = group.teams[p.home];
    const away = group.teams[p.away];
    const baseStatus = STATUS_TEMPLATE[i];
    // Occasional swap of the live slot to "live" instead of "halftime" for visual variety.
    const status: MatchStatus =
      baseStatus === "halftime" && rand() > 0.5 ? "live" : baseStatus;

    let score: SelectableMatch["score"];
    if (status === "finished") {
      score = { home: Math.floor(rand() * 4), away: Math.floor(rand() * 4) };
    } else if (status === "live" || status === "halftime") {
      score = { home: Math.floor(rand() * 3), away: Math.floor(rand() * 3) };
    }

    const hasParticipated = status === "finished" ? rand() > 0.5 : undefined;
    const windowOpen = status === "live" || status === "halftime";
    const time = TIMES[i % TIMES.length];

    return {
      id: `${group.id}-${home.code}-${away.code}`.toLowerCase(),
      homeTeam: home,
      awayTeam: away,
      date: MATCHDAY_DATES[p.matchday],
      time,
      status,
      score,
      group: group.id,
      matchday: p.matchday,
      hasParticipated,
      windowOpen,
    };
  });
}

// Featured live match wired to the LiveMatchBanner. MEX vs KOR (Group A, halftime, 1-0).
export const highlightMatch: SelectableMatch = {
  id: "a-mex-kor",
  homeTeam: { name: "México", code: "MEX", flag: "🇲🇽" },
  awayTeam: { name: "Corea del Sur", code: "KOR", flag: "🇰🇷" },
  date: "11 Jun",
  time: "18:00",
  status: "halftime",
  score: { home: 1, away: 0 },
  group: "A",
  matchday: "J1",
  windowOpen: true,
};
