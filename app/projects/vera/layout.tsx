import type { Metadata } from "next";
import { Fraunces, Newsreader, Geist, JetBrains_Mono } from "next/font/google";

import "./_styles/tokens.css";
import "./_styles/reset.css";
import "./_styles/editorial.css";
import "./_styles/product.css";
import "./_styles/grain.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-vera",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vera · Davhera",
  description:
    "Vera — una plataforma de reservas para el profesional de la salud independiente en México. Proyecto en concepto.",
};

export default function VeraLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontClasses = [
    fraunces.variable,
    newsreader.variable,
    geist.variable,
    jetbrainsMono.variable,
  ].join(" ");

  return (
    <div className={`proj-vera ${fontClasses}`}>
      {children}
    </div>
  );
}
