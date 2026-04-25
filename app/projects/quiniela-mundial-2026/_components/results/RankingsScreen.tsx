"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RankingList } from "./RankingList";
import { rankingData } from "../../_data/mockResults";

type Segment = "general" | "group";

function formatNumber(n: number) {
  return n.toLocaleString("es-MX");
}

export function RankingsScreen() {
  const reduced = useReducedMotion();
  const [segment, setSegment] = useState<Segment>("general");

  const userPosition = segment === "general" ? 42 : 2;
  const userTotal = segment === "general" ? rankingData.general.total : rankingData.group.members;
  const userTrendValue = segment === "general" ? 5 : 2;

  return (
    <div className="flex flex-col gap-5 px-4 pt-4 pb-24">
      <header>
        <h1 className="text-[22px] font-bold text-stadium-text-primary">Rankings</h1>
      </header>

      {/* Segmented control */}
      <div
        role="tablist"
        aria-label="Tipo de ranking"
        className="flex rounded-[14px] bg-stadium-surface-elevated p-1"
      >
        {(["general", "group"] as const).map((seg) => {
          const active = seg === segment;
          return (
            <button
              key={seg}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSegment(seg)}
              className={`flex-1 cursor-pointer rounded-[10px] px-3 py-2 text-[13px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch ${
                active
                  ? "bg-stadium-pitch text-stadium-text-inverse"
                  : "text-stadium-text-secondary hover:text-stadium-text-primary"
              }`}
            >
              {seg === "general" ? "General" : "Mi grupo"}
            </button>
          );
        })}
      </div>

      {/* User position card */}
      <motion.section
        key={segment}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        aria-label="Tu posición"
        className="relative overflow-hidden rounded-[10px] px-4 py-3.5"
        style={{
          background:
            "linear-gradient(90deg, rgb(0 230 118 / 0.15) 0%, rgb(0 230 118 / 0) 100%)",
          borderLeft: "3px solid var(--color-stadium-pitch)",
        }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-stadium-text-muted">
          Tu posición
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-mono text-[28px] font-extrabold text-stadium-text-primary">
            #{userPosition}
          </span>
          <span className="text-[13px] text-stadium-text-secondary">
            de {formatNumber(userTotal)}
          </span>
        </div>
        <p className="mt-1 text-[13px] font-semibold text-stadium-pitch">
          ▲{userTrendValue} posiciones
        </p>
      </motion.section>

      {/* Group header */}
      {segment === "group" && (
        <div className="px-1">
          <p className="text-[15px] font-bold text-stadium-text-primary">{rankingData.group.name}</p>
          <p className="text-[13px] text-stadium-text-muted">{rankingData.group.members} miembros</p>
        </div>
      )}

      {/* List */}
      {segment === "general" ? (
        <RankingList
          top={rankingData.general.top}
          aroundUser={rankingData.general.aroundUser}
          title="Ranking general"
          subtitle={`${formatNumber(rankingData.general.total)} participantes`}
        />
      ) : (
        <RankingList top={rankingData.group.data} title="Ranking del grupo" />
      )}
    </div>
  );
}
