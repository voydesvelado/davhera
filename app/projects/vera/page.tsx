import { PageShell } from "./_components/PageShell";

/**
 * Foundation placeholder. Proves tokens, fonts, grain overlay all work
 * end-to-end before the real landing page is built.
 */
export default function VeraFoundationPlaceholder() {
  return (
    <PageShell mode="editorial">
      <div
        style={{
          minHeight: "calc(100vh - 200px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "var(--space-24) 0",
          gap: "var(--space-8)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontVariationSettings: '"opsz" 9, "SOFT" 0',
            fontWeight: 600,
            fontSize: "12px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--accent)",
            paddingBottom: "6px",
            borderBottom: "1px solid var(--accent)",
            display: "inline-block",
            alignSelf: "flex-start",
          }}
        >
          Proyecto en concepto
        </div>

        <h1
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontVariationSettings: '"opsz" 144, "SOFT" 30',
            fontWeight: 360,
            fontSize: "clamp(56px, 11vw, 120px)",
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
            margin: 0,
            color: "var(--ink)",
          }}
        >
          Vera
          <span
            style={{
              fontVariationSettings: '"opsz" 144, "SOFT" 100',
              fontStyle: "italic",
              fontWeight: 320,
              color: "var(--accent)",
            }}
          >
            .
          </span>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "22px",
            lineHeight: 1.4,
            color: "var(--ink-soft)",
            maxWidth: "540px",
            margin: 0,
          }}
        >
          Foundation OK. Tokens, tipografía y atmósfera scoped bajo{" "}
          <code
            style={{
              fontFamily: "var(--font-mono-vera), monospace",
              fontSize: "0.86em",
              fontStyle: "normal",
              background: "var(--bg-2)",
              padding: "1px 6px",
              borderRadius: "3px",
              color: "var(--ink)",
            }}
          >
            .proj-vera
          </code>
          . La página de aterrizaje viene en el siguiente commit.
        </p>

        <div
          style={{
            marginTop: "var(--space-12)",
            paddingTop: "var(--space-5)",
            borderTop: "1px solid var(--rule)",
            fontFamily: "var(--font-fraunces), serif",
            fontVariationSettings: '"opsz" 9, "SOFT" 100',
            fontStyle: "italic",
            fontSize: "13px",
            color: "var(--muted)",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span>/projects/vera · foundation</span>
          <span>Rio de Janeiro · 2026</span>
        </div>
      </div>
    </PageShell>
  );
}
