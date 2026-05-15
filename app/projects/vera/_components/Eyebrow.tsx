import type { ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  as?: "span" | "div";
}

/**
 * Section eyebrow. Small caps Fraunces in --accent with a thin accent underline.
 * Inline-block so the underline only spans the text width.
 */
export function Eyebrow({ children, as = "span" }: EyebrowProps) {
  const Component = as;
  return (
    <Component
      style={{
        fontFamily: "var(--font-fraunces), Georgia, serif",
        fontVariationSettings: '"opsz" 9, "SOFT" 0',
        fontWeight: 600,
        fontSize: "12px",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "var(--accent)",
        display: "inline-block",
        paddingBottom: "6px",
        borderBottom: "1px solid var(--accent)",
      }}
    >
      {children}
    </Component>
  );
}
