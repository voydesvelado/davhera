interface SpinnerProps {
  size?: number;
  color?: string;
}

export function Spinner({ size = 16, color = "currentColor" }: SpinnerProps) {
  return (
    <span
      aria-hidden
      className="vera-spinner"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px solid color-mix(in oklch, ${color} 25%, transparent)`,
        borderTopColor: color,
        animation: "vera-spin 0.7s linear infinite",
      }}
    >
      <style>{`
        @keyframes vera-spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .vera-spinner { animation-duration: 1.5s; }
        }
      `}</style>
    </span>
  );
}
