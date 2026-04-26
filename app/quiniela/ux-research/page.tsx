// @ts-nocheck
"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Quiniela Mundial 2026 — UX Research Case Study
 *
 * A single-file editorial case study built on the "Stadium Nights" design system.
 * Charts and animations are functional: every data viz encodes a real research
 * finding from the source documents.
 *
 * Stack: React + TypeScript + inline styles (zero dependencies).
 */

// ────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — Stadium Nights
// ────────────────────────────────────────────────────────────────────────────
const T = {
  midnight: "#0B1120",
  deep: "#111827",
  surface: "#1A2332",
  surfaceElevated: "#1F2D3D",
  surfaceHover: "#263547",
  border: "#2A3A4E",
  borderSubtle: "#1E2E42",
  pitch: "#00E676",
  pitchDark: "#00C853",
  pitchGlow: "rgba(0, 230, 118, 0.15)",
  gold: "#FFD740",
  goldDark: "#FFC400",
  goldGlow: "rgba(255, 215, 64, 0.12)",
  coral: "#FF5252",
  coralDark: "#FF1744",
  coralGlow: "rgba(255, 82, 82, 0.12)",
  electric: "#448AFF",
  electricDark: "#2979FF",
  electricGlow: "rgba(68, 138, 255, 0.12)",
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  textInverse: "#0B1120",
  display: "'DM Sans', 'Avenir Next', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', ui-monospace, monospace",
};

// ────────────────────────────────────────────────────────────────────────────
// HOOK — Intersection observer for reveal-on-scroll
// ────────────────────────────────────────────────────────────────────────────
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

// ────────────────────────────────────────────────────────────────────────────
// HOOK — Animated count-up for numerals
// ────────────────────────────────────────────────────────────────────────────
function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return value;
}

