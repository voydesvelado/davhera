import type { ReactNode } from "react";

interface LedeProps {
  children: ReactNode;
  /** Show the drop cap on the first letter. Default true. */
  dropCap?: boolean;
}

/**
 * Lede paragraph — opens a section. Slightly larger Newsreader body
 * with optional Fraunces drop cap on the first letter.
 *
 * Uses ::first-letter which works in all evergreen browsers; clearfix
 * handles the float so subsequent paragraphs don't wrap into the cap.
 */
export function Lede({ children, dropCap = true }: LedeProps) {
  return (
    <>
      <style>{`
        .vera-lede {
          font-size: 22px;
          line-height: 1.45;
          color: var(--ink);
          font-weight: 360;
          font-family: var(--font-newsreader), Georgia, serif;
          margin: 0 0 var(--space-6) 0;
        }
        .vera-lede.has-dropcap::first-letter {
          font-family: var(--font-fraunces), Georgia, serif;
          font-variation-settings: "opsz" 144, "SOFT" 50;
          font-weight: 380;
          font-size: 76px;
          line-height: 0.85;
          float: left;
          margin: 6px 12px 0 0;
          color: var(--accent);
        }
        .vera-lede::after {
          content: '';
          display: table;
          clear: both;
        }
      `}</style>
      <p className={`vera-lede ${dropCap ? "has-dropcap" : ""}`}>{children}</p>
    </>
  );
}
