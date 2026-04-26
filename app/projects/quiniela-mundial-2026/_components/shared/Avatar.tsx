"use client";

type AvatarColor = "pitch" | "gold" | "coral" | "electric";

interface AvatarProps {
  initials: string;
  size?: number;
  color?: AvatarColor;
  highlight?: boolean;
}

const GRADIENTS: Record<AvatarColor, string> = {
  pitch:
    "radial-gradient(circle at 30% 30%, rgb(0 230 118 / 0.40), rgb(0 230 118 / 0.15))",
  gold:
    "radial-gradient(circle at 30% 30%, rgb(255 215 64 / 0.40), rgb(255 215 64 / 0.15))",
  coral:
    "radial-gradient(circle at 30% 30%, rgb(255 82 82 / 0.40), rgb(255 82 82 / 0.15))",
  electric:
    "radial-gradient(circle at 30% 30%, rgb(68 138 255 / 0.40), rgb(68 138 255 / 0.15))",
};

export function Avatar({ initials, size = 32, color = "pitch", highlight = false }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-full font-bold text-stadium-text-primary"
      style={{
        width: size,
        height: size,
        background: GRADIENTS[color],
        fontFamily: "var(--font-display)",
        fontSize: Math.round(size * 0.4),
        boxShadow: highlight ? "0 0 0 2px var(--color-stadium-pitch)" : undefined,
      }}
    >
      {initials.slice(0, 2)}
    </span>
  );
}
