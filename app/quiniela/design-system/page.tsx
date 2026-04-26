// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";

const COLORS = {
  // Core Palette — "Stadium Nights"
  midnight: "#0B1120",
  deep: "#111827",
  surface: "#1A2332",
  surfaceElevated: "#1F2D3D",
  surfaceHover: "#263547",
  border: "#2A3A4E",
  borderSubtle: "#1E2E42",

  // Pitch Green — Primary Action
  pitch: "#00E676",
  pitchDark: "#00C853",
  pitchGlow: "rgba(0, 230, 118, 0.15)",
  pitchMuted: "#0D3A2A",

  // Trophy Gold — Rewards & Winners
  gold: "#FFD740",
  goldDark: "#FFC400",
  goldGlow: "rgba(255, 215, 64, 0.12)",
  goldMuted: "#3A3020",

  // Coral — Urgency & Errors
  coral: "#FF5252",
  coralDark: "#FF1744",
  coralGlow: "rgba(255, 82, 82, 0.12)",
  coralMuted: "#3A1A1A",

  // Electric Blue — Info & Links
  electric: "#448AFF",
  electricDark: "#2979FF",
  electricGlow: "rgba(68, 138, 255, 0.12)",

  // Text
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  textInverse: "#0B1120",

  // Semantic
  success: "#00E676",
  error: "#FF5252",
  warning: "#FFD740",
  info: "#448AFF",

  // Gradients (as CSS strings)
  gradientPitch: "linear-gradient(135deg, #00E676 0%, #00C853 100%)",
  gradientGold: "linear-gradient(135deg, #FFD740 0%, #FFC400 100%)",
  gradientSurface: "linear-gradient(180deg, #1A2332 0%, #111827 100%)",
  gradientHero: "linear-gradient(135deg, #0B1120 0%, #1A2332 40%, #0D3A2A 100%)",
  gradientCoral: "linear-gradient(135deg, #FF5252 0%, #FF1744 100%)",
};

const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 };
const RADIUS = { sm: 6, md: 10, lg: 14, xl: 20, full: 9999 };
const FONT_SIZES = { xs: 11, sm: 13, md: 15, lg: 18, xl: 22, xxl: 28, hero: 36 };

const FONTS = {
  display: "'DM Sans', 'Avenir Next', sans-serif",
  body: "'DM Sans', 'Avenir Next', sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', monospace",
};

// --- Components ---

function Badge({ children, variant = "default", size = "sm", pulse = false }) {
  const variants = {
    default: { bg: COLORS.surfaceHover, color: COLORS.textSecondary, border: COLORS.border },
    live: { bg: COLORS.coralGlow, color: COLORS.coral, border: "transparent" },
    success: { bg: COLORS.pitchGlow, color: COLORS.pitch, border: "transparent" },
    gold: { bg: COLORS.goldGlow, color: COLORS.gold, border: "transparent" },
    info: { bg: COLORS.electricGlow, color: COLORS.electric, border: "transparent" },
  };
  const v = variants[variant] || variants.default;
  const sz = size === "sm" ? { px: 8, py: 3, fs: 11 } : { px: 12, py: 5, fs: 13 };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: v.bg, color: v.color, border: `1px solid ${v.border}`,
      padding: `${sz.py}px ${sz.px}px`, borderRadius: RADIUS.full,
      fontSize: sz.fs, fontWeight: 700, letterSpacing: "0.04em",
      textTransform: "uppercase", fontFamily: FONTS.body, lineHeight: 1,
    }}>
      {pulse && <span style={{
        width: 6, height: 6, borderRadius: "50%", background: v.color,
        animation: "pulse 1.5s ease-in-out infinite",
      }} />}
      {children}
    </span>
  );
}

function Button({ children, variant = "primary", size = "md", fullWidth, icon, disabled, onClick }) {
  const [hover, setHover] = useState(false);
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    border: "none", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: FONTS.body, fontWeight: 700, letterSpacing: "0.02em",
    borderRadius: RADIUS.lg, transition: "all 0.2s ease",
    width: fullWidth ? "100%" : "auto", opacity: disabled ? 0.4 : 1,
    position: "relative", overflow: "hidden",
  };
  const sizes = {
    sm: { padding: "8px 16px", fontSize: 13, minHeight: 36 },
    md: { padding: "12px 24px", fontSize: 15, minHeight: 48 },
    lg: { padding: "16px 32px", fontSize: 17, minHeight: 56 },
  };
  const variants = {
    primary: {
      background: hover ? COLORS.pitchDark : COLORS.pitch,
      color: COLORS.textInverse,
      boxShadow: hover ? `0 8px 24px ${COLORS.pitchGlow}` : `0 4px 12px ${COLORS.pitchGlow}`,
      transform: hover ? "translateY(-1px)" : "none",
    },
    secondary: {
      background: hover ? COLORS.surfaceHover : COLORS.surfaceElevated,
      color: COLORS.textPrimary,
      border: `1px solid ${COLORS.border}`,
      boxShadow: "none",
    },
    ghost: {
      background: hover ? COLORS.surfaceHover : "transparent",
      color: COLORS.textSecondary,
      boxShadow: "none",
    },
    danger: {
      background: hover ? COLORS.coralDark : COLORS.coral,
      color: "#fff",
      boxShadow: hover ? `0 8px 24px ${COLORS.coralGlow}` : "none",
    },
    gold: {
      background: hover ? COLORS.goldDark : COLORS.gold,
      color: COLORS.textInverse,
      boxShadow: hover ? `0 8px 24px ${COLORS.goldGlow}` : `0 4px 12px ${COLORS.goldGlow}`,
    },
  };
  return (
    <button
      style={{ ...base, ...sizes[size], ...variants[variant] }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <span style={{ display: "flex", fontSize: "1.1em" }}>{icon}</span>}
      {children}
    </button>
  );
}

