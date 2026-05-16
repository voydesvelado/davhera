"use client";

import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";

interface FloatingLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Optional suffix (e.g., "minutos", "MXN"). */
  suffix?: string;
  /** Optional prefix (e.g., "$"). */
  prefix?: string;
}

export const FloatingLabelInput = forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  function FloatingLabelInput({ label, suffix, prefix, value, ...rest }, ref) {
    const id = useId();
    const [focused, setFocused] = useState(false);
    const hasValue = value !== undefined && value !== null && String(value).length > 0;
    const floated = focused || hasValue;

    return (
      <div
        className="vera-fli"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "stretch",
          height: 56,
          background: "var(--bg-raised)",
          border: "1px solid var(--rule)",
          borderRadius: "var(--radius-sm)",
          transition:
            "border-color var(--dur-quick) var(--ease-snap), background var(--dur-quick) var(--ease-snap)",
        }}
      >
        {prefix ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "flex-end",
              padding: "0 0 12px var(--space-3)",
              color: "var(--muted)",
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: "var(--text-md)",
            }}
          >
            {prefix}
          </span>
        ) : null}
        <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
          <label
            htmlFor={id}
            style={{
              position: "absolute",
              left: prefix ? 4 : "var(--space-3)",
              top: floated ? 7 : "50%",
              transform: floated ? "none" : "translateY(-50%)",
              fontSize: floated ? "var(--text-2xs)" : "var(--text-base)",
              fontWeight: floated ? 500 : 400,
              letterSpacing: floated ? "var(--tracking-wider)" : "var(--tracking-normal)",
              textTransform: floated ? "uppercase" : "none",
              color: focused ? "var(--accent)" : "var(--muted)",
              pointerEvents: "none",
              transition:
                "top var(--dur-quick) var(--ease-snap), font-size var(--dur-quick) var(--ease-snap), color var(--dur-quick) var(--ease-snap), letter-spacing var(--dur-quick) var(--ease-snap), transform var(--dur-quick) var(--ease-snap)",
              fontFamily: "var(--font-geist), system-ui, sans-serif",
            }}
          >
            {label}
          </label>
          <input
            id={id}
            ref={ref}
            value={value}
            {...rest}
            onFocus={(e) => {
              setFocused(true);
              rest.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              rest.onBlur?.(e);
            }}
            style={{
              width: "100%",
              height: "100%",
              padding: floated
                ? "20px var(--space-3) 8px " + (prefix ? "4px" : "var(--space-3)")
                : "0 var(--space-3)",
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "var(--font-geist), system-ui, sans-serif",
              fontSize: "var(--text-md)",
              color: "var(--ink)",
              fontFeatureSettings: '"tnum" 1',
            }}
          />
        </div>
        {suffix ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "flex-end",
              padding: "0 var(--space-3) 12px",
              color: "var(--muted)",
              fontSize: "var(--text-sm)",
            }}
          >
            {suffix}
          </span>
        ) : null}
        <style>{`
          .vera-fli:focus-within { border-color: var(--accent); }
        `}</style>
      </div>
    );
  },
);
