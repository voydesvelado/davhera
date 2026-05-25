"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useBooking } from "@/lib/saira/booking/context";
import { formatBRL } from "@/lib/saira/format";

export function BookingSummary() {
  const t = useTranslations("wizard.summary");
  const tCommon = useTranslations("common");
  const { state } = useBooking();
  const locale = useLocale();

  const hasPrice = !state.tour.priceOnRequest && state.tour.priceBRL > 0;
  const subtotal = hasPrice ? state.tour.priceBRL * state.people : 0;
  const platformPrice = hasPrice
    ? (state.tour.comparablePlatformPriceBRL ?? state.tour.priceBRL * 1.42) *
      state.people
    : 0;
  const savings = Math.round(platformPrice - subtotal);

  const formattedDate = state.date
    ? state.date.toLocaleDateString(locale, {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "—";

  return (
    <div className="saira-summary">
      <div className="saira-summary-tour">
        <span className="saira-summary-eyebrow">{t("eyebrow")}</span>
        <h3 className="saira-summary-tour-name">{state.tour.name}</h3>
      </div>

      <div className="saira-summary-meta">
        <Row label={t("date")} value={formattedDate} />
        <Row
          label={t("people")}
          value={`${state.people} ${
            state.people === 1 ? t("personSingular") : t("personPlural")
          }`}
        />
      </div>

      <div className="saira-summary-total">
        <span className="saira-summary-total-label">{t("subtotal")}</span>
        <AnimatedAmount
          value={hasPrice ? formatBRL(subtotal) : tCommon("consultPrice")}
          className="saira-summary-total-amount"
        />
      </div>

      {hasPrice && (
        <div className="saira-summary-comparison">
          <div className="saira-summary-comparison-header">
            {t("comparison.header")}
          </div>
          <div className="saira-summary-comparison-row saira-summary-comparison-direct">
            <span>{t("comparison.direct")}</span>
            <AnimatedAmount value={formatBRL(subtotal)} />
          </div>
          <div className="saira-summary-comparison-row saira-summary-comparison-platform">
            <span>{t("comparison.platform")}</span>
            <AnimatedAmount
              value={formatBRL(Math.round(platformPrice))}
              className="saira-summary-strikethrough"
            />
          </div>
          <div className="saira-summary-savings">
            <span className="saira-summary-savings-label">
              {t("comparison.savings")}
            </span>
            <AnimatedAmount
              value={formatBRL(savings)}
              className="saira-summary-savings-amount"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="saira-summary-row">
      <span className="saira-summary-row-label">{label}</span>
      <AnimatedAmount value={value} className="saira-summary-row-value" />
    </div>
  );
}

function AnimatedAmount({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}
