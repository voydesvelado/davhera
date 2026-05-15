interface ColorSwatchProps {
  token: string;
  hex: string;
  /** Whether the value lives in product or editorial mode. */
  mode?: "editorial" | "product";
}

export function ColorSwatch({ token, hex, mode = "editorial" }: ColorSwatchProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--rule-soft)",
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          background: hex,
          height: "120px",
          borderBottom: "1px solid var(--rule-soft)",
        }}
        aria-label={`Swatch for ${token}`}
      />
      <div
        style={{
          padding: "var(--space-3) var(--space-4)",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
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
          {hex}
        </span>
        <span
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontVariationSettings: '"opsz" 9, "SOFT" 0',
            fontSize: "9.5px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginTop: "2px",
          }}
        >
          {mode}
        </span>
      </div>
    </div>
  );
}
