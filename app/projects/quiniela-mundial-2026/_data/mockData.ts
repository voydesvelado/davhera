import type { Match, Question, WindowInfo } from "../_lib/types";

export const match: Match = {
  id: "mex-vs-bra-2026-06-18",
  homeTeam: { name: "México", code: "MEX", flag: "🇲🇽" },
  awayTeam: { name: "Brasil", code: "BRA", flag: "🇧🇷" },
  score: { home: 1, away: 0 },
  status: "halftime",
  minute: 45,
};

export const questions: Question[] = [
  {
    id: "q1-result",
    type: "prediction",
    text: "¿Cómo termina el partido?",
    options: [
      { id: "home", label: "Gana México" },
      { id: "draw", label: "Empate" },
      { id: "away", label: "Gana Brasil" },
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
      { id: "bra", label: "Brasil" },
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
