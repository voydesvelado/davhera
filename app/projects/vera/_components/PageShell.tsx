import type { ReactNode } from "react";

type Mode = "editorial" | "product";

interface PageShellProps {
  mode: Mode;
  children: ReactNode;
  /** Optional container variant — defaults match the mode. */
  container?: "prose" | "product" | "none";
  /** Hide the paper-grain overlay even in editorial mode (e.g. for /sistema swatches). */
  grain?: boolean;
}

/**
 * Page wrapper for Vera surfaces. Applies the mode class, the paper-grain
 * overlay (editorial mode by default), and a sensible content container.
 *
 * Sits inside the parent .proj-vera wrapper provided by layout.tsx.
 */
export function PageShell({
  mode,
  children,
  container,
  grain,
}: PageShellProps) {
  const modeClass = mode === "editorial" ? "mode-editorial" : "mode-product";
  const showGrain = grain ?? mode === "editorial";

  const containerClass = (() => {
    const resolved = container ?? (mode === "editorial" ? "prose" : "product");
    if (resolved === "none") return "";
    if (resolved === "prose") return "container-prose";
    return "container-product";
  })();

  return (
    <div className={`${modeClass} ${showGrain ? "vera-grain" : ""}`}>
      <div className={containerClass}>{children}</div>
    </div>
  );
}
