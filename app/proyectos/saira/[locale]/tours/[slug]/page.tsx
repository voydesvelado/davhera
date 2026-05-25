import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isLocale, locales } from "../../../lib/i18n/config";
import { tours, getTour } from "@/lib/saira";
import type { Tour } from "@/lib/saira/types";
import { TourGallery } from "@/components/saira/tour/TourGallery";
import { TourHeader } from "@/components/saira/tour/TourHeader";
import { TourDescription } from "@/components/saira/tour/TourDescription";
import { TourIncludes } from "@/components/saira/tour/TourIncludes";
import { TourMeetingPoint } from "@/components/saira/tour/TourMeetingPoint";
import { TourStickyCTA } from "@/components/saira/tour/TourStickyCTA";

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
        <div className="saira-tour-detail-main">
          <TourHeader tour={tour} />
          <TourDescription tour={tour} />
          <TourIncludes slug={tour.slug} />
          <TourMeetingPoint tour={tour} />
        </div>
        <aside className="saira-tour-detail-aside" aria-label="Reservar">
          <TourStickyCTA tour={tour} />
        </aside>
      </div>
    </main>
  );
}
