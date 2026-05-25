import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/components.css";
import { fraunces, geist, geistMono } from "../lib/fonts";
import { locales, isLocale } from "../lib/i18n/config";
import { Header } from "@/components/saira/header/Header";

// Genera rutas estáticas para los 3 locales.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Script inline para aplicar `saira-dark` antes del primer paint
// (evita FOUC en sistemas con prefers-color-scheme: dark).
const darkModeInitScript = `
(function() {
  try {
    var root = document.currentScript && document.currentScript.parentElement;
    if (!root) return;
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) root.classList.add('saira-dark');
  } catch (e) {}
})();
`;

export default async function SairaLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Habilita rendering estático con i18n (next-intl v4 + Next 16).
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <div
      lang={locale}
      className={`saira ${fraunces.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <script dangerouslySetInnerHTML={{ __html: darkModeInitScript }} />
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Header />
        {children}
      </NextIntlClientProvider>
    </div>
  );
}
