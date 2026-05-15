const REFS = [
  { name: "Linear",    take: "Superficies, motion snap, dark mode maestro. La UI premium del era actual." },
  { name: "Cal.com",   take: "Vocabulario moderno de booking. Prueba de que scheduling puede sentirse premium." },
  { name: "Cron",      take: "Precisión tipográfica a tamaños pequeños. Tratamiento glass de las superficies." },
  { name: "Mercury",   take: "Restraint de grado bancario. Paleta neutra confiada. Premium por tipografía." },
  { name: "Vercel",    take: "Pureza geométrica. Geist como tipografía workhorse en todo el producto." },
  { name: "Arc",       take: "Microinteracciones pulidas. El nivel de detalle que separa «diseñado» de «premium»." },
  { name: "Raycast",   take: "Command palette. Diseño keyboard-first. Timing de animación rápido." },
  { name: "One Medical", take: "UI de salud que no se siente clínica. Cálido sin ser blando." },
];

export function ReferenceTable() {
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
        className="vera-ref-header"
        style={{
          display: "grid",
          gridTemplateColumns: "160px 1fr",
          gap: "var(--space-4)",
          padding: "var(--space-3) var(--space-5)",
          background: "var(--bg-sunken)",
          borderBottom: "1px solid var(--rule)",
          fontSize: "var(--text-xs)",
          fontWeight: 500,
          letterSpacing: "var(--tracking-widest)",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        <span>Referencia</span>
        <span>Qué tomamos</span>
      </div>
      {REFS.map((ref, idx) => (
        <div
          key={ref.name}
          className="vera-ref-row"
          style={{
            display: "grid",
            gridTemplateColumns: "160px 1fr",
            gap: "var(--space-4)",
            padding: "var(--space-4) var(--space-5)",
            borderBottom: idx === REFS.length - 1 ? "none" : "1px solid var(--rule-faint)",
            fontSize: "var(--text-sm)",
            alignItems: "baseline",
          }}
        >
          <span style={{ color: "var(--ink)", fontWeight: 600 }}>{ref.name}</span>
          <span style={{ color: "var(--ink-soft)", lineHeight: 1.5 }}>{ref.take}</span>
        </div>
      ))}
      <style>{`
        @media (max-width: 600px) {
          .vera-ref-header { display: none; }
          .vera-ref-row {
            grid-template-columns: 1fr;
            gap: var(--space-1);
          }
        }
      `}</style>
    </div>
  );
}
