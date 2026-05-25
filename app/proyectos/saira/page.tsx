import { tours, formatBRL, formatDuration } from "@/lib/saira";

// Verificación temporal de M2 (tokens) + M3 (mock data).
// Se reemplaza en M4 cuando entra el routing por locale.

export default function SairaTokenCheck() {
  return (
    <main
      style={{
        maxWidth: 980,
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
        Saira · M2–M3 check
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

      <div
        style={{
          display: "flex",
          gap: "var(--space-4)",
          marginBottom: "var(--space-16)",
        }}
      >
        <Swatch label="moss" color="var(--moss)" />
        <Swatch label="jade" color="var(--jade)" />
        <Swatch label="terracotta" color="var(--terracotta)" />
        <Swatch label="ink" color="var(--ink)" />
        <Swatch label="surface-deep" color="var(--surface-deep)" />
      </div>

      <h2
        style={{
          fontFamily: "var(--saira-font-display)",
          fontSize: "var(--text-2xl)",
          marginBottom: "var(--space-6)",
        }}
      >
        16 tours cargados
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "var(--text-sm)",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid var(--line)" }}>
            {["Slug", "Nombre", "Cat.", "Dificultad", "Duración", "Precio"].map(
              (h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "var(--space-3) var(--space-2)",
                    fontFamily: "var(--saira-font-mono)",
                    fontSize: "var(--text-xs)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--ink-muted)",
                  }}
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {tours.map((t) => (
            <tr
              key={t.slug}
              style={{ borderBottom: "1px solid var(--line-soft)" }}
            >
              <td
                style={{
                  padding: "var(--space-3) var(--space-2)",
                  fontFamily: "var(--saira-font-mono)",
                  color: "var(--ink-muted)",
                }}
              >
                {t.slug}
              </td>
              <td style={{ padding: "var(--space-3) var(--space-2)" }}>
                {t.name}
              </td>
              <td style={{ padding: "var(--space-3) var(--space-2)" }}>
                {t.category}
              </td>
              <td style={{ padding: "var(--space-3) var(--space-2)" }}>
                {t.difficulty}
              </td>
              <td style={{ padding: "var(--space-3) var(--space-2)" }}>
                {t.durationMinutes ? formatDuration(t.durationMinutes) : "—"}
              </td>
              <td style={{ padding: "var(--space-3) var(--space-2)" }}>
                {t.priceOnRequest
                  ? "Consultar"
                  : `${t.priceFromOnly ? "desde " : ""}${formatBRL(t.priceBRL)}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
