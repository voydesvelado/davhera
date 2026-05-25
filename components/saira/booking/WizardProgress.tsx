"use client";

import { useTranslations } from "next-intl";
import { useBooking, TOTAL_STEPS } from "@/lib/saira/booking/context";

const STEP_KEYS = ["date", "people", "contact", "language", "comments"] as const;

export function WizardProgress() {
  const { state } = useBooking();
  const t = useTranslations("wizard.steps");
  const progress = (state.currentStep / TOTAL_STEPS) * 100;
  const stepKey = STEP_KEYS[state.currentStep - 1];

  return (
    <div className="saira-wizard-progress">
      <div className="saira-wizard-progress-header">
        <span className="saira-wizard-step-count">
          {state.currentStep} / {TOTAL_STEPS}
        </span>
        <span className="saira-wizard-step-name">{t(stepKey)}</span>
      </div>
      <div className="saira-wizard-bar" aria-hidden="true">
        <div
          className="saira-wizard-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
