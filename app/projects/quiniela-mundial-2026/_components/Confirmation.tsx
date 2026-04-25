"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PitchBackdrop } from "./PitchBackdrop";
import type { Answers, Match, Question } from "../_lib/types";

interface ConfirmationProps {
  match: Match;
  questions: Question[];
  answers: Answers;
}

function formatTimestamp(d: Date): string {
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const time = d.toLocaleTimeString("es-MX", { hour12: false });
  const offset = -d.getTimezoneOffset() / 60;
  const sign = offset >= 0 ? "+" : "-";
  const tz = `GMT${sign}${Math.abs(offset)}`;
  return `${day} ${month} ${year} · ${time} ${tz}`;
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.04 21.785h-.003a9.87 9.87 0 0 1-5.031-1.378l-.36-.214-3.741.982 1-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.99 2.898 9.825 9.825 0 0 1 2.892 6.994c-.003 5.45-4.437 9.884-9.89 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.49-8.413z" />
  </svg>
);

export function Confirmation({ match, questions, answers }: ConfirmationProps) {
  const reduced = useReducedMotion();
  const [timestamp] = useState<Date>(() => new Date());
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Vibrate at the moment the checkmark is "sealed".
  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => {
      try {
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate(50);
        }
      } catch {
        /* iOS Safari has no vibrate; silent */
      }
    }, 400);
    return () => window.clearTimeout(id);
  }, [reduced]);

  const shareText = `Acabo de participar en la quiniela de ${match.homeTeam.name} vs ${match.awayTeam.name} 🏆 ¿Te animas?`;
  const shareUrl = "https://davhera.com/projects/quiniela-mundial-2026";

  const handleShare = async () => {
    if (typeof navigator === "undefined") return;
    try {
      const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
      if (typeof nav.share === "function") {
        await nav.share({ text: shareText, url: shareUrl, title: "Quiniela Mundial 2026" });
        return;
      }
      if (nav.clipboard?.writeText) {
        await nav.clipboard.writeText(`${shareText} ${shareUrl}`);
        setShareToast("Link copiado");
        window.setTimeout(() => setShareToast(null), 1800);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setShareToast("No se pudo compartir");
      window.setTimeout(() => setShareToast(null), 1800);
    }
  };

  const checkmarkDelay = 0;
  const titleDelay = 0.3;
  const tsDelay = 0.45;
  const summaryDelay = 0.6;
  const badgeDelay = 0.75;
  const ctaDelay = 0.9;

  const fadeUp = useMemo(
    () => ({
      initial: { opacity: 0, y: reduced ? 0 : 10 },
      animate: { opacity: 1, y: 0 },
    }),
    [reduced],
  );

  return (
    <div className="flex h-full flex-col items-center px-5 pt-8 pb-6 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <PitchBackdrop />
        <motion.div
          initial={{ scale: reduced ? 1 : 0.3, opacity: 0 }}
          animate={{ scale: reduced ? 1 : [0.3, 1.1, 1], opacity: 1 }}
          transition={
            reduced
              ? { duration: 0.2, delay: checkmarkDelay }
              : { duration: 0.6, delay: checkmarkDelay, ease: [0.34, 1.56, 0.64, 1] }
          }
          className="relative flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-stadium-pitch bg-stadium-pitch-glow shadow-[0_0_40px_rgb(0_230_118_/_0.15),0_0_80px_rgb(0_230_118_/_0.08)]"
        >
          <motion.svg
            viewBox="0 0 24 24"
            className="h-8 w-8 text-stadium-pitch"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <motion.polyline
              points="20 6 9 17 4 12"
              initial={{ pathLength: reduced ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.35, ease: "easeOut" }}
            />
          </motion.svg>
        </motion.div>
      </div>

      <motion.p
        {...fadeUp}
        transition={{ duration: 0.3, delay: titleDelay }}
        className="mt-5 text-[20px] font-extrabold text-stadium-pitch"
      >
        ¡Participación registrada!
      </motion.p>

      <motion.p
        {...fadeUp}
        transition={{ duration: 0.3, delay: tsDelay }}
        className="mt-1 font-mono text-[13px] text-stadium-text-secondary"
      >
        {formatTimestamp(timestamp)}
      </motion.p>

      <motion.div
        {...fadeUp}
        transition={{ duration: 0.3, delay: summaryDelay }}
        className="mt-6 w-full rounded-[14px] bg-stadium-surface px-5 py-4 text-left"
      >
        {questions.map((q, idx) => {
          const answerLabel = q.options.find((o) => o.id === answers[q.id])?.label ?? "—";
          const isLast = idx === questions.length - 1;
          return (
            <div
              key={q.id}
              className={`flex items-baseline gap-2 py-2.5 ${isLast ? "" : "border-b border-stadium-border-subtle"}`}
            >
              <span className="font-mono text-[12px] text-stadium-text-muted shrink-0">{idx + 1}.</span>
              <span className="flex-1 text-[13px] text-stadium-text-secondary truncate">{q.text}</span>
              <span className="text-[13px] font-semibold text-stadium-text-primary shrink-0">→ {answerLabel}</span>
            </div>
          );
        })}
      </motion.div>

      <motion.span
        {...fadeUp}
        transition={{ duration: 0.3, delay: badgeDelay }}
        className="mt-4 inline-flex items-center rounded-full bg-stadium-pitch-glow px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-stadium-pitch"
      >
        Participaste
      </motion.span>

      <motion.button
        {...fadeUp}
        transition={{ duration: 0.3, delay: ctaDelay }}
        type="button"
        onClick={handleShare}
        whileHover={reduced ? undefined : { y: -1 }}
        whileTap={reduced ? undefined : { scale: 0.99 }}
        className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-[14px] bg-gradient-to-br from-stadium-pitch to-stadium-pitch-dark px-6 py-4 text-[16px] font-bold text-stadium-text-inverse shadow-[0_4px_24px_rgb(0_230_118_/_0.25)] hover:shadow-[0_6px_32px_rgb(0_230_118_/_0.35)] transition-shadow cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-midnight"
      >
        <WhatsAppIcon />
        COMPARTIR EN WHATSAPP
      </motion.button>

      <motion.button
        {...fadeUp}
        transition={{ duration: 0.3, delay: ctaDelay }}
        type="button"
        className="mt-3 text-[13px] text-stadium-text-secondary hover:text-stadium-text-primary transition-colors cursor-pointer"
        onClick={() => {
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
        Ver mis respuestas
      </motion.button>

      {shareToast && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed bottom-10 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stadium-deep px-4 py-2 text-[12px] font-semibold text-stadium-text-primary shadow-lg"
          role="status"
        >
          {shareToast}
        </motion.div>
      )}
    </div>
  );
}
