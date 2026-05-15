import { PageShell } from "./_components/PageShell";
import { ThemeToggle } from "./_components/ui/ThemeToggle";

/**
 * Foundation placeholder — replaced by the real landing in M1.
 * Confirms tokens, fonts, theme toggle all wire up correctly.
 */
export default function VeraFoundationPlaceholder() {
  return (
    <PageShell width="content">
      <div
        style={{
          minHeight: "calc(100vh - 200px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "var(--space-8)",
          }}
        >
          <span
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 600,
              letterSpacing: "var(--tracking-snug)",
              color: "var(--ink)",
            }}
          >
            Vera
          </span>
          <ThemeToggle />
        </header>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "var(--space-4)",
            maxWidth: "560px",
          }}
        >
          <span
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              letterSpacing: "var(--tracking-widest)",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Vera · Proyecto en concepto
          </span>

          <h1
            style={{
              fontSize: "clamp(48px, 8vw, 64px)",
              fontWeight: 600,
              letterSpacing: "var(--tracking-tight)",
              lineHeight: 1.1,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            Migración completa.
          </h1>

          <p
            style={{
              fontSize: "var(--text-lg)",
              lineHeight: "var(--leading-normal)",
              color: "var(--muted)",
              margin: 0,
              maxWidth: "480px",
            }}
          >
            Reconstruyendo páginas. El landing, la página de sobre y el sistema de
            diseño se ensamblan en commits sucesivos.
          </p>

          <div
            style={{
              marginTop: "var(--space-6)",
              paddingTop: "var(--space-5)",
              borderTop: "1px solid var(--rule)",
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: "var(--text-xs)",
              color: "var(--muted)",
            }}
          >
            v0.3 · light + dark · /projects/vera
          </div>
        </div>
      </div>
    </PageShell>
  );
}
