import { MapPin, Video } from "lucide-react";
import type { Location } from "../../_lib/types";

interface LocationCardProps {
  location: Location;
}

export function LocationCard({ location }: LocationCardProps) {
  if (location.type === "online") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "var(--space-3)",
          padding: "var(--space-5)",
          background: "var(--bg-raised)",
          border: "1px solid var(--rule)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <Video size={20} strokeWidth={1.5} color="var(--ink-soft)" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "var(--text-md)",
              fontWeight: 500,
              color: "var(--ink)",
            }}
          >
            Sesión en línea
          </p>
          <p
            style={{
              margin: "var(--space-1) 0 0",
              fontSize: "var(--text-sm)",
              color: "var(--ink-soft)",
            }}
          >
            Por {location.platform}. Te enviamos el enlace al confirmar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-3)",
        padding: "var(--space-5)",
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <MapPin size={20} strokeWidth={1.5} color="var(--ink-soft)" style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <p
          style={{
            margin: 0,
            fontSize: "var(--text-md)",
            color: "var(--ink)",
            whiteSpace: "pre-line",
            lineHeight: "var(--leading-snug)",
          }}
        >
          {location.address}
        </p>
        <a
          href={location.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-1)",
            marginTop: "var(--space-3)",
            fontSize: "var(--text-sm)",
            color: "var(--accent)",
            textDecoration: "none",
            fontWeight: 500,
          }}
          className="vera-maps-link"
        >
          Cómo llegar
          <span aria-hidden>→</span>
          <style>{`.vera-maps-link:hover { text-decoration: underline; }`}</style>
        </a>
      </div>
    </div>
  );
}
