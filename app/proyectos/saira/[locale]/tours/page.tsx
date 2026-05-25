import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "../../lib/i18n/config";
import { tours } from "@/lib/saira";
import {
  filterTours,
  isCategoryFilter,
  isDifficultyBucket,
  type CategoryFilter,
  type DifficultyBucket,
} from "@/lib/saira/filters";
import { TourCard } from "@/components/saira/tour/TourCard";
import { RevealOnView } from "@/components/saira/catalog/RevealOnView";
import { FilterBar } from "@/components/saira/catalog/FilterBar";
import type { Tour } from "@/lib/saira/types";

export default async function ToursPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; difficulty?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const sp = await searchParams;
  const category: CategoryFilter = isCategoryFilter(sp.category)
    ? sp.category
    : "all";
  const difficulty: DifficultyBucket = isDifficultyBucket(sp.difficulty)
    ? sp.difficulty
    : "all";
  const filtered = filterTours(tours, category, difficulty);

  return <Inner filtered={filtered} />;
}

function Inner({ filtered }: { filtered: Tour[] }) {
  const t = useTranslations("catalog");

  return (
    <main className="saira-catalog">
      <header className="saira-catalog-header">
        <span className="saira-section-eyebrow">{t("eyebrow")}</span>
        <h1 className="saira-catalog-title">{t("title")}</h1>
        <p className="saira-catalog-subtitle">{t("subtitle")}</p>
        <p className="saira-catalog-count">
          {t("count", { count: filtered.length })}
        </p>
      </header>

      <FilterBar />

      <div className="saira-catalog-grid">
        {filtered.map((tour, i) => (
          <RevealOnView key={tour.slug} index={i}>
            <TourCard tour={tour} />
          </RevealOnView>
        ))}
      </div>
    </main>
  );
}
