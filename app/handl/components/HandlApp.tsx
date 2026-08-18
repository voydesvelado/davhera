"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import s from "../handl.module.css";
import { DATA, DEFAULT_PROVIDER } from "../data";
import { SCREEN_IDS, type ScreenId, type SheetId, type Nav } from "./types";
import { Entry, Capture, Processing, Confirm } from "./screens/entry-flow";
import {
  Options,
  Estimate,
  EstimateWide,
  Booking,
  Checkin,
  Receipt,
} from "./screens/options-flow";
import {
  Describe,
  Question,
  Recovery,
  DirectSearch,
} from "./screens/branch-flow";
import { ChatMaria, MariaPlan } from "./screens/maria-flow";
import { BreakdownSheet, RankingSheet } from "./sheets";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/* ==========================================================================
 * Screen pinning — opt-in only.
 *
 * A plain refresh of /handl always starts from state zero (`entry`). The app
 * never writes to the URL on its own, so ordinary navigation is never sticky.
 * To iterate on one screen, put it in the URL yourself:
 *   /handl#directSearch   or   /handl?screen=directSearch
 * That pin survives refreshes and HMR. Delete it to get state zero back.
 * ========================================================================== */
function isScreenId(value: string | null | undefined): value is ScreenId {
  return !!value && (SCREEN_IDS as readonly string[]).includes(value);
}

function readPinnedScreen(): ScreenId {
  if (typeof window === "undefined") return "entry";
  const hash = window.location.hash.replace(/^#/, "");
  if (isScreenId(hash)) return hash;
  const param = new URLSearchParams(window.location.search).get("screen");
  if (isScreenId(param)) return param;
  return "entry";
}

function StatusBar() {
  return (
    <div className={s.statusbar}>
      <span>9:41</span>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="6" width="3" height="5" rx="0.8" />
          <rect x="4" y="4" width="3" height="7" rx="0.8" />
          <rect x="8" y="2" width="3" height="9" rx="0.8" />
          <rect x="12" y="0" width="3" height="11" rx="0.8" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" strokeOpacity="0.5" />
          <rect x="2" y="2" width="15" height="8" rx="1.5" fill="currentColor" />
          <path d="M23 4v4c1-.6 1.5-1.4 1.5-2S24 4.6 23 4Z" fill="currentColor" fillOpacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

export function HandlApp() {
  // null until the client resolves the pinned screen, so SSR and hydration agree.
  const [screen, setScreen] = useState<ScreenId | null>(null);
  const [history, setHistory] = useState<ScreenId[]>([]);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [providerId, setProviderId] = useState<string>(DEFAULT_PROVIDER.id);
  const [sheet, setSheet] = useState<SheetId | null>(null);

  // Resolve the opt-in pin once on mount, then follow manual hash edits so you
  // can jump screens by typing #recovery in the address bar.
  useEffect(() => {
    setScreen(readPinnedScreen());
    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (isScreenId(hash)) {
        setDirection("forward");
        setScreen(hash);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const go = useCallback(
    (id: ScreenId) => {
      setHistory((h) => (screen ? [...h, screen] : h));
      setDirection("forward");
      setScreen(id);
    },
    [screen],
  );

  const back = useCallback(() => {
    setDirection("back");
    // Entered deep (a #screen pin) with nothing behind us: fall back to entry
    // so Back is never a dead button.
    if (history.length === 0) {
      setScreen("entry");
      return;
    }
    setScreen(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
  }, [history]);

  const openSheet = useCallback((id: SheetId) => setSheet(id), []);
  const closeSheet = useCallback(() => setSheet(null), []);

  const onPick = useCallback(
    (id: string) => {
      setProviderId(id);
      go(id === "moore" ? "estimateWide" : "estimate");
    },
    [go],
  );

  const nav: Nav = useMemo(
    () => ({ go, back, openSheet, closeSheet }),
    [go, back, openSheet, closeSheet],
  );

  const provider =
    DATA.providers.find((p) => p.id === providerId) ?? DEFAULT_PROVIDER;

  const renderScreen = () => {
    if (!screen) return null;
    switch (screen) {
      case "entry":
        return <Entry nav={nav} />;
      case "capture":
        return <Capture nav={nav} />;
      case "processing":
        return <Processing nav={nav} />;
      case "confirm":
        return <Confirm nav={nav} />;
      case "options":
        return <Options nav={nav} onPick={onPick} />;
      case "estimate":
        return <Estimate nav={nav} provider={provider} />;
      case "estimateWide":
        return <EstimateWide nav={nav} provider={provider} />;
      case "booking":
        return <Booking nav={nav} provider={provider} />;
      case "checkin":
        return <Checkin nav={nav} />;
      case "receipt":
        return <Receipt nav={nav} />;
      case "describe":
        return <Describe nav={nav} />;
      case "question":
        return <Question nav={nav} />;
      case "recovery":
        return <Recovery nav={nav} />;
      case "directSearch":
        return <DirectSearch nav={nav} />;
      case "chatMaria":
        return <ChatMaria nav={nav} />;
      case "mariaPlan":
        return <MariaPlan nav={nav} />;
      default:
        return <Entry nav={nav} />;
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className={s.root}>
        <div className={s.shell}>
          <div className={s.screen}>
            <StatusBar />
            <AnimatePresence mode="wait" initial={false}>
              {screen && (
              <motion.div
                key={screen}
                className={s.body}
                initial={{ opacity: 0, y: direction === "forward" ? 24 : -24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.32, ease: EASE_OUT, opacity: { duration: 0.18 } }}
              >
                {renderScreen()}
              </motion.div>
              )}
            </AnimatePresence>
            <div className={s.homeindicator} />
            <AnimatePresence>
              {sheet === "breakdown" && <BreakdownSheet provider={provider} nav={nav} />}
              {sheet === "ranking" && <RankingSheet nav={nav} />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
