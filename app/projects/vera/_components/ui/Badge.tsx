import type { ReactNode } from "react";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger";

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  /** Small leading dot indicator. */
  dot?: boolean;
}

const TONES: Record<Tone, { fg: string; border: string }> = {
  neutral: { fg: "var(--muted)", border: "var(--rule)" },
  accent: { fg: "var(--accent)", border: "var(--accent)" },
  success: { fg: "var(--success)", border: "var(--success)" },
  warning: { fg: "var(--warning)", border: "var(--warning)" },
  danger: { fg: "var(--danger)", border: "var(--danger)" },
};

export function Badge({ children, tone = "neutral", dot = false }: BadgeProps) {
  const t = TONES[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontFamily: "var(--font-fraunces), serif",
        fontVariationSettings: '"opsz" 9, "SOFT" 0',
        fontWeight: 600,
        fontSize: "10px",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: t.fg,
        border: `1px solid ${t.border}`,
        padding: "3px 10px",
        borderRadius: "var(--radius-pill)",
      }}
    >
      {dot ? (
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: t.fg,
          }}
        />
      ) : null}
      {children}
    </span>
  );
}
