// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from "react";

// ─── Design Tokens (Stadium Nights) ───
const t = {
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
  pitchMuted: "#0D3A2A",
  gold: "#FFD740",
  goldDark: "#FFC400",
  goldGlow: "rgba(255, 215, 64, 0.12)",
  goldMuted: "#3A3020",
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
};

// ─── Intersection Observer Hook ───
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Animated Section Wrapper ───
function Reveal({ children, delay = 0, style = {} }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Badge Component ───
function Badge({ children, color = t.pitch, glow = t.pitchGlow, small = false }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: small ? "2px 8px" : "4px 12px",
        borderRadius: 9999,
        fontSize: small ? 10 : 11,
        fontWeight: 700,
        fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color,
        background: glow,
        border: `1px solid ${color}22`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

// ─── Section Label ───
function SectionLabel({ number, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
      <span
        style={{
          fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
          fontSize: 12,
          fontWeight: 800,
          color: t.pitch,
          letterSpacing: "0.08em",
        }}
      >
        {number}
      </span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: t.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {text}
      </span>
      <div style={{ flex: 1, height: 1, background: t.borderSubtle }} />
    </div>
  );
}

// ─── IA Tree Node ───
function TreeNode({ label, icon, badge, badgeColor, badgeGlow, children, level = 0, color = t.textPrimary, isDefault = false }) {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = children && children.length > 0;
  return (
    <div style={{ marginLeft: level > 0 ? 20 : 0 }}>
      <div
        onClick={() => hasChildren && setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 10px",
          borderRadius: 8,
          cursor: hasChildren ? "pointer" : "default",
          background: isDefault ? t.pitchGlow : "transparent",
          border: isDefault ? `1px solid ${t.pitch}22` : "1px solid transparent",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => { if (!isDefault) e.currentTarget.style.background = t.surfaceHover; }}
        onMouseLeave={(e) => { if (!isDefault) e.currentTarget.style.background = "transparent"; }}
      >
        {hasChildren && (
          <span
            style={{
              fontSize: 9,
              color: t.textMuted,
              transition: "transform 0.2s",
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
              display: "inline-block",
              width: 12,
              textAlign: "center",
            }}
          >
            ▶
          </span>
        )}
        {!hasChildren && <span style={{ width: 12 }} />}
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span
          style={{
            fontSize: level === 0 ? 14 : 13,
            fontWeight: level === 0 ? 700 : (level === 1 ? 600 : 400),
            color: level === 0 ? color : (level === 1 ? t.textPrimary : t.textSecondary),
            fontFamily: "'DM Sans', 'Avenir Next', sans-serif",
          }}
        >
          {label}
        </span>
        {badge && (
          <Badge color={badgeColor || t.pitch} glow={badgeGlow || t.pitchGlow} small>
            {badge}
          </Badge>
        )}
      </div>
      {expanded && hasChildren && (
        <div style={{ borderLeft: `1px solid ${t.borderSubtle}`, marginLeft: 16, paddingLeft: 4, marginTop: 2 }}>
          {children.map((child, i) => (
            <TreeNode key={i} {...child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Flow Step ───
function FlowStep({ number, phase, emotion, screen, time, color, isLast = false }) {
  return (
    <div style={{ display: "flex", gap: 16, position: "relative" }}>
      {/* Vertical line */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32, flexShrink: 0 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: `${color}18`,
            border: `2px solid ${color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
            fontSize: 12,
            fontWeight: 800,
            color,
            flexShrink: 0,
          }}
        >
          {number}
        </div>
        {!isLast && (
          <div style={{ width: 2, flex: 1, background: `linear-gradient(${color}44, ${color}08)`, minHeight: 20 }} />
        )}
      </div>
      {/* Content */}
      <div style={{ paddingBottom: isLast ? 0 : 16, flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: t.textPrimary }}>{phase}</span>
          <span style={{ fontSize: 11, color: t.textMuted }}>·</span>
          <span style={{ fontSize: 12, color: t.textSecondary, fontStyle: "italic" }}>{emotion}</span>
          {time && (
            <span
              style={{
                marginLeft: "auto",
                fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
                fontSize: 11,
                fontWeight: 600,
                color,
                background: `${color}12`,
                padding: "2px 8px",
                borderRadius: 6,
              }}
            >
              {time}
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: t.textMuted, marginTop: 3 }}>{screen}</div>
      </div>
    </div>
  );
}

// ─── Persona Card ───
function PersonaCard({ name, age, emoji, role, motivation, color, journeys }) {
  return (
    <div
      style={{
        background: t.surface,
        borderRadius: 14,
        padding: 20,
        border: `1px solid ${t.borderSubtle}`,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: `${color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            border: `2px solid ${color}33`,
            flexShrink: 0,
          }}
        >
          {emoji}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary }}>{name}, {age}</div>
          <div style={{ fontSize: 12, color, fontWeight: 600 }}>{role}</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.5 }}>{motivation}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {journeys.map((j, i) => (
          <Badge key={i} color={t.textSecondary} glow={t.surfaceHover} small>{j}</Badge>
        ))}
      </div>
    </div>
  );
}

// ─── Principle Card ───
function PrincipleCard({ number, title, description, icon }) {
  return (
    <div
      style={{
        background: t.surface,
        borderRadius: 14,
        padding: 20,
        border: `1px solid ${t.borderSubtle}`,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
            fontSize: 10,
            fontWeight: 800,
            color: t.pitch,
            letterSpacing: "0.08em",
            background: t.pitchGlow,
            padding: "2px 8px",
            borderRadius: 6,
          }}
        >
          P{number}
        </span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary, lineHeight: 1.3 }}>{title}</div>
      <div style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.5 }}>{description}</div>
    </div>
  );
}

// ─── Tab Bar Preview ───
function TabBarPreview({ activeTab, onTabChange }) {
  const tabs = [
    { id: "hoy", label: "Hoy", icon: "🔥" },
    { id: "partidos", label: "Partidos", icon: "⚽" },
    { id: "rankings", label: "Rankings", icon: "🏆" },
    { id: "perfil", label: "Perfil", icon: "👤" },
  ];
  return (
    <div
      style={{
        background: t.deep,
        borderTop: `1px solid ${t.border}`,
        borderRadius: "0 0 14px 14px",
        display: "flex",
        padding: "8px 0 10px",
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 0",
              position: "relative",
            }}
          >
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? t.pitch : t.textMuted,
                fontFamily: "'DM Sans', 'Avenir Next', sans-serif",
              }}
            >
              {tab.label}
            </span>
            {isActive && (
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: t.pitch,
                  position: "absolute",
                  bottom: 0,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Phone Mockup ───
function PhoneMockup({ children, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 220,
          borderRadius: 24,
          border: `2px solid ${t.border}`,
          background: t.midnight,
          overflow: "hidden",
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 80px ${t.pitchGlow}`,
        }}
      >
        {/* Notch */}
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 0" }}>
          <div style={{ width: 60, height: 5, borderRadius: 9999, background: t.surfaceHover }} />
        </div>
        {children}
      </div>
      {label && (
        <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, textAlign: "center" }}>{label}</span>
      )}
    </div>
  );
}

// ─── Flow Journey Card ───
function FlowJourneyCard({ title, persona, constraint, color, steps, badge }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      style={{
        background: t.surface,
        borderRadius: 14,
        border: `1px solid ${t.borderSubtle}`,
        overflow: "hidden",
        transition: "border-color 0.3s",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "20px 24px",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 16,
          textAlign: "left",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: `${color}15`,
            border: `2px solid ${color}33`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {badge}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.textPrimary }}>{title}</div>
          <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 2 }}>
            {persona} · <span style={{ color }}>{constraint}</span>
          </div>
        </div>
        <span
          style={{
            fontSize: 14,
            color: t.textMuted,
            transition: "transform 0.3s",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div style={{ padding: "0 24px 24px" }}>
          <div style={{ height: 1, background: t.borderSubtle, marginBottom: 20 }} />
          {steps.map((step, i) => (
            <FlowStep key={i} {...step} color={color} isLast={i === steps.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function QuinielaCaseStudy() {
  const [activeTab, setActiveTab] = useState("hoy");
  const [activeNavSection, setActiveNavSection] = useState("overview");

  const navSections = [
    { id: "overview", label: "Overview" },
    { id: "personas", label: "Personas" },
    { id: "ia", label: "Arquitectura" },
    { id: "flows", label: "User Flows" },
    { id: "states", label: "Estados" },
    { id: "principles", label: "Principios" },
  ];

  // ─── IA Tree Data ───
  const iaTree = [
    {
      label: "Experiencia de Usuario",
      icon: "🌐",
      color: t.pitch,
      badge: "MOBILE-FIRST",
      badgeColor: t.pitch,
      badgeGlow: t.pitchGlow,
      children: [
        { label: "Landing Page", icon: "🚀", badge: "ENTRY", badgeColor: t.electric, badgeGlow: t.electricGlow, children: [] },
        { label: "Registro / Login", icon: "🔐", children: [
          { label: "Form 3 campos (nombre, email, contraseña)", icon: "📝" },
          { label: "Login Social (Google, Apple)", icon: "🔗" },
          { label: "Modo Invitado (registro diferido)", icon: "👤" },
        ]},
        { label: "Onboarding (3 pasos, skipeable)", icon: "👋", children: [] },
        {
          label: "Tab — Hoy",
          icon: "🔥",
          isDefault: true,
          badge: "DEFAULT",
          badgeColor: t.pitch,
          badgeGlow: t.pitchGlow,
          children: [
            { label: "Partido activo / próximo", icon: "⚡", children: [
              { label: "Match Header (equipos, marcador, estado)", icon: "🏟" },
              { label: "Timer de ventana", icon: "⏱" },
              { label: "Estado de participación", icon: "✅" },
              { label: "→ Flujo de Participación", icon: "▶️", badge: "CORE", badgeColor: t.gold, badgeGlow: t.goldGlow },
            ]},
            { label: "Último resultado", icon: "📊" },
            { label: "Countdown al próximo evento", icon: "⏳" },
          ],
        },
        {
          label: "Tab — Partidos",
          icon: "⚽",
          children: [
            { label: "Calendario de partidos", icon: "📅", children: [
              { label: "Filtro por Grupo (A–L)", icon: "🏷" },
              { label: "Filtro por Equipo", icon: "🏴" },
              { label: "Filtro por Fecha", icon: "📆" },
            ]},
            { label: "Detalle de Partido", icon: "📋", children: [
              { label: "Estado y marcador", icon: "🔢" },
              { label: "Ventanas de participación", icon: "🪟" },
              { label: "Resultados (post-partido)", icon: "📈" },
            ]},
          ],
        },
        {
          label: "Tab — Rankings",
          icon: "🏆",
          children: [
            { label: "Ranking General", icon: "🌍" },
            { label: "Ranking de Grupo", icon: "👥" },
            { label: "Posición del usuario (highlight)", icon: "📍" },
            { label: "Historial de aciertos", icon: "📊" },
          ],
        },
        {
          label: "Tab — Perfil",
          icon: "👤",
          children: [
            { label: "Datos del usuario", icon: "🪪" },
            { label: "Historial de participaciones", icon: "📜", children: [
              { label: "Detalle por partido", icon: "🔎" },
              { label: "Tendencia visual", icon: "📉" },
            ]},
            { label: "Mis Grupos", icon: "👥", children: [
              { label: "Crear grupo", icon: "➕" },
              { label: "Link de invitación (WhatsApp)", icon: "💬" },
              { label: "Ranking grupal", icon: "🏅" },
            ]},
            { label: "Estado de premios", icon: "🎁" },
            { label: "Preferencias de notificaciones", icon: "🔔" },
            { label: "FAQ / Reglas del juego", icon: "❓" },
          ],
        },
        {
          label: "Flujo de Participación",
          icon: "🎯",
          badge: "CORE FLOW",
          badgeColor: t.gold,
          badgeGlow: t.goldGlow,
          children: [
            { label: "Match Header (persistente)", icon: "🏟" },
            { label: "Card Pregunta 1/5", icon: "1️⃣" },
            { label: "Card Pregunta 2/5", icon: "2️⃣" },
            { label: "Card Pregunta 3/5", icon: "3️⃣" },
            { label: "Card Pregunta 4/5", icon: "4️⃣" },
            { label: "Card Pregunta 5/5", icon: "5️⃣" },
            { label: "Pantalla de Resumen (editable)", icon: "📋" },
            { label: "Pantalla de Confirmación", icon: "✅", badge: "TRUST", badgeColor: t.pitch, badgeGlow: t.pitchGlow },
            { label: "Pantalla de Resultados", icon: "🏅" },
          ],
        },
      ],
    },
    {
      label: "Panel Administrativo",
      icon: "🔧",
      color: t.electric,
      badge: "DESKTOP",
      badgeColor: t.electric,
      badgeGlow: t.electricGlow,
      children: [
        { label: "Dashboard", icon: "📊", isDefault: true, badge: "DEFAULT", badgeColor: t.pitch, badgeGlow: t.pitchGlow, children: [
          { label: "Contadores en tiempo real", icon: "⚡" },
          { label: "Alertas activas", icon: "🚨" },
        ]},
        { label: "Partidos", icon: "⚽", badge: "P0", badgeColor: t.coral, badgeGlow: t.coralGlow },
        { label: "Preguntas", icon: "❓", badge: "P1", badgeColor: t.gold, badgeGlow: t.goldGlow },
        { label: "Resultados", icon: "✅", badge: "P0", badgeColor: t.coral, badgeGlow: t.coralGlow },
        { label: "Ganadores", icon: "🏆", badge: "P0", badgeColor: t.coral, badgeGlow: t.coralGlow },
        { label: "Usuarios", icon: "👥", badge: "P1", badgeColor: t.gold, badgeGlow: t.goldGlow },
        { label: "Notificaciones", icon: "🔔", badge: "P1", badgeColor: t.gold, badgeGlow: t.goldGlow },
        { label: "Reportes", icon: "📈", badge: "P2", badgeColor: t.textMuted, badgeGlow: t.surfaceHover },
        { label: "Configuración", icon: "⚙️", badge: "P2", badgeColor: t.textMuted, badgeGlow: t.surfaceHover },
      ],
    },
  ];

  // ─── Flow Data ───
  const flows = [
    {
      title: "Journey 1 — Primer Registro y Participación",
      persona: "María (Fan Casual, 28)",
      constraint: "< 90 segundos total",
      color: t.pitch,
      badge: "🚀",
      steps: [
        { number: 1, phase: "Descubrir", emotion: "Curiosidad", screen: "Landing page desde link WhatsApp", time: "< 2s" },
        { number: 2, phase: "Registrar", emotion: "Impaciencia", screen: "Form 3 campos + login social", time: "< 20s" },
        { number: 3, phase: "Orientar", emotion: "Incertidumbre", screen: "Micro-tutorial 3 pasos (skipeable)", time: "< 5s" },
        { number: 4, phase: "Participar", emotion: "Emoción / prisa", screen: "5 Question Cards con swipe horizontal", time: "< 30s" },
        { number: 5, phase: "Revisar", emotion: "Cautela", screen: "Pantalla de resumen editable", time: "< 10s" },
        { number: 6, phase: "Confirmar", emotion: "Alivio", screen: "Checkmark animado + háptica + timestamp", time: "Instant" },
        { number: 7, phase: "Esperar", emotion: "Expectativa", screen: "Timer + marcador en vivo + \"Participaste\"", time: "—" },
        { number: 8, phase: "Resultado", emotion: "Alegría / decepción", screen: "Push + comparativa visual + CTA siguiente", time: "Post" },
      ],
    },
    {
      title: "Journey 2 — Participación en Medio Tiempo",
      persona: "Carlos (Futbolero, 34)",
      constraint: "< 60 segundos · Máximo pico de tráfico",
      color: t.gold,
      badge: "⚡",
      steps: [
        { number: 1, phase: "Activar", emotion: "Urgencia", screen: "Push contextual: \"Medio tiempo MEX 1-0 KOR\"", time: "—" },
        { number: 2, phase: "Abrir", emotion: "Expectativa", screen: "Deep link directo al partido (sin intermedios)", time: "< 2s" },
        { number: 3, phase: "Evaluar", emotion: "Concentración", screen: "Cards + contexto del partido visible", time: "< 5s" },
        { number: 4, phase: "Responder", emotion: "Confianza / duda", screen: "Botones 48px, navegación atrás, timer sutil", time: "< 30s" },
        { number: 5, phase: "Enviar", emotion: "Alivio", screen: "Micro-animación + timestamp persistente", time: "Instant" },
        { number: 6, phase: "Comparar", emotion: "Competitividad", screen: "Estadísticas de respuestas populares (%)", time: "—" },
        { number: 7, phase: "Retorno", emotion: "Satisfacción", screen: "CTA próximo partido con countdown", time: "—" },
      ],
    },
    {
      title: "Journey 3 — Operación Admin de Marca",
      persona: "Diego (Admin, 32)",
      constraint: "Cero errores en ganadores",
      color: t.electric,
      badge: "🔧",
      steps: [
        { number: 1, phase: "Preparar", emotion: "Concentración", screen: "Templates reutilizables + preview mobile", time: "< 3 min" },
        { number: 2, phase: "Activar ventana", emotion: "Tensión", screen: "Confirmación doble + timer auto-cierre + log", time: "—" },
        { number: 3, phase: "Monitorear", emotion: "Ansiedad", screen: "Dashboard con contadores RT cada 5s + alertas", time: "En vivo" },
        { number: 4, phase: "Cerrar ventana", emotion: "Presión", screen: "Validación cruzada + log inmutable", time: "—" },
        { number: 5, phase: "Validar ganador", emotion: "Cautela", screen: "Detalle respuestas vs. resultados, cálculo transparente", time: "—" },
        { number: 6, phase: "Notificar", emotion: "Alivio", screen: "Preview de mensaje + confirmación con timestamp", time: "—" },
        { number: 7, phase: "Reportar", emotion: "Satisfacción", screen: "Exportación CSV/Excel", time: "—" },
      ],
    },
    {
      title: "Journey 4 — Organización de Quiniela Grupal",
      persona: "Laura (Organizadora, 40)",
      constraint: "Creación en < 30 segundos",
      color: t.coral,
      badge: "👥",
      steps: [
        { number: 1, phase: "Crear grupo", emotion: "Motivación", screen: "Form simple: nombre + foto opcional", time: "< 30s" },
        { number: 2, phase: "Invitar", emotion: "Expectativa", screen: "Link copiable + share WhatsApp con preview rico", time: "—" },
        { number: 3, phase: "Gestionar", emotion: "Satisfacción", screen: "Quién se unió, quién participó, ranking auto", time: "—" },
        { number: 4, phase: "Seguir partido", emotion: "Emoción", screen: "Ranking grupal en tiempo real", time: "En vivo" },
        { number: 5, phase: "Compartir", emotion: "Orgullo", screen: "Resumen visual compartible post-partido", time: "Post" },
      ],
    },
    {
      title: "Journey 5 — Consulta de Resultados y Rankings",
      persona: "Carlos + María",
      constraint: "Cerrar el loop de participación",
      color: t.pitch,
      badge: "📊",
      steps: [
        { number: 1, phase: "Recibir resultado", emotion: "Anticipación", screen: "Push con puntaje + posición: \"3/5 aciertos · #42\"", time: "—" },
        { number: 2, phase: "Ver detalle", emotion: "Alegría / decepción", screen: "Comparativa: mis respuestas vs. reales (verde/rojo)", time: "—" },
        { number: 3, phase: "Ver ranking", emotion: "Competitividad", screen: "Posición general + grupal + tendencia ▲▼", time: "—" },
        { number: 4, phase: "Ver historial", emotion: "Reflexión", screen: "Todos los partidos con puntaje y aciertos", time: "—" },
        { number: 5, phase: "Anticipar", emotion: "Motivación", screen: "Countdown + CTA al próximo partido + recordatorio", time: "—" },
      ],
    },
  ];

  // ─── Match States ───
  const matchStates = [
    { state: "scheduled", label: "Próximo", color: t.textSecondary, pulse: false },
    { state: "pre_match_open", label: "¡Participa!", color: t.pitch, pulse: true },
    { state: "live_first_half", label: "En juego", color: t.coral, pulse: true },
    { state: "halftime_open", label: "Medio tiempo", color: t.gold, pulse: true },
    { state: "live_second_half", label: "En juego", color: t.coral, pulse: true },
    { state: "finished", label: "Finalizado", color: t.textMuted, pulse: false },
    { state: "results_available", label: "Resultados", color: t.pitch, pulse: false },
  ];

  const participationStates = [
    { state: "not_started", label: "—", color: t.textMuted },
    { state: "in_progress", label: "Respondiendo...", color: t.gold },
    { state: "submitted", label: "Participaste ✓", color: t.pitch },
    { state: "syncing", label: "Sincronizando...", color: t.gold },
    { state: "failed", label: "Error al enviar", color: t.coral },
    { state: "missed", label: "No participaste", color: t.textMuted },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.midnight,
        fontFamily: "'DM Sans', 'Avenir Next', sans-serif",
        color: t.textPrimary,
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${t.deep}; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 3px; }
        @keyframes pulseGlow { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        body { background: ${t.midnight}; }
      `}</style>

      {/* ━━━ Sticky Navigation ━━━ */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: `${t.midnight}ee`,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${t.borderSubtle}`,
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 8,
            overflowX: "auto",
            padding: "12px 0",
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 800, color: t.pitch, marginRight: 8, whiteSpace: "nowrap", letterSpacing: "0.05em", fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
            QM26
          </span>
          {navSections.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveNavSection(s.id);
                document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{
                padding: "6px 14px",
                borderRadius: 9999,
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: activeNavSection === s.id ? 700 : 500,
                color: activeNavSection === s.id ? t.textInverse : t.textSecondary,
                background: activeNavSection === s.id ? t.pitch : "transparent",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                fontFamily: "'DM Sans', 'Avenir Next', sans-serif",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>

        {/* ━━━ HERO ━━━ */}
        <section id="section-overview" style={{ paddingTop: 64, paddingBottom: 64 }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <Badge color={t.gold} glow={t.goldGlow}>UX Case Study</Badge>
              <Badge color={t.textSecondary} glow={t.surfaceHover}>Abril 2026</Badge>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1
              style={{
                fontSize: "clamp(32px, 6vw, 52px)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: t.textPrimary,
                marginBottom: 16,
              }}
            >
              Quiniela Mundial
              <br />
              <span
                style={{
                  background: `linear-gradient(135deg, ${t.pitch}, ${t.gold})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundSize: "200% 200%",
                  animation: "gradientShift 4s ease infinite",
                }}
              >
                2026
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontSize: 17, color: t.textSecondary, lineHeight: 1.6, maxWidth: 600 }}>
              Arquitectura de información y flujos de usuario para la plataforma de engagement 
              del Mundial FIFA 2026. Diseñada para <span style={{ color: t.pitch, fontWeight: 600 }}>participación en 60 segundos</span> durante 
              ventanas de medio tiempo — un diferenciador sin competencia directa.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ display: "flex", gap: 24, marginTop: 32, flexWrap: "wrap" }}>
              {[
                { value: "48", label: "Equipos", color: t.pitch },
                { value: "104", label: "Partidos", color: t.gold },
                { value: "5", label: "Journeys", color: t.coral },
                { value: "60s", label: "Flujo máx.", color: t.electric },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
                      fontSize: 28,
                      fontWeight: 900,
                      color: stat.color,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ━━━ PERSONAS ━━━ */}
        <section id="section-personas" style={{ paddingBottom: 64 }}>
          <Reveal>
            <SectionLabel number="01" text="Personas" />
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>Arquetipos de Usuario</h2>
            <p style={{ fontSize: 14, color: t.textSecondary, marginBottom: 28, maxWidth: 540 }}>
              4 personas derivadas del análisis competitivo de 8 plataformas y datos de consumo digital del Mundial 2022.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {[
              { name: "María", age: 28, emoji: "💁‍♀️", role: "Fan Casual", motivation: "Participa por contexto social. Baja tolerancia a apps complicadas. Ve partidos en reuniones sociales.", color: t.pitch, journeys: ["J1: Registro", "J5: Resultados"] },
              { name: "Carlos", age: 34, emoji: "⚽", role: "El Futbolero", motivation: "Fan apasionado. Quiere demostrar su conocimiento, competir con amigos y ganar premios por mérito.", color: t.gold, journeys: ["J2: Medio Tiempo", "J5: Resultados"] },
              { name: "Laura", age: 40, emoji: "📋", role: "La Organizadora", motivation: "Organiza la quiniela de la oficina. Busca reemplazar la hoja de Excel sin trabajo manual.", color: t.coral, journeys: ["J4: Grupos"] },
              { name: "Diego", age: 32, emoji: "📊", role: "Admin de Marca", motivation: "Coordinador de marketing. Necesita generar leads, maximizar participación y demostrar ROI.", color: t.electric, journeys: ["J3: Admin"] },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <PersonaCard {...p} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ━━━ INFORMATION ARCHITECTURE ━━━ */}
        <section id="section-ia" style={{ paddingBottom: 64 }}>
          <Reveal>
            <SectionLabel number="02" text="Arquitectura de Información" />
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>Mapa del Sitio</h2>
            <p style={{ fontSize: 14, color: t.textSecondary, marginBottom: 28, maxWidth: 540 }}>
              Dos aplicaciones con base de datos compartida. Navegación bottom-tab de 4 secciones para usuarios, sidebar para admin.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
            {/* Navigation Preview + IA Tree side by side on larger screens */}
            <Reveal>
              <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24, alignItems: "start" }}>
                {/* Phone Mockup */}
                <div style={{ position: "sticky", top: 80 }}>
                  <PhoneMockup label="Bottom Tab Navigation">
                    {/* Screen content based on active tab */}
                    <div style={{ padding: 16, minHeight: 260 }}>
                      {activeTab === "hoy" && (
                        <div>
                          <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Hoy</div>
                          <div style={{ background: t.surfaceElevated, borderRadius: 10, padding: 12, border: `1px solid ${t.border}`, marginBottom: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                              <span style={{ fontSize: 11, fontWeight: 700 }}>🇲🇽 MEX</span>
                              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 18, fontWeight: 900 }}>1 – 0</span>
                              <span style={{ fontSize: 11, fontWeight: 700 }}>KOR 🇰🇷</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                              <span style={{ fontSize: 9, fontWeight: 700, color: t.gold, background: t.goldGlow, padding: "2px 8px", borderRadius: 9999 }}>
                                <span style={{ animation: "pulseGlow 2s infinite" }}>●</span> MEDIO TIEMPO
                              </span>
                            </div>
                          </div>
                          <div style={{ background: t.pitch, borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: t.textInverse }}>¡Participa ahora!</span>
                          </div>
                          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: t.gold }}>12:34</span>
                            <span style={{ fontSize: 10, color: t.textMuted }}>para cierre</span>
                          </div>
                        </div>
                      )}
                      {activeTab === "partidos" && (
                        <div>
                          <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Partidos</div>
                          <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto" }}>
                            {["Todos", "Grupo A", "Grupo B"].map((f, i) => (
                              <span key={i} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 9999, background: i === 0 ? t.pitch : t.surfaceElevated, color: i === 0 ? t.textInverse : t.textSecondary, fontWeight: 600, whiteSpace: "nowrap" }}>{f}</span>
                            ))}
                          </div>
                          {[{ l: "🇲🇽 MEX", r: "KOR 🇰🇷", s: "1–0", st: "HT", c: t.gold }, { l: "🇦🇷 ARG", r: "GER 🇩🇪", s: "16:00", st: "Próx", c: t.textMuted }].map((m, i) => (
                            <div key={i} style={{ background: t.surfaceElevated, borderRadius: 8, padding: 10, marginBottom: 8, border: `1px solid ${t.borderSubtle}` }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 10, fontWeight: 600 }}>{m.l}</span>
                                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, fontWeight: 800 }}>{m.s}</span>
                                <span style={{ fontSize: 10, fontWeight: 600 }}>{m.r}</span>
                              </div>
                              <div style={{ textAlign: "center", marginTop: 4 }}>
                                <span style={{ fontSize: 8, color: m.c, fontWeight: 700, textTransform: "uppercase" }}>{m.st}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {activeTab === "rankings" && (
                        <div>
                          <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Rankings</div>
                          {[{ pos: "🥇", name: "Ana M.", pts: "385", me: false }, { pos: "🥈", name: "Luis R.", pts: "342", me: false }, { pos: "🥉", name: "Sofía L.", pts: "310", me: false }, { pos: "#42", name: "Tú", pts: "187", me: true }].map((r, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, marginBottom: 4, background: r.me ? t.pitchGlow : "transparent", border: r.me ? `1px solid ${t.pitch}22` : "1px solid transparent" }}>
                              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 800, width: 24, textAlign: "center", color: r.me ? t.pitch : t.textSecondary }}>{r.pos}</span>
                              <div style={{ width: 22, height: 22, borderRadius: "50%", background: t.surfaceHover, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: t.textSecondary }}>{r.name[0]}</div>
                              <span style={{ fontSize: 12, fontWeight: r.me ? 700 : 400, color: r.me ? t.pitch : t.textPrimary, flex: 1 }}>{r.name}</span>
                              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 700, color: r.me ? t.pitch : t.textSecondary }}>{r.pts}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {activeTab === "perfil" && (
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${t.electric}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: t.electric }}>TÚ</div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700 }}>María G.</div>
                              <div style={{ fontSize: 10, color: t.textMuted }}>5 partidos · 187 pts</div>
                            </div>
                          </div>
                          {["Historial", "Mis Grupos", "Premios", "Notificaciones", "FAQ"].map((item, i) => (
                            <div key={i} style={{ padding: "10px 0", borderBottom: `1px solid ${t.borderSubtle}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 12, color: t.textSecondary }}>{item}</span>
                              <span style={{ fontSize: 10, color: t.textMuted }}>→</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <TabBarPreview activeTab={activeTab} onTabChange={setActiveTab} />
                  </PhoneMockup>
                </div>

                {/* IA Tree */}
                <div
                  style={{
                    background: t.surface,
                    borderRadius: 14,
                    border: `1px solid ${t.borderSubtle}`,
                    padding: 20,
                    maxHeight: 600,
                    overflowY: "auto",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                    Mapa interactivo · Click para expandir
                  </div>
                  {iaTree.map((node, i) => (
                    <div key={i} style={{ marginBottom: i < iaTree.length - 1 ? 12 : 0 }}>
                      <TreeNode {...node} />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ━━━ USER FLOWS ━━━ */}
        <section id="section-flows" style={{ paddingBottom: 64 }}>
          <Reveal>
            <SectionLabel number="03" text="User Flows" />
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>Journeys Principales</h2>
            <p style={{ fontSize: 14, color: t.textSecondary, marginBottom: 28, maxWidth: 600 }}>
              5 journeys derivados del análisis de 8 competidores, 4 personas y datos de consumo del Mundial 2022. 
              Cada uno incluye fases, emociones, touchpoints y tiempos target.
            </p>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {flows.map((flow, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <FlowJourneyCard {...flow} />
              </Reveal>
            ))}
          </div>

          {/* Dependencies Matrix */}
          <Reveal delay={0.1}>
            <div style={{ marginTop: 32, background: t.surface, borderRadius: 14, border: `1px solid ${t.borderSubtle}`, padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Dependencias entre Journeys</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 20 }}>Orden de implementación basado en interdependencias</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { phase: "Fase 1 — MVP", color: t.coral, journeys: ["J1 Registro", "J2 Medio Tiempo", "J3 Admin (P0)"], desc: "Core interdependiente de la plataforma" },
                  { phase: "Fase 2 — Loop", color: t.gold, journeys: ["J5 Resultados", "J3 Admin (P1)"], desc: "Cierra el loop y habilita recurrencia" },
                  { phase: "Fase 3 — Social", color: t.pitch, journeys: ["J4 Grupos", "Share social"], desc: "Amplifica viralidad sobre core estable" },
                ].map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 4,
                        minHeight: 40,
                        borderRadius: 2,
                        background: p.color,
                        flexShrink: 0,
                        alignSelf: "stretch",
                      }}
                    />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: p.color, marginBottom: 4 }}>{p.phase}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                        {p.journeys.map((j, ji) => (
                          <Badge key={ji} color={t.textSecondary} glow={t.surfaceHover} small>{j}</Badge>
                        ))}
                      </div>
                      <div style={{ fontSize: 12, color: t.textMuted }}>{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ━━━ STATES SYSTEM ━━━ */}
        <section id="section-states" style={{ paddingBottom: 64 }}>
          <Reveal>
            <SectionLabel number="04" text="Sistema de Estados" />
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>Estados y Nomenclatura</h2>
            <p style={{ fontSize: 14, color: t.textSecondary, marginBottom: 28, maxWidth: 540 }}>
              Sistema unificado de estados para partidos, ventanas y participación del usuario.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {/* Match States */}
            <Reveal>
              <div style={{ background: t.surface, borderRadius: 14, border: `1px solid ${t.borderSubtle}`, padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Estados del Partido</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {matchStates.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 130 }}>
                        {s.pulse && (
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, animation: "pulseGlow 2s infinite", flexShrink: 0 }} />
                        )}
                        {!s.pulse && <span style={{ width: 6 }} />}
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: s.color,
                            padding: "3px 10px",
                            borderRadius: 6,
                            background: `${s.color}12`,
                            border: `1px solid ${s.color}22`,
                          }}
                        >
                          {s.label}
                        </span>
                      </div>
                      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: t.textMuted }}>{s.state}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Participation States */}
            <Reveal delay={0.1}>
              <div style={{ background: t.surface, borderRadius: 14, border: `1px solid ${t.borderSubtle}`, padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Estados de Participación</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {participationStates.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ minWidth: 130 }}>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: s.color,
                            padding: "3px 10px",
                            borderRadius: 6,
                            background: `${s.color}12`,
                            border: `1px solid ${s.color}22`,
                          }}
                        >
                          {s.label}
                        </span>
                      </div>
                      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: t.textMuted }}>{s.state}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ━━━ DESIGN PRINCIPLES ━━━ */}
        <section id="section-principles" style={{ paddingBottom: 80 }}>
          <Reveal>
            <SectionLabel number="05" text="Principios de Diseño" />
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>5 Principios Rectores</h2>
            <p style={{ fontSize: 14, color: t.textSecondary, marginBottom: 28, maxWidth: 540 }}>
              Derivados de la investigación UX y el análisis competitivo. Cada decisión de diseño se valida contra estos principios.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {[
              { number: 1, icon: "⚡", title: "60 Segundos o Menos", description: "Todo flujo de participación se completa en menos de 60 segundos. Máx. 3 niveles de profundidad. Cero pantallas intermedias entre notificación y acción." },
              { number: 2, icon: "✅", title: "Confirmación Inequívoca", description: "Confirmación multisensorial: visual (animación), háptica (vibración), y estado persistente consultable. Resuelve la queja #1 de apps competidoras." },
              { number: 3, icon: "🎯", title: "Una Acción por Pantalla", description: "Card-swipe con micro-decisiones secuenciales. Un solo CTA primario visible. Sin formularios extensos ni sobrecarga de opciones." },
              { number: 4, icon: "🏟", title: "Contexto sin Sobrecarga", description: "Marcador y estado del partido siempre visibles en header compacto. Progressive disclosure: contexto resumido visible, detalle expandible." },
              { number: 5, icon: "🔄", title: "Recurrencia Nativa", description: "Cada pantalla terminal contiene un CTA al próximo evento. La plataforma siempre responde \"¿qué viene después?\" sin que el usuario lo busque." },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <PrincipleCard {...p} />
              </Reveal>
            ))}
          </div>

          {/* Resilience Patterns */}
          <Reveal delay={0.2}>
            <div style={{ marginTop: 32, background: `linear-gradient(135deg, ${t.surface}, ${t.pitchMuted})`, borderRadius: 14, border: `1px solid ${t.pitch}22`, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 16 }}>🛡</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: t.pitch }}>Resiliencia ante Picos</span>
                <Badge color={t.coral} glow={t.coralGlow} small>Crítico</Badge>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {[
                  { label: "Offline-First", desc: "Guardado local progresivo antes del envío al servidor" },
                  { label: "Cola con Retry", desc: "Backoff exponencial para reintentos automáticos" },
                  { label: "Pre-carga", desc: "Preguntas cargadas antes de apertura de ventana" },
                  { label: "Degradación Elegante", desc: "Ranking/stats se desactivan; participación intocable" },
                ].map((r, i) => (
                  <div key={i} style={{ padding: 12, background: `${t.midnight}88`, borderRadius: 10, border: `1px solid ${t.borderSubtle}` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: t.pitch, marginBottom: 4 }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: t.textSecondary, lineHeight: 1.4 }}>{r.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ━━━ FOOTER ━━━ */}
        <footer style={{ borderTop: `1px solid ${t.borderSubtle}`, padding: "32px 0 48px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: t.textMuted, fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
            Quiniela Mundial 2026 · Design System "Stadium Nights" · v1.0
          </div>
          <div style={{ fontSize: 10, color: t.textMuted, marginTop: 4, opacity: 0.5 }}>
            Confidencial · Abril 2026
          </div>
        </footer>
      </div>
    </div>
  );
}
