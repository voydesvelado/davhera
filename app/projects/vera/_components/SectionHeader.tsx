import type { ReactNode } from "react";

interface TitleParts {
  before: string;
  emphasis: string;
  after?: string;
}

interface SectionHeaderProps {
  /** "Sección I", "Sección II", etc. or any short label. */
  num: ReactNode;
  /** h2 contents — string for plain title, TitleParts for italic emphasis. */
  title: string | TitleParts;
  /** Anchor id for in-page navigation. */
  id?: string;
}

export function SectionHeader({ num, title, id }: SectionHeaderProps) {
  const renderTitle = () => {
    if (typeof title === "string") return title;
    return (
      <>
        {title.before}
        <span
          style={{
            fontVariationSettings: '"opsz" 72, "SOFT" 100',
            fontStyle: "italic",
            fontWeight: 340,
          }}
        >
          {title.emphasis}
        </span>
        {title.after ?? ""}
      </>
    );
  };

  return (
    <div
      id={id}
      style={{
        marginBottom: "var(--space-10)",
        paddingBottom: "var(--space-6)",
        borderBottom: "1px solid var(--rule)",
        scrollMarginTop: "var(--space-12)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-fraunces), serif",
          fontVariationSettings: '"opsz" 9, "SOFT" 100',
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "14px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: "var(--space-3)",
        }}
      >
        {num}
      </div>
      <h2
        style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontVariationSettings: '"opsz" 72, "SOFT" 50',
          fontWeight: 380,
          fontSize: "clamp(32px, 5.5vw, 44px)",
          lineHeight: 1.05,
          letterSpacing: "-0.015em",
          margin: 0,
          color: "var(--ink)",
        }}
      >
        {renderTitle()}
      </h2>
    </div>
  );
}
