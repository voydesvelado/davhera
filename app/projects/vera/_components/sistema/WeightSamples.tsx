const WEIGHTS = [
  { value: 400, label: "Regular" },
  { value: 500, label: "Medium" },
  { value: 600, label: "Semibold" },
  { value: 700, label: "Bold" },
] as const;

export function WeightSamples() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {WEIGHTS.map((w) => (
        <div
          key={w.value}
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(120px, 160px) 1fr",
            gap: "var(--space-4)",
            padding: "var(--space-4) 0",
            borderBottom: "1px solid var(--rule-faint)",
            alignItems: "baseline",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "var(--text-xs)",
                color: "var(--ink)",
              }}
            >
              {w.value}
            </span>
            <span
              style={{
                fontFamily: "var(--font-geist), sans-serif",
                fontSize: "var(--text-xs)",
                color: "var(--muted)",
              }}
            >
              {w.label}
            </span>
          </div>
          <span
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: w.value,
              color: "var(--ink)",
              letterSpacing: "var(--tracking-snug)",
            }}
          >
            Aa Geist Sans 0123
          </span>
        </div>
      ))}
    </div>
  );
}
