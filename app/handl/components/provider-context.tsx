"use client";

import { motion, useReducedMotion } from "framer-motion";
import s from "../handl.module.css";
import type { Provider } from "../data";
import { Avatar, EASE_OUT } from "./primitives";

/** "Dr. Adams" -> "A". Shared with the provider cards on the options screen. */
function initialOf(name: string) {
  return name.replace("Dr. ", "").slice(0, 1);
}

/** facility · distance · availability, skipping anything the provider lacks */
function contextLine(provider: Provider) {
  return [provider.facility, provider.distance, provider.availability]
    .filter(Boolean)
    .join(" · ");
}

/* ==========================================================================
 * ProviderContext — a breadcrumb with a face.
 *
 * Identity only: who she chose and why. No price (the anchor lives in the
 * breakdown ledger, one tap away) and no back arrow (the app bar owns that),
 * so nothing here competes with the range below it. Tappable, returns to
 * options, press feedback only.
 * ========================================================================== */
export function ProviderContext({
  provider,
  onBack,
  delay = 0,
}: {
  provider: Provider;
  onBack: () => void;
  /** Seconds. The strip enters third, after the money and the confidence row. */
  delay?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      className={s.pcontext}
      onClick={onBack}
      aria-label={`${provider.name}, back to options`}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.18 : 0.32, delay, ease: EASE_OUT }}
      // Press scale lives here, not in CSS: framer owns the inline transform,
      // so an :active { transform } rule would never win.
      whileTap={reduced ? undefined : { scale: 0.98 }}
    >
      <Avatar
        initials={initialOf(provider.name)}
        photo={provider.photo}
        size={32}
        radius={10}
        dark
      />
      <span className={s.pcontextText}>
        <span className={s.pcontextName}>{provider.name}</span>
        <span className={s.pcontextSub}>{contextLine(provider)}</span>
      </span>
      <span
        className={`${s.pcontextTag} ${provider.qualityTone === "ok" ? s.pcontextTagOk : s.pcontextTagLav}`}
      >
        {provider.quality}
      </span>
    </motion.button>
  );
}

/* ==========================================================================
 * ProviderMicroHeader — the math should never render anonymous.
 * One whisper-quiet line above the breakdown ledger.
 * ========================================================================== */
export function ProviderMicroHeader({ provider }: { provider: Provider }) {
  return (
    <div className={s.pmicro}>
      <Avatar
        initials={initialOf(provider.name)}
        photo={provider.photo}
        size={24}
        radius={8}
        dark
      />
      <span>{provider.name} · {provider.facility}</span>
    </div>
  );
}
