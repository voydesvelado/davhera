const LAYERS = [
  { token: "--bg", label: "Canvas base" },
  { token: "--bg-sunken", label: "Sumergido" },
  { token: "--bg-raised", label: "Elevado" },
  { token: "--bg-overlay", label: "Flotante" },
];

export function SurfaceLayers() {
  return (
    <div
      style={{
        padding: "var(--space-6)",
        background: "var(--bg)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      {LAYERS.map((layer) => (
        <div
          key={layer.token}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-4)",
            padding: "var(--space-4) var(--space-5)",
            background: `var(${layer.token})`,
            border: "1px solid var(--rule)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "var(--text-sm)",
          }}
        >
          <span style={{ color: "var(--ink)" }}>{layer.token}</span>
          <span style={{ color: "var(--muted)", fontFamily: "var(--font-geist), sans-serif" }}>
            {layer.label}
          </span>
        </div>
      ))}
    </div>
  );
}
