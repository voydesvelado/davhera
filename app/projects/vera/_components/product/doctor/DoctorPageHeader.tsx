import type { ReactNode } from "react";

interface DoctorPageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}

export function DoctorPageHeader({ title, subtitle, action }: DoctorPageHeaderProps) {
  return (
    <header
      className="vera-doc-header"
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "var(--space-4)",
        paddingTop: "var(--space-6)",
        paddingBottom: "var(--space-4)",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1
          className="vera-doc-title"
          style={{
            margin: 0,
            fontSize: "var(--text-2xl)",
            fontWeight: 600,
            letterSpacing: "var(--tracking-snug)",
            color: "var(--ink)",
            lineHeight: "var(--leading-tight)",
          }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            style={{
              margin: "var(--space-1) 0 0",
              fontSize: "var(--text-md)",
              color: "var(--ink-soft)",
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div style={{ flexShrink: 0 }}>{action}</div> : null}

      <style>{`
        @media (min-width: 768px) {
          .vera-doc-title { font-size: var(--text-3xl) !important; }
        }
      `}</style>
    </header>
  );
}
