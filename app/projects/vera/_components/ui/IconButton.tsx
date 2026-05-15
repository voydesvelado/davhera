import type { ButtonHTMLAttributes, ReactNode } from "react";

type Size = "xs" | "sm" | "md";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size;
  /** Required for accessibility — always paired with screen-reader text. */
  "aria-label": string;
  children: ReactNode;
}

const HEIGHTS: Record<Size, number> = { xs: 28, sm: 32, md: 36 };

export function IconButton({ size = "sm", children, style, className, ...rest }: IconButtonProps) {
  return (
    <button
      {...rest}
      className={`vera-icon-btn ${className ?? ""}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: HEIGHTS[size],
        height: HEIGHTS[size],
        background: "transparent",
        color: "var(--ink-soft)",
        border: "1px solid transparent",
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        transition:
          "background var(--dur-quick) var(--ease-snap), color var(--dur-quick) var(--ease-snap), border-color var(--dur-quick) var(--ease-snap)",
        ...style,
      }}
    >
      {children}
      <style>{`
        .vera-icon-btn:hover { background: var(--bg-sunken); color: var(--ink); }
        .vera-icon-btn:active { transform: scale(0.95); }
      `}</style>
    </button>
  );
}
