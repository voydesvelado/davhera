const SPACES: Array<{ token: string; px: number }> = [
  { token: "--space-1",   px: 4 },
  { token: "--space-2",   px: 8 },
  { token: "--space-3",   px: 12 },
  { token: "--space-4",   px: 16 },
  { token: "--space-5",   px: 20 },
  { token: "--space-6",   px: 24 },
  { token: "--space-8",   px: 32 },
  { token: "--space-10",  px: 40 },
  { token: "--space-12",  px: 48 },
  { token: "--space-16",  px: 64 },
  { token: "--space-20",  px: 80 },
  { token: "--space-24",  px: 96 },
];

export function SpacingBars() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {SPACES.map((row) => (
        <div
          key={row.token}
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(120px, 140px) 60px 1fr",
            gap: "var(--space-4)",
            alignItems: "center",
            padding: "var(--space-3) 0",
            borderBottom: "1px solid var(--rule-faint)",
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "var(--text-xs)",
          }}
        >
          <span style={{ color: "var(--ink)" }}>{row.token}</span>
          <span style={{ color: "var(--muted)" }}>{row.px}px</span>
          <span
            aria-hidden
            style={{
              display: "block",
              height: "8px",
              width: `${row.px}px`,
              maxWidth: "100%",
              background: "var(--accent)",
              borderRadius: "var(--radius-xs)",
            }}
          />
        </div>
      ))}
    </div>
  );
}
