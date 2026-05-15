import type { ReactNode } from "react";

interface SketchProps {
  children?: ReactNode;
  /** A short label describing the visual contract. */
  caption?: ReactNode;
  /** Tall placeholder for surfaces like ProfileHero. */
  tall?: boolean;
}

/**
 * Static visual approximation used for components not yet wired.
 * Renders a dashed outline with a label inside; the contract is
 * communicated, not the live behavior.
 */
export function Sketch({ children, caption, tall }: SketchProps) {
  return (
    <div
      style={{
        border: "1px dashed var(--rule)",
        background: "var(--bg)",
        borderRadius: "var(--radius-sm)",
        padding: "var(--space-6)",
        minHeight: tall ? "240px" : "120px",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
        color: "var(--ink-soft)",
        fontFamily: "var(--font-geist), system-ui, sans-serif",
        fontSize: "14px",
      }}
    >
      {children}
      {caption ? (
        <div
          style={{
            marginTop: "auto",
            paddingTop: "var(--space-3)",
            fontFamily: "var(--font-newsreader), serif",
            fontStyle: "italic",
            fontSize: "13px",
            color: "var(--muted)",
          }}
        >
          {caption}
        </div>
      ) : null}
    </div>
  );
}
