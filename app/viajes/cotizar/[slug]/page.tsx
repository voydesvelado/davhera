import { notFound } from "next/navigation";
import { getTripBySlug, trips } from "../../_lib/trips";
import { FormShell } from "../../_components/form/form-shell";

export function generateStaticParams() {
  return trips.map((t) => ({ slug: t.slug }));
}

export default async function CotizarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = getTripBySlug(slug);
  if (!trip) notFound();
  return <FormShell trip={trip} />;
}
