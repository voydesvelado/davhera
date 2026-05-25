"use client";

import { motion, useReducedMotion } from "framer-motion";

// template.tsx (a diferencia de layout.tsx) se re-monta en cada navegación,
// permitiendo dispar el `initial` de motion en cada page transition.
// Aplica a todo el subsitio Saira; los routes con su propio stagger lo
// overridean con un template.tsx vacío (ej. reserva/confirmada).

export default function SairaTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      data-saira-page
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
