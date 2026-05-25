import { Hero } from "./_components/hero";
import { TripGrid } from "./_components/trip-grid";
import { Testimonials } from "./_components/testimonials";
import { Section } from "./_components/section";
import { Eyebrow } from "./_components/eyebrow";
import { Button } from "./_components/button";
import { trips } from "./_lib/trips";

export default function ViajesLandingPage() {
  return (
    <>
      <Hero />

      <Section id="catalogo">
        <TripGrid trips={trips} />
      </Section>

      <Section className="border-t border-border-token">
        <Testimonials />
      </Section>

      <Section className="border-t border-border-token">
        <div className="text-center max-w-2xl mx-auto">
          <Eyebrow>EMPIEZA AQUÍ</Eyebrow>
          <h2 className="mt-4 text-display-lg lg:text-display-xl font-display text-fg">
            ¿Qué quieres vivir en tu próximo viaje?
          </h2>
          <p className="mt-6 text-body-lg text-fg-muted mx-auto max-w-xl">
            Cuéntanos en pocos minutos qué te mueve y un asesor diseñará una
            propuesta hecha para ti.
          </p>
          <div className="mt-10 flex justify-center">
            <Button href="/viajes#catalogo" variant="primary" size="lg">
              Comenzar mi cotización
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
