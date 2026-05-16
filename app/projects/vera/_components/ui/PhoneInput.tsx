"use client";

import { useEffect, useRef, type InputHTMLAttributes } from "react";

interface PhoneInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  /** Always the digits-only string (e.g., "5512345678"), without prefix. */
  value: string;
  onChange: (digits: string) => void;
}

function formatMx(digits: string): string {
  const d = digits.slice(0, 10);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `${d.slice(0, 2)} ${d.slice(2)}`;
  return `${d.slice(0, 2)} ${d.slice(2, 6)} ${d.slice(6)}`;
}

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "").slice(0, 10);
}

export function PhoneInput({ value, onChange, style, className, ...rest }: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const formatted = formatMx(value);

  // Keep cursor near the end after live formatting (simpler than mapping
  // index-by-index; acceptable for a 10-digit phone input).
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    if (document.activeElement === el) {
      el.setSelectionRange(formatted.length, formatted.length);
    }
  }, [formatted]);

  return (
    <div
      className={`vera-phone-input ${className ?? ""}`}
      style={{
        display: "flex",
        alignItems: "stretch",
        height: "var(--field-height-base)",
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-sm)",
        overflow: "hidden",
        transition: "border-color var(--dur-quick) var(--ease-snap)",
      }}
    >
      <span
        aria-hidden
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "0 var(--space-3)",
          background: "var(--bg-sunken)",
          color: "var(--ink-soft)",
          fontSize: "var(--text-base)",
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          borderRight: "1px solid var(--rule)",
          fontFeatureSettings: '"tnum" 1',
        }}
      >
        +52
      </span>
      <input
        {...rest}
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={formatted}
        onChange={(e) => onChange(digitsOnly(e.target.value))}
        placeholder="55 1234 5678"
        style={{
          flex: 1,
          height: "100%",
          padding: "0 var(--space-3)",
          fontFamily: "var(--font-geist), system-ui, sans-serif",
          fontSize: "var(--text-base)",
          color: "var(--ink)",
          background: "transparent",
          border: "none",
          outline: "none",
          ...style,
        }}
      />
    </div>
  );
}
