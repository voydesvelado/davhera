import type { LabelHTMLAttributes, ReactNode } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export function Label({ children, style, ...rest }: LabelProps) {
  return (
    <label
      {...rest}
      style={{
        fontFamily: "var(--font-fraunces), serif",
        fontVariationSettings: '"opsz" 9, "SOFT" 0',
        fontWeight: 600,
        fontSize: "12px",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--muted)",
        display: "inline-block",
        ...style,
      }}
    >
      {children}
    </label>
  );
}
