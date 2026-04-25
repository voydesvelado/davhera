import type { Metadata, Viewport } from "next";
import { QuinielaApp } from "./_components/QuinielaApp";

export const metadata: Metadata = {
  title: "Quiniela Mundial 2026 — Prototipo UX · David Herrera",
  description:
    "Prototipo funcional de una pantalla de quiniela para el Mundial 2026: 5 preguntas, resumen y confirmación. Design system Stadium Nights, mobile-first.",
};

export const viewport: Viewport = {
  themeColor: "#0B1120",
};

export default function QuinielaMundial2026Page() {
  return <QuinielaApp />;
}
