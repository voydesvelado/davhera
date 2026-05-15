import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const HEIGHTS: Record<Size, number> = { xs: 28, sm: 32, md: 36, lg: 44 };
const PAD_X: Record<Size, string> = {
  xs: "var(--space-3)",
  sm: "var(--space-3)",
  md: "var(--space-4)",
  lg: "var(--space-5)",
};
const FONT_SIZE: Record<Size, string> = {
  xs: "var(--text-xs)",
  sm: "var(--text-sm)",
  md: "var(--text-base)",
  lg: "var(--text-md)",
};

function variantStyle(variant: Variant): CSSProperties {
  switch (variant) {
    case "secondary":
      return {
        background: "var(--bg-raised)",
        color: "var(--ink)",
        border: "1px solid var(--rule)",
      };
    case "ghost":
      return {
        background: "transparent",
        color: "var(--ink)",
        border: "1px solid transparent",
      };
    case "destructive":
      return {
        background: "var(--danger)",
        color: "#FFFFFF",
        border: "1px solid var(--danger)",
      };
    case "primary":
    default:
      return {
        background: "var(--accent)",
        color: "var(--accent-ink)",
        border: "1px solid var(--accent)",
      };
  }
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  style,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={`vera-btn vera-btn-${variant} ${className ?? ""}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-2)",
        height: HEIGHTS[size],
        padding: `0 ${PAD_X[size]}`,
        fontFamily: "var(--font-geist), system-ui, sans-serif",
        fontSize: FONT_SIZE[size],
        fontWeight: "var(--weight-medium)" as CSSProperties["fontWeight"],
        letterSpacing: "var(--tracking-normal)",
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition:
          "background var(--dur-quick) var(--ease-snap), border-color var(--dur-quick) var(--ease-snap), color var(--dur-quick) var(--ease-snap), transform var(--dur-instant) var(--ease-snap)",
        ...variantStyle(variant),
        ...style,
      }}
    >
      {children}
      <style>{`
        .vera-btn:active { transform: scale(0.97); }
        .vera-btn-primary:hover { background: var(--accent-soft); border-color: var(--accent-soft); }
        .vera-btn-secondary:hover { border-color: var(--rule-strong); }
        .vera-btn-ghost:hover { background: var(--bg-sunken); }
        .vera-btn-destructive:hover { filter: brightness(1.05); }
        .vera-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .vera-btn:disabled:hover { background: var(--accent); border-color: var(--accent); }
      `}</style>
    </button>
  );
}
