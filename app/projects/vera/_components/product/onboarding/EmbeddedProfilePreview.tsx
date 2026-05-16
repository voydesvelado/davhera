"use client";

interface EmbeddedProfilePreviewProps {
  src: string;
}

export function EmbeddedProfilePreview({ src }: EmbeddedProfilePreviewProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 640,
        margin: "0 auto",
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        overflow: "hidden",
      }}
    >
      <iframe
        src={src}
        title="Vista previa de la página pública"
        style={{
          width: "100%",
          height: 480,
          border: "none",
          display: "block",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 64,
          background: "linear-gradient(to bottom, color-mix(in oklch, var(--bg) 0%, transparent), var(--bg))",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
