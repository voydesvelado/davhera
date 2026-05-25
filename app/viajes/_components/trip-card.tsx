import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "./eyebrow";
import type { Trip } from "../_lib/trips";

const PRICE_FORMAT = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <Link
      href={`/viajes/${trip.slug}`}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded-sm"
    >
      <div className="overflow-hidden bg-fg/5">
        <div className="relative aspect-[4/5]">
          <Image
            src={trip.coverImage}
            alt={`${trip.name} — fotografía editorial de ${trip.destination}.`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
          />
        </div>
      </div>

      <div className="pt-5 transition-transform duration-300 ease-out group-hover:-translate-y-[2px]">
        <Eyebrow>{trip.country}</Eyebrow>
        <h3 className="mt-2 text-heading-lg font-display text-fg">
          {trip.name}
        </h3>
        <p className="mt-2 text-body-sm text-fg-muted">
          {trip.duration} · Desde {PRICE_FORMAT.format(trip.priceFrom)}
        </p>
      </div>
    </Link>
  );
}
