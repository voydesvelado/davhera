import type { ReactNode } from "react";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger";

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  /** Small leading dot indicator. */
  dot?: boolean;
}

const TONES: Record<Tone, { fg: string; border: string; bg: string }> = {
  neutral: { fg: "var(--muted)", border: "var(--rule)", bg: "transparent" },
  accent:  { fg: "var(--accent)", border: "transparent", bg: "var(--accent-pale)" },
  success: { fg: "var(--success)", border: "var(--success)", bg: "transparent" },
  warning: { fg: "var(--warning)", border: "var(--warning)", bg: "transparent" },
  danger:  { fg: "var(--danger)", border: "var(--danger)", bg: "transparent" },
};

export function Badge({ children, tone = "neutral", dot = false }: BadgeProps) {
  const t = TONES[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1_5)",
        fontFamily: "var(--font-geist), system-ui, sans-serif",
        fontSize: "var(--text-xs)",
        fontWeight: 500,
        letterSpacing: "var(--tracking-wider)",
        textTransform: "uppercase",
        color: t.fg,
        background: t.bg,
        border: `1px solid ${t.border}`,
        padding: "3px 10px",
        borderRadius: "var(--radius-pill)",
        whiteSpace: "nowrap",
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