// ────────────────────────────────────────────────────────────────────────────
// SECTION 1 — HERO
// ────────────────────────────────────────────────────────────────────────────
const Hero: React.FC = () => {
  const [seconds, setSeconds] = useState(60);
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s <= 0 ? 60 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "80px 32px 64px",
        overflow: "hidden",
        background: `radial-gradient(ellipse at 20% 0%, ${T.pitchGlow} 0%, transparent 45%), radial-gradient(ellipse at 90% 100%, ${T.coralGlow} 0%, transparent 50%), linear-gradient(180deg, ${T.midnight} 0%, ${T.deep} 100%)`,
      }}
    >
      {/* Pitch line backdrop */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06, pointerEvents: "none" }}
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke={T.pitch} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1200" height="800" fill="url(#grid)" />
        <circle cx="600" cy="400" r="120" fill="none" stroke={T.pitch} strokeWidth="1.5" />
        <line x1="600" y1="0" x2="600" y2="800" stroke={T.pitch} strokeWidth="1" />
      </svg>

      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto" }}>
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 80,
            fontFamily: T.mono,
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: T.textMuted,
          }}
        >
          <span>Orca Laboratory · UX Research</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.coral }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: T.coral,
                boxShadow: `0 0 12px ${T.coral}`,
                animation: "pulse 1.6s ease-in-out infinite",
              }}
            />
            Confidential v1.0 · April 2026
          </span>
        </div>

        {/* Eyebrow */}
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 12,
            letterSpacing: "0.32em",
            color: T.pitch,
            marginBottom: 24,
            textTransform: "uppercase",
          }}
        >
          Case Study · FIFA World Cup 2026
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: T.display,
            fontSize: "clamp(56px, 9vw, 128px)",
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            color: T.textPrimary,
            margin: 0,
            marginBottom: 32,
          }}
        >
          Designing a 60-second
          <br />
          window to capture
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${T.pitch} 0%, ${T.gold} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            5 billion fans.
          </span>
        </h1>

        {/* Subhead + countdown */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            gap: 48,
            alignItems: "end",
            marginBottom: 96,
          }}
        >
          <p
            style={{
              fontFamily: T.display,
              fontSize: "clamp(18px, 1.6vw, 22px)",
              lineHeight: 1.5,
              color: T.textSecondary,
              maxWidth: 640,
              margin: 0,
            }}
          >
            UX research for a halftime-driven prediction platform. Eight competitors
            benchmarked, four user archetypes modelled, three critical journeys mapped —
            all to defend one number: <span style={{ color: T.pitch, fontWeight: 700 }}>sixty seconds</span> from
            push notification to confirmed entry.
          </p>

          {/* Live ticking countdown — visualizes the core constraint */}
          <div
            style={{
              padding: "20px 28px",
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              background: T.surface,
              minWidth: 260,
            }}
          >
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 11,
                letterSpacing: "0.16em",
                color: T.textMuted,
                textTransform: "uppercase",
                marginBottom: 8,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Halftime window</span>
              <span style={{ color: T.coral }}>● live</span>
            </div>
            <div
              style={{
                fontFamily: T.mono,
                fontSize: 56,
                fontWeight: 800,
                color: T.textPrimary,
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}
            >
              {mm}:{ss}
            </div>
            <div
              style={{
                marginTop: 12,
                height: 4,
                background: T.surfaceHover,
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(seconds / 60) * 100}%`,
                  background: seconds < 10 ? T.coral : T.pitch,
                  borderRadius: 999,
                  transition: "width 1s linear, background 0.3s",
                }}
              />
            </div>
          </div>
        </div>

        {/* Context strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 0,
            borderTop: `1px solid ${T.borderSubtle}`,
            borderBottom: `1px solid ${T.borderSubtle}`,
            paddingTop: 32,
            paddingBottom: 32,
          }}
        >
          {[
            { label: "Audience", value: "5.5B+", suffix: "global viewers" },
            { label: "Mobile traffic", value: "80%", suffix: "in LATAM" },
            { label: "Tournament", value: "104", suffix: "matches · 48 teams" },
            { label: "Host nations", value: "3", suffix: "USA · MEX · CAN" },
            { label: "Halftime", value: "15min", suffix: "to act" },
          ].map((s) => (
            <div key={s.label} style={{ borderLeft: `1px solid ${T.borderSubtle}`, padding: "0 24px" }}>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  color: T.textMuted,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 32,
                  fontWeight: 800,
                  color: T.textPrimary,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontFamily: T.display, fontSize: 13, color: T.textSecondary, marginTop: 4 }}>
                {s.suffix}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// SECTION 2 — METHODOLOGY
// ────────────────────────────────────────────────────────────────────────────
const Methodology: React.FC = () => {
  const items = [
    {
      n: "01",
      title: "Competitive benchmarking",
      body: "Flow, mechanics and mobile UX of 8 active platforms — Prodefy, WC Predictor, Quiniela Pro, Quiniela Fan, Quiniela Master, Duelazo, PollaYa, Easypromos.",
      tag: "8 platforms",
      color: T.pitch,
    },
    {
      n: "02",
      title: "Secondary data review",
      body: "FIFA Audience Report, Adjust/Apptopia, Sandvine, Nielsen — digital consumption patterns, traffic peaks and mobile behaviour during 2022 matches.",
      tag: "4 sources",
      color: T.electric,
    },
    {
      n: "03",
      title: "Heuristic evaluation",
      body: "All 10 Nielsen principles applied to MVP-critical flows. 10 risk areas identified, each mapped to a specific design recommendation.",
      tag: "10 heuristics",
      color: T.gold,
    },
    {
      n: "04",
      title: "Personas & journeys",
      body: "Four archetypes synthesised from observed patterns; three end-to-end journeys (registration, halftime, admin operations) mapped phase by phase.",
      tag: "4 personas · 5 journeys",
      color: T.coral,
    },
  ];

  return (
    <section style={{ background: T.midnight, padding: "120px 32px", borderTop: `1px solid ${T.borderSubtle}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionLabel n="02" label="How we got here" accent={T.pitch} />
        <h2
          style={{
            fontFamily: T.display,
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 800,
            color: T.textPrimary,
            margin: "16px 0 64px",
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          Four methods, one question:
          <br />
          <span style={{ color: T.textSecondary }}>
            what makes a fan come back at halftime?
          </span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 1,
            background: T.borderSubtle,
            border: `1px solid ${T.borderSubtle}`,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {items.map((item) => (
            <div
              key={item.n}
              style={{
                background: T.surface,
                padding: 32,
                minHeight: 280,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    color: item.color,
                    marginBottom: 24,
                  }}
                >
                  {item.n} — METHOD
                </div>
                <h3
                  style={{
                    fontFamily: T.display,
                    fontSize: 22,
                    fontWeight: 700,
                    color: T.textPrimary,
                    margin: "0 0 12px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: T.display,
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: T.textSecondary,
                    margin: 0,
                  }}
                >
                  {item.body}
                </p>
              </div>
              <div
                style={{
                  marginTop: 24,
                  fontFamily: T.mono,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: T.textMuted,
                  textTransform: "uppercase",
                  paddingTop: 16,
                  borderTop: `1px dashed ${T.borderSubtle}`,
                }}
              >
                <span style={{ color: item.color }}>● </span>
                {item.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// SECTION 3 — COMPETITIVE GAP MATRIX (CHART #1)
// Shows feature coverage across competitors. The "Live windows" row is empty
// across all 8 competitors — this is the core differential opportunity.
// ────────────────────────────────────────────────────────────────────────────
const CompetitiveMatrix: React.FC = () => {
  const { ref, shown } = useReveal<HTMLDivElement>();

  const features = [
    { key: "Simple registration", values: [1, 1, 1, 1, 1, 1] },
    { key: "Social login", values: [1, 1, 0, 0, 0, 0] },
    { key: "Mobile-first", values: [1, 1, 1, 1, 1, 0.5] },
    { key: "Per-match prediction", values: [1, 1, 1, 1, 1, 1] },
    { key: "Dynamic questions", values: [0, 0, 0, 0, 0.5, 1] },
    { key: "Groups & rankings", values: [1, 1, 1, 1, 1, 1] },
    { key: "Push / email notifications", values: [1, 0.5, 1, 1, 1, 1] },
    { key: "Brand-custom theming", values: [0, 0, 0, 1, 0, 1] },
    { key: "Live in-match windows", values: [0, 0, 0, 0, 0, 0] },
  ];
  const competitors = ["Prodefy", "WC Predictor", "Q. Master", "Q. Fan", "Duelazo", "Easypromos"];

  const cellSize = 56;
  const labelWidth = 240;
  const w = labelWidth + competitors.length * cellSize + 16;
  const h = features.length * cellSize + 64;

  return (
    <section style={{ background: T.deep, padding: "120px 32px", borderTop: `1px solid ${T.borderSubtle}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionLabel n="03" label="The market gap" accent={T.coral} />
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)", gap: 64, alignItems: "start", marginTop: 16 }}>
          <div>
            <h2
              style={{
                fontFamily: T.display,
                fontSize: "clamp(32px, 4.5vw, 56px)",
                fontWeight: 800,
                color: T.textPrimary,
                margin: 0,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
              }}
            >
              Nine features.
              <br />
              <span style={{ color: T.coral }}>One unclaimed.</span>
            </h2>
            <p
              style={{
                fontFamily: T.display,
                fontSize: 17,
                lineHeight: 1.6,
                color: T.textSecondary,
                marginTop: 24,
                maxWidth: 540,
              }}
            >
              Every platform we analysed lets you predict <em>before</em> kickoff.
              None lets you participate <em>during</em> the match. The 15-minute halftime
              window is open territory — and exactly when fans are most engaged with their phones.
            </p>
            <div style={{ marginTop: 32, display: "flex", gap: 24 }}>
              <Legend label="Full coverage" color={T.pitch} />
              <Legend label="Partial" color={T.gold} />
              <Legend label="Absent" color={T.surfaceElevated} />
            </div>
          </div>

          <div ref={ref} style={{ overflowX: "auto", paddingBottom: 8 }}>
            <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
              {/* Column headers */}
              {competitors.map((c, i) => (
                <text
                  key={c}
                  x={labelWidth + i * cellSize + cellSize / 2}
                  y={40}
                  textAnchor="middle"
                  fontFamily={T.mono}
                  fontSize="9"
                  fill={T.textMuted}
                  style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}
                >
                  {c.length > 10 ? c.slice(0, 10) : c}
                </text>
              ))}

              {/* Rows */}
              {features.map((f, ri) => {
                const isGapRow = f.key === "Live in-match windows";
                return (
                  <g key={f.key} transform={`translate(0, ${64 + ri * cellSize})`}>
                    {/* Row label */}
                    <text
                      x={0}
                      y={cellSize / 2 + 5}
                      fontFamily={T.display}
                      fontSize="13"
                      fontWeight={isGapRow ? 700 : 500}
                      fill={isGapRow ? T.coral : T.textPrimary}
                    >
                      {f.key}
                    </text>
                    {/* Cells */}
                    {f.values.map((v, ci) => {
                      const cx = labelWidth + ci * cellSize;
                      const fill =
                        v === 1 ? T.pitch : v === 0.5 ? T.gold : T.surfaceElevated;
                      const stroke = isGapRow && v === 0 ? T.coral : T.borderSubtle;
                      // Animation: scale-in cells with stagger
                      const delay = (ri * competitors.length + ci) * 18;
                      return (
                        <g key={ci} transform={`translate(${cx + cellSize / 2}, ${cellSize / 2})`}>
                          <rect
                            x={-cellSize / 2 + 6}
                            y={-cellSize / 2 + 6}
                            width={cellSize - 12}
                            height={cellSize - 12}
                            rx={6}
                            fill={fill}
                            stroke={stroke}
                            strokeWidth={isGapRow && v === 0 ? 1.5 : 1}
                            strokeDasharray={isGapRow && v === 0 ? "3 3" : "0"}
                            opacity={shown ? (v === 0 ? (isGapRow ? 0.6 : 0.35) : 1) : 0}
                            style={{
                              transition: `opacity 400ms ease-out ${delay}ms, transform 400ms ease-out ${delay}ms`,
                              transform: shown ? "scale(1)" : "scale(0.6)",
                              transformOrigin: "center",
                              transformBox: "fill-box",
                            }}
                          />
                          {v === 1 && shown && (
                            <path
                              d="M -6 0 L -2 4 L 6 -4"
                              fill="none"
                              stroke={T.midnight}
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              opacity={1}
                              style={{ transition: `opacity 200ms ease ${delay + 250}ms` }}
                            />
                          )}
                          {v === 0.5 && shown && (
                            <line
                              x1="-6"
                              x2="6"
                              y1="0"
                              y2="0"
                              stroke={T.midnight}
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            />
                          )}
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {/* Highlight box around the gap row */}
              <rect
                x={labelWidth - 8}
                y={64 + (features.length - 1) * cellSize + 2}
                width={competitors.length * cellSize + 8}
                height={cellSize - 4}
                rx={10}
                fill="none"
                stroke={T.coral}
                strokeWidth={1.5}
                opacity={shown ? 1 : 0}
                style={{ transition: "opacity 600ms ease 1200ms" }}
              />
              <text
                x={labelWidth + competitors.length * cellSize + 4}
                y={64 + (features.length - 1) * cellSize + cellSize / 2 + 4}
                fontFamily={T.mono}
                fontSize="9"
                fill={T.coral}
                style={{ letterSpacing: "0.14em" }}
                opacity={shown ? 1 : 0}
              >
                ↑ OUR PLAY
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// SECTION 4 — TRAFFIC PEAK CHART
// Real research finding: the halftime window is the highest-traffic moment.
// This chart visualises what an architecture must absorb.
// ────────────────────────────────────────────────────────────────────────────
const TrafficPeak: React.FC = () => {
  const { ref, shown } = useReveal<HTMLDivElement>();

  // Synthetic traffic curve modelled on observed match-day patterns:
  // Pre-match warm-up, kickoff spike, in-play idle, halftime megaspike, full-time tail.
  const points = [
    { x: 0, y: 8, label: "T-30m" },
    { x: 6, y: 14 },
    { x: 12, y: 22 },
    { x: 18, y: 38, label: "Kickoff" },
    { x: 24, y: 28 },
    { x: 30, y: 18 },
    { x: 36, y: 16 },
    { x: 42, y: 22 },
    { x: 48, y: 86, label: "Halftime" },
    { x: 54, y: 92 },
    { x: 60, y: 78 },
    { x: 66, y: 24 },
    { x: 72, y: 18 },
    { x: 78, y: 16 },
    { x: 84, y: 20 },
    { x: 90, y: 44, label: "Full-time" },
    { x: 96, y: 28 },
    { x: 100, y: 14 },
  ];

  const W = 1000;
  const H = 360;
  const PAD = { top: 40, right: 40, bottom: 56, left: 64 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const xScale = (x: number) => PAD.left + (x / 100) * innerW;
  const yScale = (y: number) => PAD.top + innerH - (y / 100) * innerH;

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.x)} ${yScale(p.y)}`)
    .join(" ");
  const area = `${path} L ${xScale(100)} ${yScale(0)} L ${xScale(0)} ${yScale(0)} Z`;

  return (
    <section
      ref={ref}
      style={{ background: T.midnight, padding: "120px 32px", borderTop: `1px solid ${T.borderSubtle}` }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionLabel n="04" label="The shape of a match-day" accent={T.gold} />
        <h2
          style={{
            fontFamily: T.display,
            fontSize: "clamp(32px, 4.5vw, 56px)",
            fontWeight: 800,
            color: T.textPrimary,
            margin: "16px 0 32px",
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          Traffic doesn't arrive evenly.
          <br />
          <span style={{ color: T.gold }}>It avalanches at minute 45.</span>
        </h2>

        <p
          style={{
            fontFamily: T.display,
            fontSize: 17,
            lineHeight: 1.6,
            color: T.textSecondary,
            maxWidth: 720,
            margin: "0 0 48px",
          }}
        >
          The halftime spike is roughly <strong style={{ color: T.textPrimary }}>2.4×</strong> the
          kickoff peak. Architecture, copy and UI all bend around this fifteen-minute
          burst — pre-loaded questions, offline-first writes, and a deep link straight to the partido.
        </p>

        <div style={{ background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 14, padding: 24 }}>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
            <defs>
              <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={T.gold} stopOpacity="0.35" />
                <stop offset="100%" stopColor={T.gold} stopOpacity="0" />
              </linearGradient>
              <linearGradient id="trafficStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={T.electric} />
                <stop offset="48%" stopColor={T.electric} />
                <stop offset="50%" stopColor={T.gold} />
                <stop offset="60%" stopColor={T.coral} />
                <stop offset="100%" stopColor={T.electric} />
              </linearGradient>
            </defs>

            {/* Y-axis grid */}
            {[0, 25, 50, 75, 100].map((g) => (
              <g key={g}>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={yScale(g)}
                  y2={yScale(g)}
                  stroke={T.borderSubtle}
                  strokeDasharray="2 6"
                />
                <text
                  x={PAD.left - 12}
                  y={yScale(g) + 4}
                  textAnchor="end"
                  fontFamily={T.mono}
                  fontSize="10"
                  fill={T.textMuted}
                >
                  {g}%
                </text>
              </g>
            ))}

            {/* Halftime band */}
            <rect
              x={xScale(45)}
              y={PAD.top}
              width={xScale(60) - xScale(45)}
              height={innerH}
              fill={T.coralGlow}
            />
            <text
              x={xScale(52.5)}
              y={PAD.top - 16}
              textAnchor="middle"
              fontFamily={T.mono}
              fontSize="10"
              fill={T.coral}
              style={{ letterSpacing: "0.16em" }}
            >
              HALFTIME · 15 MIN
            </text>

            {/* Area + line */}
            <path
              d={area}
              fill="url(#trafficFill)"
              opacity={shown ? 1 : 0}
              style={{ transition: "opacity 800ms ease" }}
            />
            <path
              d={path}
              fill="none"
              stroke="url(#trafficStroke)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2400"
              strokeDashoffset={shown ? 0 : 2400}
              style={{ transition: "stroke-dashoffset 1800ms ease-out" }}
            />

            {/* Annotated points */}
            {points
              .filter((p) => p.label)
              .map((p, i) => {
                const peak = p.label === "Halftime";
                return (
                  <g
                    key={p.label}
                    transform={`translate(${xScale(p.x)}, ${yScale(p.y)})`}
                    opacity={shown ? 1 : 0}
                    style={{ transition: `opacity 400ms ease ${1400 + i * 120}ms` }}
                  >
                    <circle
                      r={peak ? 8 : 5}
                      fill={peak ? T.coral : T.electric}
                      stroke={T.midnight}
                      strokeWidth="2"
                    />
                    {peak && (
                      <circle
                        r={14}
                        fill="none"
                        stroke={T.coral}
                        strokeWidth="1.5"
                        opacity="0.6"
                        style={{ animation: "pulse-ring 2s ease-out infinite" }}
                      />
                    )}
                    <text
                      y={-18}
                      textAnchor="middle"
                      fontFamily={T.mono}
                      fontSize="10"
                      fill={peak ? T.coral : T.textSecondary}
                      style={{ letterSpacing: "0.08em" }}
                    >
                      {p.label} · {p.y}%
                    </text>
                  </g>
                );
              })}

            {/* X-axis labels */}
            {points
              .filter((p) => p.label)
              .map((p) => (
                <text
                  key={`x-${p.x}`}
                  x={xScale(p.x)}
                  y={H - 16}
                  textAnchor="middle"
                  fontFamily={T.mono}
                  fontSize="10"
                  fill={T.textMuted}
                  style={{ letterSpacing: "0.08em" }}
                >
                  {p.label === "T-30m" ? "−30" : p.label === "Kickoff" ? "0" : p.label === "Halftime" ? "45" : p.label === "Full-time" ? "90" : ""}
                </text>
              ))}
            <text
              x={W / 2}
              y={H - 2}
              textAnchor="middle"
              fontFamily={T.mono}
              fontSize="9"
              fill={T.textMuted}
              style={{ letterSpacing: "0.18em", textTransform: "uppercase" }}
            >
              Match clock (minutes)
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// SECTION 5 — PERSONAS
// ────────────────────────────────────────────────────────────────────────────
const Personas: React.FC = () => {
  const personas = [
    {
      name: "María",
      tag: "The Casual Fan",
      age: 28,
      color: T.electric,
      glow: T.electricGlow,
      motivation:
        "Stay in the social conversation. Doesn't want to be the only one not playing the office quiniela.",
      need: "Register in <30 seconds. Plain-language questions. Instant visual feedback.",
      moment: "Watching the match at a friend's place, joins from a WhatsApp link.",
      kpi: "Completes registration + 1 entry within first 3 days",
      lead: "MARC",
      initial: "M",
    },
    {
      name: "Carlos",
      tag: "The Football Geek",
      age: 34,
      color: T.pitch,
      glow: T.pitchGlow,
      motivation:
        "Show off. Compete with friends. Win prizes that reward actual football knowledge.",
      need: "Quick history access. Visible ranking. Questions that beat randomness.",
      moment: "Analyses the matchup beforehand, plays every available window.",
      kpi: "Plays >80% of available matches; shares rankings",
      lead: "FUTBOLERO",
      initial: "C",
    },
    {
      name: "Laura",
      tag: "The Organiser",
      age: 40,
      color: T.gold,
      glow: T.goldGlow,
      motivation:
        "Replace the office Excel spreadsheet. Stop manually chasing results and reminders.",
      need: "WhatsApp-share invites. Auto-calculated standings. Zero manual ops.",
      moment: "Pre-tournament: configures the group. During: it runs itself.",
      kpi: "Invites 10+ people and never opens a support ticket",
      lead: "ORGANIZER",
      initial: "L",
    },
    {
      name: "Diego",
      tag: "The Brand Admin",
      age: 32,
      color: T.coral,
      glow: T.coralGlow,
      motivation:
        "Generate qualified leads, maximise participation, prove engagement ROI.",
      need: "Real-time dashboard. CSV export. Alerts for anomalies. Notification logs.",
      moment: "Live ops during every match. Eye on the dashboard the whole 90+15.",
      kpi: "Zero critical incidents; final report with engagement targets met",
      lead: "BRAND OPS",
      initial: "D",
    },
  ];

  return (
    <section style={{ background: T.deep, padding: "120px 32px", borderTop: `1px solid ${T.borderSubtle}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionLabel n="05" label="Who we're designing for" accent={T.electric} />
        <h2
          style={{
            fontFamily: T.display,
            fontSize: "clamp(32px, 4.5vw, 56px)",
            fontWeight: 800,
            color: T.textPrimary,
            margin: "16px 0 64px",
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          Four people. Four watches.
          <br />
          <span style={{ color: T.textSecondary }}>One platform that has to feel built for each.</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {personas.map((p) => (
            <article
              key={p.name}
              style={{
                background: T.surface,
                border: `1px solid ${T.borderSubtle}`,
                borderRadius: 14,
                padding: 32,
                position: "relative",
                overflow: "hidden",
                transition: "transform 300ms ease, border-color 300ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = p.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = T.borderSubtle;
              }}
            >
              {/* Bg glow */}
              <div
                style={{
                  position: "absolute",
                  top: -80,
                  right: -80,
                  width: 200,
                  height: 200,
                  background: p.glow,
                  borderRadius: "50%",
                  filter: "blur(40px)",
                  pointerEvents: "none",
                }}
              />

              <div style={{ position: "relative" }}>
                {/* Avatar + name */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${p.color}33 0%, ${p.color}66 100%)`,
                      border: `1.5px solid ${p.color}`,
                      display: "grid",
                      placeItems: "center",
                      fontFamily: T.display,
                      fontSize: 22,
                      fontWeight: 800,
                      color: p.color,
                    }}
                  >
                    {p.initial}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: T.mono,
                        fontSize: 10,
                        letterSpacing: "0.18em",
                        color: p.color,
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      {p.lead} · {p.age}
                    </div>
                    <div
                      style={{
                        fontFamily: T.display,
                        fontSize: 22,
                        fontWeight: 800,
                        color: T.textPrimary,
                        lineHeight: 1.1,
                      }}
                    >
                      {p.name}
                    </div>
                    <div style={{ fontFamily: T.display, fontSize: 13, color: T.textSecondary }}>
                      {p.tag}
                    </div>
                  </div>
                </div>

                <Field label="Motivation" body={p.motivation} />
                <Field label="UX need" body={p.need} accent={p.color} />
                <Field label="Key moment" body={p.moment} />

                <div
                  style={{
                    marginTop: 20,
                    paddingTop: 16,
                    borderTop: `1px dashed ${T.borderSubtle}`,
                    fontFamily: T.mono,
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    color: T.textMuted,
                  }}
                >
                  <span style={{ color: p.color }}>SUCCESS · </span>
                  {p.kpi}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const Field: React.FC<{ label: string; body: string; accent?: string }> = ({ label, body, accent }) => (
  <div style={{ marginBottom: 16 }}>
    <div
      style={{
        fontFamily: T.mono,
        fontSize: 9.5,
        letterSpacing: "0.22em",
        color: accent || T.textMuted,
        textTransform: "uppercase",
        marginBottom: 6,
      }}
    >
      — {label}
    </div>
    <div
      style={{
        fontFamily: T.display,
        fontSize: 14,
        lineHeight: 1.5,
        color: T.textPrimary,
      }}
    >
      {body}
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// SECTION 6 — THE 60-SECOND JOURNEY (animated journey timeline)
// ────────────────────────────────────────────────────────────────────────────
const Journey: React.FC = () => {
  const stages = [
    { sec: 0, name: "Push received", emo: "Urgency", icon: "🔔" },
    { sec: 4, name: "Deep link opens partido", emo: "Anticipation", icon: "↗" },
    { sec: 9, name: "Match context loads", emo: "Focus", icon: "⚽" },
    { sec: 14, name: "Q1 — winner of 2nd half", emo: "Decisión", icon: "1" },
    { sec: 22, name: "Q2 — first scorer", emo: "Decisión", icon: "2" },
    { sec: 30, name: "Q3 — yellow cards", emo: "Decisión", icon: "3" },
    { sec: 38, name: "Q4 — total goals", emo: "Decisión", icon: "4" },
    { sec: 46, name: "Q5 — bonus question", emo: "Decisión", icon: "5" },
    { sec: 52, name: "Review screen", emo: "Caution", icon: "✓" },
    { sec: 58, name: "Confirmed · haptic", emo: "Relief", icon: "✓" },
  ];

  const { ref, shown } = useReveal<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const W = 1200;
  const H = 320;
  const PAD = { left: 56, right: 56, top: 80, bottom: 80 };
  const innerW = W - PAD.left - PAD.right;
  const xScale = (sec: number) => PAD.left + (sec / 60) * innerW;

  return (
    <section
      ref={ref}
      style={{ background: T.midnight, padding: "120px 32px", borderTop: `1px solid ${T.borderSubtle}` }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionLabel n="06" label="The hero journey" accent={T.pitch} />
        <h2
          style={{
            fontFamily: T.display,
            fontSize: "clamp(32px, 4.5vw, 56px)",
            fontWeight: 800,
            color: T.textPrimary,
            margin: "16px 0 32px",
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          From notification to confirmed entry,{" "}
          <span style={{ color: T.pitch }}>under sixty seconds.</span>
        </h2>
        <p
          style={{
            fontFamily: T.display,
            fontSize: 17,
            lineHeight: 1.6,
            color: T.textSecondary,
            maxWidth: 720,
            margin: "0 0 48px",
          }}
        >
          Ten micro-decisions, each measured against the clock. The deep link
          eliminates landing pages; pre-loaded questions remove network waits;
          one-question-per-screen card-swipe keeps cognitive load minimal.
        </p>

        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.borderSubtle}`,
            borderRadius: 14,
            padding: 32,
            overflowX: "auto",
          }}
        >
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", minWidth: 720 }}>
            <defs>
              <linearGradient id="journeyTrack" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={T.coral} />
                <stop offset="50%" stopColor={T.gold} />
                <stop offset="100%" stopColor={T.pitch} />
              </linearGradient>
            </defs>

            {/* Track background */}
            <rect
              x={PAD.left}
              y={H / 2 - 3}
              width={innerW}
              height={6}
              rx={3}
              fill={T.surfaceHover}
            />
            {/* Progress fill */}
            <rect
              x={PAD.left}
              y={H / 2 - 3}
              width={shown ? innerW : 0}
              height={6}
              rx={3}
              fill="url(#journeyTrack)"
              style={{ transition: "width 2400ms ease-out" }}
            />

            {/* Tick marks every 10s */}
            {[0, 10, 20, 30, 40, 50, 60].map((t) => (
              <g key={t}>
                <line
                  x1={xScale(t)}
                  x2={xScale(t)}
                  y1={H / 2 + 16}
                  y2={H / 2 + 24}
                  stroke={T.textMuted}
                />
                <text
                  x={xScale(t)}
                  y={H / 2 + 42}
                  textAnchor="middle"
                  fontFamily={T.mono}
                  fontSize="11"
                  fontWeight="700"
                  fill={t === 60 ? T.pitch : T.textMuted}
                >
                  {t}s
                </text>
              </g>
            ))}

            {/* Stage nodes */}
            {stages.map((s, i) => {
              const x = xScale(s.sec);
              const y = H / 2;
              const above = i % 2 === 0;
              const labelY = above ? y - 32 : y + 60;
              const delay = 600 + i * 140;
              const isHovered = hover === i;
              return (
                <g
                  key={i}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Connector */}
                  <line
                    x1={x}
                    x2={x}
                    y1={y}
                    y2={labelY + (above ? 4 : -4)}
                    stroke={T.borderSubtle}
                    strokeDasharray="2 3"
                    opacity={shown ? 1 : 0}
                    style={{ transition: `opacity 400ms ease ${delay}ms` }}
                  />
                  {/* Label */}
                  <g
                    transform={`translate(${x}, ${labelY})`}
                    opacity={shown ? 1 : 0}
                    style={{ transition: `opacity 400ms ease ${delay + 80}ms` }}
                  >
                    <text
                      textAnchor="middle"
                      fontFamily={T.display}
                      fontSize="12"
                      fontWeight="700"
                      fill={isHovered ? T.pitch : T.textPrimary}
                      style={{ transition: "fill 200ms" }}
                    >
                      {s.name}
                    </text>
                    <text
                      y={14}
                      textAnchor="middle"
                      fontFamily={T.mono}
                      fontSize="9"
                      fill={T.textMuted}
                      style={{ letterSpacing: "0.14em", textTransform: "uppercase" }}
                    >
                      {s.emo}
                    </text>
                  </g>
                  {/* Node */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 14 : 10}
                    fill={T.deep}
                    stroke={i === stages.length - 1 ? T.pitch : i === 0 ? T.coral : T.gold}
                    strokeWidth={2}
                    opacity={shown ? 1 : 0}
                    style={{
                      transition: `opacity 300ms ease ${delay}ms, r 200ms ease`,
                    }}
                  />
                  <text
                    x={x}
                    y={y + 4}
                    textAnchor="middle"
                    fontFamily={T.mono}
                    fontSize="10"
                    fontWeight="800"
                    fill={i === stages.length - 1 ? T.pitch : i === 0 ? T.coral : T.gold}
                    opacity={shown ? 1 : 0}
                    style={{ transition: `opacity 300ms ease ${delay + 100}ms` }}
                  >
                    {s.icon}
                  </text>
                </g>
              );
            })}

            {/* End cap label */}
            <text
              x={xScale(60)}
              y={40}
              textAnchor="middle"
              fontFamily={T.mono}
              fontSize="11"
              fontWeight="700"
              fill={T.pitch}
              style={{ letterSpacing: "0.18em" }}
            >
              ENTRY CONFIRMED
            </text>
            <line
              x1={xScale(60)}
              x2={xScale(60)}
              y1={48}
              y2={H / 2 - 14}
              stroke={T.pitch}
              strokeDasharray="2 3"
              opacity={shown ? 1 : 0}
              style={{ transition: "opacity 400ms ease 2400ms" }}
            />

            {/* Start cap label */}
            <text
              x={xScale(0)}
              y={40}
              textAnchor="middle"
              fontFamily={T.mono}
              fontSize="11"
              fontWeight="700"
              fill={T.coral}
              style={{ letterSpacing: "0.18em" }}
            >
              PUSH
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// SECTION 7 — DESIGN PRINCIPLES
// ────────────────────────────────────────────────────────────────────────────
const Principles: React.FC = () => {
  const principles = [
    {
      n: "P1",
      title: "Sixty seconds or less",
      body: "Every participation flow completes in under 60s from first tap. Each screen, transition, and interaction must justify itself against this ceiling.",
      color: T.pitch,
    },
    {
      n: "P2",
      title: "Unequivocal confirmation",
      body: "Multisensory: visual checkmark, haptic vibration, and a persistent state the user can re-check later. Quiniela Pro lost users on this exact failure.",
      color: T.gold,
    },
    {
      n: "P3",
      title: "One action per screen",
      body: "Card-swipe over forms. The user makes one micro-decision at a time. The screens that win in LATAM (Duelazo, Q. Master) all do this.",
      color: T.electric,
    },
    {
      n: "P4",
      title: "Context without overload",
      body: "Match score and minute always available, never competing with the action. Progressive disclosure: summary visible, detail expandable.",
      color: T.coral,
    },
    {
      n: "P5",
      title: "Native recurrence",
      body: "Every terminal screen — confirmation, results, ranking — includes a CTA to the next opportunity. The platform always answers ‘what's next?'",
      color: T.pitch,
    },
  ];

  return (
    <section style={{ background: T.deep, padding: "120px 32px", borderTop: `1px solid ${T.borderSubtle}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionLabel n="07" label="Five rules we won't break" accent={T.gold} />
        <h2
          style={{
            fontFamily: T.display,
            fontSize: "clamp(32px, 4.5vw, 56px)",
            fontWeight: 800,
            color: T.textPrimary,
            margin: "16px 0 64px",
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          Design principles
          <br />
          <span style={{ color: T.textSecondary }}>derived directly from the research.</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 1,
            background: T.borderSubtle,
            border: `1px solid ${T.borderSubtle}`,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {principles.map((p) => (
            <article
              key={p.n}
              style={{
                background: T.surface,
                padding: 32,
                minHeight: 260,
                position: "relative",
                overflow: "hidden",
                transition: "background 200ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = T.surfaceElevated)}
              onMouseLeave={(e) => (e.currentTarget.style.background = T.surface)}
            >
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 64,
                  fontWeight: 900,
                  color: p.color,
                  opacity: 0.18,
                  position: "absolute",
                  top: 16,
                  right: 24,
                  letterSpacing: "-0.04em",
                }}
              >
                {p.n}
              </div>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: p.color,
                  marginBottom: 16,
                  position: "relative",
                }}
              >
                PRINCIPLE {p.n.slice(1)}
              </div>
              <h3
                style={{
                  fontFamily: T.display,
                  fontSize: 24,
                  fontWeight: 800,
                  color: T.textPrimary,
                  margin: "0 0 16px",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.15,
                  position: "relative",
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontFamily: T.display,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: T.textSecondary,
                  margin: 0,
                  position: "relative",
                }}
              >
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// SECTION 8 — CONVERSION FUNNEL (CHART)
// ────────────────────────────────────────────────────────────────────────────
const Funnel: React.FC = () => {
  const { ref, shown } = useReveal<HTMLDivElement>();

  // Modeled targets from the research metrics framework
  const stages = [
    { label: "Link impressions", pct: 100, mono: "BASELINE", color: T.electric },
    { label: "Click → landing", pct: 78, mono: ">75% target", color: T.electric },
    { label: "Registration completed", pct: 50, mono: ">50% target", color: T.gold },
    { label: "First participation", pct: 38, mono: ">75% of registered", color: T.pitch },
    { label: "Repeat participation (≥2 matches)", pct: 23, mono: ">60% of players", color: T.pitch },
    { label: "Halftime participation", pct: 15, mono: ">40% of total entries", color: T.coral },
  ];

  const W = 1100;
  const H = 460;
  const top = 60;
  const bandH = 56;
  const gap = 4;

  return (
    <section
      ref={ref}
      style={{ background: T.midnight, padding: "120px 32px", borderTop: `1px solid ${T.borderSubtle}` }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionLabel n="08" label="The numbers we're chasing" accent={T.pitch} />
        <h2
          style={{
            fontFamily: T.display,
            fontSize: "clamp(32px, 4.5vw, 56px)",
            fontWeight: 800,
            color: T.textPrimary,
            margin: "16px 0 32px",
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          Targets the design has to hit
        </h2>
        <p
          style={{
            fontFamily: T.display,
            fontSize: 17,
            lineHeight: 1.6,
            color: T.textSecondary,
            maxWidth: 720,
            margin: "0 0 48px",
          }}
        >
          Each band is a research-derived target. Drop-off between any two stages is
          where the next round of usability testing zooms in.
        </p>

        <div style={{ background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 14, padding: "40px 24px" }}>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
            {stages.map((s, i) => {
              const w = (s.pct / 100) * (W - 200);
              const x = (W - w) / 2;
              const y = top + i * (bandH + gap);
              const delay = i * 160;
              const animatedW = shown ? w : 0;
              const animatedX = shown ? x : W / 2;
              return (
                <g key={s.label}>
                  <rect
                    x={animatedX}
                    y={y}
                    width={animatedW}
                    height={bandH}
                    rx={8}
                    fill={s.color}
                    opacity={0.14}
                    stroke={s.color}
                    strokeOpacity={0.55}
                    style={{
                      transition: `width 700ms ease ${delay}ms, x 700ms ease ${delay}ms`,
                    }}
                  />
                  {/* % big number */}
                  <text
                    x={W / 2}
                    y={y + bandH / 2 + 6}
                    textAnchor="middle"
                    fontFamily={T.mono}
                    fontSize="22"
                    fontWeight="800"
                    fill={s.color}
                  >
                    {s.pct}%
                  </text>
                  {/* Label left */}
                  <text
                    x={x - 12}
                    y={y + bandH / 2 + 5}
                    textAnchor="end"
                    fontFamily={T.display}
                    fontSize="14"
                    fontWeight="600"
                    fill={T.textPrimary}
                  >
                    {s.label}
                  </text>
                  {/* Mono right */}
                  <text
                    x={x + w + 12}
                    y={y + bandH / 2 + 4}
                    fontFamily={T.mono}
                    fontSize="10"
                    fill={T.textMuted}
                    style={{ letterSpacing: "0.14em", textTransform: "uppercase" }}
                  >
                    {s.mono}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// SECTION 9 — RISK MATRIX (CHART)
// ────────────────────────────────────────────────────────────────────────────
const RiskMatrix: React.FC = () => {
  const { ref, shown } = useReveal<HTMLDivElement>();

  // x = probability (0..1), y = impact (0..1)
  const risks = [
    { id: "R1", label: "System crash at halftime peak", x: 0.6, y: 0.95, color: T.coral },
    { id: "R2", label: "User doesn't see confirmation", x: 0.55, y: 0.78, color: T.coral },
    { id: "R3", label: "Wrong winner notified", x: 0.2, y: 0.97, color: T.coral },
    { id: "R4", label: "Notification fatigue & opt-out", x: 0.6, y: 0.65, color: T.gold },
    { id: "R5", label: "Question scope creep", x: 0.78, y: 0.5, color: T.gold },
    { id: "R6", label: "Slow load on poor mobile signal", x: 0.85, y: 0.7, color: T.gold },
    { id: "R7", label: "Confusion over rules / scoring", x: 0.8, y: 0.45, color: T.electric },
  ];

  const W = 720;
  const H = 520;
  const PAD = { l: 80, r: 40, t: 40, b: 80 };
  const inner = { w: W - PAD.l - PAD.r, h: H - PAD.t - PAD.b };
  const xS = (v: number) => PAD.l + v * inner.w;
  const yS = (v: number) => PAD.t + (1 - v) * inner.h;

  return (
    <section
      ref={ref}
      style={{ background: T.deep, padding: "120px 32px", borderTop: `1px solid ${T.borderSubtle}` }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionLabel n="09" label="What could go wrong" accent={T.coral} />
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 64, alignItems: "start", marginTop: 16 }}>
          <div>
            <h2
              style={{
                fontFamily: T.display,
                fontSize: "clamp(32px, 4.5vw, 56px)",
                fontWeight: 800,
                color: T.textPrimary,
                margin: "0 0 24px",
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
              }}
            >
              The seven risks
              <br />
              <span style={{ color: T.coral }}>we won't ship without mitigating.</span>
            </h2>
            <p
              style={{
                fontFamily: T.display,
                fontSize: 16,
                lineHeight: 1.6,
                color: T.textSecondary,
                margin: "0 0 32px",
                maxWidth: 480,
              }}
            >
              Each red and yellow point has a paired mitigation in the architecture
              brief — auto-scaling, offline-first writes, double-confirmation in admin
              flows, immutable winner-calculation logs.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {risks.map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 16,
                    alignItems: "center",
                    padding: "12px 16px",
                    background: T.surface,
                    border: `1px solid ${T.borderSubtle}`,
                    borderRadius: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: T.mono,
                      fontSize: 11,
                      fontWeight: 800,
                      color: r.color,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {r.id}
                  </span>
                  <span style={{ fontFamily: T.display, fontSize: 13, color: T.textPrimary }}>
                    {r.label}
                  </span>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: r.color,
                      boxShadow: `0 0 12px ${r.color}66`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 14, padding: 24 }}>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
              {/* Quadrant background */}
              <rect
                x={xS(0.5)}
                y={yS(1)}
                width={xS(1) - xS(0.5)}
                height={yS(0.5) - yS(1)}
                fill={T.coralGlow}
              />
              <rect
                x={PAD.l}
                y={yS(1)}
                width={xS(0.5) - PAD.l}
                height={yS(0.5) - yS(1)}
                fill={T.goldGlow}
              />
              <rect
                x={xS(0.5)}
                y={yS(0.5)}
                width={xS(1) - xS(0.5)}
                height={yS(0) - yS(0.5)}
                fill={T.goldGlow}
              />

              {/* Axes */}
              <line x1={PAD.l} y1={yS(0)} x2={xS(1)} y2={yS(0)} stroke={T.border} />
              <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={yS(0)} stroke={T.border} />

              {/* Mid grid */}
              <line
                x1={xS(0.5)}
                x2={xS(0.5)}
                y1={PAD.t}
                y2={yS(0)}
                stroke={T.borderSubtle}
                strokeDasharray="3 4"
              />
              <line
                x1={PAD.l}
                x2={xS(1)}
                y1={yS(0.5)}
                y2={yS(0.5)}
                stroke={T.borderSubtle}
                strokeDasharray="3 4"
              />

              {/* Quadrant labels */}
              <text
                x={xS(0.75)}
                y={yS(0.75) + 4}
                textAnchor="middle"
                fontFamily={T.mono}
                fontSize="9"
                fill={T.coral}
                style={{ letterSpacing: "0.18em" }}
                opacity={0.7}
              >
                CRITICAL
              </text>
              <text
                x={xS(0.25)}
                y={yS(0.75) + 4}
                textAnchor="middle"
                fontFamily={T.mono}
                fontSize="9"
                fill={T.gold}
                style={{ letterSpacing: "0.18em" }}
                opacity={0.7}
              >
                HIGH IMPACT
              </text>
              <text
                x={xS(0.75)}
                y={yS(0.25) + 4}
                textAnchor="middle"
                fontFamily={T.mono}
                fontSize="9"
                fill={T.gold}
                style={{ letterSpacing: "0.18em" }}
                opacity={0.7}
              >
                FREQUENT
              </text>
              <text
                x={xS(0.25)}
                y={yS(0.25) + 4}
                textAnchor="middle"
                fontFamily={T.mono}
                fontSize="9"
                fill={T.electric}
                style={{ letterSpacing: "0.18em" }}
                opacity={0.7}
              >
                MONITOR
              </text>

              {/* Axis labels */}
              <text
                x={(PAD.l + xS(1)) / 2}
                y={H - 32}
                textAnchor="middle"
                fontFamily={T.mono}
                fontSize="10"
                fill={T.textMuted}
                style={{ letterSpacing: "0.18em", textTransform: "uppercase" }}
              >
                Probability →
              </text>
              <text
                x={-(yS(0) + PAD.t) / 2}
                y={28}
                textAnchor="middle"
                fontFamily={T.mono}
                fontSize="10"
                fill={T.textMuted}
                style={{ letterSpacing: "0.18em", textTransform: "uppercase" }}
                transform="rotate(-90)"
              >
                Impact →
              </text>

              {/* Risk dots */}
              {risks.map((r, i) => {
                const cx = shown ? xS(r.x) : xS(0.5);
                const cy = shown ? yS(r.y) : yS(0.5);
                return (
                  <g
                    key={r.id}
                    style={{
                      transition: `transform 700ms ease ${i * 100}ms`,
                    }}
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={20}
                      fill={r.color}
                      opacity={shown ? 0.18 : 0}
                      style={{ transition: `opacity 500ms ease ${i * 100 + 300}ms` }}
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={10}
                      fill={r.color}
                      opacity={shown ? 1 : 0}
                      style={{ transition: `opacity 500ms ease ${i * 100 + 300}ms` }}
                    />
                    <text
                      x={cx}
                      y={cy + 3}
                      textAnchor="middle"
                      fontFamily={T.mono}
                      fontSize="9"
                      fontWeight="800"
                      fill={T.midnight}
                      opacity={shown ? 1 : 0}
                      style={{ transition: `opacity 500ms ease ${i * 100 + 400}ms` }}
                    >
                      {r.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// SECTION 10 — UI EXPRESSION (mobile-first artifact)
// ────────────────────────────────────────────────────────────────────────────
const SolutionPreview: React.FC = () => {
  const [step, setStep] = useState<"q" | "ok">("q");
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section style={{ background: T.midnight, padding: "120px 32px", borderTop: `1px solid ${T.borderSubtle}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionLabel n="10" label="The system in motion" accent={T.gold} />
        <h2
          style={{
            fontFamily: T.display,
            fontSize: "clamp(32px, 4.5vw, 56px)",
            fontWeight: 800,
            color: T.textPrimary,
            margin: "16px 0 32px",
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          From research to interface.
        </h2>
        <p
          style={{
            fontFamily: T.display,
            fontSize: 17,
            lineHeight: 1.6,
            color: T.textSecondary,
            maxWidth: 640,
            margin: "0 0 48px",
          }}
        >
          The full design system materialises in the halftime card. Tap an option, then
          confirm — the whole sequence respects the 60-second budget.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 280px) minmax(0, 1fr)",
            gap: 64,
            alignItems: "center",
          }}
        >
          {/* Phone mockup */}
          <div
            style={{
              width: 280,
              height: 580,
              borderRadius: 36,
              border: `8px solid ${T.surfaceElevated}`,
              background: T.midnight,
              padding: 16,
              boxShadow: `0 30px 80px ${T.pitchGlow}, 0 0 0 1px ${T.border}`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Notch */}
            <div
              style={{
                position: "absolute",
                top: 8,
                left: "50%",
                transform: "translateX(-50%)",
                width: 80,
                height: 22,
                background: T.surfaceElevated,
                borderRadius: 12,
                zIndex: 2,
              }}
            />
            {/* Status bar */}
            <div
              style={{
                paddingTop: 32,
                paddingBottom: 12,
                display: "flex",
                justifyContent: "space-between",
                fontFamily: T.mono,
                fontSize: 10,
                color: T.textPrimary,
              }}
            >
              <span>9:42</span>
              <span>● ● ●</span>
            </div>

            {step === "q" ? (
              <>
                {/* Match header */}
                <div
                  style={{
                    background: T.surfaceElevated,
                    borderRadius: 12,
                    padding: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 22 }}>🇧🇷</span>
                    <span style={{ fontFamily: T.display, fontWeight: 700, fontSize: 12, color: T.textPrimary }}>BRA</span>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: T.mono, fontSize: 22, fontWeight: 900, color: T.textPrimary, lineHeight: 1 }}>
                      1 – 0
                    </div>
                    <div style={{ fontFamily: T.mono, fontSize: 8, color: T.gold, letterSpacing: "0.16em", marginTop: 2 }}>
                      ● HT
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: T.display, fontWeight: 700, fontSize: 12, color: T.textPrimary }}>ARG</span>
                    <span style={{ fontSize: 22 }}>🇦🇷</span>
                  </div>
                </div>

                {/* Progress segments */}
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {[1, 0, 0, 0, 0].map((on, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 999,
                        background: on ? T.pitch : T.surfaceHover,
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: 10,
                    color: T.textMuted,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  Pregunta 1 de 5
                </div>

                {/* Question */}
                <div
                  style={{
                    fontFamily: T.display,
                    fontSize: 16,
                    fontWeight: 700,
                    color: T.textPrimary,
                    lineHeight: 1.3,
                    marginBottom: 16,
                  }}
                >
                  ¿Quién marca primero en el segundo tiempo?
                </div>

                {/* Options */}
                {[
                  { id: "A", label: "Brasil" },
                  { id: "B", label: "Argentina" },
                  { id: "C", label: "Nadie marca" },
                ].map((opt) => {
                  const isSel = selected === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelected(opt.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                        padding: "10px 12px",
                        marginBottom: 8,
                        background: isSel ? T.pitchGlow : T.surfaceElevated,
                        border: `2px solid ${isSel ? T.pitch : T.border}`,
                        borderRadius: 10,
                        cursor: "pointer",
                        transition: "all 150ms",
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          background: isSel ? T.pitch : T.surface,
                          color: isSel ? T.midnight : T.textSecondary,
                          fontFamily: T.mono,
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        {isSel ? "✓" : opt.id}
                      </span>
                      <span
                        style={{
                          fontFamily: T.display,
                          fontSize: 13,
                          fontWeight: isSel ? 700 : 500,
                          color: isSel ? T.pitch : T.textPrimary,
                        }}
                      >
                        {opt.label}
                      </span>
                    </button>
                  );
                })}

                {/* Submit */}
                <button
                  disabled={!selected}
                  onClick={() => setStep("ok")}
                  style={{
                    width: "100%",
                    marginTop: 12,
                    padding: "12px 16px",
                    background: selected ? T.pitch : T.surfaceElevated,
                    color: selected ? T.midnight : T.textMuted,
                    border: "none",
                    borderRadius: 10,
                    fontFamily: T.display,
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: selected ? "pointer" : "not-allowed",
                    boxShadow: selected ? `0 0 24px ${T.pitchGlow}` : "none",
                    transition: "all 200ms",
                  }}
                >
                  Enviar respuesta →
                </button>
              </>
            ) : (
              // Confirmation state
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "calc(100% - 80px)",
                  textAlign: "center",
                  padding: "0 12px",
                }}
              >
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill={T.pitchGlow}
                    stroke={T.pitch}
                    strokeWidth="3"
                    style={{
                      filter: `drop-shadow(0 0 20px ${T.pitchGlow})`,
                    }}
                  />
                  <path
                    d="M 25 40 L 36 51 L 56 30"
                    fill="none"
                    stroke={T.pitch}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="60"
                    strokeDashoffset="0"
                    style={{ animation: "draw 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
                  />
                </svg>
                <div
                  style={{
                    fontFamily: T.display,
                    fontSize: 18,
                    fontWeight: 800,
                    color: T.pitch,
                    marginTop: 20,
                  }}
                >
                  ¡Participación registrada!
                </div>
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: 11,
                    color: T.textSecondary,
                    marginTop: 8,
                    letterSpacing: "0.06em",
                  }}
                >
                  16:42:31 · GMT-3
                </div>
                <button
                  onClick={() => {
                    setStep("q");
                    setSelected(null);
                  }}
                  style={{
                    marginTop: 32,
                    padding: "10px 20px",
                    background: "transparent",
                    color: T.textSecondary,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    fontFamily: T.display,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ↻ Reset demo
                </button>
              </div>
            )}
          </div>

          {/* Annotations */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Annotation
              label="01"
              title="Compact match header"
              body="Score, minute, badge — visible context, never competing with the question."
              color={T.gold}
            />
            <Annotation
              label="02"
              title="One question per screen"
              body="Card-swipe pattern. 48px tap targets. Progress segments above."
              color={T.electric}
            />
            <Annotation
              label="03"
              title="Selection state"
              body="Checkmark, glow border, color change — three signals so the user knows what's chosen."
              color={T.pitch}
            />
            <Annotation
              label="04"
              title="Multisensory confirmation"
              body="Animated checkmark + haptic vibration + persistent timestamp. Solves Quiniela Pro's #1 complaint."
              color={T.coral}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const Annotation: React.FC<{ label: string; title: string; body: string; color: string }> = ({
  label,
  title,
  body,
  color,
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "auto minmax(0, 1fr)",
      gap: 20,
      alignItems: "start",
      paddingBottom: 20,
      borderBottom: `1px dashed ${T.borderSubtle}`,
    }}
  >
    <span
      style={{
        fontFamily: T.mono,
        fontSize: 28,
        fontWeight: 800,
        color,
        letterSpacing: "-0.02em",
        lineHeight: 1,
      }}
    >
      {label}
    </span>
    <div>
      <h4
        style={{
          fontFamily: T.display,
          fontSize: 18,
          fontWeight: 700,
          color: T.textPrimary,
          margin: "0 0 6px",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h4>
      <p style={{ fontFamily: T.display, fontSize: 14, lineHeight: 1.55, color: T.textSecondary, margin: 0 }}>
        {body}
      </p>
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// SECTION 11 — CLOSING
// ────────────────────────────────────────────────────────────────────────────
const Closing: React.FC = () => {
  return (
    <section
      style={{
        position: "relative",
        background: `linear-gradient(180deg, ${T.midnight} 0%, ${T.deep} 100%)`,
        padding: "120px 32px 80px",
        borderTop: `1px solid ${T.borderSubtle}`,
        overflow: "hidden",
      }}
    >
      {/* Half stadium glow */}
      <div
        style={{
          position: "absolute",
          bottom: -300,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1000,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${T.pitchGlow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 12,
            letterSpacing: "0.32em",
            color: T.gold,
            marginBottom: 24,
          }}
        >
          NEXT STEPS
        </div>
        <h2
          style={{
            fontFamily: T.display,
            fontSize: "clamp(40px, 6vw, 80px)",
            fontWeight: 900,
            color: T.textPrimary,
            margin: 0,
            letterSpacing: "-0.035em",
            lineHeight: 1.0,
          }}
        >
          Wireframes. Prototype.
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${T.pitch} 0%, ${T.gold} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Then we kick off.
          </span>
        </h2>

        <div
          style={{
            marginTop: 48,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 24,
            textAlign: "left",
          }}
        >
          {[
            { w: "Week 3", t: "Lo-fi wireframes for the 3 critical journeys." },
            { w: "Week 3", t: "Phase 1 usability test on 5–8 users." },
            { w: "Week 4", t: "Hi-fi prototype + design system rollout." },
            { w: "Week 5", t: "Phase 2 end-to-end test in staging." },
            { w: "Week 6", t: "Go-live + 7-day live ops support window." },
          ].map((s) => (
            <div
              key={s.w}
              style={{
                padding: 20,
                background: T.surface,
                border: `1px solid ${T.borderSubtle}`,
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  color: T.pitch,
                  marginBottom: 8,
                }}
              >
                {s.w}
              </div>
              <div style={{ fontFamily: T.display, fontSize: 14, lineHeight: 1.5, color: T.textPrimary }}>
                {s.t}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 96,
            paddingTop: 32,
            borderTop: `1px solid ${T.borderSubtle}`,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            fontFamily: T.mono,
            fontSize: 11,
            letterSpacing: "0.16em",
            color: T.textMuted,
            textTransform: "uppercase",
          }}
        >
          <span>Quiniela Mundial 2026 · UX Research v1.0</span>
          <span>Orca Laboratory · April 2026</span>
          <span style={{ color: T.pitch }}>● Confidential</span>
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// SHARED — Section label and small bits
// ────────────────────────────────────────────────────────────────────────────
const SectionLabel: React.FC<{ n: string; label: string; accent: string }> = ({ n, label, accent }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 16,
      fontFamily: T.mono,
      fontSize: 11,
      letterSpacing: "0.24em",
      textTransform: "uppercase",
      color: T.textMuted,
    }}
  >
    <span
      style={{
        display: "inline-block",
        width: 32,
        height: 1,
        background: accent,
      }}
    />
    <span style={{ color: accent, fontWeight: 700 }}>{n}</span>
    <span>· {label}</span>
  </div>
);

const Legend: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <span
      style={{
        width: 12,
        height: 12,
        borderRadius: 3,
        background: color,
        border: `1px solid ${T.borderSubtle}`,
      }}
    />
    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMuted, letterSpacing: "0.1em" }}>
      {label}
    </span>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// MAIN
// ────────────────────────────────────────────────────────────────────────────
const QuinielaUXCaseStudy: React.FC = () => {
  return (
    <div
      style={{
        background: T.midnight,
        color: T.textPrimary,
        fontFamily: T.display,
        minHeight: "100vh",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&family=JetBrains+Mono:wght@400;500;700;800&display=swap');

        * { box-sizing: border-box; }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.7; }
          100% { transform: scale(2); opacity: 0; }
        }

        @keyframes draw {
          from { stroke-dashoffset: 60; }
          to { stroke-dashoffset: 0; }
        }

        ::selection {
          background: ${T.pitch};
          color: ${T.midnight};
        }

        html { scroll-behavior: smooth; }
      `}</style>

      <Hero />
      <Methodology />
      <CompetitiveMatrix />
      <TrafficPeak />
      <Personas />
      <Journey />
      <Principles />
      <Funnel />
      <RiskMatrix />
      <SolutionPreview />
      <Closing />
    </div>
  );
};

export default QuinielaUXCaseStudy;
