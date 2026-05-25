"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Tour } from "@/lib/saira/types";

// Galería de imágenes para el tour detail.
// Mientras David no entrega imágenes reales por slug, los paths apuntan
// a /saira/tours/{slug}/hero.jpg (que 404 en dev). Renderizamos un
// placeholder visual (gradient moss → jade + marca) en su lugar.
// Cuando lleguen las imágenes, basta con cambiar `hasRealImage` (abajo)
// y descomentar el <Image fill> wrapped en cada slide.

function hasRealImage(_path: string): boolean {
  // TODO(david): cuando entreguen imágenes definitivas, devolver true
  // o detectar por convención (ej. !path.includes('.placeholder')).
  return false;
}

export function TourGallery({ tour }: { tour: Tour }) {
  const images = tour.images.length > 0 ? tour.images : [tour.heroImage];
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className="saira-gallery" aria-label={`Galeria · ${tour.name}`}>
      <div className="saira-gallery-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            className="saira-gallery-slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {hasRealImage(images[activeIdx]) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[activeIdx]}
                alt={`${tour.name} · ${activeIdx + 1}`}
                className="saira-gallery-img"
              />
            ) : (
              <div className="saira-gallery-placeholder" aria-hidden="true">
                <span className="saira-gallery-placeholder-mark">
                  {tour.name
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")}
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="saira-gallery-thumbs" role="tablist">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === activeIdx}
              className={
                "saira-gallery-thumb" + (idx === activeIdx ? " is-active" : "")
              }
              onClick={() => setActiveIdx(idx)}
            >
              <span className="saira-gallery-thumb-fallback" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
