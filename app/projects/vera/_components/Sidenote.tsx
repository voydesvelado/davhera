import type { ReactNode } from "react";

interface SidenoteProps {
  children: ReactNode;
  label?: ReactNode;
}

export function Sidenote({ children, label = "Nota al margen" }: SidenoteProps) {
  return (
    <aside
      style={{
        margin: "var(--space-8) 0",
        padding: "var(--space-5) var(--space-6)",
        background: "var(--bg-2)",
        borderLeft: "2px solid var(--rule)",
        fontSize: "16px",
        lineHeight: 1.5,
        color: "var(--ink-soft)",
        fontFamily: "var(--font-newsreader), Georgia, serif",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-fraunces), serif",
          fontVariationSettings: '"opsz" 9, "SOFT" 0',
          fontWeight: 600,
          fontSize: "10px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--accent)",
          display: "block",
          marginBottom: "var(--space-2)",
        }}
      >
        {label}
      </span>
      {children}
    </aside>
  );
}
