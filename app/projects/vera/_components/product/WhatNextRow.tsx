import type { ReactNode } from "react";

interface WhatNextRowProps {
  icon: ReactNode;
  children: ReactNode;
}

export function WhatNextRow({ icon, children }: WhatNextRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-3)",
        fontSize: "var(--text-md)",
        color: "var(--ink-soft)",
        lineHeight: "var(--leading-snug)",
      }}
    >
      <span
        aria-hidden
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          background: "var(--bg-sunken)",
          color: "var(--ink-soft)",
          borderRadius: "var(--radius-md)",
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
}