function Card({ children, variant = "default", glow, onClick, style: customStyle }) {
  const [hover, setHover] = useState(false);
  const variants = {
    default: { bg: COLORS.surface, border: COLORS.borderSubtle },
    elevated: { bg: COLORS.surfaceElevated, border: COLORS.border },
    interactive: { bg: hover ? COLORS.surfaceHover : COLORS.surface, border: hover ? COLORS.pitch : COLORS.borderSubtle },
    live: { bg: COLORS.surface, border: COLORS.coral },
  };
  const v = variants[variant] || variants.default;
  return (
    <div
      style={{
        background: v.bg, border: `1px solid ${v.border}`, borderRadius: RADIUS.lg,
        padding: SPACING.xl, transition: "all 0.2s ease",
        cursor: onClick ? "pointer" : "default",
        boxShadow: glow ? `0 0 24px ${glow}` : (hover && onClick ? `0 8px 32px rgba(0,0,0,0.3)` : "none"),
        transform: hover && onClick ? "translateY(-2px)" : "none",
        ...customStyle,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function ProgressBar({ value, max = 100, label, color = COLORS.pitch, showValue = true }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ width: "100%" }}>
      {(label || showValue) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontFamily: FONTS.body, fontSize: 13 }}>
          {label && <span style={{ color: COLORS.textSecondary }}>{label}</span>}
          {showValue && <span style={{ color, fontWeight: 700 }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div style={{ height: 6, background: COLORS.surfaceHover, borderRadius: RADIUS.full, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, background: color, borderRadius: RADIUS.full,
          transition: "width 0.5s ease",
        }} />
      </div>
    </div>
  );
}

function Avatar({ name, size = 36, color = COLORS.electric }) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}33, ${color}66)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, color: color,
      fontFamily: FONTS.body, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function Timer({ minutes = 12, seconds = 34, label = "Cierra en", urgent }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      background: urgent ? COLORS.coralGlow : COLORS.surfaceElevated,
      border: `1px solid ${urgent ? COLORS.coral + "44" : COLORS.border}`,
      borderRadius: RADIUS.lg, padding: "8px 16px",
    }}>
      <span style={{ fontSize: 12, color: urgent ? COLORS.coral : COLORS.textMuted, fontFamily: FONTS.body, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </span>
      <span style={{
        fontSize: 22, fontWeight: 800, fontFamily: FONTS.mono,
        color: urgent ? COLORS.coral : COLORS.textPrimary,
        letterSpacing: "0.08em",
      }}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}

function BottomNav({ active = 0 }) {
  const tabs = [
    { label: "Hoy", icon: "🔥" },
    { label: "Partidos", icon: "⚽" },
    { label: "Rankings", icon: "🏆" },
    { label: "Perfil", icon: "👤" },
  ];
  return (
    <div style={{
      display: "flex", background: COLORS.deep, borderTop: `1px solid ${COLORS.border}`,
      padding: "8px 0 12px", justifyContent: "space-around",
    }}>
      {tabs.map((tab, i) => (
        <div key={i} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          cursor: "pointer", padding: "4px 16px",
        }}>
          <span style={{ fontSize: 20 }}>{tab.icon}</span>
          <span style={{
            fontSize: 10, fontWeight: i === active ? 700 : 500,
            color: i === active ? COLORS.pitch : COLORS.textMuted,
            fontFamily: FONTS.body, letterSpacing: "0.03em",
          }}>
            {tab.label}
          </span>
          {i === active && <div style={{
            width: 4, height: 4, borderRadius: "50%", background: COLORS.pitch,
            marginTop: 1,
          }} />}
        </div>
      ))}
    </div>
  );
}

function MatchHeader({ team1, team2, score1, score2, status, flag1 = "🇧🇷", flag2 = "🇦🇷" }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 20,
      padding: "20px 16px", background: COLORS.surfaceElevated,
      borderRadius: RADIUS.lg, border: `1px solid ${COLORS.borderSubtle}`,
    }}>
      <div style={{ textAlign: "center", flex: 1 }}>
        <div style={{ fontSize: 32 }}>{flag1}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary, fontFamily: FONTS.body, marginTop: 4 }}>{team1}</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: 32, fontWeight: 900, color: COLORS.textPrimary, fontFamily: FONTS.display,
          letterSpacing: "0.06em", lineHeight: 1,
        }}>
          {score1} <span style={{ color: COLORS.textMuted }}>–</span> {score2}
        </div>
        <Badge variant={status === "LIVE" ? "live" : status === "HT" ? "gold" : "default"} pulse={status === "LIVE"}>
          {status}
        </Badge>
      </div>
      <div style={{ textAlign: "center", flex: 1 }}>
        <div style={{ fontSize: 32 }}>{flag2}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary, fontFamily: FONTS.body, marginTop: 4 }}>{team2}</div>
      </div>
    </div>
  );
}

