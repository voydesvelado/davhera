import type { Metadata, Viewport } from "next";
import { PortfolioWrapper } from "./_components/shared/PortfolioWrapper";
import { SharedPreview } from "./_components/shared/SharedPreview";

export const metadata: Metadata = {
  title: "Quiniela Mundial 2026 — Prototipo UX · David Herrera",
  description:
    "Prototipo funcional de una pantalla de quiniela para el Mundial 2026: 5 preguntas, resumen y confirmación. Design system Stadium Nights, mobile-first.",
};

export const viewport: Viewport = {
  themeColor: "#0B1120",
};

// TEMP: visual validation of the 7 shared components in a 375px frame.
// Restore `<QuinielaApp />` once the shared layer is wired into landing/flow/results.
export default function QuinielaMundial2026Page() {
  return (
    <PortfolioWrapper
      title="Quiniela Mundial 2026"
      subtitle="Prototipo UX — Stadium Nights"
      contextLine="Validación visual · componentes compartidos"
    >
      <SharedPreview />
    </PortfolioWrapper>
  );
}
