const ROWS = [
  { service: "Consulta inicial",     duration: "60 min", price: "$1,200 MXN" },
  { service: "Sesión de seguimiento", duration: "45 min", price: "$900 MXN" },
  { service: "Valoración rápida",     duration: "20 min", price: "$500 MXN" },
];

export function MonoSample() {
  return (
    <div
      style={{
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-5)",
        fontFamily: "var(--font-geist-mono), monospace",
        fontFeatureSettings: '"tnum" 1',
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto auto",
          gap: "var(--space-5)",
          paddingBottom: "var(--space-3)",
          borderBottom: "1px solid var(--rule-faint)",
          fontSize: "var(--text-xs)",
          textTransform: "uppercase",
          letterSpacing: "var(--tracking-wider)",
          color: "var(--muted)",
        }}
      >
        <span>Servicio</span>
        <span style={{ textAlign: "right" }}>Duración</span>
        <span style={{ textAlign: "right" }}>Precio</span>
      </div>
      {ROWS.map((r) => (
        <div
          key={r.service}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto",
            gap: "var(--space-5)",
            padding: "var(--space-3) 0",
            borderBottom: "1px solid var(--rule-faint)",
            fontSize: "var(--text-sm)",
            color: "var(--ink)",
          }}
        >
          <span style={{ fontFamily: "var(--font-geist), sans-serif" }}>{r.service}</span>
          <span style={{ textAlign: "right", color: "var(--ink-soft)" }}>{r.duration}</span>
          <span style={{ textAlign: "right" }}>{r.price}</span>
        </div>
      ))}
    </div>
  );
}
