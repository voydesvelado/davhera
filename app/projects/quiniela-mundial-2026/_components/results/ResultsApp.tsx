"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BottomNav, type ResultsTab } from "./BottomNav";
import { ResultsScreen } from "./ResultsScreen";
import { RankingsScreen } from "./RankingsScreen";
import { HistoryScreen } from "./HistoryScreen";
import { MatchSelectionScreen } from "../matches/MatchSelectionScreen";

interface ResultsAppProps {
  initialTab?: ResultsTab;
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
            {tab === "matches" && (
              <MatchSelectionScreen
                onSelectMatch={() => {}}
                windowEndsAt={null}
                contentBottomClass="pb-24"
              />
            )}
            {tab === "rankings" && <RankingsScreen />}
            {tab === "profile" && <HistoryScreen />}
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
