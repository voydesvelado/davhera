interface ColorSwatchProps {
  token: string;
  oklch: string;
  hex: string;
}

export function ColorSwatch({ token, oklch, hex }: ColorSwatchProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: `var(${token})`,
          height: "140px",
          borderBottom: "1px solid var(--rule)",
        }}
        aria-label={`Color swatch for ${token}`}
      />
      <div
        style={{
          padding: "var(--space-3) var(--space-4)",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          fontFamily: "var(--font-geist-mono), monospace",
        }}
      >
        <span style={{ fontSize: "var(--text-sm)", color: "var(--ink)" }}>{token}</span>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>{oklch}</span>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--ink-faint)" }}>{hex}</span>
      </div>
    </div>
  );
}
