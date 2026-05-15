import type { ReactNode } from "react";

interface PatternDiagramProps {
  title: ReactNode;
  caption: ReactNode;
  children: ReactNode;
}

export function PatternDiagram({ title, caption, children }: PatternDiagramProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
        padding: "var(--space-6)",
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <h4
        style={{
          fontSize: "var(--text-md)",
          fontWeight: 600,
          color: "var(--ink)",
          margin: 0,
        }}
      >
        {title}
      </h4>
      <div
        style={{
          padding: "var(--space-5)",
          background: "var(--bg-sunken)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        {children}
      </div>
      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--ink-soft)",
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {caption}
      </p>
    </div>
  );
}
