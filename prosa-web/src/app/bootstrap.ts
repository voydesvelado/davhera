import { db } from "../core/db/schema";
import { getStore } from "./store";
import { detectLocale, setLocale, type Locale } from "../i18n";

const SEEDED_KEY = "sampleSeeded";

/**
 * Primer arranque: sin onboarding, sin tour, sin modal de bienvenida. Un ensayo
 * precargado que explica la app siendo la app, y que se puede borrar como
 * cualquier otro documento.
 *
 * Se marca en `meta` para que borrarlo NO lo traiga de vuelta al recargar. Un
 * documento que reaparece después de que alguien lo eliminó es una falta de respeto.
 */
export async function seedSampleDocument(): Promise<void> {
  const seeded = await db.meta.get(SEEDED_KEY);
  if (seeded) return;

  await db.meta.put({ key: SEEDED_KEY, value: true });

  // Si ya hay biblioteca (por ejemplo, se restauró un zip antes), no se agrega nada.
  if ((await db.documents.count()) > 0) return;

  const locale = await resolveLocale();
  const file = locale === "es" ? "bienvenida.es.md" : "welcome.en.md";

  try {
    const response = await fetch(`${import.meta.env.BASE_URL}sample/${file}`);
    if (!response.ok) return;
    const markdown = await response.text();
    const store = await getStore();
    await store.importDocument(markdown);
  } catch {
    // Sin conexión en la primera visita: no hay muestra y no pasa nada. La app
    // funciona igual y el empty state explica qué hacer.
  }
}

async function resolveLocale(): Promise<Locale> {
  const stored = await db.meta.get("locale");
  const locale: Locale = stored?.value === "es" || stored?.value === "en" ? stored.value : detectLocale();
  setLocale(locale);
  return locale;
}

/**
 * Registra el service worker. Su scope es /prosa/ y no puede tocar el resto de
 * davhera.com. En desarrollo no se registra: un shell cacheado mientras se edita
 * es una hora perdida por sesión.
 */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
      scope: import.meta.env.BASE_URL,
    });
  });
}
