"use client";

import { useTranslations, useLocale } from "next-intl";
import { DayPicker } from "react-day-picker";
import { ptBR, es, enUS } from "date-fns/locale";
import "react-day-picker/style.css";
import { useBooking } from "@/lib/saira/booking/context";

const LOCALE_MAP = { pt: ptBR, es: es, en: enUS } as const;

export function StepDate() {
  const t = useTranslations("wizard.date");
  const { state, dispatch } = useBooking();
  const locale = useLocale() as keyof typeof LOCALE_MAP;
  const dpLocale = LOCALE_MAP[locale] ?? ptBR;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formattedDate =
    state.date &&
    state.date.toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  return (
    <div className="saira-step saira-step-date">
      <h2 className="saira-step-title">{t("title")}</h2>
      <p className="saira-step-subtitle">{t("subtitle")}</p>

      <div className="saira-step-date-picker">
        <DayPicker
          mode="single"
          selected={state.date ?? undefined}
          onSelect={(date) =>
            dispatch({ type: "SET_DATE", date: date ?? null })
          }
          locale={dpLocale}
          disabled={{ before: today }}
          showOutsideDays={false}
          weekStartsOn={1}
        />
      </div>

      {formattedDate && (
        <p className="saira-step-date-confirm">
          {t("confirm", { date: formattedDate })}
        </p>
      )}
    </div>
  );
}
