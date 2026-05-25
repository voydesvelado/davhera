"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function SairaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    // Solo log en consola; no exponemos el error al usuario.
    console.error("Saira error:", error);
  }, [error]);

  return (
    <main className="saira-notfound">
      <span className="saira-section-eyebrow">{t("eyebrow")}</span>
      <h1 className="saira-notfound-title">{t("title")}</h1>
      <p className="saira-notfound-body">{t("body")}</p>
      <button
        type="button"
        onClick={reset}
        className="saira-btn saira-btn-primary saira-btn-md"
      >
        {t("retry")}
      </button>
    </main>
  );
}
