"use client";

import { useTranslations } from "next-intl";
import {
  useBooking,
  type LanguagePreference,
} from "@/lib/saira/booking/context";

const LANGS: LanguagePreference[] = ["pt", "es", "en", "it", "any"];

export function StepLanguage() {
  const t = useTranslations("wizard.language");
  const { state, dispatch } = useBooking();

  return (
    <div className="saira-step saira-step-language">
      <h2 className="saira-step-title">{t("title")}</h2>
      <p className="saira-step-subtitle">{t("subtitle")}</p>

      <div className="saira-step-language-options">
        {LANGS.map((lang) => {
          const active = state.languagePreference === lang;
          return (
            <button
              key={lang}
              type="button"
              className={"saira-lang-tile" + (active ? " is-active" : "")}
              onClick={() =>
                dispatch({ type: "SET_LANGUAGE", language: lang })
              }
              aria-pressed={active}
            >
              <span className="saira-lang-tile-code">
                {lang === "any" ? "—" : lang.toUpperCase()}
              </span>
              <span className="saira-lang-tile-name">
                {t(`options.${lang}`)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
