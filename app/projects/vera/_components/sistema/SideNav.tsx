"use client";

import { useEffect, useState } from "react";

export interface NavItem {
  id: string;
  label: string;
  num: string;
}

interface SideNavProps {
  items: NavItem[];
}

export function SideNav({ items }: SideNavProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      },
    );

    elements.forEach((el) => observer.observe(el));
    observers.push(observer);

    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  return (
    <nav
      aria-label="Secciones del sistema"
      className="vera-sidenav"
      style={{
        position: "sticky",
        top: "var(--space-16)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-0_5)",
        fontSize: "var(--text-sm)",
        maxHeight: "calc(100vh - var(--space-20))",
        overflowY: "auto",
      }}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            style={{
              display: "grid",
              gridTemplateColumns: "32px 1fr",
              gap: "var(--space-2)",
              padding: "var(--space-2) var(--space-3)",
              color: isActive ? "var(--accent)" : "var(--ink-soft)",
              fontWeight: isActive ? 500 : 400,
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
              transition: "color var(--dur-quick) var(--ease-snap), background var(--dur-quick) var(--ease-snap)",
              background: isActive ? "var(--accent-pale)" : "transparent",
            }}
            className="vera-sidenav-link"
          >
            <span
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "var(--text-xs)",
                color: isActive ? "var(--accent)" : "var(--muted)",
              }}
            >
              {item.num}
            </span>
            <span>{item.label}</span>
          </a>
        );
      })}
      <style>{`
        .vera-sidenav-link:hover { color: var(--ink); }
      `}</style>
    </nav>
  );
}
