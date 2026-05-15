interface RadiusBoxProps {
  token: string;
  radius: string;
}

export function RadiusBox({ token, radius }: RadiusBoxProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-3)",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          background: "var(--bg-2)",
          border: "1px solid var(--rule)",
          borderRadius: radius,
        }}
        aria-hidden
      />
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "2px" }}>
        <span
          style={{
            fontFamily: "var(--font-mono-vera), monospace",
            fontSize: "12px",
            color: "var(--ink)",
          }}
        >
          {token}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono-vera), monospace",
            fontSize: "11px",
            color: "var(--muted)",
          }}
        >
          {radius}
        </span>
      </div>
    </div>
  );
}
