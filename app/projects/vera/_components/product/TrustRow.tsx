import { Check } from "lucide-react";
import type { ReactNode } from "react";

interface TrustRowProps {
  children: ReactNode;
}

export function TrustRow({ children }: TrustRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
        fontSize: "var(--text-md)",
        color: "var(--ink-soft)",
      }}
    >
      <span
        aria-hidden
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          background: "color-mix(in oklch, var(--success) 15%, transparent)",
          color: "var(--success)",
          borderRadius: "var(--radius-pill)",
          flexShrink: 0,
        }}
      >
        <Check size={12} strokeWidth={2.5} />
      </span>
      {children}
    </div>
  );
}
