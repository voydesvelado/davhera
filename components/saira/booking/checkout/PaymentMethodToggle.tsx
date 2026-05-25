"use client";

import { useTranslations } from "next-intl";
import { useBooking } from "@/lib/saira/booking/context";

export function PaymentMethodToggle() {
  const t = useTranslations("checkout.method");
  const { state, dispatch } = useBooking();

  const isProcessing = state.phase === "processing";

  return (
    <div className="saira-payment-toggle" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={state.paymentMethod === "pix"}
        className={
          "saira-payment-option" +
          (state.paymentMethod === "pix" ? " is-active" : "")
        }
        onClick={() =>
          !isProcessing && dispatch({ type: "SET_PAYMENT_METHOD", method: "pix" })
        }
        disabled={isProcessing}
      >
        <span className="saira-payment-option-title">Pix</span>
        <span className="saira-payment-option-meta">{t("pixMeta")}</span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={state.paymentMethod === "card"}
        className={
          "saira-payment-option" +
          (state.paymentMethod === "card" ? " is-active" : "")
        }
        onClick={() =>
          !isProcessing &&
          dispatch({ type: "SET_PAYMENT_METHOD", method: "card" })
        }
        disabled={isProcessing}
      >
        <span className="saira-payment-option-title">{t("cardTitle")}</span>
        <span className="saira-payment-option-meta">{t("cardMeta")}</span>
      </button>
    </div>
  );
}
