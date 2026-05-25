"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

// Reveal at scroll entry, una sola vez. Index controla el stagger.
// Compartido por catálogo (M11) y CatalogGrid (M13).
export function RevealOnView({
  children,
  index = 0,
}: {
  children: ReactNode;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.06, 0.6),
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
