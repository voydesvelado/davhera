const SHADOWS = ["--shadow-sm", "--shadow-md", "--shadow-lg", "--shadow-xl"] as const;

export function ShadowSamples() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "var(--space-5)",
        padding: "var(--space-8) var(--space-5)",
      }}
    >
      {SHADOWS.map((token) => (
        <div
          key={token}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-3)" }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "140px",
              height: "90px",
              background: "var(--bg-raised)",
              border: "1px solid var(--rule)",
              borderRadius: "var(--radius-md)",
              boxShadow: `var(${token})`,
            }}
            aria-hidden
          />
          <span
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "var(--text-xs)",
              color: "var(--ink)",
            }}
          >
            {token}
          </span>
        </div>
      ))}
    </div>
  );
}
