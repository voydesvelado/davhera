import type { ReactNode } from "react";

interface KbdProps {
  children: ReactNode;
}

/**
 * Keyboard-shortcut hint chip. Pair tokens with a separator (e.g. "G H")
 * by passing a single string — letters render together inside one chip.
 */
export function Kbd({ children }: KbdProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        padding: "1px 5px",
        background: "var(--bg-sunken)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-xs)",
        fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
        fontSize: "var(--text-2xs)",
        fontWeight: 500,
        color: "var(--ink-soft)",
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
