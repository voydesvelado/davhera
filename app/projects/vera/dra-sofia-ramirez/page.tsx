import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "../_components/PageShell";
import { TopNav } from "../_components/marketing/TopNav";
import { DemoRibbon } from "../_components/ui/DemoRibbon";
import { Button } from "../_components/ui/Button";
import { ProfileHero } from "../_components/product/ProfileHero";
import { ServiceCard } from "../_components/product/ServiceCard";
import { LocationCard } from "../_components/product/LocationCard";
import { TrustRow } from "../_components/product/TrustRow";
import { Eyebrow } from "../_components/product/Eyebrow";
import { HechoConVera } from "../_components/product/HechoConVera";

import { SEED_DOCTOR, SEED_SERVICES } from "../_lib/seed";

export const metadata: Metadata = {
  title: `${SEED_DOCTOR.name} · ${SEED_DOCTOR.specialty}`,
  description: `Reserva una cita con ${SEED_DOCTOR.name}. Consultorio en Roma Norte, Ciudad de México.`,
};

const RESERVAR_BASE = "/projects/vera/dra-sofia-ramirez/reservar";

export default function PerfilDraSofiaPage() {
  return (
    <>
      <TopNav />
      <DemoRibbon />
      <PageShell width="content">
        <ProfileHero doctor={SEED_DOCTOR} reservarHref={RESERVAR_BASE} />

        {/* About */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
            paddingTop: "var(--space-12)",
          }}
        >
          <Eyebrow>Sobre mí</Eyebrow>
          <p
            style={{
              margin: 0,
              fontSize: "var(--text-md)",
              lineHeight: "var(--leading-normal)",
              color: "var(--ink-soft)",
              maxWidth: "640px",
            }}
          >
            {SEED_DOCTOR.bio}
          </p>
        </section>

        {/* Services */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
            paddingTop: "var(--space-12)",
          }}
        >
          <Eyebrow>Servicios</Eyebrow>
          <div
            className="vera-service-list"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
            }}
          >
            {SEED_SERVICES.map((s, idx) => (
              <div
                key={s.id}
                className="vera-service-item"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <ServiceCard service={s} href={`${RESERVAR_BASE}?service=${s.id}`} />
              </div>
            ))}
          </div>
          <style>{`
            .vera-service-item {
              animation: vera-card-in var(--dur-base) var(--ease-snap) both;
            }
            @keyframes vera-card-in {
              from { opacity: 0; transform: translateY(4px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @media (prefers-reduced-motion: reduce) {
              .vera-service-item { animation: none; }
            }
          `}</style>
        </section>

        {/* Location */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
            paddingTop: "var(--space-12)",
          }}
        >
          <Eyebrow>Dónde</Eyebrow>
          <LocationCard location={SEED_DOCTOR.location} />
        </section>

        {/* Trust */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
            paddingTop: "var(--space-8)",
          }}
        >
          <TrustRow>Cédula profesional verificada · {SEED_DOCTOR.cedula}</TrustRow>
          <TrustRow>{SEED_DOCTOR.yearsOfPractice} años de práctica</TrustRow>
          <TrustRow>Consultas en {SEED_DOCTOR.languages.join(" e ")}</TrustRow>
        </section>

        {/* Final CTA */}
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "var(--space-12)",
          }}
        >
          <Link href={RESERVAR_BASE} className="vera-final-cta">
            <Button size="md" style={{ minWidth: 280 }}>
              Reservar cita
              <span aria-hidden>→</span>
            </Button>
          </Link>
        </section>

        <HechoConVera />
      </PageShell>
    </>
  );
}
