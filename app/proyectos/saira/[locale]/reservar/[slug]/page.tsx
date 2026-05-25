import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isLocale, locales } from "../../../lib/i18n/config";
import { tours, getTour } from "@/lib/saira";
import { BookingWizard } from "@/components/saira/booking/BookingWizard";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    tours.map((tour) => ({ locale, slug: tour.slug })),
  );
}

export default async function ReservarPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const tour = getTour(slug);
  if (!tour) notFound();
  setRequestLocale(locale);

  return <BookingWizard tour={tour} />;
}
