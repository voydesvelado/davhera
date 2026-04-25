"use client";

import { RankingRow } from "./RankingRow";
import type { Player } from "../../_data/mockResults";

interface RankingListProps {
  /** Top of the leaderboard, rendered first. */
  top: Player[];
  /** Optional rows centered around the current user, rendered after a "···" separator. */
  aroundUser?: Player[];
  title: string;
  subtitle?: string;
}

export function RankingList({ top, aroundUser, title, subtitle }: RankingListProps) {
  const showSkip = !!(aroundUser && aroundUser.length > 0);
  return (
    <section aria-label={title} className="flex flex-col">
      <header className="px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-stadium-text-muted">
          {title}
        </p>
        {subtitle && (
          <p className="mt-0.5 text-[11px] font-medium text-stadium-text-muted">{subtitle}</p>
        )}
      </header>

      <ul role="list" className="mt-3 flex flex-col">
        {top.map((p, i) => (
          <RankingRow key={p.id} rank={i + 1} player={p} index={i} />
        ))}

        {showSkip && (
          <>
            <li
              aria-hidden="true"
              className="py-2 text-center text-[16px] font-bold text-stadium-text-muted"
            >
              ···
            </li>
            {aroundUser.map((p, i) => (
              <RankingRow key={`au-${p.id}`} rank={p.id} player={p} index={i + top.length} />
            ))}
          </>
        )}
      </ul>
    </section>
  );
}
