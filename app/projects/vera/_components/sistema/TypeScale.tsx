const SCALE: Array<{ token: string; px: number; sample: string }> = [
  { token: "--text-2xs", px: 11, sample: "Etiqueta o atajo de teclado" },
  { token: "--text-xs",  px: 12, sample: "Etiqueta de sección · uppercase" },
  { token: "--text-sm",  px: 13, sample: "Texto terciario" },
  { token: "--text-base",px: 14, sample: "Cuerpo del producto por defecto" },
  { token: "--text-md",  px: 15, sample: "Cuerpo ligeramente enfatizado" },
  { token: "--text-lg",  px: 16, sample: "Apertura · UI prominente" },
  { token: "--text-xl",  px: 18, sample: "h5 · título de tarjeta" },
  { token: "--text-2xl", px: 22, sample: "h4" },
  { token: "--text-3xl", px: 28, sample: "h3" },
  { token: "--text-4xl", px: 36, sample: "h2" },
  { token: "--text-5xl", px: 48, sample: "h1" },
  { token: "--text-6xl", px: 64, sample: "Hero" },
  { token: "--text-7xl", px: 80, sample: "Vera" },
];

export function TypeScale() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {SCALE.map((row) => (
        <div
          key={row.token}
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(120px, 160px) 60px 1fr",
            gap: "var(--space-4)",
            padding: "var(--space-4) 0",
            borderBottom: "1px solid var(--rule-faint)",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "var(--text-xs)",
              color: "var(--ink)",
            }}
          >
            {row.token}
          </span>
          <span
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "var(--text-xs)",
              color: "var(--muted)",
            }}
          >
            {row.px}px
          </span>
          <span
            style={{
              fontSize: `${row.px}px`,
              fontWeight: row.px >= 36 ? 600 : 400,
              letterSpacing: row.px >= 48 ? "var(--tracking-tight)" : "var(--tracking-normal)",
              lineHeight: row.px >= 36 ? 1.1 : 1.4,
              color: "var(--ink)",
              fontFamily: "var(--font-geist), sans-serif",
            }}
          >
            {row.sample}
          </span>
        </div>
      ))}
    </div>
  );
}
