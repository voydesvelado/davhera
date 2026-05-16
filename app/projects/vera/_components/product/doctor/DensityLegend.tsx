interface SwatchProps {
  bg: string;
  border?: string;
  label: string;
  hatched?: boolean;
}

function Swatch({ bg, border, label, hatched }: SwatchProps) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: 12,
          height: 12,
          background: bg,
          border: border ? `1px solid ${border}` : "none",
          borderRadius: 2,
          backgroundImage: hatched
            ? "repeating-linear-gradient(45deg, transparent 0 3px, var(--muted) 3px 4px)"
            : undefined,
        }}
      />
      <span style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>{label}</span>
    </span>
  );
}

export function DensityLegend() {
  return (
    <div
      style={{
        display: "flex",
        gap: "var(--space-4)",
        flexWrap: "wrap",
        justifyContent: "center",
        padding: "var(--space-4) 0",
      }}
    >
      <Swatch bg="var(--bg-raised)" border="var(--rule)" label="Disponible" />
      <Swatch bg="var(--accent-pale)" border="var(--accent)" label="Reservado" />
      <Swatch bg="var(--rule-faint)" hatched label="Bloqueado" />
      <Swatch bg="var(--bg-sunken)" label="Fuera de horario" />
    </div>
  );
}
