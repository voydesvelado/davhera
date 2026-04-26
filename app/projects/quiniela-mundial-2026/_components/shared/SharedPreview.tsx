"use client";

import { useEffect, useState } from "react";
import { Avatar } from "./Avatar";
import { BottomNav } from "./BottomNav";
import { MatchHeader } from "./MatchHeader";
import { NextMatchCard } from "./NextMatchCard";
import { StadiumBackground } from "./StadiumBackground";
import { Timer } from "./Timer";
import type { Match } from "../../_lib/types";

const previewMatch: Match & { group: string; matchday: string } = {
  id: "preview-mex-kor",
  homeTeam: { name: "México", code: "MEX", flag: "🇲🇽" },
  awayTeam: { name: "Corea", code: "KOR", flag: "🇰🇷" },
  score: { home: 1, away: 0 },
  status: "halftime",
  minute: 45,
  group: "Grupo A",
  matchday: "Jornada 1",
};

const previewLiveMatch: Match = {
  id: "preview-live",
  homeTeam: { name: "Argentina", code: "ARG", flag: "🇦🇷" },
  awayTeam: { name: "Alemania", code: "GER", flag: "🇩🇪" },
  score: { home: 0, away: 0 },
  status: "live",
  minute: 12,
};

const previewFinishedMatch: Match = {
  id: "preview-finished",
  homeTeam: { name: "España", code: "ESP", flag: "🇪🇸" },
  awayTeam: { name: "Japón", code: "JPN", flag: "🇯🇵" },
  score: { home: 2, away: 1 },
  status: "finished",
  minute: 90,
};

const nextMatch = {
  homeTeam: { name: "Argentina", code: "ARG", flag: "🇦🇷" },
  awayTeam: { name: "Alemania", code: "GER", flag: "🇩🇪" },
  date: "Mañana · 18:00",
  group: "Grupo A",
};

export function SharedPreview() {
  const [tab, setTab] = useState("today");
  const [endsAt, setEndsAt] = useState<{ urgent: number; normal: number } | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const now = Date.now();
    setEndsAt({
      urgent: now + 4 * 60 * 1000 + 22 * 1000,
      normal: now + 11 * 60 * 1000 + 5 * 1000,
    });
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <div lang="es" className="stadium-nights relative h-full overflow-y-auto bg-stadium-midnight pb-20 text-stadium-text-primary">
      <StadiumBackground />
      <div className="relative z-10 flex flex-col gap-5 px-4 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-stadium-text-muted">
          Hero — MatchHeader
        </p>
        <MatchHeader match={previewMatch} size="hero" />

        <p className="text-[11px] font-semibold uppercase tracking-wide text-stadium-text-muted">
          Compact — halftime
        </p>
        <MatchHeader match={previewMatch} size="compact" />

        <p className="text-[11px] font-semibold uppercase tracking-wide text-stadium-text-muted">
          Compact — live
        </p>
        <MatchHeader match={previewLiveMatch} size="compact" />

        <p className="text-[11px] font-semibold uppercase tracking-wide text-stadium-text-muted">
          Compact — finished
        </p>
        <MatchHeader match={previewFinishedMatch} size="compact" />

        <p className="text-[11px] font-semibold uppercase tracking-wide text-stadium-text-muted">
          Timer — normal & urgente
        </p>
        {endsAt ? (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <Timer endsAt={endsAt.normal} />
              <Timer endsAt={endsAt.urgent} />
            </div>
            <p className="text-[12px] text-stadium-text-secondary">
              Inline: <Timer endsAt={endsAt.urgent} size="inline" />
            </p>
          </>
        ) : null}

        <p className="text-[11px] font-semibold uppercase tracking-wide text-stadium-text-muted">
          Avatar — colores
        </p>
        <div className="flex items-center gap-3">
          <Avatar initials="MX" color="pitch" />
          <Avatar initials="JG" color="gold" />
          <Avatar initials="CR" color="coral" />
          <Avatar initials="EL" color="electric" />
          <Avatar initials="YO" color="pitch" highlight size={40} />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-wide text-stadium-text-muted">
          NextMatchCard
        </p>
        <NextMatchCard match={nextMatch} />
      </div>

      <BottomNav activeTab={tab} onTabChange={setTab} />
    </div>
  );
}
