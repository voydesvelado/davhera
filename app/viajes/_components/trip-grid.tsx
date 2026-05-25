"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TripCard } from "./trip-card";
import { Eyebrow } from "./eyebrow";
import { cn } from "@/lib/utils";
import type { Trip, TripCategory } from "../_lib/trips";

const FILTERS: { label: string; value: TripCategory | "todos" }[] = [
  { label: "Todos", value: "todos" },
  { label: "Playa", value: "playa" },
  { label: "Ciudad", value: "ciudad" },
  { label: "Aventura", value: "aventura" },
  { label: "Cultura", value: "cultura" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function TripGrid({ trips }: { trips: Trip[] }) {
  const [filter, setFilter] = useState<TripCategory | "todos">("todos");
  const prefersReducedMotion = useReducedMotion();

  const filtered = useMemo(
    () => (filter === "todos" ? trips : trips.filter((t) => t.category === filter)),
    [filter, trips],
  );

  return (
    <div>
      <div className="flex flex-col gap-6 mb-12 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>CATÁLOGO</Eyebrow>
          <h2 className="mt-3 text-display-lg font-display text-fg">
            Nuestros viajes
          </h2>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-12">
        {FILTERS.map((f) => {
          const active = f.value === filter;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-5 h-11 rounded-full text-body-sm font-medium transition-colors duration-200 cursor-pointer outline-none active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                active
                  ? "bg-fg text-bg"
                  : "border border-border-token bg-transparent text-fg hover:bg-fg/5",
              )}
              aria-pressed={active}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <motion.div
        layout={!prefersReducedMotion}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((trip) => (
            <motion.div
              key={trip.slug}
              layout={!prefersReducedMotion}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <TripCard trip={trip} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
