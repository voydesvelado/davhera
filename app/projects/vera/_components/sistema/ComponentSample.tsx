import type { ReactNode } from "react";
import { Badge } from "../ui/Badge";

interface ComponentSampleProps {
  name: string;
  description: ReactNode;
  status: "implementado" | "boceto";
  children: ReactNode;
}

export function ComponentSample({ name, description, status, children }: ComponentSampleProps) {
  const isImpl = status === "implementado";
  return (
    <div
      style={{
        padding: "var(--space-6)",
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "var(--space-3)",
          flexWrap: "wrap",
        }}
      >
        <h4
          style={{
            fontSize: "var(--text-lg)",
            fontWeight: 600,
            color: "var(--ink)",
            margin: 0,
            letterSpacing: "var(--tracking-normal)",
          }}
        >
          {name}
        </h4>
        <Badge tone={isImpl ? "success" : "neutral"} dot>
          {isImpl ? "Implementado" : "Boceto"}
        </Badge>
      </div>
      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--ink-soft)",
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
      <div
        style={{
          padding: "var(--space-5)",
          background: "var(--bg-sunken)",
          borderRadius: "var(--radius-sm)",
          border: isImpl ? "1px solid var(--rule-faint)" : "1px dashed var(--rule)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
