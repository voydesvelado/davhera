import type { ReactNode } from "react";

interface ComponentSampleProps {
  name: string;
  description: ReactNode;
  status: "implementado" | "boceto";
  children: ReactNode;
}

export function ComponentSample({
  name,
  description,
  status,
  children,
}: ComponentSampleProps) {
  const isImplementado = status === "implementado";
  return (
    <div
      style={{
        padding: "var(--space-6) 0",
        borderBottom: "1px solid var(--rule-soft)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "var(--space-4)",
          marginBottom: "var(--space-2)",
          flexWrap: "wrap",
        }}
      >
        <h4
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontVariationSettings: '"opsz" 36, "SOFT" 30',
            fontWeight: 500,
            fontSize: "20px",
            color: "var(--ink)",
            margin: 0,
            letterSpacing: "-0.005em",
          }}
        >
          {name}
        </h4>
        <span
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontVariationSettings: '"opsz" 9, "SOFT" 0',
            fontWeight: 600,
            fontSize: "10px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: isImplementado ? "var(--success)" : "var(--muted)",
            border: `1px solid ${isImplementado ? "var(--success)" : "var(--rule)"}`,
            padding: "3px 10px",
            borderRadius: "var(--radius-pill)",
          }}
        >
          {isImplementado ? "Implementado" : "Boceto"}
        </span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-newsreader), serif",
          fontStyle: "italic",
          fontSize: "15px",
          color: "var(--muted)",
          margin: "0 0 var(--space-5)",
        }}
      >
        {description}
      </p>
      <div
        style={{
          padding: "var(--space-6)",
          background: "var(--bg-2)",
          border: "1px solid var(--rule-soft)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
