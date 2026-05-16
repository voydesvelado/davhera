"use client";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Switch({ checked, onCheckedChange, label, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      style={{
        position: "relative",
        width: 36,
        height: 20,
        padding: 0,
        background: checked ? "var(--accent)" : "var(--bg-sunken)",
        border: "1px solid",
        borderColor: checked ? "var(--accent)" : "var(--rule)",
        borderRadius: "var(--radius-pill)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition:
          "background var(--dur-base) var(--ease-snap), border-color var(--dur-base) var(--ease-snap)",
        flexShrink: 0,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 1,
          left: checked ? 17 : 1,
          width: 16,
          height: 16,
          background: "#fff",
          borderRadius: "50%",
          boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
          transition: "left var(--dur-base) var(--ease-snap)",
        }}
      />
    </button>
  );
}
