import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "../lib/i18n/config";
import { Hero } from "@/components/saira/landing/Hero";

export default async function SairaHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      {/* FeaturedTours · M8 · ValueProp · M9 · Footer · M10 */}
    </main>
  );
}
