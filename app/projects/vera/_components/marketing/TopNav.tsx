"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { ThemeToggle } from "../ui/ThemeToggle";

const LINKS: Array<{ href: string; label: string }> = [
  { href: "/projects/vera/sobre", label: "Sobre" },
  { href: "/projects/vera/sistema", label: "Sistema" },
];

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: scrolled ? "color-mix(in oklch, var(--bg) 80%, transparent)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--rule)" : "1px solid transparent",
        transition:
          "background var(--dur-base) var(--ease-snap), border-color var(--dur-base) var(--ease-snap)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--max-wide)",
          margin: "0 auto",
          padding: "var(--space-3) var(--px-mobile)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-4)",
        }}
        className="vera-topnav-inner"
      >
        <Link
          href="/projects/vera"
          style={{
            fontSize: "var(--text-lg)",
            fontWeight: 600,
            letterSpacing: "var(--tracking-snug)",
            color: "var(--ink)",
            textDecoration: "none",
          }}
        >
          Vera
        </Link>

        {/* Desktop links */}
        <nav
          className="vera-topnav-desktop"
          style={{
            display: "none",
            alignItems: "center",
            gap: "var(--space-1)",
          }}
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--ink-soft)",
                padding: "var(--space-2) var(--space-3)",
                borderRadius: "var(--radius-sm)",
                textDecoration: "none",
                transition:
                  "background var(--dur-quick) var(--ease-snap), color var(--dur-quick) var(--ease-snap)",
              }}
              className="vera-topnav-link"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
          <Link href="#demo" style={{ marginLeft: "var(--space-2)" }}>
            <Button size="sm">Ver el demo</Button>
          </Link>
        </nav>

        {/* Mobile */}
        <div className="vera-topnav-mobile" style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
          <ThemeToggle />
          <IconButton
            size="sm"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Menu size={18} strokeWidth={1.75} />
          </IconButton>
        </div>
      </div>

      {mobileOpen ? (
        <div
          className="vera-topnav-mobile"
          style={{
            borderTop: "1px solid var(--rule)",
            background: "var(--bg-raised)",
            padding: "var(--space-3) var(--px-mobile)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-1)",
          }}
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: "var(--space-3)",
                fontSize: "var(--text-md)",
                color: "var(--ink)",
                borderRadius: "var(--radius-sm)",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="#demo" onClick={() => setMobileOpen(false)} style={{ marginTop: "var(--space-2)" }}>
            <Button size="md" style={{ width: "100%" }}>
              Ver el demo
            </Button>
          </Link>
        </div>
      ) : null}

      <style>{`
        .vera-topnav-link:hover { background: var(--bg-sunken); color: var(--ink); }
        @media (min-width: 768px) {
          .vera-topnav-desktop { display: flex !important; }
          .vera-topnav-mobile { display: none !important; }
        }
        @media (min-width: 640px) {
          .vera-topnav-inner { padding-left: var(--px-tablet); padding-right: var(--px-tablet); }
        }
        @media (min-width: 1024px) {
          .vera-topnav-inner { padding-left: var(--px-desktop); padding-right: var(--px-desktop); }
        }
      `}</style>
    </header>
  );
}
