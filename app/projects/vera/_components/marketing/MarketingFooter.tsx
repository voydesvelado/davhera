import Link from "next/link";
import { ThemeToggle } from "../ui/ThemeToggle";

const LINKS = [
  { href: "/projects/vera/sobre", label: "Sobre" },
  { href: "/projects/vera/sistema", label: "Sistema" },
  { href: "https://github.com/voydesvelado/davhera", label: "GitHub" },
];

export function MarketingFooter() {
  return (
    <footer
      style={{
        marginTop: "var(--space-16)",
        paddingTop: "var(--space-8)",
        paddingBottom: "var(--space-10)",
        borderTop: "1px solid var(--rule)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-4)",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--ink-soft)",
          }}
        >
          Vera · Una pieza de portafolio de Davhera
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-4)",
            flexWrap: "wrap",
          }}
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--ink-soft)",
                textDecoration: "none",
              }}
              className="vera-footer-link"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: "var(--text-xs)",
          color: "var(--muted)",
        }}
      >
        Diseñado y construido en Rio de Janeiro · 2026
      </div>
      <style>{`
        .vera-footer-link:hover { color: var(--ink); }
      `}</style>
    </footer>
  );
}
