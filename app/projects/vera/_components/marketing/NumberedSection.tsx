import type { ReactNode } from "react";

interface NumberedItem {
  title: ReactNode;
  body: ReactNode;
}

interface NumberedSectionProps {
  items: NumberedItem[];
}

export function NumberedSection({ items }: NumberedSectionProps) {
  return (
    <ol
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {items.map((item, idx) => (
        <li
          key={idx}
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "var(--space-5)",
            alignItems: "baseline",
          }}
        >
          <span
            aria-hidden
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "var(--text-2xl)",
              fontWeight: 600,
              color: "var(--accent)",
              fontVariantNumeric: "tabular-nums",
              minWidth: "2ch",
            }}
          >
            {String(idx + 1).padStart(2, "0")}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <h3
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: 600,
                color: "var(--ink)",
                margin: 0,
                letterSpacing: "var(--tracking-normal)",
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontSize: "var(--text-md)",
                lineHeight: "var(--leading-normal)",
                color: "var(--ink-soft)",
                margin: 0,
              }}
            >
              {item.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
