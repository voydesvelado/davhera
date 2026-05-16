import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "../../_lib/types";
import { formatPrice, formatDuration } from "../../_lib/date-format";

interface ServiceCardProps {
  service: Service;
  href: string;
}

export function ServiceCard({ service, href }: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="vera-service-card"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-4)",
        padding: "var(--space-5)",
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-md)",
        textDecoration: "none",
        color: "inherit",
        transition:
          "border-color var(--dur-quick) var(--ease-snap), transform var(--dur-instant) var(--ease-snap)",
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "var(--space-3)",
            flexWrap: "wrap",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "var(--text-xl)",
              fontWeight: 600,
              letterSpacing: "var(--tracking-normal)",
              color: "var(--ink)",
            }}
          >
            {service.name}
          </h3>
          <span
            style={{
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: "var(--text-sm)",
              color: "var(--muted)",
              fontFeatureSettings: '"tnum" 1',
              whiteSpace: "nowrap",
            }}
          >
            {formatDuration(service.durationMin)} · {formatPrice(service.priceMxn)}
          </span>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "var(--text-md)",
            lineHeight: "var(--leading-normal)",
            color: "var(--ink-soft)",
          }}
        >
          {service.description}
        </p>
      </div>
      <ArrowRight
        size={20}
        strokeWidth={1.5}
        color="var(--muted)"
        style={{ flexShrink: 0, marginTop: 4 }}
        className="vera-service-arrow"
      />
      <style>{`
        .vera-service-card:hover { border-color: var(--rule-strong); }
        .vera-service-card:hover .vera-service-arrow { color: var(--accent); }
        .vera-service-card:active { transform: scale(0.99); }
      `}</style>
    </Link>
  );
}
