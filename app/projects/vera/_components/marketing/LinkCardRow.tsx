import Link from "next/link";
import type { ReactNode } from "react";

interface LinkCard {
  href: string;
  title: ReactNode;
  description: ReactNode;
  external?: boolean;
}

interface LinkCardRowProps {
  cards: LinkCard[];
}

export function LinkCardRow({ cards }: LinkCardRowProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "var(--space-3)",
      }}
    >
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          target={card.external ? "_blank" : undefined}
          rel={card.external ? "noopener noreferrer" : undefined}
          className="vera-link-card"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-1)",
            padding: "var(--space-4)",
            background: "var(--bg-raised)",
            border: "1px solid var(--rule)",
            borderRadius: "var(--radius-md)",
            textDecoration: "none",
            color: "inherit",
            transition: "border-color var(--dur-quick) var(--ease-snap)",
          }}
        >
          <span
            style={{
              fontSize: "var(--text-md)",
              fontWeight: 600,
              color: "var(--ink)",
            }}
          >
            {card.title}
          </span>
          <span
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--muted)",
            }}
          >
            {card.description}
          </span>
        </Link>
      ))}
      <style>{`.vera-link-card:hover { border-color: var(--accent) !important; }`}</style>
    </div>
  );
}
