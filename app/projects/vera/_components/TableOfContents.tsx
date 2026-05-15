import type { ReactNode } from "react";

interface TocEntry {
  label: ReactNode;
  href: string;
  pg?: string;
}

interface TableOfContentsProps {
  entries: TocEntry[];
  label?: ReactNode;
}

const ROMAN = [
  "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII",
];

export function TableOfContents({ entries, label = "Contenido" }: TableOfContentsProps) {
  return (
    <nav
      style={{
        margin: "var(--space-16) 0 var(--space-24)",
        padding: "var(--space-8) 0",
        borderTop: "1px solid var(--rule)",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-fraunces), serif",
          fontVariationSettings: '"opsz" 9, "SOFT" 0',
          fontWeight: 600,
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: "var(--space-5)",
        }}
      >
        {label}
      </div>
      <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {entries.map((entry, idx) => (
          <li
            key={entry.href}
            style={{
              display: "grid",
              gridTemplateColumns: "44px 1fr auto",
              gap: "var(--space-4)",
              padding: "10px 0",
              borderBottom:
                idx === entries.length - 1 ? "none" : "1px dotted var(--rule-soft)",
              fontSize: "17px",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontVariationSettings: '"opsz" 9',
                fontSize: "11px",
                letterSpacing: "0.1em",
                color: "var(--muted)",
              }}
            >
              {ROMAN[idx] ?? String(idx + 1)}
            </span>
            <a
              href={entry.href}
              style={{
                color: "var(--ink)",
                textDecoration: "none",
                fontFamily: "var(--font-newsreader), serif",
                borderBottom: "none",
              }}
            >
              {entry.label}
            </a>
            {entry.pg ? (
              <span
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontVariationSettings: '"opsz" 9',
                  fontSize: "12px",
                  color: "var(--muted)",
                }}
              >
                {entry.pg}
              </span>
            ) : (
              <span />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
