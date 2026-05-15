import type { ReactNode } from "react";

interface PullQuoteProps {
  children: ReactNode;
  attribution?: ReactNode;
}

/**
 * Pull quote — italic Fraunces with --accent left border.
 * Optional attribution renders in small caps Fraunces below the quote.
 */
export function PullQuote({ children, attribution }: PullQuoteProps) {
  return (
    <blockquote
      style={{
        margin: "var(--space-12) 0",
        padding: "0 0 0 var(--space-6)",
        borderLeft: "2px solid var(--accent)",
        fontFamily: "var(--font-fraunces), Georgia, serif",
        fontVariationSettings: '"opsz" 36, "SOFT" 100',
        fontStyle: "italic",
        fontWeight: 340,
        fontSize: "26px",
        lineHeight: 1.3,
        color: "var(--ink)",
      }}
    >
      {children}
      {attribution ? (
        <span
          style={{
            display: "block",
            marginTop: "var(--space-4)",
            fontFamily: "var(--font-fraunces), serif",
            fontVariationSettings: '"opsz" 9, "SOFT" 0',
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          {attribution}
        </span>
      ) : null}
    </blockquote>
  );
}
