import { useTranslations } from "next-intl";
import { Link } from "@/app/proyectos/saira/lib/i18n/navigation";
import { TourCard } from "@/components/saira/tour/TourCard";
import { tours } from "@/lib/saira";

// Curado editorial. Cambiar este array es la única edición necesaria para
// rotar destacados con Saraí.
export const FEATURED_SLUGS = [
  "pedra-da-gavea",
  "cerro-dois-irmaos",
  "parapente",
] as const;

export function FeaturedTours() {
  const t = useTranslations("featured");
  const featured = FEATURED_SLUGS.map(
    (slug) => tours.find((x) => x.slug === slug)!,
  );

  return (
    <section className="saira-featured" aria-labelledby="featured-title">
      <div className="saira-featured-header">
        <div className="saira-featured-header-lead">
          <span className="saira-section-eyebrow">01</span>
          <h2 id="featured-title" className="saira-section-title">
            {t("title")}
          </h2>
          <p className="saira-section-subtitle">{t("subtitle")}</p>
        </div>
        <Link href="/tours" className="saira-featured-viewall">
          {t("viewAll")} →
        </Link>
      </div>

      <div className="saira-featured-grid">
        {featured.map((tour) => (
          <TourCard key={tour.slug} tour={tour} />
        ))}
      </div>
    </section>
  );
}
