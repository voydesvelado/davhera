import type { ReactNode } from "react";
import { LiveList } from "./LiveList";
import { Eyebrow } from "./Eyebrow";

interface DualColumnListsProps {
  left: { label: ReactNode; items: ReactNode[]; marker?: "check" | "arrow" };
  right: { label: ReactNode; items: ReactNode[]; marker?: "check" | "arrow" };
}

export function DualColumnLists({ left, right }: DualColumnListsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "var(--space-8)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <Eyebrow>{left.label}</Eyebrow>
        <LiveList items={left.items} marker={left.marker} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <Eyebrow>{right.label}</Eyebrow>
        <LiveList items={right.items} marker={right.marker} />
      </div>
    </div>
  );
}
