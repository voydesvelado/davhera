import type { ReactNode } from "react";

interface EditorialFooterProps {
  left: ReactNode;
  right: ReactNode;
}

export function EditorialFooter({ left, right }: EditorialFooterProps) {
  return (
    <footer
      style={{
        marginTop: "var(--space-24)",
        paddingTop: "var(--space-12)",
        borderTop: "1px solid var(--rule)",
        display: "flex",
        justifyContent: "space-between",
        gap: "var(--space-6)",
        flexWrap: "wrap",
        fontFamily: "var(--font-fraunces), serif",
        fontVariationSettings: '"opsz" 9, "SOFT" 100',
        fontStyle: "italic",
        fontSize: "13px",
        color: "var(--muted)",
      }}
    >
      <span>{left}</span>
      <span style={{ textAlign: "right" }}>{right}</span>
    </footer>
  );
}
