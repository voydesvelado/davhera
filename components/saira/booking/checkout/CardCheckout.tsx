"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  useBooking,
  snapshotBooking,
  CONFIRMED_BOOKING_KEY,
} from "@/lib/saira/booking/context";
import { useSairaRouter } from "@/app/proyectos/saira/lib/i18n/client-nav";
import { CardVisual } from "./CardVisual";
import {
  type CardData,
  type CardField,
  formatCardNumber,
  formatExpiry,
  isCardValid,
} from "./card-utils";

const EMPTY: CardData = { number: "", name: "", expiry: "", cvc: "" };
const PROCESSING_MS = 2500;

export function CardCheckout() {
  const t = useTranslations("checkout.card");
  const { state, dispatch } = useBooking();
  const router = useSairaRouter();
  const [card, setCard] = useState<CardData>(EMPTY);
  const [focused, setFocused] = useState<CardField | null>(null);

  const update = (field: CardField, value: string) => {
    let formatted = value;
    if (field === "number") formatted = formatCardNumber(value);
    else if (field === "expiry") formatted = formatExpiry(value);
    else if (field === "cvc") formatted = value.replace(/\D/g, "").slice(0, 4);
    else if (field === "name") formatted = value.toUpperCase();
    setCard((prev) => ({ ...prev, [field]: formatted }));
  };

  const handlePay = () => {
    if (!isCardValid(card)) return;
    if (state.phase === "processing") return;
    dispatch({ type: "START_PROCESSING" });
    setTimeout(() => {
      sessionStorage.setItem(
        CONFIRMED_BOOKING_KEY,
        JSON.stringify(snapshotBooking(state, "card")),
      );
      router.push("/reserva/confirmada");
    }, PROCESSING_MS);
  };

  const processing = state.phase === "processing";
  const canPay = isCardValid(card) && !processing;

  return (
    <motion.div
      className="saira-card-checkout"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <CardVisual card={card} focused={focused} />

      <div className="saira-card-form">
        <div className="saira-field">
          <label className="saira-input-label" htmlFor="cc-number">
            {t("number")}
          </label>
          <input
            id="cc-number"
            className="saira-input"
            type="text"
            value={card.number}
            onChange={(e) => update("number", e.target.value)}
            onFocus={() => setFocused("number")}
            onBlur={() => setFocused(null)}
            placeholder="1234 5678 9012 3456"
            autoComplete="cc-number"
            inputMode="numeric"
          />
        </div>

        <div className="saira-field">
          <label className="saira-input-label" htmlFor="cc-name">
            {t("name")}
          </label>
          <input
            id="cc-name"
            className="saira-input"
            type="text"
            value={card.name}
            onChange={(e) => update("name", e.target.value)}
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused(null)}
            placeholder="MARIA SILVA"
            autoComplete="cc-name"
          />
        </div>

        <div className="saira-card-form-row">
          <div className="saira-field">
            <label className="saira-input-label" htmlFor="cc-exp">
              {t("expiry")}
            </label>
            <input
              id="cc-exp"
              className="saira-input"
              type="text"
              value={card.expiry}
              onChange={(e) => update("expiry", e.target.value)}
              onFocus={() => setFocused("expiry")}
              onBlur={() => setFocused(null)}
              placeholder="MM/AA"
              autoComplete="cc-exp"
              inputMode="numeric"
            />
          </div>
          <div className="saira-field">
            <label className="saira-input-label" htmlFor="cc-cvc">
              CVC
            </label>
            <input
              id="cc-cvc"
              className="saira-input"
              type="text"
              value={card.cvc}
              onChange={(e) => update("cvc", e.target.value)}
              onFocus={() => setFocused("cvc")}
              onBlur={() => setFocused(null)}
              placeholder="123"
              autoComplete="cc-csc"
              inputMode="numeric"
            />
          </div>
        </div>

        <button
          type="button"
          className="saira-btn saira-btn-primary saira-btn-lg saira-card-pay-btn"
          onClick={handlePay}
          disabled={!canPay}
        >
          {processing ? (
            <>
              <span className="saira-spinner" aria-hidden="true" />
              <span>{t("processing")}</span>
            </>
          ) : (
            t("pay")
          )}
        </button>

        <p className="saira-card-note">{t("note")}</p>
      </div>
    </motion.div>
  );
}
