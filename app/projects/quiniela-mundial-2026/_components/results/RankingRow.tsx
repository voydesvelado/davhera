"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Avatar } from "./Avatar";
import type { Player } from "../../_data/mockResults";

interface RankingRowProps {
  rank: number;
  player: Player;
  index: number;
}

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

function RankingRowImpl({ rank, player, index }: RankingRowProps) {
  const reduced = useReducedMotion();
  const isUser = !!player.isCurrentUser;

  const trendNode = (() => {
    if (player.trend === "up") {
      return <span className="text-stadium-pitch">▲{player.change}</span>;
    }
    if (player.trend === "down") {
      return <span className="text-stadium-coral">▼{player.change}</span>;
    }
    return <span className="text-stadium-text-muted">–</span>;
  })();

  return (
    <motion.li
      role="listitem"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: reduced ? 0 : index * 0.04, ease: "easeOut" }}
      className={`flex items-center gap-3 px-4 py-3 transition-colors duration-150 ${
        isUser
          ? "rounded-[10px] border bg-stadium-pitch-glow"
          : "border-b border-stadium-border-subtle hover:bg-stadium-surface-hover"
      }`}
      style={{
        borderColor: isUser ? "rgb(0 230 118 / 0.27)" : undefined,
      }}
    >
      <span
        aria-hidden="true"
        className="w-7 text-center font-mono text-[13px] font-semibold text-stadium-text-muted"
      >
        {MEDALS[rank] ? <span className="text-[20px]">{MEDALS[rank]}</span> : `#${rank}`}
      </span>

      <Avatar initials={player.initials} color={player.color} size={32} highlighted={isUser} />

      <div className="flex flex-1 items-baseline gap-1.5 truncate">
        <span
          className={`truncate text-[14px] ${isUser ? "font-bold text-stadium-text-primary" : "font-medium text-stadium-text-primary"}`}
        >
          {player.name}
        </span>
        {isUser && (
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-stadium-pitch">
            (tú)
          </span>
        )}
      </div>

      <span className="w-9 text-center text-[12px] font-semibold tabular-nums">{trendNode}</span>

      <span className="flex shrink-0 items-baseline justify-end gap-1" style={{ minWidth: 60 }}>
        <span className="font-mono text-[16px] font-extrabold tabular-nums text-stadium-text-primary">
          {player.points}
        </span>
        <span className="text-[10px] font-medium text-stadium-text-muted">pts</span>
      </span>
    </motion.li>
  );
}

export const RankingRow = memo(RankingRowImpl);
