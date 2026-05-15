export function Ornament() {
  return (
    <hr
      role="separator"
      aria-hidden
      style={{
        border: "none",
        textAlign: "center",
        margin: "var(--space-16) 0",
        height: 0,
      }}
    >
    </hr>
  );
}

/**
 * A centered three-dot ornament. We render an empty hr for semantic
 * "separator" plus a sibling span to draw the dots so a screen reader
 * sees a divider while sighted readers see the ornament.
 */
export function OrnamentRule() {
  return (
    <div
      role="separator"
      aria-hidden
      style={{
        margin: "var(--space-16) 0",
        textAlign: "center",
        color: "var(--muted)",
        fontFamily: "var(--font-fraunces), serif",
        fontVariationSettings: '"opsz" 144',
        fontSize: "14px",
        letterSpacing: "1em",
      }}
    >
      ·  ·  ·
    </div>
  );
}
