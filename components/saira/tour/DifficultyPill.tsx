import { useTranslations } from "next-intl";
import type { TourDifficulty } from "@/lib/saira/types";

type Variant = "inline" | "overlay";
type Level = "easy" | "moderate" | "hard";

const levelByDifficulty: Record<TourDifficulty, Level> = {
  facil: "easy",
  "facil-moderada": "easy",
  moderada: "moderate",
  "moderada-dificil": "moderate",
  dificil: "hard",
  variable: "easy",
};

export function DifficultyPill({
  difficulty,
  variant = "inline",
}: {
  difficulty: TourDifficulty;
  variant?: Variant;
}) {
  const t = useTranslations("difficulty");
  const level = levelByDifficulty[difficulty];
  return (
    <span
      className={`saira-pill saira-pill-${level} saira-pill-${variant}`}
    >
      {t(difficulty)}
    </span>
  );
}
