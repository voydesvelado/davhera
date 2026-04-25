"use client";

export type ResultsTab = "today" | "matches" | "rankings" | "profile";

interface BottomNavProps {
  active: ResultsTab;
  onChange: (tab: ResultsTab) => void;
}

const TABS: { id: ResultsTab; label: string; icon: string }[] = [
  { id: "today", label: "Hoy", icon: "🔥" },
  { id: "matches", label: "Partidos", icon: "⚽" },
  { id: "rankings", label: "Rankings", icon: "🏆" },
  { id: "profile", label: "Perfil", icon: "👤" },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      role="navigation"
      aria-label="Navegación principal"
      className="absolute inset-x-0 bottom-0 z-30 flex border-t border-stadium-border bg-stadium-deep/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 px-2 py-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-stadium-pitch ${
              isActive ? "text-stadium-pitch" : "text-stadium-text-muted hover:text-stadium-text-secondary"
            }`}
            style={{ minHeight: 56 }}
          >
            <span className="text-[20px] leading-none" aria-hidden="true">{tab.icon}</span>
            <span
              className={`text-[10px] uppercase tracking-wider ${isActive ? "font-bold" : "font-medium"}`}
            >
              {tab.label}
            </span>
            {isActive && (
              <span aria-hidden="true" className="block h-1 w-1 rounded-full bg-stadium-pitch" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
