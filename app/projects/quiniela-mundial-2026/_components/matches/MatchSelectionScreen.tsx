"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { GroupFilter } from "./GroupFilter";
import { LiveMatchBanner } from "./LiveMatchBanner";
import { MatchSelectCard } from "./MatchSelectCard";
import {
  generateGroupMatches,
  highlightMatch,
  worldCupGroups,
  type GroupData,
  type SelectableMatch,
} from "../../_data/matchesData";

interface MatchSelectionScreenProps {
  onSelectMatch: (match: SelectableMatch) => void;
  userName?: string;
  windowEndsAt: number | null;
}

const STATUS_ORDER: Record<SelectableMatch["status"], number> = {
  live: 0,
  halftime: 1,
  upcoming: 2,
  finished: 3,
};

function liveBadge(group: GroupData): boolean {
  return group.id === highlightMatch.group;
}

function GroupSummaryCard({
  group,
  onSelect,
  index,
}: {
  group: GroupData;
  onSelect: (id: string) => void;
  index: number;
}) {
  const reduced = useReducedMotion();
  const showLiveBadge = liveBadge(group);
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(group.id)}
      whileHover={reduced ? undefined : { y: -1 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.03 }}
      className="flex flex-col rounded-[14px] border border-stadium-border-subtle bg-stadium-surface-elevated p-4 text-left hover:border-stadium-border hover:bg-stadium-surface-hover transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-midnight"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-stadium-text-primary">
          Grupo {group.id}
        </span>
        {showLiveBadge && (
          <span className="inline-flex items-center gap-1 rounded-full bg-stadium-coral-glow px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-stadium-coral">
            En vivo
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-row gap-1 text-xl">
        {group.teams.map((t) => (
          <span key={t.code} aria-label={t.name}>
            {t.flag}
          </span>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-stadium-text-muted">6 partidos</p>
    </motion.button>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <motion.div
      key={message}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.2 }}
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-30 mx-auto w-fit rounded-full border border-stadium-border bg-stadium-surface-elevated px-4 py-2 text-xs font-medium text-stadium-text-primary shadow-lg"
    >
      {message}
    </motion.div>
  );
}

export function MatchSelectionScreen({
  onSelectMatch,
  userName,
  windowEndsAt,
}: MatchSelectionScreenProps) {
  const reduced = useReducedMotion();
  const [selectedGroup, setSelectedGroup] = useState<"all" | string>("all");
  const [toast, setToast] = useState<string | null>(null);

  const handleUnavailable = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  }, []);

  const groupMatches = useMemo(() => {
    if (selectedGroup === "all") return null;
    const group = worldCupGroups.find((g) => g.id === selectedGroup);
    if (!group) return null;
    const matches = generateGroupMatches(group);
    // Promote the highlight match into its own group so it stays in sync with the banner.
    if (group.id === highlightMatch.group) {
      const idx = matches.findIndex(
        (m) =>
          m.homeTeam.code === highlightMatch.homeTeam.code &&
          m.awayTeam.code === highlightMatch.awayTeam.code,
      );
      const replacement: SelectableMatch = {
        ...(idx >= 0 ? matches[idx] : matches[0]),
        ...highlightMatch,
      };
      if (idx >= 0) {
        matches[idx] = replacement;
      } else {
        matches.unshift(replacement);
      }
    }
    return [...matches].sort(
      (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
    );
  }, [selectedGroup]);

  const showLiveBanner =
    selectedGroup === "all" || selectedGroup === highlightMatch.group;
  const selectedGroupData =
    selectedGroup !== "all"
      ? worldCupGroups.find((g) => g.id === selectedGroup)
      : null;

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-stadium-midnight">
      <header className="px-4 pt-4">
        <h1 className="text-xl font-bold text-stadium-text-primary">
          {userName ? (
            <>
              Hola, {userName} <span aria-hidden="true">👋</span>
            </>
          ) : (
            <>
              Elige tu partido <span aria-hidden="true">🏆</span>
            </>
          )}
        </h1>
        <p className="mt-1 text-sm text-stadium-text-secondary">
          Elige un partido para participar
        </p>
      </header>

      {showLiveBanner && (
        <LiveMatchBanner
          match={highlightMatch}
          windowEndsAt={windowEndsAt}
          onParticipate={() => onSelectMatch(highlightMatch)}
        />
      )}

      <div className="mt-4">
        <GroupFilter
          groups={worldCupGroups}
          selectedGroup={selectedGroup}
          onSelect={setSelectedGroup}
        />
      </div>

      <div className="px-4 pb-8">
        {selectedGroup === "all" ? (
          <div className="mt-2 grid grid-cols-2 gap-3">
            {worldCupGroups.map((g, i) => (
              <GroupSummaryCard
                key={g.id}
                group={g}
                index={i}
                onSelect={setSelectedGroup}
              />
            ))}
          </div>
        ) : (
          selectedGroupData && (
            <div className="mt-2">
              <h2 className="text-base font-bold text-stadium-text-primary">
                Grupo {selectedGroupData.id}
              </h2>
              <div className="mt-2 flex flex-row flex-wrap gap-1.5">
                {selectedGroupData.teams.map((t) => (
                  <span
                    key={t.code}
                    className="inline-flex items-center gap-1.5 rounded-full bg-stadium-surface-elevated px-2.5 py-1 text-[11px] font-medium text-stadium-text-primary"
                  >
                    <span aria-hidden="true">{t.flag}</span>
                    <span>{t.code}</span>
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                {groupMatches?.map((match, i) => (
                  <motion.div
                    key={match.id}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut", delay: i * 0.05 }}
                  >
                    <MatchSelectCard
                      match={match}
                      onSelect={onSelectMatch}
                      onUnavailable={handleUnavailable}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      <AnimatePresence>{toast && <Toast message={toast} />}</AnimatePresence>
    </div>
  );
}
