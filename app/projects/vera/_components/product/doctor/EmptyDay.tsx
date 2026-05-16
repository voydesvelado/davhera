interface EmptyDayProps {
  message?: string;
}

export function EmptyDay({ message = "Sin citas hoy." }: EmptyDayProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-2)",
        padding: "var(--space-12) var(--space-4)",
        textAlign: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "var(--text-xl)",
          fontWeight: 500,
          color: "var(--muted)",
        }}
      >
        {message}
      </p>
      <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--ink-faint)" }}>
        Aprovecha para escribir bio, postear en IG o tomarte un café.
      </p>
    </div>
  );
}
