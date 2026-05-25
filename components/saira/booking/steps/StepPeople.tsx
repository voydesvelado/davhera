"use client";

import { useTranslations } from "next-intl";
import { Minus, Plus } from "lucide-react";
import { useBooking } from "@/lib/saira/booking/context";

const MIN = 1;
const MAX = 8;

export function StepPeople() {
  const t = useTranslations("wizard.people");
  const { state, dispatch } = useBooking();

  const update = (delta: number) => {
    const next = Math.min(MAX, Math.max(MIN, state.people + delta));
    dispatch({ type: "SET_PEOPLE", people: next });
  };

  return (
    <div className="saira-step saira-step-people">
      <h2 className="saira-step-title">{t("title")}</h2>
      <p className="saira-step-subtitle">{t("subtitle")}</p>

      <div className="saira-step-people-stepper">
        <button
          type="button"
          className="saira-stepper-btn-lg"
          onClick={() => update(-1)}
          disabled={state.people <= MIN}
          aria-label={t("decrease")}
        >
          <Minus size={20} aria-hidden="true" />
        </button>

        <div className="saira-step-people-display">
          <span className="saira-step-people-count">{state.people}</span>
          <span className="saira-step-people-label">
            {state.people === 1 ? t("person") : t("people")}
          </span>
        </div>

        <button
          type="button"
          className="saira-stepper-btn-lg"
          onClick={() => update(+1)}
          disabled={state.people >= MAX}
          aria-label={t("increase")}
        >
          <Plus size={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
