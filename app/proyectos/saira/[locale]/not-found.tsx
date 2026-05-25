import { useTranslations } from "next-intl";
import { Link } from "@/app/proyectos/saira/lib/i18n/navigation";

// not-found.tsx anidado: Next.js lo usa cuando notFound() se llama
// dentro de cualquier ruta de [locale]. Hereda el header/footer del
// layout y mantiene el chrome de Saira.
export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <main className="saira-notfound">
      <span className="saira-section-eyebrow">404</span>
      <h1 className="saira-notfound-title">{t("title")}</h1>
      <p className="saira-notfound-body">{t("body")}</p>
      <Link
        href="/"
        className="saira-btn saira-btn-primary saira-btn-md"
      >
        {t("cta")}
      </Link>
    </main>
  );
}
