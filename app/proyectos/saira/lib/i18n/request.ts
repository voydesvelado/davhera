import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale } from "./config";

// Config consumida por next-intl en el server. Resuelve qué messages cargar
// según el locale solicitado (lo provee el layout vía setRequestLocale).
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../../../../../messages/${locale}.json`)).default,
  };
});
