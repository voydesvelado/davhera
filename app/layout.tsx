import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono, Geist, Lora } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "David Herrera",
  description: "Personal site for multiple purposes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${geistMono.variable} ${geist.variable} ${lora.variable}`}>
      <body>
        {children}
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
