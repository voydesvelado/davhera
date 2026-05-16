"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { ThemeToggle } from "../../ui/ThemeToggle";
import { Kbd } from "../../ui/Kbd";
import { CommandPalette } from "../../ui/CommandPalette";
import { useDoctorActions } from "./useDoctorActions";

export function DoctorTopBar() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const actions = useDoctorActions(() => setPaletteOpen(false));

  // ⌘K / Ctrl+K opens the palette anywhere under /panel/*.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isCmdK) {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div
        className="vera-doc-topbar"
        style={{
          display: "none",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "var(--space-2)",
          padding: "var(--space-3) 0",
        }}
      >
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          aria-label="Abrir paleta de comandos"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            height: 32,
            padding: "0 var(--space-3)",
            background: "var(--bg-raised)",
            border: "1px solid var(--rule)",
            borderRadius: "var(--radius-sm)",
            color: "var(--muted)",
            fontSize: "var(--text-sm)",
            fontFamily: "var(--font-geist), system-ui, sans-serif",
            cursor: "pointer",
            transition: "border-color var(--dur-quick) var(--ease-snap)",
          }}
          className="vera-cp-trigger"
        >
          <Search size={14} strokeWidth={1.75} />
          Buscar acciones
          <Kbd>⌘ K</Kbd>
        </button>
        <ThemeToggle />
        <Link
          href="/projects/vera/panel/perfil"
          aria-label="Perfil"
          style={{
            display: "inline-flex",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "var(--accent-pale)",
            color: "var(--accent)",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          SR
        </Link>
        <style>{`
          .vera-cp-trigger:hover { border-color: var(--rule-strong); color: var(--ink-soft); }
          @media (min-width: 768px) {
            .vera-doc-topbar { display: flex !important; }
          }
        `}</style>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} actions={actions} />
    </>
  );
}
