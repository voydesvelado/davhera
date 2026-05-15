"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

interface MarketingHeroProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  body: ReactNode;
  actions?: ReactNode;
}

export function MarketingHero({ eyebrow, title, body, actions }: MarketingHeroProps) {
  const reduce = useReducedMotion();
  const initial = reduce ? false : { opacity: 0, y: 8 };
  const animate = reduce ? undefined : { opacity: 1, y: 0 };
  const transition = { duration: 0.4, ease: [0.32, 0.72, 0, 1] as const };

  return (
    <motion.section
      initial={initial}
      animate={animate}
      transition={transition}
      className="density-comfortable"
      style={{
        paddingTop: "var(--space-24)",
        paddingBottom: "var(--space-20)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
        maxWidth: "var(--max-content)",
      }}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}

      <h1
        style={{
          fontSize: "clamp(48px, 9vw, 80px)",
          fontWeight: 600,
          letterSpacing: "var(--tracking-tight)",
          lineHeight: 1.05,
          color: "var(--ink)",
          margin: 0,
          maxWidth: "16ch",
        }}
      >
        {title}
      </h1>

      <p
        style={{
          fontSize: "var(--text-lg)",
          lineHeight: "var(--leading-normal)",
          color: "var(--ink-soft)",
          maxWidth: "640px",
          margin: 0,
        }}
      >
        {body}
      </p>

      {actions ? (
        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            flexWrap: "wrap",
            marginTop: "var(--space-2)",
          }}
        >
          {actions}
        </div>
      ) : null}
    </motion.section>
  );
}
