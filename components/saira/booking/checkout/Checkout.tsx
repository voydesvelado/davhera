"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { useBooking } from "@/lib/saira/booking/context";
import { PaymentMethodToggle } from "./PaymentMethodToggle";
import { PixCheckout } from "./PixCheckout";
import { CardCheckout } from "./CardCheckout";

export function Checkout() {
  const t = useTranslations("checkout");
  const { state, dispatch } = useBooking();
  const isProcessing = state.phase === "processing";

  return (
    <div className="saira-checkout">
      <button
        type="button"
        className="saira-checkout-back"
        onClick={() => dispatch({ type: "BACK_TO_FORM" })}
        disabled={isProcessing}
      >
        <ArrowLeft size={14} aria-hidden="true" />
        {t("backToForm")}
      </button>

      <h2 className="saira-step-title">{t("title")}</h2>
      <p className="saira-step-subtitle">{t("subtitle")}</p>

      <PaymentMethodToggle />

      {state.paymentMethod === "pix" && <PixCheckout />}
      {state.paymentMethod === "card" && <CardCheckout />}
    </div>
  );
}
