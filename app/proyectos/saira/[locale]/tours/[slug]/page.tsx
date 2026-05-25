import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isLocale, locales } from "../../../lib/i18n/config";
import { tours, getTour } from "@/lib/saira";
import type { Tour } from "@/lib/saira/types";
import { TourGallery } from "@/components/saira/tour/TourGallery";
import { TourHeader } from "@/components/saira/tour/TourHeader";
import { TourDescription } from "@/components/saira/tour/TourDescription";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    tours.map((tour) => ({ locale, slug: tour.slug })),
  );
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const tour = getTour(slug);
  if (!tour) notFound();
  setRequestLocale(locale);

  return <Inner tour={tour} />;
}

function Inner({ tour }: { tour: Tour }) {
  return (
    <main className="saira-tour-detail">
      <TourGallery tour={tour} />
      <div className="saira-tour-detail-content">
        <TourHeader tour={tour} />
        <TourDescription tour={tour} />
        {/* Includes + meeting · M15 · Sticky CTA · M16 */}
      </div>
    </main>
  );
}
