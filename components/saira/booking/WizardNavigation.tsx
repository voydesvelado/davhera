"use client";

import { useTranslations } from "next-intl";
import { useBooking, TOTAL_STEPS } from "@/lib/saira/booking/context";
import { isStepValid } from "@/lib/saira/booking/validation";

export function WizardNavigation() {
  const { state, dispatch } = useBooking();
  const t = useTranslations("wizard.nav");
  const isValid = isStepValid(state.currentStep, state);
  const isLast = state.currentStep === TOTAL_STEPS;

  const handleNext = () => {
    if (!isValid) return;
    if (isLast) {
      dispatch({ type: "GO_TO_CHECKOUT" });
      return;
    }
    dispatch({ type: "NEXT" });
  };

  return (
    <div className="saira-wizard-nav">
      {state.currentStep > 1 && (
        <button
          type="button"
          className="saira-btn saira-btn-ghost saira-btn-md"
          onClick={() => dispatch({ type: "BACK" })}
        >
          {t("back")}
        </button>
      )}
      <button
        type="button"
        className="saira-btn saira-btn-primary saira-btn-md saira-wizard-nav-primary"
        onClick={handleNext}
        disabled={!isValid}
      >
        {isLast ? t("continue") : t("next")}
      </button>
    </div>
  );
}
