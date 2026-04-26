"use client";

import { motion } from "framer-motion";

interface BottomNavTab {
  id: string;
  label: string;
  icon: string;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs?: BottomNavTab[];
}

const DEFAULT_TABS: BottomNavTab[] = [
  { id: "today", label: "Hoy", icon: "🔥" },
  { id: "matches", label: "Partidos", icon: "⚽" },
  { id: "rankings", label: "Rankings", icon: "🏆" },
  { id: "profile", label: "Perfil", icon: "👤" },
];

export function BottomNav({ activeTab, onTabChange, tabs = DEFAULT_TABS }: BottomNavProps) {
  return (
    <nav
      role="navigation"
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-50 flex w-full border-t border-stadium-border bg-stadium-deep"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-1 cursor-pointer flex-col items-center gap-0.5 py-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-stadium-pitch ${
              isActive
                ? "text-stadium-pitch"
                : "text-stadium-text-muted hover:text-stadium-text-secondary"
            }`}
            style={{ minHeight: 48 }}
          >
            <span className="text-[20px] leading-none" aria-hidden="true">
              {tab.icon}
            </span>
            <span
              className={`text-[10px] uppercase tracking-tight ${
                isActive ? "font-bold" : "font-medium"
              }`}
            >
              {tab.label}
            </span>
            {isActive ? (
              <motion.span
                aria-hidden="true"
                layoutId="bottomnav-indicator"
                className="block h-1 w-1 rounded-full bg-stadium-pitch"
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
              />
            ) : (
              <span aria-hidden="true" className="block h-1 w-1" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
