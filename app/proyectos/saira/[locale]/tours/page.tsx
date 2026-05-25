import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "../../lib/i18n/config";
import { tours } from "@/lib/saira";
import { TourCard } from "@/components/saira/tour/TourCard";
import { RevealOnView } from "@/components/saira/catalog/RevealOnView";

export default async function ToursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return <Inner />;
}

function Inner() {
  const t = useTranslations("catalog");

  return (
    <main className="saira-catalog">
      <header className="saira-catalog-header">
        <span className="saira-section-eyebrow">{t("eyebrow")}</span>
        <h1 className="saira-catalog-title">{t("title")}</h1>
        <p className="saira-catalog-subtitle">{t("subtitle")}</p>
        <p className="saira-catalog-count">
          {t("count", { count: tours.length })}
        </p>
      </header>

      <div className="saira-catalog-grid">
        {tours.map((tour, i) => (
          <RevealOnView key={tour.slug} index={i}>
            <TourCard tour={tour} />
          </RevealOnView>
        ))}
      </div>
    </main>
  );
}
