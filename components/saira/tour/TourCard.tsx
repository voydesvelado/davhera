import { useTranslations } from "next-intl";
import { Link } from "@/app/proyectos/saira/lib/i18n/navigation";
import type { Tour } from "@/lib/saira";
import { formatBRL, formatDuration } from "@/lib/saira";
import { DifficultyPill } from "./DifficultyPill";

// Card editorial de un tour.
// Placeholder visual: gradient de --moss → --jade hasta que David entregue
// imágenes. Cuando lleguen, swap a <Image fill> de next/image dentro del
// .saira-tour-card-media (manteniendo el gradient como fallback de carga).

export function TourCard({ tour }: { tour: Tour }) {
  const t = useTranslations("common");
  const tCat = useTranslations("category");

  const priceLabel = tour.priceOnRequest
    ? t("consultPrice")
    : `${tour.priceFromOnly ? t("from") + " " : ""}${formatBRL(tour.priceBRL)}`;

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="saira-tour-card"
      aria-label={tour.name}
    >
      <div className="saira-tour-card-media">
        <DifficultyPill difficulty={tour.difficulty} variant="overlay" />
        <span className="saira-tour-card-media-mark" aria-hidden="true">
          {tour.name
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")}
        </span>
      </div>

      <div className="saira-tour-card-body">
        <h3 className="saira-tour-card-name">{tour.name}</h3>

        <div className="saira-tour-card-meta">
          {tour.durationMinutes != null && (
            <span>{formatDuration(tour.durationMinutes)}</span>
          )}
          <span>{tCat(tour.category)}</span>
        </div>

        <div className="saira-tour-card-price">
          <span className="saira-tour-card-price-amount">{priceLabel}</span>
          {!tour.priceOnRequest && (
            <span className="saira-tour-card-price-suffix">
              {" · "}
              {t("perPerson")}
            </span>
          )}
          <span className="saira-tour-card-arrow" aria-hidden="true">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
