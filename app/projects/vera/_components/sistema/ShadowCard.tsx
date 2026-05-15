interface ShadowCardProps {
  token: string;
  shadow: string;
}

export function ShadowCard({ token, shadow }: ShadowCardProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-4)",
        padding: "var(--space-6) 0",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "180px",
          height: "100px",
          background: "#FFFFFF",
          borderRadius: "var(--radius-md)",
          boxShadow: shadow,
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
      </div>
    </div>
  );
}
