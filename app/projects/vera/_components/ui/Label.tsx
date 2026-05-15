import type { LabelHTMLAttributes, ReactNode } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export function Label({ children, style, ...rest }: LabelProps) {
  return (
    <label
      {...rest}
      style={{
        fontFamily: "var(--font-geist), system-ui, sans-serif",
        fontSize: "var(--text-xs)",
        fontWeight: 500,
        letterSpacing: "var(--tracking-widest)",
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
