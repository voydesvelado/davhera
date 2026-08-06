import { useEffect, useState } from "react";

/**
 * M0 — pantalla de verificación del deploy. NO es la app.
 *
 * Existe para responder en un preview de Vercel las tres preguntas que deciden
 * si la arquitectura de §1 del plan funciona:
 *
 *   1. /prosa            → ¿sirve el SPA?
 *   2. /prosa/lo-que-sea → ¿el rewrite afterFiles lo manda al mismo index.html?
 *   3. /prosa/assets/*   → ¿los assets reales se sirven, o el rewrite se los come?
 *
 * La reemplaza la biblioteca en M2.
 */
export function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [assetOk, setAssetOk] = useState<boolean | null>(null);

  useEffect(() => {
    // El propio bundle es el asset a verificar: si esta URL devuelve JavaScript
    // y no HTML, el rewrite no se tragó /prosa/assets/*.
    const src = document.querySelector<HTMLScriptElement>('script[type="module"]')?.src;
    if (!src) return setAssetOk(false);
    fetch(src, { method: "HEAD" })
      .then((r) => setAssetOk(r.ok && !!r.headers.get("content-type")?.includes("javascript")))
      .catch(() => setAssetOk(false));
  }, []);

  const go = (to: string) => {
    window.history.pushState({}, "", to);
    setPath(window.location.pathname);
  };

  return (
    <main style={{ maxWidth: "68ch", margin: "0 auto", padding: "48px 24px" }}>
      <h1
        style={{
          fontSize: "var(--t-display)",
          fontWeight: 500,
          margin: "0 0 8px",
        }}
      >
        Prosa
      </h1>
      <p style={{ color: "var(--ink-2)", margin: "0 0 32px" }}>
        Verificación de deploy · M0. Todavía no hay biblioteca.
      </p>

      <dl style={{ display: "grid", gap: 16, margin: 0 }}>
        <Row label="Ruta servida" value={path} />
        <Row label="Base de assets" value={import.meta.env.BASE_URL} />
        <Row
          label="Assets sin interceptar"
          value={assetOk === null ? "comprobando…" : assetOk ? "sí" : "NO — revisar el rewrite"}
        />
      </dl>

      <p style={{ color: "var(--ink-2)", marginTop: 32 }}>
        Para probar el rewrite, abrí{" "}
        <a href="/prosa/ruta/inventada" style={{ color: "var(--ink-1)" }}>
          /prosa/ruta/inventada
        </a>{" "}
        directo en la barra de direcciones (recarga completa, no click). Debe verse esta misma
        pantalla con la ruta de arriba actualizada, no un 404 de davhera.com.
      </p>

      <button
        onClick={() => go("/prosa/ruta/inventada")}
        style={{
          font: "inherit",
          letterSpacing: "inherit",
          fontWeight: 500,
          color: "var(--bg)",
          background: "var(--ink-1)",
          border: "none",
          borderRadius: "var(--r-pill)",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Simular navegación del router
      </button>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12 }}>
      <dt style={{ fontSize: "var(--t-caption)", color: "var(--ink-3)" }}>{label}</dt>
      <dd style={{ margin: "2px 0 0", fontWeight: 500 }}>{value}</dd>
    </div>
  );
}
