"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { UserScore } from "../../_data/mockResults";

interface ScoreHeroProps {
  userScore: UserScore;
}

function formatNumber(n: number) {
  return n.toLocaleString("es-MX");
}

export function ScoreHero({ userScore }: ScoreHeroProps) {
  const reduced = useReducedMotion();
  const { correct, total, points, position, previousPosition, totalParticipants } = userScore;

  const positionDelta = previousPosition - position;
  const isPerfect = correct === total;
  const numberColor = isPerfect ? "text-stadium-gold" : "text-stadium-pitch";
  const numberGlow = isPerfect ? "0 0 40px rgb(255 215 64 / 0.45)" : "0 0 30px rgb(0 230 118 / 0.35)";

  const trendLabel = (() => {
    if (positionDelta > 0) return { sign: "▲", value: positionDelta, color: "text-stadium-pitch" };
    if (positionDelta < 0) return { sign: "▼", value: -positionDelta, color: "text-stadium-coral" };
    return { sign: "–", value: 0, color: "text-stadium-text-muted" };
  })();

  return (
    <div className="flex flex-col items-center px-4 pt-6 pb-2 text-center">
      <div className="flex items-baseline gap-1">
        <motion.span
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: reduced ? 1 : [0.5, 1.12, 1] }}
          transition={
            reduced
              ? { duration: 0.2 }
              : { duration: 0.55, ease: [0.34, 1.56, 0.64, 1], times: [0, 0.6, 1] }
          }
          className={`font-mono text-[56px] font-black leading-none ${numberColor}`}
          style={{ textShadow: reduced ? undefined : numberGlow }}
        >
          {correct}
        </motion.span>
        <motion.span
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: reduced ? 0.05 : 0.25 }}
          className="font-mono text-[28px] font-medium text-stadium-text-muted"
        >
          /{total}
        </motion.span>
      </div>
      <motion.p
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: reduced ? 0.05 : 0.3 }}
        className="mt-1 text-[15px] font-medium text-stadium-text-secondary"
      >
        {isPerfect ? "¡puntaje perfecto!" : "aciertos"}
      </motion.p>

      <motion.span
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: reduced ? 0.1 : 0.45, ease: [0.34, 1.56, 0.64, 1] }}
        className={`mt-3 inline-flex items-center rounded-full px-4 py-1 font-mono text-[16px] font-bold ${
          isPerfect ? "bg-stadium-gold-glow text-stadium-gold" : "bg-stadium-pitch-glow text-stadium-pitch"
        }`}
      >
        +{points} pts
      </motion.span>

      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: reduced ? 0.1 : 0.6 }}
        className="mt-4 flex flex-col items-center gap-0.5"
      >
        <div className="flex items-baseline gap-2">
          <span className="text-[13px] font-medium text-stadium-text-secondary">Posición</span>
          <span className="font-mono text-[22px] font-extrabold tabular-nums text-stadium-text-primary">
            #{position}
          </span>
          <span className={`text-[15px] font-bold ${trendLabel.color}`}>
            {trendLabel.sign}
            {trendLabel.value > 0 ? trendLabel.value : ""}
          </span>
        </div>
        <span className="text-[11px] text-stadium-text-muted">
          de {formatNumber(totalParticipants)} participantes
        </span>
      </motion.div>
    </div>
  );
}
