import type { Match } from "../_lib/types";

export type AccentColor = "pitch" | "gold" | "coral" | "electric";
export type Trend = "up" | "down" | "same";

export interface ResultQuestion {
  id: string;
  text: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface UserScore {
  correct: number;
  total: number;
  points: number;
  position: number;
  previousPosition: number;
  totalParticipants: number;
}

export interface Player {
  id: number;
  name: string;
  initials: string;
  points: number;
  correct: number;
  trend: Trend;
  change: number;
  color: AccentColor;
  isCurrentUser?: boolean;
}

export interface MatchResult {
  match: Match & { venue: string; group: string; date: string };
  userScore: UserScore;
  questions: ResultQuestion[];
}

export const matchResult: MatchResult = {
  match: {
    id: "mex-vs-kor-2026-06-18",
    homeTeam: { name: "México", code: "MEX", flag: "🇲🇽" },
    awayTeam: { name: "Corea del Sur", code: "KOR", flag: "🇰🇷" },
    score: { home: 2, away: 1 },
    status: "finished",
    minute: 90,
    venue: "Estadio Azteca, CDMX",
    group: "Grupo A",
    date: "18 Jun 2026",
  },
  userScore: {
    correct: 3,
    total: 5,
    points: 15,
    position: 42,
    previousPosition: 47,
    totalParticipants: 12_847,
  },
  questions: [
    {
      id: "q1",
      text: "¿Cómo termina el partido?",
      userAnswer: "Gana México",
      correctAnswer: "Gana México",
      isCorrect: true,
    },
    {
      id: "q2",
      text: "¿Cuántos goles en el segundo tiempo?",
      userAnswer: "2",
      correctAnswer: "2",
      isCorrect: true,
    },
    {
      id: "q3",
      text: "¿Quién marca el próximo gol?",
      userAnswer: "Corea del Sur",
      correctAnswer: "México",
      isCorrect: false,
    },
    {
      id: "q4",
      text: "¿Habrá tarjeta roja en el segundo tiempo?",
      userAnswer: "No",
      correctAnswer: "No",
      isCorrect: true,
    },
    {
      id: "q5",
      text: "¿Qué pasa primero?",
      userAnswer: "Gol",
      correctAnswer: "Tarjeta amarilla",
      isCorrect: false,
    },
  ],
};

export interface RankingGroup {
  name: string;
  members: number;
  data: Player[];
}

export interface RankingData {
  general: { top: Player[]; aroundUser: Player[]; total: number };
  group: RankingGroup;
}

export const rankingData: RankingData = {
  general: {
    total: 12_847,
    top: [
      { id: 1, name: "Alejandra M.", initials: "AM", points: 87, correct: 29, trend: "up", change: 2, color: "gold" },
      { id: 2, name: "Roberto S.", initials: "RS", points: 84, correct: 28, trend: "up", change: 1, color: "electric" },
      { id: 3, name: "Fernanda G.", initials: "FG", points: 81, correct: 27, trend: "down", change: 3, color: "coral" },
      { id: 4, name: "Miguel Á.", initials: "MÁ", points: 78, correct: 26, trend: "up", change: 5, color: "pitch" },
      { id: 5, name: "Daniela R.", initials: "DR", points: 75, correct: 25, trend: "same", change: 0, color: "electric" },
      { id: 6, name: "Pablo N.", initials: "PN", points: 72, correct: 24, trend: "down", change: 1, color: "gold" },
      { id: 7, name: "Lucía T.", initials: "LT", points: 69, correct: 23, trend: "up", change: 4, color: "coral" },
      { id: 8, name: "Andrés K.", initials: "AK", points: 66, correct: 22, trend: "down", change: 2, color: "pitch" },
    ],
    aroundUser: [
      { id: 41, name: "Renata J.", initials: "RJ", points: 46, correct: 15, trend: "down", change: 1, color: "coral" },
      { id: 42, name: "Carlos R.", initials: "CR", points: 45, correct: 15, trend: "up", change: 5, color: "pitch", isCurrentUser: true },
      { id: 43, name: "Sofía H.", initials: "SH", points: 44, correct: 14, trend: "down", change: 1, color: "electric" },
    ],
  },
  group: {
    name: "Quiniela de la Oficina 🏢",
    members: 14,
    data: [
      { id: 1, name: "Ana L.", initials: "AL", points: 54, correct: 18, trend: "up", change: 1, color: "gold" },
      { id: 2, name: "Carlos R.", initials: "CR", points: 45, correct: 15, trend: "up", change: 2, color: "pitch", isCurrentUser: true },
      { id: 3, name: "Jorge M.", initials: "JM", points: 42, correct: 14, trend: "down", change: 1, color: "electric" },
      { id: 4, name: "Luis F.", initials: "LF", points: 39, correct: 13, trend: "same", change: 0, color: "coral" },
      { id: 5, name: "Mariana V.", initials: "MV", points: 36, correct: 12, trend: "up", change: 3, color: "electric" },
      { id: 6, name: "Ricardo B.", initials: "RB", points: 33, correct: 11, trend: "down", change: 2, color: "gold" },
      { id: 7, name: "Paola S.", initials: "PS", points: 30, correct: 10, trend: "up", change: 1, color: "coral" },
    ],
  },
};

export interface PastMatch {
  id: string;
  matchday: string;
  home: string;
  away: string;
  score: string;
  correct: number;
  total: number;
  points: number;
  date: string;
}

export const participationHistory: PastMatch[] = [
  { id: "h1", matchday: "J2", home: "🇲🇽 MEX", away: "KOR 🇰🇷", score: "2-1", correct: 3, total: 5, points: 15, date: "18 Jun" },
  { id: "h2", matchday: "J2", home: "🇲🇽 MEX", away: "POL 🇵🇱", score: "1-0", correct: 4, total: 5, points: 20, date: "11 Jun" },
  { id: "h3", matchday: "J1", home: "🇲🇽 MEX", away: "CAN 🇨🇦", score: "3-1", correct: 2, total: 5, points: 10, date: "8 Jun" },
  { id: "h4", matchday: "J2", home: "🇦🇷 ARG", away: "JPN 🇯🇵", score: "2-2", correct: 1, total: 5, points: 5, date: "10 Jun" },
  { id: "h5", matchday: "J1", home: "🇧🇷 BRA", away: "GER 🇩🇪", score: "0-1", correct: 3, total: 5, points: 15, date: "7 Jun" },
  { id: "h6", matchday: "J1", home: "🇪🇸 ESP", away: "USA 🇺🇸", score: "2-0", correct: 2, total: 5, points: 10, date: "7 Jun" },
];

export interface NextMatch {
  homeTeam: { name: string; code: string; flag: string };
  awayTeam: { name: string; code: string; flag: string };
  date: string;
  venue: string;
  group: string;
}

export const nextMatch: NextMatch = {
  homeTeam: { name: "Argentina", code: "ARG", flag: "🇦🇷" },
  awayTeam: { name: "Alemania", code: "GER", flag: "🇩🇪" },
  date: "Mañana · 18:00",
  venue: "MetLife Stadium, NJ",
  group: "Grupo A",
};
