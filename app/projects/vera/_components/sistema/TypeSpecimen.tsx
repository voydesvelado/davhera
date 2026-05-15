import type { CSSProperties, ReactNode } from "react";

interface TypeSpecimenProps {
  token: string;
  px: number;
  sample: ReactNode;
  /** Inline style override for the sample (font-family, weight, opsz/SOFT, italic). */
  sampleStyle?: CSSProperties;
}

/**
 * One row of the type-scale ladder.
 * Renders: token name (mono) | px value (mono) | sample text (live size).
 */
export function TypeSpecimen({ token, px, sample, sampleStyle }: TypeSpecimenProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: "var(--space-5)",
        padding: "var(--space-4) 0",
        borderBottom: "1px solid var(--rule-soft)",
        alignItems: "baseline",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span
          style={{
            fontFamily: "var(--font-mono-vera), monospace",
            fontSize: "12px",
            color: "var(--ink)",
          }}
        >
          {token}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono-vera), monospace",
            fontSize: "11px",
            color: "var(--muted)",
          }}
        >
          {px}px
        </span>
      </div>
      <div
        style={{
          fontSize: `${px}px`,
          lineHeight: 1.2,
          color: "var(--ink)",
          fontFamily: "var(--font-newsreader), Georgia, serif",
          ...sampleStyle,
        }}
      >
        {sample}
      </div>
    </div>
  );
}
