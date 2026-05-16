import { Check } from "lucide-react";

interface CredentialBadgeProps {
  cedula: string;
}

export function CredentialBadge({ cedula }: CredentialBadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)",
        fontSize: "var(--text-sm)",
        color: "var(--ink-soft)",
        fontFeatureSettings: '"tnum" 1',
      }}
      title={`Cédula profesional ${cedula}, verificada con SEP`}
    >
      <Check size={14} strokeWidth={2} color="var(--success)" />
      Cédula {cedula}
    </span>
  );
}
