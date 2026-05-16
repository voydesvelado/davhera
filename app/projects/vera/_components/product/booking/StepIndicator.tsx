interface StepIndicatorProps {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontSize: "var(--text-2xs)",
        fontWeight: 500,
        letterSpacing: "var(--tracking-wider)",
        textTransform: "uppercase",
        color: "var(--muted)",
      }}
    >
      <span style={{ fontFeatureSettings: '"tnum" 1' }}>
        Paso {current} de {total}
      </span>
      <span style={{ display: "flex", gap: 3 }}>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            style={{
              width: 16,
              height: 2,
              borderRadius: 1,
              background: i < current ? "var(--accent)" : "var(--rule)",
              transition: "background var(--dur-base) var(--ease-snap)",
            }}
          />
        ))}
      </span>
    </div>
  );
}
