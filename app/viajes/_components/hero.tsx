"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "./eyebrow";
import { Button } from "./button";

const EASE = [0.22, 1, 0.36, 1] as const;

// TODO: replace with real agency hero shot once available.
const HERO_SRC =
  "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=2400&q=80&auto=format&fit=crop";

const WA_HREF =
  "https://wa.me/525500000000?text=" +
  encodeURIComponent("Hola, me interesa conocer más sobre sus viajes.");

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[70vh] lg:min-h-[88vh] overflow-hidden">
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: EASE }}
        className="absolute inset-0"
      >
        <Image
          src={HERO_SRC}
          alt="Mujer mirando el atardecer sobre los Valles Centrales de Oaxaca, con el sol bajo entre cerros áridos."
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-fg/60 via-fg/15 to-transparent" />
      </motion.div>

      <div className="relative h-full min-h-[70vh] lg:min-h-[88vh] flex flex-col justify-end">
        <div className="mx-auto max-w-7xl w-full px-6 lg:px-12 pb-16 lg:pb-24">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
            }}
            className="max-w-3xl"
          >
            <Reveal>
              <Eyebrow className="text-bg/80">
                AGENCIA DE VIAJES · MÉXICO
              </Eyebrow>
            </Reveal>
            <Reveal>
              <h1 className="mt-6 font-display text-bg text-display-lg sm:text-display-xl lg:text-display-2xl">
                Viajes diseñados para{" "}
                <em className="italic font-display">sentir</em>, no solo para
                visitar.
              </h1>
            </Reveal>
            <Reveal>
              <p className="mt-6 text-body-lg text-bg/80 max-w-xl">
                Curamos rutas a medida por México y el mundo, con la atención
                de quien sabe que un viaje cambia algo en ti.
              </p>
            </Reveal>
            <Reveal>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button href="/viajes#catalogo" variant="primary" size="lg">
                  Ver catálogo
                </Button>
                <Button
                  href={WA_HREF}
                  variant="ghost"
                  size="lg"
                  className="bg-transparent text-bg border border-bg/30 hover:bg-bg/10"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Habla con un asesor
                </Button>
              </div>
            </Reveal>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}
