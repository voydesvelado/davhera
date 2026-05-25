import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "../../lib/i18n/config";
import { Link } from "@/app/proyectos/saira/lib/i18n/navigation";

// Placeholder hasta M21. Mantiene la navegación end-to-end del demo
// (wizard step 5 "Continuar para pagamento" llega acá sin 404).
export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "var(--space-24) var(--space-6)",
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
        Saira · M21 placeholder
      </p>
      <h1
        style={{
          fontFamily: "var(--saira-font-display)",
          fontSize: "var(--text-4xl)",
          marginBottom: "var(--space-6)",
        }}
      >
        Checkout — em construção
      </h1>
      <p
        style={{
          fontFamily: "var(--saira-font-body)",
          fontSize: "var(--text-lg)",
          color: "var(--ink-soft)",
          marginBottom: "var(--space-8)",
        }}
      >
        Pix + cartão (mock) llega en M21.
      </p>
      <Link
        href="/tours"
        className="saira-btn saira-btn-secondary saira-btn-md"
      >
        ← Ver experiências
      </Link>
    </main>
  );
}
