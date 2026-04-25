"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { HeroCopy } from "../../_data/mockData";
import type { MatchStatus } from "../../_lib/types";

interface HeroSectionProps {
  copy: HeroCopy;
  status: MatchStatus;
}

function splitWithHighlight(headline: string, highlight?: string) {
  if (!highlight) return [{ word: headline, highlighted: false }];
  const parts: { word: string; highlighted: boolean }[] = [];
  const segments = headline.split(new RegExp(`(${highlight})`, "i"));
  for (const seg of segments) {
    if (!seg) continue;
    const isHi = seg.toLowerCase() === highlight.toLowerCase();
    for (const word of seg.split(/(\s+)/)) {
      if (!word) continue;
      if (/^\s+$/.test(word)) {
        const last = parts[parts.length - 1];
        if (last) last.word += word;
        continue;
      }
      parts.push({ word, highlighted: isHi });
    }
  }
  return parts;
}

export function HeroSection({ copy, status }: HeroSectionProps) {
  const reduced = useReducedMotion();
  const words = splitWithHighlight(copy.headline, copy.highlight);

  return (
    <section className="px-6 pt-4">
      {/* Branding row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col items-start gap-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stadium-text-muted">
              QUINIELA
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-stadium-pitch">
              MUNDIAL
            </span>
          </div>
          <span className="font-mono text-[11px] font-semibold tracking-[0.1em] text-stadium-text-muted">
            2026
          </span>
        </div>
        <span className="rounded-full bg-stadium-surface-elevated px-2.5 py-1 text-[10px] font-medium text-stadium-text-muted">
          FIFA World Cup 2026™
        </span>
      </div>

      {/* Headline */}
      <h1 className="mt-12 text-left text-[34px] font-black leading-[1.05] tracking-tight text-stadium-text-primary">
        {words.map((w, i) => (
          <motion.span
            key={`${w.word}-${i}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduced ? 0.18 : 0.42,
              delay: reduced ? 0 : i * 0.08,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            className={`inline-block ${w.highlighted ? "text-stadium-pitch" : "text-stadium-text-primary"}`}
          >
            {w.word}
          </motion.span>
        ))}
      </h1>

      {/* Subheadline */}
      <motion.p
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: reduced ? 0.05 : 0.4, ease: "easeOut" }}
        className="mt-3 max-w-[28ch] text-left text-[16px] font-medium leading-[1.5] text-stadium-text-secondary"
      >
        {copy.subheadline}
      </motion.p>

      {status === "halftime" && (
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-stadium-gold-glow px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-stadium-gold"
        >
          <span aria-hidden="true">⚽</span> Medio tiempo
        </motion.span>
      )}
      {status === "live" && (
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-stadium-coral-glow px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-stadium-coral"
        >
          <motion.span
            aria-hidden="true"
            className="block h-1.5 w-1.5 rounded-full bg-stadium-coral"
            animate={reduced ? undefined : { scale: [1, 1.7, 1], opacity: [1, 0, 1] }}
            transition={reduced ? undefined : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          En vivo
        </motion.span>
      )}
    </section>
  );
}
