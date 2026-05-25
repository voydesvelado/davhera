"use client";

import { useTranslations } from "next-intl";
import { useBooking } from "@/lib/saira/booking/context";

const MAX_CHARS = 300;

export function StepComments() {
  const t = useTranslations("wizard.comments");
  const { state, dispatch } = useBooking();

  return (
    <div className="saira-step saira-step-comments">
      <h2 className="saira-step-title">{t("title")}</h2>
      <p className="saira-step-subtitle">{t("subtitle")}</p>

      <div className="saira-field">
        <textarea
          className="saira-textarea"
          value={state.comments}
          onChange={(e) =>
            dispatch({
              type: "SET_COMMENTS",
              comments: e.target.value.slice(0, MAX_CHARS),
            })
          }
          placeholder={t("placeholder")}
          rows={6}
        />
        <span className="saira-textarea-counter">
          {state.comments.length} / {MAX_CHARS}
        </span>
      </div>
    </div>
  );
}
