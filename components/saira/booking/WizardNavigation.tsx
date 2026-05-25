"use client";

import { useTranslations } from "next-intl";
import { useBooking, TOTAL_STEPS } from "@/lib/saira/booking/context";
import { isStepValid } from "@/lib/saira/booking/validation";
import { useSairaRouter } from "@/app/proyectos/saira/lib/i18n/client-nav";

export function WizardNavigation() {
  const { state, dispatch } = useBooking();
  const t = useTranslations("wizard.nav");
  const router = useSairaRouter();
  const isValid = isStepValid(state.currentStep, state);
  const isLast = state.currentStep === TOTAL_STEPS;

  const handleNext = () => {
    if (!isValid) return;
    if (isLast) {
      router.push("/checkout");
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
