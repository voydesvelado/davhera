import { Eyebrow } from "./eyebrow";

const TESTIMONIALS = [
  {
    quote:
      "Pensé que sabía viajar hasta que probé que alguien más diseñara la ruta. Cada día tenía una sorpresa que parecía pensada solo para mí.",
    name: "Mariana Robles",
    city: "Ciudad de México",
  },
  {
    quote:
      "Lo que más valoro es la respuesta humana. Hablar por WhatsApp con alguien que de verdad conoce los lugares cambia toda la experiencia.",
    name: "Daniel Fuentes",
    city: "Monterrey",
  },
  {
    quote:
      "Regresamos con la sensación de haber vivido el lugar, no de haberlo recorrido. Pocas agencias logran eso, y se nota desde la primera llamada.",
    name: "Adriana Salinas",
    city: "Guadalajara",
  },
];

function initial(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
}

export function Testimonials() {
  return (
    <div>
      <div className="max-w-2xl">
        <Eyebrow>TESTIMONIOS</Eyebrow>
        <h2 className="mt-3 text-display-md font-display text-fg">
          Lo que dicen quienes ya viajaron
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="border-t border-border-token pt-8 flex flex-col gap-8"
          >
            <blockquote className="text-heading-lg font-display italic text-fg leading-snug">
              “{t.quote}”
            </blockquote>
            <figcaption className="flex items-center gap-4">
              <span
                aria-hidden
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-fg/5 text-body-sm font-medium text-fg"
              >
                {initial(t.name)}
              </span>
              <div className="text-body-sm">
                <span className="block text-fg font-medium">{t.name}</span>
                <span className="block text-fg-muted">{t.city}</span>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
