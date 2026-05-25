"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/app/proyectos/saira/lib/i18n/navigation";
import type { Tour } from "@/lib/saira/types";
import { formatBRL } from "@/lib/saira/format";

export function TourStickyCTA({ tour }: { tour: Tour }) {
  const t = useTranslations("common");

  const showPrice = !tour.priceOnRequest && tour.priceBRL > 0;
  const priceLabel = showPrice ? formatBRL(tour.priceBRL) : t("consultPrice");
  const suffix = showPrice ? t("perPerson") : null;

  return (
    <motion.div
      className="saira-tour-cta"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
    >
      <div className="saira-tour-cta-info">
        <span className="saira-tour-cta-price">{priceLabel}</span>
        {suffix && <span className="saira-tour-cta-suffix">{suffix}</span>}
      </div>
      <Link
        href={`/reservar/${tour.slug}`}
        className="saira-btn saira-btn-primary saira-btn-md"
        aria-label={t("bookNow") + " · " + tour.name}
      >
        {t("bookNow")}
      </Link>
    </motion.div>
  );
}
