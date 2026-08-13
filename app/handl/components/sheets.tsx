"use client";

import { motion } from "framer-motion";
import s from "../handl.module.css";
import { breakdownMath, money, type Provider } from "../data";
import type { Nav } from "./types";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/* ==========================================================================
 * 5.7 breakdown sheet
 * ========================================================================== */
export function BreakdownSheet({
  provider,
  nav,
}: {
  provider: Provider;
  nav: Nav;
}) {
  const m = breakdownMath(provider);
  const [lo, hi] = provider.estimate ?? [0, 0];

  const rows: { l: string; r: string; whisper?: string; total?: boolean }[] = [
    { l: "Contracted rate here", r: `$${money(m.contracted)}`, whisper: "the price your insurer already negotiated" },
    { l: "Remaining deductible", r: `$${money(m.remaining)}`, whisper: "you pay this part first" },
    { l: `Plan then covers ${m.coinsurancePct}% of`, r: `$${money(m.planBase)}` },
    { l: "Your 15% share", r: `≈ $${money(m.yourShare)}` },
    { l: "Your total", r: `$${money(lo)} – $${money(hi)}`, total: true },
  ];

  return (
    <>
      <motion.div
        className={s.dim}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={nav.closeSheet}
      />
      <motion.div
        className={s.sheet}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.32, ease: EASE_OUT }}
      >
        <div className={s.grabber} />
        <div className={s.sheetTitle}>How we got this number.</div>

        <div className={s.card} style={{ marginTop: 0 }}>
          {rows.map((row, i) => (
            <motion.div
              key={row.l}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i + 0.1, duration: 0.25 }}
            >
              {i === 1 && <div className={s.divider} />}
              {i === 4 && <div className={s.divider} />}
              <div className={`${s.ledgerRow} ${row.total ? s.total : ""}`}>
                <span className="l">
                  {row.l}
                  {row.whisper && (
                    <span className={s.whisper}>{row.whisper}</span>
                  )}
                </span>
                <span className="r">{row.r}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className={s.card}>
          <p className={s.whisper}>
            <strong style={{ color: "var(--ink)", fontWeight: 600 }}>
              What could move it:
            </strong>{" "}
            anesthesia billed separately, or additional findings. Both already
            inside the range.
          </p>
        </div>

        <p className={s.footnote}>
          These are your plan's own numbers, applied to your situation. Nothing
          here is an average or a guess.
        </p>
      </motion.div>
    </>
  );
}

/* ==========================================================================
 * Ranking sheet (options)
 * ========================================================================== */
export function RankingSheet({ nav }: { nav: Nav }) {
  return (
    <>
      <motion.div
        className={s.dim}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={nav.closeSheet}
      />
      <motion.div
        className={s.sheet}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.32, ease: EASE_OUT }}
      >
        <div className={s.grabber} />
        <div className={s.sheetTitle}>How we rank providers</div>
        <p className={s.whisper} style={{ fontSize: 14 }}>
          We rank by outcomes for this specific procedure, cost against the
          local typical, and distance. Price alone never decides the order.
        </p>
      </motion.div>
    </>
  );
}
