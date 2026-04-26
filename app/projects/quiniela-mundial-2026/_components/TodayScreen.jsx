"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
  pitchGlow: "rgba(0,230,118,0.15)",
  gold: "#FFD740",
  goldGlow: "rgba(255,215,64,0.12)",
  coral: "#FF5252",
  coralGlow: "rgba(255,82,82,0.12)",
  electric: "#448AFF",
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  textInverse: "#0B1120",
};

const FONT_DISPLAY =
  '"DM Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
const FONT_MONO =
  '"JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, monospace';

const UPCOMING = [
  { id: "can-bih", home: { code: "CAN", flag: "🇨🇦" }, away: { code: "BIH", flag: "🇧🇦" }, time: "16:00", group: "Grupo B" },
  { id: "bra-mar", home: { code: "BRA", flag: "🇧🇷" }, away: { code: "MAR", flag: "🇲🇦" }, time: "19:00", group: "Grupo C" },
  { id: "usa-par", home: { code: "USA", flag: "🇺🇸" }, away: { code: "PAR", flag: "🇵🇾" }, time: "22:00", group: "Grupo D" },
];

const TABS = [
  { id: "today", label: "Hoy", icon: "🔥" },
  { id: "matches", label: "Partidos", icon: "⚽" },
  { id: "rankings", label: "Rankings", icon: "🏆" },
  { id: "profile", label: "Perfil", icon: "👤" },
];

