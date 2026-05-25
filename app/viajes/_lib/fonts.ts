import { Fraunces, Inter } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
  weight: "variable",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
