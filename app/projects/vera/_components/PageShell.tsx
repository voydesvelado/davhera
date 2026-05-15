import type { CSSProperties, ReactNode } from "react";

type Density = "compact" | "comfortable";
type Width = "narrow" | "content" | "wide" | "dashboard" | "full";

interface PageShellProps {
  children: ReactNode;
  /** Default compact — premium product surfaces are dense by default. */
  density?: Density;
  /** Max-width token. Defaults to wide for marketing surfaces. */
  width?: Width;
  /** Optional extra className on the shell wrapper. */
  className?: string;
  /** Optional extra inline styles. */
  style?: CSSProperties;
}

const WIDTH_TOKEN: Record<Width, string> = {
  narrow: "var(--max-narrow)",
  content: "var(--max-content)",
  wide: "var(--max-wide)",
  dashboard: "var(--max-dashboard)",
  full: "100%",
};

/**
 * Vera page shell — v0.3.
 *
 * One mode only. Provides consistent page padding, max-width, and an
 * optional density variant. No editorial wrappers, no grain, no mode prop.
 */
export function PageShell({
  children,
  density = "compact",
  width = "wide",
  className,
  style,
}: PageShellProps) {
  return (
    <div
      className={`${density === "comfortable" ? "density-comfortable" : ""} ${className ?? ""}`}
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--ink)",
        ...style,
      }}
    >
      <div
        style={{
          maxWidth: WIDTH_TOKEN[width],
          margin: "0 auto",
          paddingLeft: "var(--px-mobile)",
          paddingRight: "var(--px-mobile)",
          width: "100%",
        }}
        className="vera-page-inner"
      >
        {children}
      </div>
      <style>{`
        @media (min-width: 640px) {
          .vera-page-inner {
            padding-left: var(--px-tablet);
            padding-right: var(--px-tablet);
          }
        }
        @media (min-width: 1024px) {
          .vera-page-inner {
            padding-left: var(--px-desktop);
            padding-right: var(--px-desktop);
          }
        }
      `}</style>
    </div>
  );
}
