import { useTranslations } from "next-intl";
import type { Tour } from "@/lib/saira/types";
import { DifficultyPill } from "./DifficultyPill";
import { formatBRL, formatDuration } from "@/lib/saira/format";

export function TourHeader({ tour }: { tour: Tour }) {
  const t = useTranslations("common");
  const tCat = useTranslations("category");

  const priceLabel = tour.priceOnRequest
    ? t("consultPrice")
    : `${tour.priceFromOnly ? t("from") + " " : ""}${formatBRL(tour.priceBRL)}`;

  return (
    <header className="saira-tour-header">
      <div className="saira-tour-header-meta">
        <span className="saira-section-eyebrow">{tCat(tour.category)}</span>
        <h1 className="saira-tour-header-name">{tour.name}</h1>
      </div>

      <div className="saira-tour-header-stats">
        <DifficultyPill difficulty={tour.difficulty} />
        {tour.durationMinutes != null && (
          <span className="saira-tour-stat">
            <span className="saira-tour-stat-label">{t("duration")}</span>
            <span className="saira-tour-stat-value">
              {formatDuration(tour.durationMinutes)}
            </span>
          </span>
        )}
        <span className="saira-tour-stat saira-tour-stat-price">
          <span className="saira-tour-stat-label">{t("price")}</span>
          <span className="saira-tour-stat-value">{priceLabel}</span>
        </span>
      </div>
    </header>
  );
}
