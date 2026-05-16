"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  House,
  CalendarDays,
  Clock,
  List,
  Ellipsis,
  MessageCircle,
  User,
  ArrowLeft,
} from "lucide-react";
import { Sheet } from "../../ui/Sheet";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  isMore?: boolean;
}

const PRIMARY_ITEMS: NavItem[] = [
  { href: "/projects/vera/panel", label: "Hoy", icon: <House size={18} strokeWidth={1.75} /> },
  { href: "/projects/vera/panel/semana", label: "Semana", icon: <CalendarDays size={18} strokeWidth={1.75} /> },
  { href: "/projects/vera/panel/disponibilidad", label: "Horarios", icon: <Clock size={18} strokeWidth={1.75} /> },
  { href: "/projects/vera/panel/servicios", label: "Servicios", icon: <List size={18} strokeWidth={1.75} /> },
];

const MORE_ITEMS = [
  { href: "/projects/vera/panel/perfil", label: "Perfil", icon: <User size={18} strokeWidth={1.75} /> },
  { href: "/projects/vera/panel/proximos-recordatorios", label: "Próximos recordatorios", icon: <MessageCircle size={18} strokeWidth={1.75} /> },
  { href: "/projects/vera", label: "Volver al inicio", icon: <ArrowLeft size={18} strokeWidth={1.75} /> },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/projects/vera/panel") return pathname === href;
  return pathname.startsWith(href);
}

export function TabBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = MORE_ITEMS.slice(0, 2).some((it) => pathname.startsWith(it.href));

  return (
    <>
      <nav
        aria-label="Navegación"
        className="vera-tabbar"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 30,
          display: "flex",
          background: "var(--bg-raised)",
          borderTop: "1px solid var(--rule)",
          padding: "var(--space-2) 0 calc(var(--space-2) + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {PRIMARY_ITEMS.map((it) => {
          const active = isActive(pathname, it.href);
          return (
            <TabBarItem key={it.href} href={it.href} icon={it.icon} label={it.label} active={active} />
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-1)",
            padding: "var(--space-1) 0",
            background: "transparent",
            color: moreActive ? "var(--accent)" : "var(--muted)",
            border: "none",
            cursor: "pointer",
            fontSize: "var(--text-2xs)",
            fontWeight: 500,
          }}
        >
          <Ellipsis size={18} strokeWidth={1.75} />
          Más
        </button>
        <style>{`
          @media (min-width: 768px) {
            .vera-tabbar { display: none !important; }
          }
        `}</style>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen} size="sm" title="Más">
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
          {MORE_ITEMS.map((it) => (
            <li key={it.href}>
              <Link
                href={it.href}
                onClick={() => setMoreOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "var(--space-3)",
                  fontSize: "var(--text-md)",
                  color: "var(--ink)",
                  textDecoration: "none",
                  borderRadius: "var(--radius-sm)",
                }}
                className="vera-more-item"
              >
                <span style={{ color: "var(--ink-soft)" }}>{it.icon}</span>
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
        <style>{`.vera-more-item:hover { background: var(--bg-sunken); }`}</style>
      </Sheet>
    </>
  );
}

function TabBarItem({ href, icon, label, active }: { href: string; icon: ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-1)",
        padding: "var(--space-1) 0",
        color: active ? "var(--accent)" : "var(--muted)",
        textDecoration: "none",
        fontSize: "var(--text-2xs)",
        fontWeight: 500,
      }}
    >
      {icon}
      {label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const items = [...PRIMARY_ITEMS, ...MORE_ITEMS.slice(0, 2)];

  return (
    <aside
      className="vera-sidebar"
      style={{
        position: "sticky",
        top: 0,
        width: 240,
        height: "100vh",
        background: "var(--bg-sunken)",
        borderRight: "1px solid var(--rule)",
        padding: "var(--space-5) var(--space-3)",
        display: "none",
        flexDirection: "column",
        gap: "var(--space-4)",
        flexShrink: 0,
      }}
    >
      <Link
        href="/projects/vera"
        style={{
          fontSize: "var(--text-lg)",
          fontWeight: 600,
          letterSpacing: "var(--tracking-snug)",
          color: "var(--ink)",
          textDecoration: "none",
          padding: "0 var(--space-2)",
        }}
      >
        Vera
      </Link>

      <nav aria-label="Panel de la doctora">
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          {items.map((it) => {
            const active = isActive(pathname, it.href);
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    padding: "var(--space-2) var(--space-3)",
                    color: active ? "var(--accent)" : "var(--ink-soft)",
                    background: active ? "var(--bg-raised)" : "transparent",
                    borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                    borderRadius: "var(--radius-sm)",
                    textDecoration: "none",
                    fontSize: "var(--text-sm)",
                    fontWeight: active ? 500 : 400,
                  }}
                  className="vera-side-item"
                >
                  <span style={{ color: active ? "var(--accent)" : "var(--ink-faint)" }}>{it.icon}</span>
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ marginTop: "auto" }}>
        <Link
          href="/projects/vera"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-2) var(--space-3)",
            fontSize: "var(--text-sm)",
            color: "var(--muted)",
            textDecoration: "none",
            borderRadius: "var(--radius-sm)",
          }}
          className="vera-side-item"
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
          Volver al inicio
        </Link>
      </div>

      <style>{`
        .vera-side-item:hover { color: var(--ink); background: var(--bg-raised); }
        @media (min-width: 768px) {
          .vera-sidebar { display: flex !important; }
        }
      `}</style>
    </aside>
  );
}
