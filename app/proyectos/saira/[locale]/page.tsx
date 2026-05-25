import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "../lib/i18n/config";
import { Hero } from "@/components/saira/landing/Hero";
import { FeaturedTours } from "@/components/saira/landing/FeaturedTours";
import { ValueProp } from "@/components/saira/landing/ValueProp";

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
      <FeaturedTours />
      <ValueProp />
      {/* Footer · M10 */}
    </main>
  );
}
