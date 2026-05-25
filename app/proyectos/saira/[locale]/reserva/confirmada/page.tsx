import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "../../../lib/i18n/config";
import { ConfirmationView } from "@/components/saira/booking/ConfirmationView";

export default async function ConfirmadaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return <ConfirmationView />;
}
