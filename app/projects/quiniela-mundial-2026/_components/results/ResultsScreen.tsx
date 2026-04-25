"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { MatchHeader } from "../MatchHeader";
import { ScoreHero } from "./ScoreHero";
import { ResultComparison } from "./ResultComparison";
import { NextMatchCard } from "./NextMatchCard";
import { matchResult, nextMatch } from "../../_data/mockResults";

interface ResultsScreenProps {
  onViewRankings: () => void;
}

export function ResultsScreen({ onViewRankings }: ResultsScreenProps) {
  const [shareToast, setShareToast] = useState<string | null>(null);

  const handleShare = useCallback(async () => {
    if (typeof navigator === "undefined") return;
    const { match, userScore } = matchResult;
    const text = `Acerté ${userScore.correct}/${userScore.total} en ${match.homeTeam.code} ${match.score.home}-${match.score.away} ${match.awayTeam.code} 🏆 Posición #${userScore.position}`;
    const url = "https://davhera.com/projects/quiniela-mundial-2026";
    try {
      const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
      if (typeof nav.share === "function") {
        await nav.share({ text, url, title: "Quiniela Mundial 2026" });
        return;
      }
      if (nav.clipboard?.writeText) {
        await nav.clipboard.writeText(`${text} ${url}`);
        setShareToast("Resultado copiado");
        window.setTimeout(() => setShareToast(null), 1800);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setShareToast("No se pudo compartir");
      window.setTimeout(() => setShareToast(null), 1800);
    }
  }, []);

  return (
    <div className="flex flex-col gap-5 px-4 pt-3 pb-24">
      <MatchHeader match={matchResult.match} />
      <ScoreHero userScore={matchResult.userScore} />
      <hr className="mx-2 border-stadium-border-subtle" />
      <ResultComparison questions={matchResult.questions} />
      <NextMatchCard match={nextMatch} />

      <button
        type="button"
        onClick={onViewRankings}
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-[10px] border border-stadium-border bg-stadium-surface-elevated px-4 text-[14px] font-semibold text-stadium-text-primary transition-colors hover:bg-stadium-surface-hover cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-midnight"
        style={{ minHeight: 48 }}
      >
        <span aria-hidden="true">🏆</span> Ver ranking completo
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="text-[13px] text-stadium-text-secondary transition-colors hover:text-stadium-text-primary cursor-pointer"
      >
        📤 Compartir resultado
      </button>

      {shareToast && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stadium-deep px-4 py-2 text-[12px] font-semibold text-stadium-text-primary shadow-lg"
          role="status"
        >
          {shareToast}
        </motion.div>
      )}
    </div>
  );
}
