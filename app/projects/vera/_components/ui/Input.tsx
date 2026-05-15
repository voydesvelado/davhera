import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ style, className, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      className={`vera-input ${className ?? ""}`}
      style={{
        height: "var(--field-height-base)",
        padding: "0 var(--space-3)",
        fontFamily: "var(--font-geist), system-ui, sans-serif",
        fontSize: "var(--text-base)",
        color: "var(--ink)",
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-sm)",
        outline: "none",
        width: "100%",
        transition:
          "border-color var(--dur-quick) var(--ease-snap), background var(--dur-quick) var(--ease-snap)",
        ...style,
      }}
    />
  );
}
