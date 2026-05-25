import { Fraunces, Geist, Geist_Mono } from "next/font/google";

// Fraunces con eje opsz para escalar el grade óptico en titulares grandes.
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--saira-font-display",
  axes: ["opsz"],
  display: "swap",
});

export const geist = Geist({
  subsets: ["latin"],
  variable: "--saira-font-body",
  display: "swap",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--saira-font-mono",
  display: "swap",
});
