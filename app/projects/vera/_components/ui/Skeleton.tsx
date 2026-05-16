import type { CSSProperties } from "react";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: string;
  style?: CSSProperties;
  className?: string;
}

export function Skeleton({ width, height, radius, style, className }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={`vera-skeleton ${className ?? ""}`}
      style={{
        width: width ?? "100%",
        height: height ?? "1em",
        borderRadius: radius ?? "var(--radius-sm)",
        ...style,
      }}
    />
  );
}
