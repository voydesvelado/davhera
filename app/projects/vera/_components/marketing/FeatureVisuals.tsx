import type { ReactNode } from "react";

interface ShellProps {
  children: ReactNode;
  /** Aspect ratio override for the framed visual. */
  aspect?: string;
}

/** Card shell common to every feature visual — bg-raised, rule border, subtle shadow. */
function VisualShell({ children, aspect = "5 / 4" }: ShellProps) {
  return (
    <div
      style={{
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
        aspectRatio: aspect,
        padding: "var(--space-5)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}

/* ── Página pública — profile card abstraction ───────────────── */
export function PublicProfileVisual() {
  return (
    <VisualShell>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <div
            aria-hidden
            style={{
              width: 48,
              height: 48,
              borderRadius: "var(--radius-pill)",
              background: "var(--bg-sunken)",
              border: "1px solid var(--rule)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1_5)" }}>
            <div className="vera-skeleton" style={{ width: 120, height: 12, borderRadius: "var(--radius-xs)" }} />
            <div className="vera-skeleton" style={{ width: 80, height: 10, borderRadius: "var(--radius-xs)" }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", flex: 1 }}>
          {[88, 74, 92].map((w, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "var(--space-3)",
                background: "var(--bg-sunken)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div className="vera-skeleton" style={{ width: `${w}px`, height: 11, borderRadius: "var(--radius-xs)" }} />
              <span
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "var(--text-xs)",
                  color: "var(--ink-faint)",
                }}
              >
                $1,200
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            padding: "var(--space-2_5) var(--space-4)",
            height: 36,
            background: "var(--accent)",
            color: "var(--accent-ink)",
            borderRadius: "var(--radius-sm)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
          }}
        >
          Reservar cita
        </div>
      </div>
    </VisualShell>
  );
}

/* ── Reservas — calendar / slot grid ─────────────────────────── */
export function BookingVisual() {
  return (
    <VisualShell>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", height: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "var(--space-1_5)",
          }}
        >
          {Array.from({ length: 7 }, (_, i) => {
            const isToday = i === 2;
            const dimmed = i === 0;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "2px",
                  padding: "var(--space-2) 0",
                  borderRadius: "var(--radius-sm)",
                  background: isToday ? "var(--accent)" : "transparent",
                  border: "1px solid var(--rule-faint)",
                  opacity: dimmed ? 0.4 : 1,
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-2xs)",
                    color: isToday ? "var(--accent-ink)" : "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: "var(--tracking-wider)",
                  }}
                >
                  {["L", "M", "M", "J", "V", "S", "D"][i]}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: isToday ? "var(--accent-ink)" : "var(--ink)",
                  }}
                >
                  {String(13 + i).padStart(2, "0")}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", flex: 1 }}>
          {["09:00", "10:00", "11:00", "14:00"].map((time, i) => {
            const selected = i === 1;
            return (
              <div
                key={time}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "var(--space-3) var(--space-4)",
                  background: selected ? "var(--accent)" : "var(--bg-sunken)",
                  color: selected ? "var(--accent-ink)" : "var(--ink)",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "var(--text-sm)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <span>{time}</span>
                <span style={{ opacity: 0.6, fontSize: "var(--text-xs)" }}>60 min</span>
              </div>
            );
          })}
        </div>
      </div>
    </VisualShell>
  );
}

/* ── Recordatorios — WhatsApp bubble ─────────────────────────── */
export function ReminderVisual() {
  return (
    <VisualShell>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
          height: "100%",
          padding: "var(--space-2)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            paddingBottom: "var(--space-3)",
            borderBottom: "1px solid var(--rule-faint)",
          }}
        >
          <div
            aria-hidden
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-pill)",
              background: "#075E54",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontFamily: "var(--font-geist), sans-serif",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            SR
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--ink)" }}>Dra. Sofía R.</span>
            <span style={{ fontSize: "var(--text-2xs)", color: "var(--muted)" }}>en línea</span>
          </div>
        </div>
        <div
          style={{
            alignSelf: "flex-start",
            maxWidth: "85%",
            padding: "var(--space-3) var(--space-4)",
            background: "var(--bg-sunken)",
            borderRadius: "var(--radius-md)",
            borderTopLeftRadius: "var(--radius-xs)",
            fontSize: "var(--text-sm)",
            lineHeight: "var(--leading-normal)",
            color: "var(--ink)",
          }}
        >
          Hola Laura, recordatorio: mañana jueves a las 16:00 tienes tu Consulta inicial.
        </div>
        <div
          style={{
            alignSelf: "flex-start",
            maxWidth: "85%",
            padding: "var(--space-3) var(--space-4)",
            background: "var(--bg-sunken)",
            borderRadius: "var(--radius-md)",
            borderTopLeftRadius: "var(--radius-xs)",
            fontSize: "var(--text-sm)",
            lineHeight: "var(--leading-normal)",
            color: "var(--ink)",
          }}
        >
          ¿Necesitas reagendar? <span style={{ color: "var(--accent)" }}>Aquí ›</span>
        </div>
        <div style={{ marginTop: "auto", fontSize: "var(--text-2xs)", color: "var(--muted)", textAlign: "center" }}>
          Enviado automáticamente · T-24h
        </div>
      </div>
    </VisualShell>
  );
}

/* ── Diseño — light/dark split ───────────────────────────────── */
export function DesignVisual() {
  return (
    <VisualShell>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          height: "100%",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          border: "1px solid var(--rule)",
        }}
      >
        {/* Light side */}
        <div
          style={{
            background: "#FAFAFB",
            color: "#16181C",
            padding: "var(--space-4)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          <span
            style={{
              fontSize: "var(--text-2xs)",
              fontWeight: 500,
              letterSpacing: "var(--tracking-widest)",
              textTransform: "uppercase",
              color: "#717680",
            }}
          >
            Claro
          </span>
          <div style={{ height: 8, background: "#E5E6E8", borderRadius: "var(--radius-xs)" }} />
          <div style={{ height: 8, background: "#E5E6E8", borderRadius: "var(--radius-xs)", width: "70%" }} />
          <div
            style={{
              marginTop: "auto",
              padding: "6px 10px",
              background: "#A6402F",
              color: "#FCFAF9",
              borderRadius: "var(--radius-sm)",
              fontSize: "var(--text-xs)",
              alignSelf: "flex-start",
              fontWeight: 500,
            }}
          >
            Reservar
          </div>
        </div>
        {/* Dark side */}
        <div
          style={{
            background: "#1B1D21",
            color: "#F2F3F5",
            padding: "var(--space-4)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          <span
            style={{
              fontSize: "var(--text-2xs)",
              fontWeight: 500,
              letterSpacing: "var(--tracking-widest)",
              textTransform: "uppercase",
              color: "#7C808A",
            }}
          >
            Oscuro
          </span>
          <div style={{ height: 8, background: "#3D4045", borderRadius: "var(--radius-xs)" }} />
          <div style={{ height: 8, background: "#3D4045", borderRadius: "var(--radius-xs)", width: "70%" }} />
          <div
            style={{
              marginTop: "auto",
              padding: "6px 10px",
              background: "#D87560",
              color: "#1A1614",
              borderRadius: "var(--radius-sm)",
              fontSize: "var(--text-xs)",
              alignSelf: "flex-start",
              fontWeight: 500,
            }}
          >
            Reservar
          </div>
        </div>
      </div>
    </VisualShell>
  );
}
