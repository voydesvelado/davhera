const RADII = [
  { token: "--radius-xs", value: "4px" },
  { token: "--radius-sm", value: "6px" },
  { token: "--radius-md", value: "8px" },
  { token: "--radius-lg", value: "12px" },
  { token: "--radius-xl", value: "16px" },
];

export function RadiusGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "var(--space-5)",
        padding: "var(--space-6) 0",
      }}
    >
      {RADII.map((r) => (
        <div
          key={r.token}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-3)" }}
        >
          <div
            aria-hidden
            style={{
              width: 72,
              height: 72,
              background: "var(--bg-raised)",
              border: "1px solid var(--rule)",
              borderRadius: r.value,
            }}
          />
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "2px" }}>
            <span
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "var(--text-xs)",
                color: "var(--ink)",
              }}
            >
              {r.token}
            </span>
            <span
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "var(--text-xs)",
                color: "var(--muted)",
              }}
            >
              {r.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
