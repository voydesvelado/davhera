"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import s from "../../handl.module.css";
import { DATA } from "../../data";
import type { Nav } from "../types";
import {
  AppBar,
  Button,
  Chip,
  CameraIcon,
  LibraryIcon,
  ShieldIcon,
  PathCard,
  MariaRow,
  staggerContainer,
  fadeUp,
} from "../primitives";

/* ==========================================================================
 * 5.1 entry
 * ========================================================================== */
export function Entry({ nav }: { nav: Nav }) {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <AppBar title="Acme Benefits" avatar={{ initials: DATA.user.initials }} />

      <motion.p variants={fadeUp} className={s.eyebrow} style={{ marginTop: 18 }}>
        Find care
      </motion.p>
      <motion.h1 variants={fadeUp} className={s.h1}>
        What brings you here today, Jenny?
      </motion.h1>
      <motion.p variants={fadeUp} className={s.sub}>
        We'll find the care you need, check your plan, and show your cost before
        you commit to anything.
      </motion.p>

      <motion.div variants={fadeUp}>
        <PathCard
          pre
          title="I have a doctor's order"
          support="Photograph it. No typing, no medical words."
          onClick={() => nav.go("capture")}
        />
      </motion.div>
      <motion.div variants={fadeUp}>
        <PathCard
          title="I need care, but I'm not sure what"
          support="A few short questions, in plain language"
          onClick={() => nav.go("describe")}
        />
      </motion.div>
      <motion.div variants={fadeUp}>
        <PathCard
          title="I know what I need"
          support="Search it directly, skip the questions"
          onClick={() => nav.go("directSearch")}
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        <MariaRow onClick={() => nav.go("chatMaria")} />
      </motion.div>
    </motion.div>
  );
}

/* ==========================================================================
 * 5.2 capture
 * ========================================================================== */

/** Viewfinder L brackets: each contracts 4px toward the document on capture. */
const CORNERS = [
  { key: "tl", cls: s.cornerTL, x: 4, y: 4 },
  { key: "tr", cls: s.cornerTR, x: -4, y: 4 },
  { key: "bl", cls: s.cornerBL, x: 4, y: -4 },
  { key: "br", cls: s.cornerBR, x: -4, y: -4 },
] as const;

/* spec 6.3 — 160ms on --ease-out */
const CORNER_CONTRACT = {
  duration: 0.16,
  ease: [0.22, 1, 0.36, 1],
} as const;

export function Capture({ nav }: { nav: Nav }) {
  const [capturing, setCapturing] = useState(false);
  const reduced = useReducedMotion();

  const takePhoto = () => {
    if (capturing) return;
    setCapturing(true);
    setTimeout(() => nav.go("processing"), reduced ? 0 : 480);
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <AppBar title="Doctor's order" onBack={nav.back} />

      <motion.h1 variants={fadeUp} className={s.h1} style={{ marginTop: 14 }}>
        Photograph your order
      </motion.h1>
      <motion.p variants={fadeUp} className={s.sub}>
        We read it and find the exact procedure. Handwriting, abbreviations and
        Spanish are all fine.
      </motion.p>

      <motion.div variants={fadeUp} className={s.viewfinder}>
        {CORNERS.map(({ key, cls, x, y }) => (
          <motion.span
            key={key}
            className={`${s.corner} ${cls}`}
            animate={capturing ? { x, y } : { x: 0, y: 0 }}
            transition={CORNER_CONTRACT}
          />
        ))}
        <motion.div
          className={s.ghostdoc}
          animate={capturing ? { scale: 0.96 } : {}}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={`${s.ghostline} ${i % 2 ? s.short : ""}`} />
          ))}
        </motion.div>
        {capturing && (
          <motion.div
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "#ffffff",
            }}
          />
        )}
        <span className={s.caption}>Align the order inside the frame.</span>
      </motion.div>

      <motion.div variants={fadeUp} className={s.btnStack}>
        <Button variant="primary" icon={<CameraIcon />} onClick={takePhoto}>
          Take photo
        </Button>
        <Button variant="secondary" icon={<LibraryIcon />}>
          Choose from library
        </Button>
      </motion.div>

      <motion.div variants={fadeUp} className={s.card} style={{ display: "flex", gap: 11 }}>
        <ShieldIcon size={20} />
        <p className={s.whisper}>
          Used only to identify the procedure. Deleted after processing. Never
          visible to your employer.
        </p>
      </motion.div>

      <motion.p variants={fadeUp} style={{ marginTop: 18, textAlign: "center" }}>
        <button className={s.link} onClick={() => nav.go("describe")}>
          Type it instead
        </button>
      </motion.p>
    </motion.div>
  );
}

