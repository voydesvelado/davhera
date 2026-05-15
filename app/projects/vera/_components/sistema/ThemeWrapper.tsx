import type { CSSProperties, ReactNode } from "react";

interface ThemeWrapperProps {
  children: ReactNode;
  theme?: "light" | "dark";
  /** Render the wrapper's own bg/ink so dark variants are visible against the page. */
  applyBackground?: boolean;
  style?: CSSProperties;
}

/**
 * Locally applies a theme variant to its children. The .theme-dark class
 * is scoped to the wrapper, so CSS variables resolve dark inside but stay
 * unaffected outside. Used by /sistema to show dark swatches on a light page.
 */
export function ThemeWrapper({
  children,
  theme = "light",
  applyBackground = true,
  style,
}: ThemeWrapperProps) {
  return (
    <div
      className={theme === "dark" ? "theme-dark" : ""}
      style={{
        background: applyBackground ? "var(--bg)" : undefined,
        color: applyBackground ? "var(--ink)" : undefined,
        borderRadius: "var(--radius-md)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
