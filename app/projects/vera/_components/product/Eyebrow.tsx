import type { ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
}

export function Eyebrow({ children }: EyebrowProps) {
  return (
    <p
      style={{
        margin: 0,
        fontSize: "var(--text-xs)",
        fontWeight: 500,
        letterSpacing: "var(--tracking-widest)",
        textTransform: "uppercase",
        color: "var(--muted)",
      }}
    >
      {children}
    </p>
  );
}
