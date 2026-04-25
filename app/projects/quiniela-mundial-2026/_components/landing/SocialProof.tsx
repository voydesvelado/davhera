"use client";

import { memo, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { FriendStub } from "../../_data/mockData";

interface SocialProofProps {
  activeParticipants: number;
  friends: FriendStub[];
  /** When false, the live counter freezes (e.g. for finished state). */
  live?: boolean;
}

const ACCENT_BG: Record<FriendStub["accent"], string> = {
  pitch: "bg-gradient-to-br from-stadium-pitch/40 to-stadium-pitch/10",
  electric: "bg-gradient-to-br from-stadium-electric/40 to-stadium-electric/10",
  gold: "bg-gradient-to-br from-stadium-gold/40 to-stadium-gold/10",
};

function formatNumber(n: number) {
  return n.toLocaleString("es-MX");
}

function SocialProofImpl({ activeParticipants, friends, live = true }: SocialProofProps) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(reduced ? activeParticipants : 0);
  const [flashKey, setFlashKey] = useState(0);

  // Count-up on mount. setState-in-effect is the right tool here — we're
  // syncing an animation frame loop into React state.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (reduced) {
      setCount(activeParticipants);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 1500;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * activeParticipants));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [activeParticipants, reduced]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Periodic micro-increments to suggest live activity
  const baseRef = useRef(activeParticipants);
  useEffect(() => {
    if (!live || reduced) return;
    let cancelled = false;
    const schedule = () => {
      const wait = 5_000 + Math.random() * 5_000;
      const id = window.setTimeout(() => {
        if (cancelled) return;
        baseRef.current += Math.floor(1 + Math.random() * 4);
        setCount(baseRef.current);
        setFlashKey((k) => k + 1);
        schedule();
      }, wait);
      return id;
    };
    const initialId = schedule();
    return () => {
      cancelled = true;
      window.clearTimeout(initialId);
    };
  }, [live, reduced]);

  const friendsLabel = (() => {
    if (friends.length === 0) return "";
    if (friends.length === 1) return `${friends[0].name} ya participó`;
    if (friends.length === 2) return `${friends[0].name} y ${friends[1].name} ya participaron`;
    if (friends.length === 3)
      return `${friends[0].name}, ${friends[1].name} y ${friends[2].name} ya participaron`;
    return `${friends[0].name}, ${friends[1].name} y ${friends.length - 2} más ya participaron`;
  })();

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: reduced ? 0 : 0.8, ease: "easeOut" }}
      className="mt-6 flex flex-col gap-3 px-6"
    >
      <div className="flex items-center gap-2">
        {live && (
          <motion.span
            aria-hidden="true"
            className="block h-2 w-2 rounded-full bg-stadium-pitch"
            animate={reduced ? undefined : { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
            transition={reduced ? undefined : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <motion.span
          key={flashKey}
          initial={flashKey === 0 ? false : { color: "#F1F5F9" }}
          animate={{ color: "#00E676" }}
          transition={{ duration: 0.3 }}
          className="font-mono text-[15px] font-bold tabular-nums text-stadium-pitch"
        >
          {formatNumber(count)}
        </motion.span>
        <span className="text-[14px] font-medium text-stadium-text-secondary">
          {live ? "personas participando ahora" : "personas participaron"}
        </span>
      </div>

      {friends.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex">
            {friends.slice(0, 3).map((f, i) => (
              <span
                key={f.name}
                aria-hidden="true"
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-stadium-surface text-[11px] font-bold text-stadium-text-primary ${ACCENT_BG[f.accent]}`}
                style={{ marginLeft: i === 0 ? 0 : -8 }}
              >
                {f.initials}
              </span>
            ))}
          </div>
          <span className="text-[13px] font-medium text-stadium-text-secondary">
            {friendsLabel}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export const SocialProof = memo(SocialProofImpl);
