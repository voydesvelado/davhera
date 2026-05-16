import { Check, X } from "lucide-react";
import type { ReactNode } from "react";

type Status = "confirmed" | "cancelled";

interface ConfirmationHeaderProps {
  status: Status;
  title: ReactNode;
  subtitle?: ReactNode;
}

export function ConfirmationHeader({ status, title, subtitle }: ConfirmationHeaderProps) {
  const isConfirmed = status === "confirmed";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <span
        aria-hidden
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: isConfirmed
            ? "color-mix(in oklch, var(--success) 15%, transparent)"
            : "var(--bg-sunken)",
          color: isConfirmed ? "var(--success)" : "var(--muted)",
        }}
      >
        {isConfirmed ? (
          <Check size={20} strokeWidth={2.25} />
        ) : (
          <X size={20} strokeWidth={2.25} />
        )}
      </span>
      <h1
        style={{
          margin: 0,
          fontSize: "var(--text-3xl)",
          fontWeight: 600,
          letterSpacing: "var(--tracking-snug)",
          color: isConfirmed ? "var(--ink)" : "var(--ink-soft)",
          lineHeight: "var(--leading-tight)",
        }}
      >
        {title}
      </h1>
      {subtitle ? (
        <p
          style={{
            margin: 0,
            fontSize: "var(--text-md)",
            color: "var(--ink-soft)",
            lineHeight: "var(--leading-normal)",
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
