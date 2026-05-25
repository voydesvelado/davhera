export const locales = ["pt", "es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt";

/** basePath del subsitio Saira dentro de Davhera */
export const SAIRA_BASE = "/proyectos/saira";

/** Nombre de la cookie de persistencia (idéntico al usado por next-intl) */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Construye un path absoluto dentro del subsitio Saira.
 *  Ejemplos:
 *    sairaPath('pt')                 → /proyectos/saira/pt
 *    sairaPath('es', 'tours')        → /proyectos/saira/es/tours
 *    sairaPath('en', 'tours', 'pedra-da-gavea')
 *                                    → /proyectos/saira/en/tours/pedra-da-gavea
 */
export function sairaPath(locale: Locale, ...segments: string[]): string {
  const tail = segments
    .map((s) => s.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");
  return tail ? `${SAIRA_BASE}/${locale}/${tail}` : `${SAIRA_BASE}/${locale}`;
}
