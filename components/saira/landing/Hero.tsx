import { useTranslations } from "next-intl";
import { Link } from "@/app/proyectos/saira/lib/i18n/navigation";

// Hero responsivo: 9:16 en mobile, 16:9 en desktop.
// Video con autoplay iOS-safe: muted + playsInline obligatorios.
//
// Fuente de video: actualmente placeholders (.placeholder) hasta que
// David entregue el drone footage. Cuando lleguen, basta con sustituir
// los archivos en /public/saira/hero/ — no se requieren cambios de código.
//
// Sobre `<source media>`: soportado en Chrome/Safari modernos; algunos
// edge cases con cambio de viewport tras el primer render. Si QA reporta
// problemas, swap a un Client Component con useEffect + matchMedia.
//
// Animación de entrada: keyframes CSS con staggered animation-delay.
// No usamos Framer Motion aquí para mantener el Hero como Server Component.

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="saira-hero" aria-label={t("headline")}>
      <div className="saira-hero-media">
        <video
          className="saira-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/saira/hero/poster.jpg"
          aria-hidden="true"
        >
          <source
            src="/saira/hero/reel-mobile.webm"
            type="video/webm"
            media="(max-width: 768px)"
          />
          <source
            src="/saira/hero/reel-mobile.mp4"
            type="video/mp4"
            media="(max-width: 768px)"
          />
          <source src="/saira/hero/reel-desktop.webm" type="video/webm" />
          <source src="/saira/hero/reel-desktop.mp4" type="video/mp4" />
        </video>
        <div className="saira-hero-overlay" aria-hidden="true" />
      </div>

      <div className="saira-hero-content">
        <span className="saira-hero-eyebrow saira-hero-reveal saira-hero-reveal-1">
          {t("eyebrow")}
        </span>
        <h1 className="saira-hero-headline saira-hero-reveal saira-hero-reveal-2">
          {t("headline")}
        </h1>
        <p className="saira-hero-lede saira-hero-reveal saira-hero-reveal-3">
          {t("lede")}
        </p>
        <div className="saira-hero-reveal saira-hero-reveal-4">
          <Link
            href="/tours"
            className="saira-btn saira-btn-primary saira-btn-lg"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
