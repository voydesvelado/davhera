interface SpacingBarProps {
  token: string;
  px: number;
}

export function SpacingBar({ token, px }: SpacingBarProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "140px 70px 1fr",
        gap: "var(--space-5)",
        padding: "var(--space-3) 0",
        borderBottom: "1px solid var(--rule-soft)",
        alignItems: "center",
        fontFamily: "var(--font-mono-vera), monospace",
        fontSize: "12px",
      }}
    >
      <span style={{ color: "var(--ink)" }}>{token}</span>
      <span style={{ color: "var(--muted)" }}>{px}px</span>
      <span
        aria-hidden
        style={{
          display: "block",
          height: "6px",
          width: `${px}px`,
          maxWidth: "100%",
          background: "var(--accent)",
        }}
      />
    </div>
  );
}
