import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ style, className, rows = 3, ...rest }: TextareaProps) {
  return (
    <textarea
      {...rest}
      rows={rows}
      className={`vera-textarea ${className ?? ""}`}
      style={{
        minHeight: 80,
        padding: "var(--space-3)",
        fontFamily: "var(--font-geist), system-ui, sans-serif",
        fontSize: "var(--text-base)",
        lineHeight: "var(--leading-normal)",
        color: "var(--ink)",
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-sm)",
        outline: "none",
        width: "100%",
        resize: "vertical",
        transition:
          "border-color var(--dur-quick) var(--ease-snap), background var(--dur-quick) var(--ease-snap)",
        ...style,
      }}
    />
  );
}
