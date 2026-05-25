import type { Tour, TourCategory, TourDifficulty } from "./types";

// Buckets de dificultad para la UI: las 6 variantes del catálogo se
// agrupan en 3 (Fácil / Moderada / Difícil) para que el filter bar
// se sienta legible.
const DIFFICULTY_BUCKETS: Record<TourDifficulty, "easy" | "moderate" | "hard"> = {
  facil: "easy",
  "facil-moderada": "easy",
  moderada: "moderate",
  "moderada-dificil": "moderate",
  dificil: "hard",
  variable: "easy",
};

export type DifficultyBucket = "easy" | "moderate" | "hard" | "all";
export type CategoryFilter = TourCategory | "all";

export function filterTours(
  tours: Tour[],
  category: CategoryFilter,
  difficulty: DifficultyBucket,
): Tour[] {
  return tours.filter((tour) => {
    if (category !== "all" && tour.category !== category) return false;
    if (
      difficulty !== "all" &&
      DIFFICULTY_BUCKETS[tour.difficulty] !== difficulty
    ) {
      return false;
    }
    return true;
  });
}

export function isCategoryFilter(value: string | undefined): value is CategoryFilter {
  return value === "all" || value === "ecotour" || value === "aventura";
}

export function isDifficultyBucket(value: string | undefined): value is DifficultyBucket {
  return (
    value === "all" ||
    value === "easy" ||
    value === "moderate" ||
    value === "hard"
  );
}
