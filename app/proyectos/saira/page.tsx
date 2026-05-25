// Visual check de tokens y fuentes (M2).
// Se reemplaza en M4/M7 cuando entren i18n y Hero.

export default function SairaTokenCheck() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "var(--space-16) var(--space-6)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--saira-font-mono)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--ink-muted)",
          marginBottom: "var(--space-4)",
        }}
      >
        Saira · M2 token check
      </p>

      <h1
        style={{
          fontFamily: "var(--saira-font-display)",
          fontSize: "var(--text-5xl)",
          fontVariationSettings: "'opsz' 144",
          marginBottom: "var(--space-6)",
        }}
      >
        Aventuras autênticas no Rio
      </h1>

      <p
        style={{
          fontFamily: "var(--saira-font-body)",
          fontSize: "var(--text-lg)",
          color: "var(--ink-soft)",
          lineHeight: 1.5,
          marginBottom: "var(--space-12)",
        }}
      >
        Trilhas, cascatas e travessias guiadas por quem conhece a Mata
        Atlântica de perto. Reserva direto, sem intermediários.
      </p>

      <div style={{ display: "flex", gap: "var(--space-4)" }}>
        <Swatch label="moss" color="var(--moss)" />
        <Swatch label="jade" color="var(--jade)" />
        <Swatch label="terracotta" color="var(--terracotta)" />
        <Swatch label="ink" color="var(--ink)" />
        <Swatch label="surface-deep" color="var(--surface-deep)" />
      </div>
    </main>
  );
}

function Swatch({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: 64,
          height: 64,
          background: color,
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--line)",
          marginBottom: "var(--space-2)",
        }}
      />
      <span
        style={{
          fontFamily: "var(--saira-font-mono)",
          fontSize: "var(--text-2xs)",
          color: "var(--ink-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </span>
    </div>
  );
}
