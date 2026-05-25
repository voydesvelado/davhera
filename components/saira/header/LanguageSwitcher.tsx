"use client";

import { useLocale } from "next-intl";
import {
  useSairaPathname,
  useSairaRouter,
} from "@/app/proyectos/saira/lib/i18n/client-nav";
import {
  locales,
  type Locale,
} from "@/app/proyectos/saira/lib/i18n/config";

export function LanguageSwitcher() {
  const router = useSairaRouter();
  const pathname = useSairaPathname();
  const currentLocale = useLocale() as Locale;

  return (
    <div className="saira-lang-switcher" role="group" aria-label="Idioma">
      {locales.map((locale) => {
        const isActive = locale === currentLocale;
        return (
          <button
            key={locale}
            type="button"
            className={
              "saira-lang-option" + (isActive ? " is-active" : "")
            }
            onClick={() => {
              if (isActive) return;
              router.replace(pathname, { locale });
            }}
            aria-pressed={isActive}
            aria-label={`Cambiar a ${locale.toUpperCase()}`}
          >
            {locale.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
