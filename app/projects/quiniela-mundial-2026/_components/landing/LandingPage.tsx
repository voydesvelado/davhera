"use client";

import { StadiumBackground } from "./StadiumBackground";
import { HeroSection } from "./HeroSection";
import { MatchCard } from "./MatchCard";
import { SocialProof } from "./SocialProof";
import { UpcomingMatches } from "./UpcomingMatches";
import { LandingFooter } from "./LandingFooter";
import {
  heroCopy,
  landingMatchMeta,
  socialProof,
  upcomingMatches,
  match as defaultMatch,
} from "../../_data/mockData";
import type { Match, MatchStatus } from "../../_lib/types";

interface LandingPageProps {
  status: MatchStatus;
  upcomingKickoffMs: number;
  onParticipate: () => void;
  onLogin: () => void;
}

function matchForStatus(status: MatchStatus): Match {
  // For non-upcoming states show the live MEX 1-0 BRA. For upcoming, hide score.
  const m: Match = { ...defaultMatch, status };
  if (status === "upcoming") {
    m.score = { home: 0, away: 0 };
    m.minute = 0;
  }
  return m;
}

export function LandingPage({ status, upcomingKickoffMs, onParticipate, onLogin }: LandingPageProps) {
  const copy = heroCopy[status];
  const m = matchForStatus(status);

  return (
    <div className="relative min-h-full overflow-y-auto">
      <StadiumBackground />
      <div className="relative z-10 flex flex-col">
        <HeroSection copy={copy} status={status} />
        <MatchCard
          match={m}
          venue={landingMatchMeta.venue}
          group={landingMatchMeta.group}
          matchday={landingMatchMeta.matchday}
          status={status}
          upcomingKickoffMs={upcomingKickoffMs}
          onCta={onParticipate}
        />
        <SocialProof
          activeParticipants={socialProof.activeParticipants}
          friends={socialProof.friends}
          live={status !== "finished"}
        />
        <UpcomingMatches matches={upcomingMatches} />
        <LandingFooter onLogin={onLogin} />
      </div>
    </div>
  );
}
