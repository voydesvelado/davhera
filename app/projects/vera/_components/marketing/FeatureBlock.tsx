"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

interface FeatureBlockProps {
  eyebrow: ReactNode;
  title: ReactNode;
  body: ReactNode;
  visual: ReactNode;
  /** Optional supporting bullets shown beneath the body — kept short, ≤6 words each. */
  details?: ReactNode[];
  /** "left" puts text on the left (desktop); "right" reverses. */
  imageSide?: "left" | "right";
}

export function FeatureBlock({
  eyebrow,
  title,
  body,
  visual,
  details,
  imageSide = "right",
}: FeatureBlockProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] as const }}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "var(--space-8)",
        alignItems: "center",
      }}
      className={`vera-feature-block ${imageSide === "left" ? "vera-feature-image-left" : "vera-feature-image-right"}`}
    >
      <div
        className="vera-feature-text"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
          maxWidth: "480px",
        }}
      >
        <Eyebrow accent>{eyebrow}</Eyebrow>
        <h3
          style={{
            fontSize: "var(--text-3xl)",
            fontWeight: 600,
            letterSpacing: "var(--tracking-snug)",
            lineHeight: "var(--leading-snug)",
            color: "var(--ink)",
            margin: 0,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: "var(--text-md)",
            lineHeight: "var(--leading-normal)",
            color: "var(--ink-soft)",
            margin: 0,
          }}
        >
          {body}
        </p>
        {details && details.length > 0 ? (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "var(--space-2) 0 0 0",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
              borderTop: "1px solid var(--rule-faint)",
              paddingTop: "var(--space-4)",
            }}
          >
            {details.map((d, i) => (
              <li
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "var(--space-3)",
                  alignItems: "baseline",
                  fontSize: "var(--text-sm)",
                  lineHeight: "var(--leading-normal)",
                  color: "var(--ink-soft)",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "var(--text-2xs)",
                    color: "var(--accent)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="vera-feature-visual">{visual}</div>

      <style>{`
        @media (min-width: 900px) {
          .vera-feature-block {
            grid-template-columns: 1fr 1fr;
            gap: var(--space-16);
          }
          .vera-feature-image-left .vera-feature-text { order: 2; }
          .vera-feature-image-left .vera-feature-visual { order: 1; }
        }
      `}</style>
    </motion.div>
  );
}
