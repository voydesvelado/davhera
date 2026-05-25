"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { formatBRL } from "@/lib/saira";

// Hardcodeo Pedra da Gávea como ejemplo concreto del bloque de comparación.
// Si Saraí quiere otro tour ejemplo, basta con cambiar estos tres números.
const EXAMPLE_NAME = "Pedra da Gávea";
const DIRECT_PRICE = 190;
const PLATFORM_PRICE = 270;
const SAVINGS = PLATFORM_PRICE - DIRECT_PRICE; // 80

export function ComparisonCard() {
  const t = useTranslations("valueProp.comparison");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <motion.div
      ref={ref}
      className="saira-comparison"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="saira-comparison-header">{EXAMPLE_NAME}</div>

      <div className="saira-comparison-row saira-comparison-row-direct">
        <span>{t("direct")}</span>
        <span className="saira-comparison-price">{formatBRL(DIRECT_PRICE)}</span>
      </div>

      <div className="saira-comparison-row saira-comparison-row-platform">
        <span>{t("platform")}</span>
        <span className="saira-comparison-price saira-comparison-price-platform">
          {formatBRL(PLATFORM_PRICE)}
        </span>
      </div>

      <motion.div
        className="saira-comparison-savings"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{
          duration: 0.4,
          delay: 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <span className="saira-comparison-savings-label">
          {t("savingsLabel")}
        </span>
        <span className="saira-comparison-savings-amount">
          {formatBRL(SAVINGS)}
        </span>
      </motion.div>
    </motion.div>
  );
}
