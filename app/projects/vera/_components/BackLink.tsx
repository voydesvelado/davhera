import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

interface BackLinkProps {
  href: string;
  children: ReactNode;
}

export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontFamily: "var(--font-fraunces), serif",
        fontVariationSettings: '"opsz" 9, "SOFT" 100',
        fontStyle: "italic",
        fontSize: "13px",
        color: "var(--muted)",
        textDecoration: "none",
        marginBottom: "var(--space-8)",
      }}
    >
      <ArrowLeft size={14} strokeWidth={1.5} />
      {children}
    </Link>
  );
}
