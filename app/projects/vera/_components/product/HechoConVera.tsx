import Link from "next/link";

export function HechoConVera() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: "var(--space-12)",
        paddingBottom: "var(--space-8)",
      }}
    >
      <Link
        href="/projects/vera"
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--muted)",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-1)",
        }}
        className="vera-hecho-con"
      >
        Hecho con <span style={{ fontWeight: 600, color: "var(--ink-soft)" }}>Vera</span>
        <span aria-hidden style={{ marginLeft: 2 }}>→</span>
        <style>{`
          .vera-hecho-con:hover { color: var(--ink); }
        `}</style>
      </Link>
    </div>
  );
}
