"use client";

import type { AccentColor } from "../../_data/mockResults";

interface AvatarProps {
  initials: string;
  size?: number;
  color: AccentColor;
  highlighted?: boolean;
}

const GRADIENTS: Record<AccentColor, string> = {
  pitch:
    "radial-gradient(circle at 30% 30%, rgb(0 230 118 / 0.45), rgb(0 230 118 / 0.12))",
  gold:
    "radial-gradient(circle at 30% 30%, rgb(255 215 64 / 0.45), rgb(255 215 64 / 0.12))",
  coral:
    "radial-gradient(circle at 30% 30%, rgb(255 82 82 / 0.45), rgb(255 82 82 / 0.12))",
  electric:
    "radial-gradient(circle at 30% 30%, rgb(68 138 255 / 0.45), rgb(68 138 255 / 0.12))",
};

export function Avatar({ initials, size = 32, color, highlighted = false }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-full text-stadium-text-primary font-bold"
      style={{
        width: size,
        height: size,
        background: GRADIENTS[color],
        fontSize: Math.round(size * 0.38),
        boxShadow: highlighted ? "0 0 0 2px var(--color-stadium-pitch)" : undefined,
      }}
    >
      {initials.slice(0, 2)}
    </span>
  );
}
