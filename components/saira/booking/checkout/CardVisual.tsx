"use client";

import { motion } from "framer-motion";
import type { CardData, CardField } from "./card-utils";
import { detectBrand } from "./card-utils";

export function CardVisual({
  card,
  focused,
}: {
  card: CardData;
  focused: CardField | null;
}) {
  const brand = detectBrand(card.number);
  const isFlipped = focused === "cvc";

  return (
    <div className="saira-card-visual-wrap">
      <motion.div
        className="saira-card-visual"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
      >
        <div className="saira-card-face saira-card-face-front">
          <div className="saira-card-brand">
            {brand !== "generic" ? brand : ""}
          </div>
          <div className="saira-card-chip" aria-hidden="true" />
          <div className="saira-card-number">
            {card.number || "•••• •••• •••• ••••"}
          </div>
          <div className="saira-card-row">
            <div>
              <div className="saira-card-meta-label">Titular</div>
              <div className="saira-card-meta-value">
                {card.name || "NOME COMPLETO"}
              </div>
            </div>
            <div>
              <div className="saira-card-meta-label">Validade</div>
              <div className="saira-card-meta-value">
                {card.expiry || "MM/AA"}
              </div>
            </div>
          </div>
        </div>

        <div className="saira-card-face saira-card-face-back">
          <div className="saira-card-magstripe" aria-hidden="true" />
          <div className="saira-card-cvc-strip">
            <span className="saira-card-cvc-label">CVC</span>
            <span className="saira-card-cvc-value">{card.cvc || "•••"}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
