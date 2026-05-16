import { MapPin, Languages as LanguagesIcon } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "location" | "languages";

interface LocationPillProps {
  variant?: Variant;
  children: ReactNode;
}

export function LocationPill({ variant = "location", children }: LocationPillProps) {
  const Icon = variant === "languages" ? LanguagesIcon : MapPin;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1_5)",
        padding: "4px 10px",
        background: "var(--bg-sunken)",
        color: "var(--ink-soft)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-pill)",
        fontSize: "var(--text-sm)",
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={14} strokeWidth={1.75} />
      {children}
    </span>
  );
}
