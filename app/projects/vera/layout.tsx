import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./_styles/tokens.css";
import "./_styles/reset.css";
import "./_styles/dark.css";
import "./_styles/microinteractions.css";

import { ThemeProvider, themeInitScript } from "./_lib/theme";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vera · Davhera",
  description:
    "Reservas para profesionales independientes. Una pieza de portafolio de Davhera.",
};

export default function VeraLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`proj-vera ${geist.variable} ${geistMono.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      <ThemeProvider>{children}</ThemeProvider>
    </div>
  );
}
