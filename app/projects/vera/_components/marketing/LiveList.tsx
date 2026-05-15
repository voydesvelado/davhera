import { Check, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface LiveListProps {
  items: ReactNode[];
  /** "check" (default, --success) for "done" lists; "arrow" (--muted) for "what's next" lists. */
  marker?: "check" | "arrow";
}

export function LiveList({ items, marker = "check" }: LiveListProps) {
  const Icon = marker === "check" ? Check : ArrowRight;
  const color = marker === "check" ? "var(--success)" : "var(--muted)";

  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      {items.map((item, idx) => (
        <li
          key={idx}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "var(--space-3)",
            fontSize: "var(--text-md)",
            lineHeight: "var(--leading-normal)",
            color: "var(--ink)",
          }}
        >
          <span style={{ display: "inline-flex", paddingTop: "3px", color, flexShrink: 0 }}>
            <Icon size={16} strokeWidth={2} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
