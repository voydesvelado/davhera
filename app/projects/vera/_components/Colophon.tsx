import type { ReactNode } from "react";

interface ColophonProps {
  children: ReactNode;
}

export function Colophon({ children }: ColophonProps) {
  return (
    <div
      style={{
        marginTop: "var(--space-24)",
        paddingTop: "var(--space-10)",
        borderTop: "1px solid var(--rule)",
        fontFamily: "var(--font-fraunces), serif",
        fontVariationSettings: '"opsz" 9, "SOFT" 100',
        fontStyle: "italic",
        fontSize: "13px",
        lineHeight: 1.6,
        color: "var(--muted)",
        textAlign: "center",
      }}
    >
      <span
        style={{
          fontStyle: "normal",
          fontFamily: "var(--font-fraunces), serif",
          fontVariationSettings: '"opsz" 9, "SOFT" 0',
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontSize: "11px",
          color: "var(--ink)",
          display: "block",
          marginBottom: "var(--space-4)",
        }}
      >
        Colofón
      </span>
      {children}
    </div>
  );
}