/* ==========================================================================
 * 5.3 processing
 * ========================================================================== */
const STEPS = [
  { title: "Document scanned", sub: null },
  { title: "Identifying the procedure", sub: "Finding the exact procedure your doctor wrote" },
  { title: "Checking your network and plan", sub: null },
];

export function Processing({ nav }: { nav: Nav }) {
  const [done, setDone] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const timings = [
      { at: 600, step: 0 },
      { at: 1500, step: 1 },
      { at: 2400, step: 2 },
    ];
    const timers = timings.map(({ at, step }) =>
      setTimeout(() => setDone((d) => [...d, step]), reduced ? 0 : at),
    );
    const routeTimer = setTimeout(() => nav.go("confirm"), reduced ? 150 : 2700);

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (reduced ? 150 : 2700));
      setProgress(t * 100);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(routeTimer);
      cancelAnimationFrame(raf);
    };
  }, [nav, reduced]);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <motion.p variants={fadeUp} className={s.title} style={{ marginTop: 10 }}>
        Reading your order.
      </motion.p>
      <motion.h1 variants={fadeUp} className={s.h1}>
        A few seconds…
      </motion.h1>

      <motion.div variants={fadeUp}>
        <div className={s.progressTrack}>
          <motion.div className={s.progressFill} animate={{ width: `${progress}%` }} transition={{ duration: 0.1 }} />
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        {STEPS.map((step, i) => {
          const isDone = done.includes(i);
          return (
            <div key={i} className={`${s.step} ${isDone ? s.done : s.pending}`}>
              <motion.span
                className={s.stepCircle}
                initial={false}
                animate={isDone ? { scale: [0.6, 1] } : {}}
                transition={{ duration: 0.22, ease: [0.34, 1.4, 0.64, 1] }}
              >
                {isDone && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12.5 4.5 4.5L19 7" />
                  </svg>
                )}
              </motion.span>
              <div>
                <div className={s.stepTitle}>{step.title}</div>
                {step.sub && <div className={s.stepSub}>{step.sub}</div>}
              </div>
            </div>
          );
        })}
      </motion.div>

      <motion.div variants={fadeUp} className={s.card}>
        <p className={s.whisper}>
          Every number you see comes from{" "}
          <strong style={{ color: "var(--ink)", fontWeight: 600 }}>
            your plan's own prices
          </strong>{" "}
          and where your deductible stands today. Not from averages, and never a
          guess.
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ==========================================================================
 * 5.4 confirm
 * ========================================================================== */
export function Confirm({ nav }: { nav: Nav }) {
  const { procedure } = DATA;
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <AppBar title="Your procedure" onBack={nav.back} />

      <motion.p variants={fadeUp} className={s.eyebrow} style={{ marginTop: 14 }}>
        Identified
      </motion.p>
      <motion.h1 variants={fadeUp} className={s.h1}>
        Knee arthroscopy
      </motion.h1>
      <motion.p variants={fadeUp} className={s.sub}>
        On medical bills it appears as{" "}
        <em style={{ fontStyle: "italic" }}>arthroscopy, knee, surgical</em>.
        That is the exact item your plan prices.
      </motion.p>

      <motion.div variants={fadeUp} className={s.card}>
        <div className={s.row}>
          <span className={s.rowLabel}>In your network</span>
          <Chip tone="ok">{procedure.networkCount} providers nearby</Chip>
        </div>
        <div className={s.row}>
          <span className={s.rowLabel}>Covered by your plan</span>
          <Chip tone="ok">Yes, after deductible</Chip>
        </div>
        <div className={s.row}>
          <span className={s.rowLabel}>Typical total in your area</span>
          <span className={s.rowValue}>
            ${procedure.areaRange[0].toLocaleString()} – ${procedure.areaRange[1].toLocaleString()}
          </span>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className={s.btnStack}>
        <Button onClick={() => nav.go("options")}>See your options</Button>
      </motion.div>

      <motion.p variants={fadeUp} style={{ textAlign: "center", marginTop: 16 }}>
        <button className={s.link} onClick={nav.back}>
          Not what your doctor said? Go back
        </button>
      </motion.p>

      <motion.p variants={fadeUp} className={s.footnote}>
        We identify the procedure your doctor ordered. We never diagnose. That
        part stays between you and your doctor.
      </motion.p>
    </motion.div>
  );
}
