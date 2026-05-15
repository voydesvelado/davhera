import type { CSSProperties, ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  /** Use --accent instead of --muted. Default false (--muted). */
  accent?: boolean;
  style?: CSSProperties;
}

/**
 * Product-style eyebrow — Geist Sans medium, uppercase, widest tracking.
 * No serif italic, no underline. Used for section labels across marketing.
 */
export function Eyebrow({ children, accent, style }: EyebrowProps) {
  return (
    <span
      style={{
        fontFamily: "var(--font-geist), system-ui, sans-serif",
        fontSize: "var(--text-xs)",
        fontWeight: 500,
        letterSpacing: accent ? "var(--tracking-wider)" : "var(--tracking-widest)",
        textTransform: "uppercase",
        color: accent ? "var(--accent)" : "var(--muted)",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
