import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Star,
  Compass,
  Mountain,
  Sun,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Eyebrow } from "../_components/eyebrow";
import { Button } from "../_components/button";
import { Section } from "../_components/section";
import { TripHeroImage } from "../_components/trip-hero-image";
import { trips, getTripBySlug, type Trip } from "../_lib/trips";

const PRICE_FORMAT = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const HIGHLIGHT_ICONS: LucideIcon[] = [Star, Compass, Mountain, Sun, Sparkles];

const CATEGORY_LABEL: Record<Trip["category"], string> = {
  playa: "Playa",
  ciudad: "Ciudad",
  aventura: "Aventura",
  cultura: "Cultura",
};

export function generateStaticParams() {
  return trips.map((t) => ({ slug: t.slug }));
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = getTripBySlug(slug);
  if (!trip) notFound();

  const waText = encodeURIComponent(
    `Hola, me interesa el viaje "${trip.name}" en ${trip.destination}.`,
  );
  const waHref = `https://wa.me/525500000000?text=${waText}`;
  const [galleryHero, ...galleryRest] = trip.gallery;

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[80vh] overflow-hidden">
        <TripHeroImage src={trip.coverImage} alt={`${trip.name} en ${trip.destination}.`} />
        <div className="absolute inset-0 bg-gradient-to-t from-fg/60 via-fg/15 to-transparent" />
        <div className="relative min-h-[80vh] flex flex-col justify-end">
          <div className="mx-auto max-w-7xl w-full px-6 lg:px-12 pb-16 lg:pb-24">
            <div className="max-w-3xl">
              <Eyebrow className="text-bg/80">{trip.country.toUpperCase()}</Eyebrow>
              <h1 className="mt-6 text-display-lg sm:text-display-xl lg:text-display-2xl font-display text-bg">
                {trip.name}
              </h1>
              <p className="mt-6 text-body-lg text-bg/85 max-w-2xl">
                {trip.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview row */}
      <section className="bg-bg-elevated border-y border-border-token">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-10 lg:py-12">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <Overview label="Duración" value={trip.duration} />
            <Overview
              label="Desde"
              value={PRICE_FORMAT.format(trip.priceFrom) + " MXN"}
            />
            <Overview
              label="Categoría"
              value={CATEGORY_LABEL[trip.category]}
            />
            <Overview label="Próximas salidas" value="Todo el año" />
          </dl>
        </div>
      </section>

      {/* Description */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow>SOBRE ESTE VIAJE</Eyebrow>
            <h2 className="mt-4 text-display-md lg:text-display-lg font-display text-fg">
              Una propuesta a tu medida
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-body-lg text-fg-muted leading-relaxed">
              {trip.description}
            </p>
          </div>
        </div>
      </Section>

      {/* Highlights */}
      <Section className="border-t border-border-token">
        <div className="max-w-2xl">
          <Eyebrow>DESTACADOS</Eyebrow>
          <h2 className="mt-4 text-display-md lg:text-display-lg font-display text-fg">
            Lo que vas a vivir
          </h2>
        </div>
        <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {trip.highlights.map((h, i) => {
            const Icon = HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length];
            return (
              <li key={h} className="flex gap-4">
                <span
                  aria-hidden
                  className="shrink-0 mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <p className="text-body-lg text-fg leading-snug">{h}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Itinerary */}
      <Section className="border-t border-border-token">
        <div className="max-w-2xl">
          <Eyebrow>ITINERARIO</Eyebrow>
          <h2 className="mt-4 text-display-md lg:text-display-lg font-display text-fg">
            Día a día
          </h2>
        </div>
        <ol className="mt-12">
          {trip.itinerary.map((d) => (
            <li
              key={d.day}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-10 lg:py-12 border-t border-border-token first:border-t-0"
            >
              <div className="md:col-span-3">
                <span className="text-display-lg font-display text-fg-subtle leading-none">
                  {String(d.day).padStart(2, "0")}
                </span>
                <span className="block mt-2 text-eyebrow text-fg-muted">
                  Día {d.day}
                </span>
              </div>
              <div className="md:col-span-9">
                <h3 className="text-heading-lg font-display text-fg">
                  {d.title}
                </h3>
                <p className="mt-3 text-body text-fg-muted leading-relaxed max-w-2xl">
                  {d.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Gallery */}
      <Section className="border-t border-border-token">
        <div className="max-w-2xl">
          <Eyebrow>GALERÍA</Eyebrow>
          <h2 className="mt-4 text-display-md lg:text-display-lg font-display text-fg">
            Postales del viaje
          </h2>
        </div>
        <div className="mt-12 space-y-4 lg:space-y-6">
          {galleryHero ? (
            <div className="relative aspect-[16/9] overflow-hidden bg-fg/5">
              <Image
                src={galleryHero}
                alt={`Fotografía de ${trip.destination}.`}
                fill
                sizes="(min-width: 1024px) 1280px, 100vw"
                loading="lazy"
                className="object-cover"
              />
            </div>
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {galleryRest.map((src, i) => (
              <div
                key={src}
                className="relative aspect-[4/3] overflow-hidden bg-fg/5"
              >
                <Image
                  src={src}
                  alt={`Fotografía ${i + 2} de ${trip.destination}.`}
                  fill
                  sizes="(min-width: 1024px) 640px, 100vw"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Reservation CTA */}
      <section className="bg-fg text-bg">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-24 lg:py-32 text-center">
          <Eyebrow className="text-bg/60">RESERVA</Eyebrow>
          <h2 className="mt-4 text-display-lg lg:text-display-xl font-display max-w-3xl mx-auto">
            Cotiza este viaje a tu medida
          </h2>
          <p className="mt-6 text-body-lg text-bg/80 max-w-xl mx-auto">
            Cuéntanos algunos detalles y un asesor te enviará una propuesta
            personalizada en menos de 24 horas.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              href={`/viajes/cotizar/${trip.slug}`}
              variant="primary"
              size="lg"
            >
              Comenzar cotización
            </Button>
            <Button
              href={waHref}
              variant="ghost"
              size="lg"
              className="bg-transparent text-bg border border-bg/30 hover:bg-bg/10"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hablar por WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function Overview({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-eyebrow text-fg-muted">{label}</dt>
      <dd className="mt-2 text-heading-md font-medium text-fg">{value}</dd>
    </div>
  );
}
