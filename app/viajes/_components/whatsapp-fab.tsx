"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";

// TODO: replace with the real agency WhatsApp number before launch.
const WA_NUMBER = "525500000000";
const WA_TEXT = encodeURIComponent(
  "Hola, me interesa conocer más sobre sus viajes.",
);
const HREF = `https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`;

const EASE = [0.22, 1, 0.36, 1] as const;

export function WhatsAppFab() {
  const pathname = usePathname();
  const [hover, setHover] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  if (pathname?.startsWith("/viajes/cotizar/")) return null;

  return (
    <a
      href={HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Habla con un asesor por WhatsApp"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-30 inline-flex items-center bg-accent text-accent-fg rounded-full shadow-[0_8px_24px_rgba(180,69,31,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent overflow-hidden h-14"
    >
      <span className="inline-flex items-center justify-center h-14 w-14 shrink-0">
        <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
      </span>
      <motion.span
        initial={false}
        animate={{
          width: hover && !prefersReducedMotion ? "auto" : 0,
          opacity: hover ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: EASE }}
        className="overflow-hidden whitespace-nowrap text-body font-medium"
        aria-hidden={!hover}
      >
        <span className="pr-6 pl-1">Habla con un asesor</span>
      </motion.span>
    </a>
  );
}