function QuestionCard({ number, total, question, options, selected, onSelect }) {
  return (
    <div style={{ padding: "0 4px" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 12,
      }}>
        <span style={{ color: COLORS.textMuted, fontSize: 13, fontFamily: FONTS.body, fontWeight: 600 }}>
          Pregunta {number} de {total}
        </span>
        <div style={{
          display: "flex", gap: 4,
        }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              width: i < number ? 24 : 24, height: 4,
              borderRadius: RADIUS.full,
              background: i < number ? COLORS.pitch : COLORS.surfaceHover,
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
      </div>
      <h3 style={{
        fontSize: FONT_SIZES.lg, fontWeight: 700, color: COLORS.textPrimary,
        fontFamily: FONTS.display, marginBottom: 20, lineHeight: 1.4,
      }}>
        {question}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect?.(i)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              width: "100%", textAlign: "left", border: `2px solid ${selected === i ? COLORS.pitch : COLORS.border}`,
              background: selected === i ? COLORS.pitchGlow : COLORS.surfaceElevated,
              borderRadius: RADIUS.md, padding: "14px 16px", cursor: "pointer",
              transition: "all 0.15s ease", fontFamily: FONTS.body,
              fontSize: 15, fontWeight: selected === i ? 700 : 500,
              color: selected === i ? COLORS.pitch : COLORS.textPrimary,
              minHeight: 48,
            }}
          >
            <span style={{
              width: 28, height: 28, borderRadius: "50%",
              border: `2px solid ${selected === i ? COLORS.pitch : COLORS.border}`,
              background: selected === i ? COLORS.pitch : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800, color: selected === i ? COLORS.textInverse : COLORS.textMuted,
              flexShrink: 0, transition: "all 0.15s ease",
            }}>
              {selected === i ? "✓" : String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function RankingRow({ position, name, points, trend, isUser, avatar }) {
  const trendColors = { up: COLORS.pitch, down: COLORS.coral, same: COLORS.textMuted };
  const trendIcons = { up: "▲", down: "▼", same: "–" };
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
      background: isUser ? COLORS.pitchGlow : "transparent",
      borderRadius: RADIUS.md, border: isUser ? `1px solid ${COLORS.pitch}44` : "1px solid transparent",
      transition: "all 0.2s ease",
    }}>
      <span style={{
        width: 28, textAlign: "center", fontSize: 14, fontWeight: 800,
        color: position <= 3 ? COLORS.gold : COLORS.textMuted, fontFamily: FONTS.mono,
      }}>
        {position <= 3 ? ["🥇", "🥈", "🥉"][position - 1] : `#${position}`}
      </span>
      <Avatar name={name} size={32} color={isUser ? COLORS.pitch : COLORS.electric} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: isUser ? 700 : 500, color: COLORS.textPrimary, fontFamily: FONTS.body }}>
          {name} {isUser && <span style={{ fontSize: 11, color: COLORS.pitch }}>(tú)</span>}
        </div>
      </div>
      <span style={{ fontSize: 11, color: trendColors[trend], fontWeight: 700, fontFamily: FONTS.mono }}>
        {trendIcons[trend]}
      </span>
      <span style={{
        fontSize: 16, fontWeight: 800, color: COLORS.textPrimary, fontFamily: FONTS.mono,
        minWidth: 40, textAlign: "right",
      }}>
        {points}
      </span>
    </div>
  );
}

function ConfirmationCheck({ visible }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
      padding: 32, opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.8)",
      transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%", background: COLORS.pitchGlow,
        border: `3px solid ${COLORS.pitch}`, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 36,
        boxShadow: `0 0 40px ${COLORS.pitchGlow}`,
        animation: visible ? "confirmBounce 0.6s ease" : "none",
      }}>
        ✓
      </div>
      <div style={{ textAlign: "center" }}>
        <h3 style={{ color: COLORS.pitch, fontFamily: FONTS.display, fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>
          ¡Participación registrada!
        </h3>
        <p style={{ color: COLORS.textSecondary, fontFamily: FONTS.body, fontSize: 13, margin: 0 }}>
          25 abr 2026 · 16:42:31 GMT-3
        </p>
      </div>
    </div>
  );
}

function NotificationPreview({ type = "halftime" }) {
  const configs = {
    halftime: {
      title: "⚽ Medio tiempo: BRA 1 – 0 ARG",
      body: "¿Quién marca primero en el 2T? Participa ahora.",
      time: "Ahora",
    },
    result: {
      title: "🏆 Resultados: BRA 2 – 1 ARG",
      body: "Acertaste 3/5 · Posición #42 · +15 pts",
      time: "Hace 2 min",
    },
    reminder: {
      title: "⏰ Últimos 5 minutos",
      body: "¡No te quedes fuera! BRA-ARG cierra pronto.",
      time: "Ahora",
    },
  };
  const cfg = configs[type];
  return (
    <div style={{
      background: COLORS.surfaceElevated, borderRadius: RADIUS.lg,
      padding: "12px 16px", border: `1px solid ${COLORS.border}`,
      display: "flex", gap: 12, alignItems: "flex-start",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: RADIUS.sm, background: COLORS.pitchGlow,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
      }}>
        Q
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary, fontFamily: FONTS.body }}>
            {cfg.title}
          </span>
          <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.body, flexShrink: 0 }}>
            {cfg.time}
          </span>
        </div>
        <p style={{ fontSize: 12, color: COLORS.textSecondary, fontFamily: FONTS.body, margin: "3px 0 0", lineHeight: 1.4 }}>
          {cfg.body}
        </p>
      </div>
    </div>
  );
}

function InputField({ label, placeholder, type = "text", error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.textSecondary, fontFamily: FONTS.body }}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", boxSizing: "border-box",
          padding: "12px 16px", fontSize: 15, fontFamily: FONTS.body,
          background: COLORS.surfaceElevated, color: COLORS.textPrimary,
          border: `2px solid ${error ? COLORS.coral : focused ? COLORS.pitch : COLORS.border}`,
          borderRadius: RADIUS.md, outline: "none",
          transition: "border-color 0.15s ease",
          minHeight: 48,
        }}
      />
      {error && <span style={{ fontSize: 12, color: COLORS.coral, fontFamily: FONTS.body }}>{error}</span>}
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    "Próximo": { bg: COLORS.surfaceHover, color: COLORS.textSecondary, border: COLORS.border },
    "En juego": { bg: COLORS.coralGlow, color: COLORS.coral, border: COLORS.coral + "44" },
    "Medio tiempo": { bg: COLORS.goldGlow, color: COLORS.gold, border: COLORS.gold + "44" },
    "Finalizado": { bg: COLORS.surfaceHover, color: COLORS.textMuted, border: COLORS.borderSubtle },
    "Participaste": { bg: COLORS.pitchGlow, color: COLORS.pitch, border: COLORS.pitch + "44" },
  };
  const s = map[status] || map["Próximo"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 10px", borderRadius: RADIUS.full,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontSize: 11, fontWeight: 700, fontFamily: FONTS.body,
      textTransform: "uppercase", letterSpacing: "0.04em",
    }}>
      {(status === "En juego" || status === "Medio tiempo") && (
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, animation: "pulse 1.5s infinite" }} />
      )}
      {status}
    </span>
  );
}


