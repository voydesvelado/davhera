"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BottomNav, type ResultsTab } from "./BottomNav";
import { ResultsScreen } from "./ResultsScreen";
import { RankingsScreen } from "./RankingsScreen";
import { HistoryScreen } from "./HistoryScreen";

interface ResultsAppProps {
  initialTab?: ResultsTab;
}

function MatchesPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center px-6 pb-24">
      <div className="rounded-[14px] border border-stadium-border-subtle bg-stadium-surface px-6 py-8 text-center">
        <p className="text-[28px]" aria-hidden="true">📅</p>
        <p className="mt-2 text-[15px] font-medium text-stadium-text-secondary">
          Calendario de partidos
        </p>
        <p className="text-[13px] text-stadium-text-muted">Próximamente</p>
      </div>
    </div>
  );
}

export function ResultsApp({ initialTab = "today" }: ResultsAppProps) {
  const reduced = useReducedMotion();
  const [tab, setTab] = useState<ResultsTab>(initialTab);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Scroll the active tab's pane to top whenever the tab changes.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = 0;
  }, [tab]);

  const handleViewRankings = () => setTab("rankings");

  return (
    <div className="relative flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="min-h-full"
          >
            {tab === "today" && <ResultsScreen onViewRankings={handleViewRankings} />}
            {tab === "matches" && <MatchesPlaceholder />}
            {tab === "rankings" && <RankingsScreen />}
            {tab === "profile" && <HistoryScreen />}
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