function formatCountdown(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function TodayScreen() {
  const [activeTab, setActiveTab] = useState("today");
  const [participating, setParticipating] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Countdown: 12:34 → 0:00 simulated.
  const initialSeconds = 12 * 60 + 34;
  const startedAt = useRef(Date.now());
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    const id = window.setInterval(() => {
      const elapsed = (Date.now() - startedAt.current) / 1000;
      const remaining = Math.max(0, initialSeconds - elapsed);
      setSecondsLeft(remaining);
      if (remaining <= 0) window.clearInterval(id);
    }, 1000);
    return () => window.clearInterval(id);
  }, [initialSeconds]);

  const countdown = useMemo(() => formatCountdown(secondsLeft), [secondsLeft]);

  const handleParticipate = () => {
    setParticipating(true);
    // eslint-disable-next-line no-console
    console.log("[TodayScreen] Participar ahora — abriendo flujo de quiniela");
    window.setTimeout(() => setParticipating(false), 1200);
  };

  const handleUpcomingClick = (id) => {
    // eslint-disable-next-line no-console
    console.log(`[TodayScreen] Próximo partido seleccionado: ${id}`);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 375,
        minHeight: 812,
        margin: "0 auto",
        background: T.midnight,
        color: T.textPrimary,
        fontFamily: FONT_DISPLAY,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes today-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.6); opacity: 0; }
        }
        .today-card-interactive {
          transition: background-color .18s ease, border-color .18s ease, transform .18s ease;
          will-change: transform;
        }
        .today-card-interactive:hover {
          background: ${T.surfaceHover} !important;
          border-color: ${T.pitch} !important;
          transform: translateY(-2px);
        }
        .today-cta {
          transition: transform .15s ease, box-shadow .2s ease, filter .2s ease;
        }
        .today-cta:hover { filter: brightness(1.05); }
        .today-cta:active { transform: scale(0.99); }
        .today-tab {
          transition: color .15s ease;
        }
        .today-tab:hover { color: ${T.textSecondary}; }
      `}</style>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingBottom: 88,
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 16px 16px 16px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: T.textPrimary,
              }}
            >
              Hoy
            </h1>
            <p
              style={{
                margin: "2px 0 0 0",
                fontSize: 13,
                fontWeight: 500,
                color: T.textSecondary,
              }}
            >
              Miércoles 11 Jun 2026
            </p>
          </div>

          <button
            type="button"
            aria-label="Perfil de María Cervantes"
            onClick={() => setActiveTab("profile")}
            style={{
              width: 36,
              height: 36,
              borderRadius: 9999,
              border: `1px solid ${T.border}`,
              background: `linear-gradient(135deg, rgba(0,230,118,0.4) 0%, rgba(0,230,118,0.2) 100%)`,
              color: T.textPrimary,
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.02em",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            MC
          </button>
        </header>

        {/* LIVE MATCH CARD */}
        <section style={{ padding: "8px 16px 0 16px" }}>
          <article
            aria-label="Partido en vivo: México vs Sudáfrica"
            style={{
              position: "relative",
              background: T.surface,
              border: `1px solid ${T.coral}`,
              borderRadius: 20,
              padding: 20,
              boxShadow: `0 0 0 1px ${T.coralGlow}, 0 8px 32px rgba(0,0,0,0.35), 0 0 60px rgba(255,82,82,0.08)`,
            }}
          >
            {/* LIVE badge */}
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: T.coralGlow,
                  color: T.coral,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "4px 10px",
                  borderRadius: 9999,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: 9999,
                    background: T.coral,
                    animation: "today-pulse 1.6s ease-in-out infinite",
                  }}
                />
                EN VIVO
              </span>
            </div>

            {/* Match header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginTop: 16,
              }}
            >
              {/* Home */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 32, lineHeight: 1 }} aria-hidden="true">🇲🇽</span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    color: T.textPrimary,
                  }}
                >
                  MEX
                </span>
              </div>

              {/* Score */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  minWidth: 110,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 32,
                    fontWeight: 900,
                    color: T.textPrimary,
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                  }}
                >
                  <span>1</span>
                  <span style={{ color: T.textMuted }}>–</span>
                  <span>0</span>
                </div>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    fontWeight: 600,
                    color: T.coral,
                    letterSpacing: "0.04em",
                  }}
                >
                  45+2&apos;
                </span>
              </div>

              {/* Away */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 32, lineHeight: 1 }} aria-hidden="true">🇿🇦</span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    color: T.textPrimary,
                  }}
                >
                  RSA
                </span>
              </div>
            </div>

            {/* Status pill */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: T.goldGlow,
                  color: T.gold,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "4px 10px",
                  borderRadius: 9999,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: 9999,
                    background: T.gold,
                    animation: "today-pulse 1.6s ease-in-out infinite",
                  }}
                />
                MEDIO TIEMPO
              </span>
            </div>

            {/* Window timer */}
            <div
              style={{
                marginTop: 16,
                padding: "8px 16px",
                borderRadius: 14,
                background: T.surfaceElevated,
                border: `1px solid ${T.border}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: T.textSecondary,
                }}
              >
                Cierra en
              </span>
              <span
                aria-live="polite"
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: T.textPrimary,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {countdown}
              </span>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={handleParticipate}
              disabled={participating}
              className="today-cta"
              style={{
                marginTop: 16,
                width: "100%",
                minHeight: 56,
                border: "none",
                borderRadius: 14,
                background: participating
                  ? `linear-gradient(135deg, ${T.pitchDark}, ${T.pitchDark})`
                  : `linear-gradient(135deg, ${T.pitch} 0%, ${T.pitchDark} 100%)`,
                color: T.textInverse,
                fontFamily: FONT_DISPLAY,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.01em",
                cursor: participating ? "progress" : "pointer",
                boxShadow: `0 4px 20px ${T.pitchGlow}, 0 0 0 1px rgba(0,230,118,0.4) inset`,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {participating ? "Abriendo…" : "Participar ahora"}
              {!participating && <span aria-hidden="true">→</span>}
            </button>

            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: 11,
                textAlign: "center",
                color: T.textMuted,
              }}
            >
              5 preguntas · 60 segundos
            </p>
          </article>
        </section>

        {/* UPCOMING TODAY */}
        <section style={{ padding: "24px 16px 0 16px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: T.textPrimary,
            }}
          >
            Más partidos hoy
          </h2>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "12px 0 0 0",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {UPCOMING.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => handleUpcomingClick(m.id)}
                  onMouseEnter={() => setHoveredCard(m.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="today-card-interactive"
                  aria-label={`${m.home.code} contra ${m.away.code}, ${m.time}, ${m.group}`}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 16,
                    background: T.surface,
                    border: `1px solid ${T.borderSubtle}`,
                    borderRadius: 14,
                    color: T.textPrimary,
                    fontFamily: FONT_DISPLAY,
                    cursor: "pointer",
                    textAlign: "left",
                    minHeight: 64,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 22, lineHeight: 1 }} aria-hidden="true">
                      {m.home.flag}
                    </span>
                    <span style={{ fontSize: 22, lineHeight: 1 }} aria-hidden="true">
                      {m.away.flag}
                    </span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: T.textPrimary,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {m.home.code} vs {m.away.code}
                    </div>
                    <div
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 12,
                        color: T.textSecondary,
                        marginTop: 2,
                      }}
                    >
                      {m.time} · {m.group}
                    </div>
                  </div>

                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: 10,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: hoveredCard === m.id ? T.pitch : T.textSecondary,
                      padding: "4px 8px",
                      borderRadius: 9999,
                      background: T.surfaceElevated,
                    }}
                  >
                    Próximo
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* LAST RESULT */}
        <section style={{ padding: "24px 16px 0 16px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: T.textPrimary,
            }}
          >
            Último resultado
          </h2>

          <article
            style={{
              marginTop: 12,
              background: T.surface,
              border: `1px solid ${T.borderSubtle}`,
              borderRadius: 14,
              padding: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 24, lineHeight: 1 }} aria-hidden="true">🇪🇸</span>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 18,
                    fontWeight: 800,
                    color: T.textPrimary,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  ESP
                  <span style={{ margin: "0 8px", color: T.textPrimary }}>3</span>
                  <span style={{ color: T.textMuted }}>–</span>
                  <span style={{ margin: "0 8px", color: T.textPrimary }}>0</span>
                  CPV
                </span>
                <span style={{ fontSize: 24, lineHeight: 1 }} aria-hidden="true">🇨🇻</span>
              </div>

              <span
                style={{
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: T.surfaceElevated,
                  color: T.textMuted,
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "4px 8px",
                  borderRadius: 9999,
                }}
              >
                Finalizado
              </span>
            </div>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 500,
                  color: T.pitch,
                }}
              >
                Acertaste 4/5 · +20 pts
              </p>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: T.pitchGlow,
                  color: T.pitch,
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: 9999,
                }}
              >
                Participaste ✓
              </span>
            </div>
          </article>
        </section>

        <div style={{ height: 24 }} />
      </div>

      {/* BOTTOM NAV */}
      <nav
        role="navigation"
        aria-label="Navegación principal"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          background: T.deep,
          borderTop: `1px solid ${T.border}`,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          zIndex: 10,
        }}
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className="today-tab"
              style={{
                flex: 1,
                minHeight: 56,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                padding: "8px 4px",
                color: isActive ? T.pitch : T.textMuted,
                fontFamily: FONT_DISPLAY,
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }} aria-hidden="true">
                {tab.icon}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {tab.label}
              </span>
              <span
                aria-hidden="true"
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 9999,
                  background: isActive ? T.pitch : "transparent",
                }}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
