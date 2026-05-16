"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Sheet } from "../../ui/Sheet";
import { Button } from "../../ui/Button";

interface OnboardingShellProps {
  step: number;
  total: number;
  children: ReactNode;
  /** Bottom action bar contents — left and right groups. */
  back?: ReactNode;
  primary?: ReactNode;
  /** When true, hides the bottom action bar entirely (used on celebration). */
  hideActions?: boolean;
}

export function OnboardingShell({
  step,
  total,
  children,
  back,
  primary,
  hideActions = false,
}: OnboardingShellProps) {
  const [exitOpen, setExitOpen] = useState(false);
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-3)",
          padding: "var(--space-3) var(--px-mobile)",
          borderBottom: "1px solid var(--rule-faint)",
        }}
        className="vera-onb-header"
      >
        <button
          type="button"
          onClick={() => setExitOpen(true)}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontFamily: "var(--font-geist), system-ui, sans-serif",
            fontSize: "var(--text-lg)",
            fontWeight: 600,
            letterSpacing: "var(--tracking-snug)",
            color: "var(--ink)",
          }}
        >
          Vera
        </button>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, minWidth: 120 }}>
          <span
            style={{
              fontSize: "var(--text-2xs)",
              fontWeight: 500,
              letterSpacing: "var(--tracking-widest)",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Paso {step} de {total}
          </span>
          <span
            aria-hidden
            style={{
              width: 120,
              height: 4,
              background: "var(--bg-sunken)",
              borderRadius: "var(--radius-pill)",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                display: "block",
                width: `${(step / total) * 100}%`,
                height: "100%",
                background: "var(--accent)",
                transition: "width var(--dur-base) var(--ease-snap)",
              }}
            />
          </span>
        </div>

        <style>{`
          @media (min-width: 640px) {
            .vera-onb-header { padding-left: var(--px-tablet); padding-right: var(--px-tablet); }
          }
          @media (min-width: 1024px) {
            .vera-onb-header { padding-left: var(--px-desktop); padding-right: var(--px-desktop); }
          }
        `}</style>
      </header>

      <main
        className="density-comfortable"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "var(--space-8) var(--px-mobile) calc(var(--space-16) + 80px)",
        }}
      >
        <div style={{ width: "100%", maxWidth: "var(--max-narrow)" }}>{children}</div>
      </main>

      {hideActions ? null : (
        <div
          className="vera-onb-actions"
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-3)",
            padding: "var(--space-4) var(--px-mobile)",
            background: "var(--bg-raised)",
            borderTop: "1px solid var(--rule)",
            zIndex: 10,
          }}
        >
          <div>{back}</div>
          <div>{primary}</div>

          <style>{`
            @media (min-width: 768px) {
              .vera-onb-actions {
                position: static !important;
                margin-top: var(--space-8);
                background: transparent !important;
                border-top: none !important;
                max-width: var(--max-narrow);
                margin-left: auto;
                margin-right: auto;
                padding: var(--space-4) 0;
              }
            }
          `}</style>
        </div>
      )}

      <Sheet open={exitOpen} onOpenChange={setExitOpen} size="sm" title="¿Salir del registro?">
        <p style={{ margin: "0 0 var(--space-4)", fontSize: "var(--text-md)", color: "var(--ink-soft)" }}>
          Si sales ahora, perderás lo que has llenado hasta aquí.
        </p>
        <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={() => setExitOpen(false)}>
            Continuar el registro
          </Button>
          <Button variant="destructive" onClick={() => router.push("/projects/vera")}>
            Sí, salir
          </Button>
        </div>
      </Sheet>
    </div>
  );
}

export function OnboardingHeading({ children, size = "h1" }: { children: ReactNode; size?: "h1" | "h2" }) {
  const Comp = size as "h1" | "h2";
  return (
    <Comp
      style={{
        margin: 0,
        fontFamily: "var(--font-geist), system-ui, sans-serif",
        fontSize: size === "h1" ? "clamp(36px, 6vw, 56px)" : "var(--text-3xl)",
        fontWeight: 600,
        letterSpacing: "var(--tracking-tight)",
        color: "var(--ink)",
        lineHeight: "var(--leading-tight)",
      }}
    >
      {(<>{children}</>) as ReactNode}
    </Comp>
  );
}

export function OnboardingLede({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        margin: "var(--space-3) 0 0",
        fontSize: "var(--text-lg)",
        color: "var(--ink-soft)",
        lineHeight: "var(--leading-normal)",
      }}
    >
      {children}
    </p>
  );
}
