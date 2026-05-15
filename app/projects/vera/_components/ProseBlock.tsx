import type { CSSProperties, ReactNode } from "react";

interface ProseBlockProps {
  children: ReactNode;
  /** Optional override for the prose color. */
  style?: CSSProperties;
}

/**
 * Editorial body wrapper. Sets the Newsreader serif voice and the right
 * paragraph rhythm without polluting the global tag selectors.
 */
export function ProseBlock({ children, style }: ProseBlockProps) {
  return (
    <div
      className="vera-prose"
      style={{
        fontFamily: "var(--font-newsreader), Georgia, serif",
        fontWeight: 380,
        fontSize: "19px",
        lineHeight: 1.55,
        color: "var(--ink-soft)",
        ...style,
      }}
    >
      <style>{`
        .vera-prose > p { margin: 0 0 22px; color: var(--ink-soft); }
        .vera-prose > p:last-child { margin-bottom: 0; }
        .vera-prose strong { font-weight: 600; color: var(--ink); }
        .vera-prose em, .vera-prose i { font-style: italic; }
        .vera-prose .lede {
          font-size: 22px;
          line-height: 1.45;
          color: var(--ink);
          font-weight: 360;
        }
        .vera-prose a {
          color: var(--accent);
          text-decoration: none;
          border-bottom: 1px solid var(--accent-soft);
        }
        .vera-prose a:hover { color: var(--accent-soft); }
      `}</style>
      {children}
    </div>
  );
}
