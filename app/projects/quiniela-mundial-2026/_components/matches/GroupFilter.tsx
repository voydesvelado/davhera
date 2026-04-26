"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { GroupData } from "../../_data/matchesData";

interface GroupFilterProps {
  groups: GroupData[];
  selectedGroup: "all" | string;
  onSelect: (groupId: "all" | string) => void;
}

export function GroupFilter({ groups, selectedGroup, onSelect }: GroupFilterProps) {
  const reduced = useReducedMotion();
  const items: { id: "all" | string; label: string }[] = [
    { id: "all", label: "Todos" },
    ...groups.map((g) => ({ id: g.id, label: g.id })),
  ];

  return (
    <div
      role="tablist"
      aria-label="Filtrar partidos por grupo"
      className="sticky top-0 z-10 flex flex-row gap-1.5 overflow-x-auto bg-[rgb(11_17_32_/_0.95)] px-4 py-3 backdrop-blur-sm [scrollbar-width:none] [scroll-snap-type:x_mandatory] [&::-webkit-scrollbar]:hidden"
    >
      {items.map((item) => {
        const active = selectedGroup === item.id;
        return (
          <motion.button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(item.id)}
            whileTap={reduced ? undefined : { scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-3.5 text-[11px] font-semibold transition-colors duration-150 [scroll-snap-align:start] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch ${
              active
                ? "border-stadium-pitch/30 bg-stadium-pitch-glow font-bold text-stadium-pitch"
                : "border-stadium-border-subtle bg-stadium-surface-elevated text-stadium-text-secondary hover:border-stadium-border hover:bg-stadium-surface-hover"
            }`}
            style={{ minHeight: 36 }}
          >
            {item.label === "Todos" ? "Todos" : `Grupo ${item.label}`}
          </motion.button>
        );
      })}
    </div>
  );
}
