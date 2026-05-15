"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

interface TitleParts {
  /** Text before the italic emphasis. */
  before: string;
  /** Italic SOFT-100 --accent emphasis. */
  emphasis: string;
  /** Text after the emphasis. */
  after?: string;
}

interface EditorialCoverProps {
  metaLeft: ReactNode;
  metaRight: ReactNode;
  eyebrow: ReactNode;
  /** Either a plain string (no emphasis) or a TitleParts breakdown. */
  title: string | TitleParts;
  deck: ReactNode;
  footMeta: ReactNode;
  /** Optional line breaks rendered inside the title — array of segments. */
  titleLines?: Array<string | TitleParts>;
}

/**
 * The editorial cover block. Used at the top of /, /manifesto, /sistema.
 * Pattern mirrors the cover in design-system.md §15.
 */
export function EditorialCover({
  metaLeft,
  metaRight,
  eyebrow,
  title,
  deck,
  footMeta,
  titleLines,
}: EditorialCoverProps) {
  const prefersReducedMotion = useReducedMotion();

  const initial = prefersReducedMotion ? false : { opacity: 0, y: 8 };
  const animate = prefersReducedMotion ? undefined : { opacity: 1, y: 0 };
  const transition = { duration: 0.4, ease: [0.2, 0, 0, 1] as const };

  const renderTitleSegment = (segment: string | TitleParts) => {
    if (typeof segment === "string") return segment;
    return (
      <>
        {segment.before}
        <span
          style={{
            fontVariationSettings: '"opsz" 144, "SOFT" 100',
            fontStyle: "italic",
            fontWeight: 320,
            color: "var(--accent)",
          }}
        >
          {segment.emphasis}
        </span>
        {segment.after ?? ""}
      </>
    );
  };

  return (
    <motion.header
      initial={initial}
      animate={animate}
      transition={transition}
      style={{
        minHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingTop: "var(--space-10)",
        paddingBottom: "var(--space-12)",
        borderBottom: "1px solid var(--rule)",
        marginBottom: "var(--space-20)",
      }}
    >
      {/* Top meta */}
      <div
        style={{
          fontFamily: "var(--font-fraunces), serif",
          fontVariationSettings: '"opsz" 9, "SOFT" 100',
          fontWeight: 500,
          fontSize: "11px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--muted)",
          display: "flex",
          justifyContent: "space-between",
          gap: "var(--space-6)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>{metaLeft}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "right" }}>
          {metaRight}
        </div>
      </div>

      {/* Title block */}
      <div style={{ marginTop: "var(--space-20)", marginBottom: "var(--space-12)" }}>
        <div style={{ marginBottom: "var(--space-8)" }}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontVariationSettings: '"opsz" 144, "SOFT" 30',
            fontWeight: 360,
            fontSize: "clamp(44px, 9vw, 76px)",
            lineHeight: 0.98,
            letterSpacing: "-0.025em",
            margin: "0 0 var(--space-7) 0",
            color: "var(--ink)",
          }}
        >
          {titleLines
            ? titleLines.map((seg, idx) => (
                <span key={idx} style={{ display: "block" }}>
                  {renderTitleSegment(seg)}
                </span>
              ))
            : renderTitleSegment(title)}
        </h1>

        <p
          style={{
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontVariationSettings: '"opsz" 24',
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "22px",
            lineHeight: 1.4,
            color: "var(--ink-soft)",
            maxWidth: "540px",
            margin: 0,
          }}
        >
          {deck}
        </p>
      </div>

      {/* Foot meta */}
      <div
        style={{
          fontFamily: "var(--font-fraunces), serif",
          fontVariationSettings: '"opsz" 9',
          fontSize: "13px",
          color: "var(--muted)",
          fontStyle: "italic",
          borderTop: "1px solid var(--rule)",
          paddingTop: "var(--space-5)",
        }}
      >
        {footMeta}
      </div>
    </motion.header>
  );
}
