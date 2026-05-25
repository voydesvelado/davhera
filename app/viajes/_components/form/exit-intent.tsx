"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "../button";
import { Eyebrow } from "../eyebrow";

const EASE = [0.22, 1, 0.36, 1] as const;
const SS_KEY = "viajes_exit_intent_shown";

const WA_HREF =
  "https://wa.me/525500000000?text=" +
  encodeURIComponent(
    "Hola, vi su sitio y quiero una cotización por WhatsApp. ¿Me ayudan?",
  );

export function ExitIntent({ activeStep }: { activeStep: 1 | 2 | 3 | 4 }) {
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (activeStep > 2) return;

    const eligible = () =>
      !window.matchMedia("(max-width: 1023px)").matches &&
      !window.sessionStorage.getItem(SS_KEY);

    if (!eligible()) return;

    const onMove = (e: MouseEvent) => {
      if (e.clientY > 8) return;
      if (!eligible()) return;
      window.sessionStorage.setItem(SS_KEY, "1");
      setOpen(true);
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, [activeStep]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="exit-intent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-fg/40 px-6"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-intent-title"
        >
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 12, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 12, scale: 0.98 }
            }
            transition={{ duration: 0.35, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-lg bg-bg-elevated border border-border-token p-8 lg:p-10 shadow-[0_24px_60px_rgba(26,24,21,0.18)]"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-fg-muted hover:bg-fg/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <Eyebrow accent>UN MOMENTO</Eyebrow>
            <h2
              id="exit-intent-title"
              className="mt-4 text-display-md font-display text-fg"
            >
              ¿No tienes tiempo ahora?
            </h2>
            <p className="mt-4 text-body text-fg-muted leading-relaxed">
              Te mando una cotización por WhatsApp en cuanto estés listo. Sin
              presión y sin pasar por el formulario.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href={WA_HREF}
                variant="primary"
                size="md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hablar por WhatsApp
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => setOpen(false)}
                type="button"
              >
                Sigo en lo mío
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
