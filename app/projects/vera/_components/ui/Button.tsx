import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const HEIGHTS: Record<Size, number> = { sm: 32, md: 40, lg: 48 };
const PADS: Record<Size, string> = {
  sm: "0 var(--space-4)",
  md: "0 var(--space-5)",
  lg: "0 var(--space-6)",
};
const FONT_SIZE: Record<Size, string> = { sm: "13px", md: "14px", lg: "15px" };

export function Button({
  variant = "primary",
  size = "md",
  children,
  style,
  ...rest
}: ButtonProps) {
  const variantStyle: CSSProperties = (() => {
    switch (variant) {
      case "secondary":
        return {
          background: "transparent",
          color: "var(--ink)",
          border: "1px solid var(--rule)",
        };
      case "ghost":
        return {
          background: "transparent",
          color: "var(--ink)",
          border: "1px solid transparent",
        };
      case "primary":
      default:
        return {
          background: "var(--accent)",
          color: "#FFFFFF",
          border: "1px solid var(--accent)",
        };
    }
  })();

  return (
    <button
      {...rest}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-2)",
        height: HEIGHTS[size],
        padding: PADS[size],
        fontFamily: "var(--font-geist), system-ui, sans-serif",
        fontSize: FONT_SIZE[size],
        fontWeight: 500,
        letterSpacing: "0.01em",
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)",
        ...variantStyle,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