// ===== MAIN DESIGN SYSTEM SHOWCASE =====

export default function DesignSystem() {
  const [activeSection, setActiveSection] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const sections = [
    "Fundamentos", "Colores", "Tipografía", "Componentes",
    "Patrones", "Flujos Clave"
  ];

  const colorGroups = [
    { label: "Core — Stadium Nights", colors: [
      { name: "midnight", hex: COLORS.midnight }, { name: "deep", hex: COLORS.deep },
      { name: "surface", hex: COLORS.surface }, { name: "surfaceElevated", hex: COLORS.surfaceElevated },
    ]},
    { label: "Pitch Green — Acción Primaria", colors: [
      { name: "pitch", hex: COLORS.pitch }, { name: "pitchDark", hex: COLORS.pitchDark },
      { name: "pitchGlow", hex: "rgba(0,230,118,0.15)" },
    ]},
    { label: "Trophy Gold — Premios", colors: [
      { name: "gold", hex: COLORS.gold }, { name: "goldDark", hex: COLORS.goldDark },
    ]},
    { label: "Coral — Urgencia / Error", colors: [
      { name: "coral", hex: COLORS.coral }, { name: "coralDark", hex: COLORS.coralDark },
    ]},
    { label: "Electric Blue — Info", colors: [
      { name: "electric", hex: COLORS.electric }, { name: "electricDark", hex: COLORS.electricDark },
    ]},
    { label: "Texto", colors: [
      { name: "textPrimary", hex: COLORS.textPrimary }, { name: "textSecondary", hex: COLORS.textSecondary },
      { name: "textMuted", hex: COLORS.textMuted },
    ]},
  ];

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.midnight, color: COLORS.textPrimary,
      fontFamily: FONTS.body, overflow: "auto",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&family=JetBrains+Mono:wght@500;700&display=swap');
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes confirmBounce { 0% { transform: scale(0.3); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.deep}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <header style={{
        padding: "40px 32px 32px",
        background: COLORS.gradientHero,
        borderBottom: `1px solid ${COLORS.borderSubtle}`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -60, right: -60, width: 200, height: 200,
          borderRadius: "50%", background: COLORS.pitchGlow, filter: "blur(80px)",
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: "30%", width: 160, height: 160,
          borderRadius: "50%", background: COLORS.goldGlow, filter: "blur(60px)",
        }} />
        <div style={{ position: "relative", maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: RADIUS.md,
              background: COLORS.gradientPitch, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 20, fontWeight: 900, color: COLORS.textInverse,
            }}>
              Q
            </div>
            <Badge variant="success" size="sm">v1.0</Badge>
          </div>
          <h1 style={{
            fontSize: 32, fontWeight: 900, fontFamily: FONTS.display,
            letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 8,
          }}>
            Quiniela Mundial 2026
          </h1>
          <h2 style={{
            fontSize: 18, fontWeight: 400, color: COLORS.textSecondary,
            fontFamily: FONTS.body, lineHeight: 1.5,
          }}>
            Design System & Component Library
          </h2>
          <p style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 12, maxWidth: 600, lineHeight: 1.6 }}>
            Sistema de diseño construido sobre investigación UX de 8 competidores (Prodefy, WC Predictor, Quiniela Pro, Duelazo, Easypromos), optimizado para mobile-first, flujos de 60 segundos y participación en ventanas de medio tiempo.
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{
        padding: "0 32px", background: COLORS.deep,
        borderBottom: `1px solid ${COLORS.borderSubtle}`,
        overflowX: "auto", whiteSpace: "nowrap",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", gap: 0 }}>
          {sections.map((s, i) => (
            <button key={i} onClick={() => setActiveSection(i)} style={{
              padding: "14px 20px", fontSize: 13, fontWeight: i === activeSection ? 700 : 500,
              color: i === activeSection ? COLORS.pitch : COLORS.textMuted,
              background: "transparent", border: "none", cursor: "pointer",
              fontFamily: FONTS.body, borderBottom: i === activeSection ? `2px solid ${COLORS.pitch}` : "2px solid transparent",
              transition: "all 0.15s ease", flexShrink: 0,
            }}>
              {s}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 32px 120px" }}>

        {/* SECTION: Fundamentos */}
        {activeSection === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 40, animation: "fadeInUp 0.3s ease" }}>
            <div>
              <SectionTitle>Principios de Diseño</SectionTitle>
              <p style={{ color: COLORS.textSecondary, fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                Derivados de la investigación UX, análisis de 8 competidores y datos del Mundial 2022. Cada principio resuelve un problema real detectado en el benchmarking.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                {[
                  { icon: "⚡", title: "60 Segundos o Menos", desc: "Ningún competidor ofrece ventanas en vivo. El medio tiempo (15 min) es nuestro diferenciador — cada flujo debe completarse en <60s.", color: COLORS.pitch },
                  { icon: "✓", title: "Confirmación Inequívoca", desc: "Quiniela Pro tiene reseñas de 'la app se cierra y no guarda'. La confirmación multisensorial (visual + háptica) es P0.", color: COLORS.gold },
                  { icon: "☐", title: "Una Acción por Pantalla", desc: "Duelazo y Q. Master triunfan con simplicidad radical: una decisión clara por pantalla, formato card-swipe.", color: COLORS.electric },
                  { icon: "📋", title: "Contexto sin Sobrecarga", desc: "Marcador y minuto visibles pero no compiten con la acción. Progressive disclosure: resumen visible, detalle expandible.", color: COLORS.coral },
                  { icon: "🔄", title: "Recurrencia Nativa", desc: "Prodefy retiene vía grupos + notificaciones contextuales. Cada pantalla terminal incluye CTA al próximo partido.", color: COLORS.pitch },
                ].map((p, i) => (
                  <Card key={i} variant="elevated">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: RADIUS.md,
                        background: p.color + "1A", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 18,
                      }}>
                        {p.icon}
                      </div>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary, fontFamily: FONTS.display }}>{p.title}</h4>
                    </div>
                    <p style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>{p.desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <SectionTitle>Decisiones Clave del Benchmarking</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  { decision: "Mobile-first obligatorio", source: ">80% tráfico móvil LATAM (Mundial 2022)", priority: "P0" },
                  { decision: "Tab 'Hoy' como inicio", source: "90% de visitas buscan partido actual", priority: "P0" },
                  { decision: "Registro máx. 3 campos + login social", source: "40% abandonan por procesos complejos (InDataLabs)", priority: "P0" },
                  { decision: "Deep link desde notificación push", source: "Ningún competidor tiene ventanas en vivo — cada segundo cuenta", priority: "P0" },
                  { decision: "Guardado local offline-first con retry", source: "Picos de tráfico en HT, resiliencia crítica", priority: "P0" },
                  { decision: "Share vía WhatsApp post-participación", source: "Canal #1 en LATAM, driver principal de viralidad", priority: "P1" },
                ].map((d, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "12px 16px", background: i % 2 === 0 ? COLORS.surface : "transparent",
                    borderRadius: RADIUS.sm,
                  }}>
                    <Badge variant={d.priority === "P0" ? "live" : "info"} size="sm">{d.priority}</Badge>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>{d.decision}</span>
                      <span style={{ fontSize: 12, color: COLORS.textMuted, marginLeft: 8 }}>— {d.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionTitle>Espaciado & Radios</SectionTitle>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 8 }}>
                {Object.entries(SPACING).map(([key, val]) => (
                  <div key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ width: val, height: val, background: COLORS.pitchGlow, border: `1px solid ${COLORS.pitch}44`, borderRadius: 2 }} />
                    <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.mono }}>{key}: {val}px</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 24 }}>
                {Object.entries(RADIUS).map(([key, val]) => (
                  <div key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 48, height: 48, background: COLORS.surfaceElevated, border: `1px solid ${COLORS.border}`, borderRadius: val }} />
                    <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.mono }}>{key}: {val}px</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: Colores */}
        {activeSection === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32, animation: "fadeInUp 0.3s ease" }}>
            <div>
              <SectionTitle>Paleta de Colores — "Stadium Nights"</SectionTitle>
              <p style={{ color: COLORS.textSecondary, fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                Inspirada en la atmósfera nocturna del estadio: fondos profundos con acentos vibrantes. El verde pitch evoca la cancha, el dorado celebra victorias, el coral genera urgencia para las ventanas de medio tiempo.
              </p>
            </div>
            {colorGroups.map((group, gi) => (
              <div key={gi}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: COLORS.textMuted, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {group.label}
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {group.colors.map((c, ci) => (
                    <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{
                        width: 80, height: 64, borderRadius: RADIUS.md,
                        background: c.hex, border: `1px solid ${COLORS.border}`,
                      }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.textPrimary, fontFamily: FONTS.body }}>{c.name}</span>
                      <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.mono }}>{c.hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: COLORS.textMuted, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Gradientes
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {[
                  { name: "gradientPitch", val: COLORS.gradientPitch },
                  { name: "gradientGold", val: COLORS.gradientGold },
                  { name: "gradientCoral", val: COLORS.gradientCoral },
                  { name: "gradientHero", val: COLORS.gradientHero },
                  { name: "gradientSurface", val: COLORS.gradientSurface },
                ].map((g, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ width: 120, height: 64, borderRadius: RADIUS.md, background: g.val, border: `1px solid ${COLORS.border}` }} />
                    <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.mono }}>{g.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: Tipografía */}
        {activeSection === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32, animation: "fadeInUp 0.3s ease" }}>
            <SectionTitle>Tipografía</SectionTitle>
            <p style={{ color: COLORS.textSecondary, fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>
              DM Sans como fuente principal — geométrica pero cálida, legible en mobile a cualquier tamaño. JetBrains Mono para datos numéricos (timers, puntajes, rankings) donde la alineación monoespaciada importa.
            </p>

            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: COLORS.textMuted, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Escala Tipográfica
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { label: "Hero", size: 36, weight: 900, sample: "Mundial 2026" },
                  { label: "XXL", size: 28, weight: 800, sample: "¡Participación registrada!" },
                  { label: "XL", size: 22, weight: 700, sample: "Partidos de hoy" },
                  { label: "LG", size: 18, weight: 700, sample: "¿Quién marca primero en el 2T?" },
                  { label: "MD", size: 15, weight: 500, sample: "Selecciona tu respuesta para continuar" },
                  { label: "SM", size: 13, weight: 500, sample: "Pregunta 3 de 5 · Medio tiempo" },
                  { label: "XS", size: 11, weight: 600, sample: "25 ABR 2026 · 16:42 GMT-3" },
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 16, paddingBottom: 16, borderBottom: `1px solid ${COLORS.borderSubtle}` }}>
                    <div style={{ width: 48, flexShrink: 0 }}>
                      <Badge variant="default" size="sm">{t.label}</Badge>
                    </div>
                    <span style={{ fontSize: t.size, fontWeight: t.weight, fontFamily: FONTS.display, color: COLORS.textPrimary, lineHeight: 1.2 }}>
                      {t.sample}
                    </span>
                    <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: FONTS.mono, flexShrink: 0 }}>
                      {t.size}px / {t.weight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: COLORS.textMuted, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Monoespaciada — Datos & Timers
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 700, fontFamily: FONTS.mono, color: COLORS.textPrimary, letterSpacing: "0.08em" }}>12:34</div>
                  <span style={{ fontSize: 11, color: COLORS.textMuted }}>Timer</span>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 700, fontFamily: FONTS.mono, color: COLORS.gold }}>247</div>
                  <span style={{ fontSize: 11, color: COLORS.textMuted }}>Puntaje</span>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 700, fontFamily: FONTS.mono, color: COLORS.pitch }}>#42</div>
                  <span style={{ fontSize: 11, color: COLORS.textMuted }}>Ranking</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: Componentes */}
        {activeSection === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 40, animation: "fadeInUp 0.3s ease" }}>
            <div>
              <SectionTitle>Botones</SectionTitle>
              <p style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
                Mínimo 48px de altura para cumplir con touch targets mobile-first. El primario usa pitch green para acción principal.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <Button variant="primary">Participar ahora</Button>
                <Button variant="secondary">Ver ranking</Button>
                <Button variant="gold" icon="🏆">Premios</Button>
                <Button variant="ghost">Saltar</Button>
                <Button variant="danger">Cerrar ventana</Button>
                <Button variant="primary" disabled>Enviando...</Button>
              </div>
              <div style={{ marginTop: 16, maxWidth: 320 }}>
                <Button variant="primary" fullWidth size="lg">Enviar respuestas</Button>
              </div>
            </div>

            <div>
              <SectionTitle>Badges & Status Pills</SectionTitle>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <Badge>Default</Badge>
                <Badge variant="live" pulse>EN VIVO</Badge>
                <Badge variant="success">Enviado</Badge>
                <Badge variant="gold">Ganador</Badge>
                <Badge variant="info">Grupo A</Badge>
                <StatusPill status="Próximo" />
                <StatusPill status="En juego" />
                <StatusPill status="Medio tiempo" />
                <StatusPill status="Finalizado" />
                <StatusPill status="Participaste" />
              </div>
            </div>

            <div>
              <SectionTitle>Cards</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                <Card variant="default"><p style={{ fontSize: 13, color: COLORS.textSecondary }}>Card default — contenido base</p></Card>
                <Card variant="elevated"><p style={{ fontSize: 13, color: COLORS.textSecondary }}>Card elevated — elementos prominentes</p></Card>
                <Card variant="interactive" onClick={() => {}}><p style={{ fontSize: 13, color: COLORS.textSecondary }}>Card interactive — hover con borde pitch</p></Card>
                <Card variant="live" glow={COLORS.coralGlow}><p style={{ fontSize: 13, color: COLORS.textSecondary }}>Card live — borde coral con glow</p></Card>
              </div>
            </div>

            <div>
              <SectionTitle>Timer</SectionTitle>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                <Timer minutes={12} seconds={34} />
                <Timer minutes={4} seconds={58} urgent label="¡Cierra en" />
              </div>
            </div>

            <div>
              <SectionTitle>Formulario de Registro</SectionTitle>
              <p style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 16 }}>
                Máximo 3 campos. Login social como alternativa. Cumple heurística de "prevención de errores".
              </p>
              <div style={{ maxWidth: 360, display: "flex", flexDirection: "column", gap: 16 }}>
                <InputField label="Nombre o apodo" placeholder="Ej: Carlos_BRA" />
                <InputField label="Email o teléfono" placeholder="tu@email.com" type="email" />
                <InputField label="Contraseña" placeholder="Mínimo 6 caracteres" type="password" error="" />
                <Button variant="primary" fullWidth>Crear cuenta</Button>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, height: 1, background: COLORS.border }} />
                  <span style={{ fontSize: 12, color: COLORS.textMuted }}>o continúa con</span>
                  <div style={{ flex: 1, height: 1, background: COLORS.border }} />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <Button variant="secondary" fullWidth>Google</Button>
                  <Button variant="secondary" fullWidth>Apple</Button>
                </div>
              </div>
            </div>

            <div>
              <SectionTitle>Progress Bar</SectionTitle>
              <div style={{ maxWidth: 400, display: "flex", flexDirection: "column", gap: 20 }}>
                <ProgressBar value={60} label="Participación en ventana" />
                <ProgressBar value={85} label="Tasa de completación" color={COLORS.gold} />
                <ProgressBar value={25} label="Tiempo restante" color={COLORS.coral} />
              </div>
            </div>

            <div>
              <SectionTitle>Avatares</SectionTitle>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Avatar name="María López" size={44} color={COLORS.pitch} />
                <Avatar name="Carlos Ramírez" size={44} color={COLORS.electric} />
                <Avatar name="Laura Gómez" size={44} color={COLORS.gold} />
                <Avatar name="Diego Mora" size={44} color={COLORS.coral} />
              </div>
            </div>

            <div>
              <SectionTitle>Notificaciones Push</SectionTitle>
              <p style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 16 }}>
                Copy contextual con equipos y marcador. Máx. 3-4 por día de partido. Driver principal de retorno.
              </p>
              <div style={{ maxWidth: 400, display: "flex", flexDirection: "column", gap: 12 }}>
                <NotificationPreview type="halftime" />
                <NotificationPreview type="reminder" />
                <NotificationPreview type="result" />
              </div>
            </div>
          </div>
        )}

        {/* SECTION: Patrones */}
        {activeSection === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 40, animation: "fadeInUp 0.3s ease" }}>
            <div>
              <SectionTitle>Match Header — Contexto Compacto</SectionTitle>
              <p style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 16 }}>
                Visible pero no compite con la pregunta. Marcador + estado en header para dar referencia sin sobrecarga.
              </p>
              <div style={{ maxWidth: 400 }}>
                <MatchHeader team1="Brasil" team2="Argentina" score1={1} score2={0} status="HT" />
              </div>
            </div>

            <div>
              <SectionTitle>Question Card — Una Acción por Pantalla</SectionTitle>
              <p style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 16 }}>
                Formato card-swipe. Barra de progreso superior. Opciones como botones grandes (48px mín). El patrón más exitoso de Duelazo y Q. Master.
              </p>
              <div style={{ maxWidth: 400 }}>
                <Card variant="elevated">
                  <QuestionCard
                    number={3}
                    total={5}
                    question="¿Quién marca el próximo gol?"
                    options={["Brasil", "Argentina", "Ninguno (sin goles en 2T)"]}
                    selected={selectedOption}
                    onSelect={setSelectedOption}
                  />
                </Card>
              </div>
            </div>

            <div>
              <SectionTitle>Confirmación Multisensorial</SectionTitle>
              <p style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 16 }}>
                Checkmark animado + timestamp visible. Resuelve la queja principal de Quiniela Pro (pérdida de respuestas). El usuario debe SENTIR que su participación fue registrada.
              </p>
              <div style={{ maxWidth: 400 }}>
                <Card variant="elevated" glow={COLORS.pitchGlow}>
                  <ConfirmationCheck visible={showConfirm} />
                  {!showConfirm && (
                    <div style={{ textAlign: "center", padding: 20 }}>
                      <Button variant="primary" onClick={() => setShowConfirm(true)}>
                        Simular confirmación
                      </Button>
                    </div>
                  )}
                  {showConfirm && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                      <Button variant="primary" fullWidth icon="📱">Compartir en WhatsApp</Button>
                      <Button variant="ghost" fullWidth onClick={() => setShowConfirm(false)}>Ver mis respuestas</Button>
                    </div>
                  )}
                </Card>
              </div>
            </div>

            <div>
              <SectionTitle>Ranking — Social & Competitividad</SectionTitle>
              <p style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 16 }}>
                Posición general + grupal. El principal motivador de recurrencia según Prodefy. Historial de aciertos acumulado.
              </p>
              <div style={{ maxWidth: 400 }}>
                <Card variant="elevated" style={{ padding: 8 }}>
                  {[
                    { pos: 1, name: "Ana Martínez", pts: 247, trend: "up" },
                    { pos: 2, name: "Luis García", pts: 235, trend: "up" },
                    { pos: 3, name: "Pedro Sánchez", pts: 228, trend: "down" },
                    { pos: 4, name: "Carlos Ramírez", pts: 215, trend: "up", isUser: true },
                    { pos: 5, name: "Sofía Torres", pts: 201, trend: "same" },
                  ].map((r) => (
                    <RankingRow key={r.pos} position={r.pos} name={r.name} points={r.pts} trend={r.trend} isUser={r.isUser} />
                  ))}
                </Card>
              </div>
            </div>

            <div>
              <SectionTitle>Bottom Navigation — 4 Tabs</SectionTitle>
              <p style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 16 }}>
                Optimizada para uso con una mano. Tab "Hoy" como destino default (90% de las visitas buscan el partido actual).
              </p>
              <div style={{ maxWidth: 400, borderRadius: RADIUS.lg, overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
                <BottomNav active={activeTab} />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                {[0,1,2,3].map(i => (
                  <Button key={i} variant={activeTab === i ? "primary" : "ghost"} size="sm" onClick={() => setActiveTab(i)}>
                    Tab {i + 1}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <SectionTitle>Resiliencia UX — Estados de Conexión</SectionTitle>
              <div style={{ maxWidth: 400, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{
                  padding: "10px 16px", borderRadius: RADIUS.md,
                  background: COLORS.goldGlow, border: `1px solid ${COLORS.gold}33`,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{ fontSize: 14 }}>⚠️</span>
                  <span style={{ fontSize: 13, color: COLORS.gold, fontFamily: FONTS.body }}>
                    Tus respuestas están seguras. Se enviarán automáticamente.
                  </span>
                </div>
                <div style={{
                  padding: "10px 16px", borderRadius: RADIUS.md,
                  background: COLORS.pitchGlow, border: `1px solid ${COLORS.pitch}33`,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{ fontSize: 14 }}>✓</span>
                  <span style={{ fontSize: 13, color: COLORS.pitch, fontFamily: FONTS.body }}>
                    Guardado. Sincronizando...
                  </span>
                </div>
                <div style={{
                  padding: "10px 16px", borderRadius: RADIUS.md,
                  background: COLORS.coralGlow, border: `1px solid ${COLORS.coral}33`,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{ fontSize: 14 }}>⚠️</span>
                  <span style={{ fontSize: 13, color: COLORS.coral, fontFamily: FONTS.body }}>
                    La ventana se cerró. No alcanzaste a enviar.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: Flujos Clave */}
        {activeSection === 5 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 40, animation: "fadeInUp 0.3s ease" }}>
            <SectionTitle>Flujos Clave del MVP</SectionTitle>
            <p style={{ color: COLORS.textSecondary, fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>
              Tres journeys críticos derivados de la investigación. Cada paso mapeado con persona primaria, emoción y oportunidad UX.
            </p>

            {/* Journey 1 */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Badge variant="success" size="md">J1</Badge>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.textPrimary, fontFamily: FONTS.display }}>
                    Primer Registro y Participación
                  </h3>
                  <p style={{ fontSize: 13, color: COLORS.textMuted }}>Persona: María (Fan Casual) · Target: &lt;90 seg · Conversión: &gt;60%</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
                {[
                  { step: 1, label: "Descubrir", desc: "Link WhatsApp", emotion: "😯", time: "<2s carga" },
                  { step: 2, label: "Registrar", desc: "3 campos máx", emotion: "😤", time: "<20s" },
                  { step: 3, label: "Orientar", desc: "3 pasos skip", emotion: "🤔", time: "<5s" },
                  { step: 4, label: "Participar", desc: "5 cards swipe", emotion: "😃", time: "<30s" },
                  { step: 5, label: "Revisar", desc: "Resumen editable", emotion: "🧐", time: "<10s" },
                  { step: 6, label: "Confirmar", desc: "✓ + háptica", emotion: "😌", time: "Instant" },
                  { step: 7, label: "Esperar", desc: "Timer + estado", emotion: "🤞", time: "—" },
                  { step: 8, label: "Resultado", desc: "Push + ranking", emotion: "🎉", time: "Post" },
                ].map((s) => (
                  <div key={s.step} style={{
                    minWidth: 120, padding: 14, background: COLORS.surfaceElevated,
                    borderRadius: RADIUS.md, border: `1px solid ${COLORS.borderSubtle}`,
                    display: "flex", flexDirection: "column", gap: 6, flexShrink: 0,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.pitch, fontFamily: FONTS.mono }}>#{s.step}</span>
                      <span style={{ fontSize: 18 }}>{s.emotion}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary }}>{s.label}</span>
                    <span style={{ fontSize: 11, color: COLORS.textSecondary, lineHeight: 1.4 }}>{s.desc}</span>
                    <span style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: FONTS.mono }}>{s.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Journey 2 */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Badge variant="live" size="md">J2</Badge>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.textPrimary, fontFamily: FONTS.display }}>
                    Participación en Medio Tiempo
                  </h3>
                  <p style={{ fontSize: 13, color: COLORS.textMuted }}>Persona: Carlos (Futbolero) · Target: &lt;60 seg · Diferenciador clave</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
                {[
                  { step: 1, label: "Activar", desc: "Push contextual", emotion: "🔔", color: COLORS.coral },
                  { step: 2, label: "Abrir", desc: "Deep link directo", emotion: "📱", color: COLORS.electric },
                  { step: 3, label: "Evaluar", desc: "Cards + contexto", emotion: "🤔", color: COLORS.gold },
                  { step: 4, label: "Responder", desc: "Tap-friendly 48px", emotion: "💪", color: COLORS.pitch },
                  { step: 5, label: "Enviar", desc: "Confirmación ✓", emotion: "😌", color: COLORS.pitch },
                  { step: 6, label: "Comparar", desc: "Stats populares", emotion: "📊", color: COLORS.electric },
                  { step: 7, label: "Retorno", desc: "CTA próximo", emotion: "🔄", color: COLORS.gold },
                ].map((s) => (
                  <div key={s.step} style={{
                    minWidth: 120, padding: 14, background: COLORS.surfaceElevated,
                    borderRadius: RADIUS.md, border: `1px solid ${s.color}33`,
                    display: "flex", flexDirection: "column", gap: 6, flexShrink: 0,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: s.color, fontFamily: FONTS.mono }}>#{s.step}</span>
                      <span style={{ fontSize: 18 }}>{s.emotion}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary }}>{s.label}</span>
                    <span style={{ fontSize: 11, color: COLORS.textSecondary, lineHeight: 1.4 }}>{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Métricas */}
            <div>
              <SectionTitle>Métricas Target del MVP</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                {[
                  { metric: "Tasa registro", target: ">50%", icon: "📝", color: COLORS.pitch },
                  { metric: "Primera participación", target: ">75%", icon: "🎯", color: COLORS.electric },
                  { metric: "Registro → envío", target: "<90 seg", icon: "⚡", color: COLORS.gold },
                  { metric: "Completación form", target: ">90%", icon: "✅", color: COLORS.pitch },
                  { metric: "Recurrencia", target: ">60%", icon: "🔄", color: COLORS.electric },
                  { metric: "Éxito de envío", target: ">99.5%", icon: "💪", color: COLORS.coral },
                  { metric: "Notif → envío HT", target: "<60 seg", icon: "⏱️", color: COLORS.gold },
                  { metric: "Error ganadores", target: "0%", icon: "🛡️", color: COLORS.coral },
                ].map((m, i) => (
                  <Card key={i} variant="elevated">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{m.icon}</span>
                      <span style={{ fontSize: 13, color: COLORS.textSecondary, fontFamily: FONTS.body }}>{m.metric}</span>
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: m.color, fontFamily: FONTS.mono }}>
                      {m.target}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Token Export */}
            <div>
              <SectionTitle>Exportar Tokens</SectionTitle>
              <Card variant="elevated">
                <pre style={{
                  fontSize: 12, fontFamily: FONTS.mono, color: COLORS.textSecondary,
                  lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre-wrap",
                }}>
{`// Design Tokens — Quiniela Mundial 2026
// Copy this to your project's theme file

export const theme = {
  colors: {
    midnight: "${COLORS.midnight}",
    deep: "${COLORS.deep}",
    surface: "${COLORS.surface}",
    surfaceElevated: "${COLORS.surfaceElevated}",
    pitch: "${COLORS.pitch}",
    pitchDark: "${COLORS.pitchDark}",
    gold: "${COLORS.gold}",
    coral: "${COLORS.coral}",
    electric: "${COLORS.electric}",
    textPrimary: "${COLORS.textPrimary}",
    textSecondary: "${COLORS.textSecondary}",
    textMuted: "${COLORS.textMuted}",
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  radius: { sm: 6, md: 10, lg: 14, xl: 20, full: 9999 },
  fonts: {
    display: "DM Sans, sans-serif",
    mono: "JetBrains Mono, monospace",
  },
  breakpoints: { mobile: 375, tablet: 768, desktop: 1024 },
  touchTarget: 48, // minimum px for mobile
};`}
                </pre>
              </Card>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 style={{
      fontSize: 20, fontWeight: 800, color: COLORS.textPrimary,
      fontFamily: FONTS.display, marginBottom: 8, letterSpacing: "-0.01em",
      paddingBottom: 12, borderBottom: `1px solid ${COLORS.borderSubtle}`,
    }}>
      {children}
    </h3>
  );
}
