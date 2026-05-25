import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { isLocale } from "../lib/i18n/config";
import { notFound } from "next/navigation";

// Placeholder M4 — verifica que next-intl está leyendo messages/{locale}.json.
// Las secciones reales (Hero, FeaturedTours, ValueProp) entran en M7/M8/M9.
export default async function SairaHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return <Inner />;
}

function Inner() {
  const t = useTranslations("hero");
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "var(--space-16) var(--space-6)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--saira-font-mono)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--ink-muted)",
          marginBottom: "var(--space-4)",
        }}
      >
        Saira · M4 i18n check
      </p>
      <h1
        style={{
          fontFamily: "var(--saira-font-display)",
          fontSize: "var(--text-4xl)",
          fontVariationSettings: "'opsz' 96",
          marginBottom: "var(--space-6)",
        }}
      >
        {t("headline") || "[hero.headline]"}
      </h1>
      <p
        style={{
          fontFamily: "var(--saira-font-body)",
          fontSize: "var(--text-lg)",
          color: "var(--ink-soft)",
        }}
      >
        {t("lede") || "[hero.lede]"}
      </p>
    </main>
  );
}
