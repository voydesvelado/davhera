import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ style, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      style={{
        height: "40px",
        padding: "0 var(--space-4)",
        fontFamily: "var(--font-geist), system-ui, sans-serif",
        fontSize: "14px",
        color: "var(--ink)",
        background: "var(--bg)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-sm)",
        outline: "none",
        width: "100%",
        ...style,
      }}
    />
  );
}
