"use client";

import { TrendChart } from "./TrendChart";
import { HistoryCard } from "./HistoryCard";
import { participationHistory } from "../../_data/mockResults";

export function HistoryScreen() {
  return (
    <div className="flex flex-col gap-5 px-4 pt-4 pb-24">
      <header className="px-1">
        <h1 className="text-[22px] font-bold text-stadium-text-primary">Mi historial</h1>
        <p className="mt-1 text-[13px] text-stadium-text-secondary">
          {participationHistory.length} partidos participados
        </p>
      </header>

      <TrendChart history={participationHistory} />

      <section>
        <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-stadium-text-muted">
          Partidos
        </p>
        <ul role="list" className="mt-3 flex flex-col gap-2">
          {participationHistory.map((m, i) => (
            <HistoryCard key={m.id} match={m} index={i} />
          ))}
        </ul>
      </section>
    </div>
  );
}
