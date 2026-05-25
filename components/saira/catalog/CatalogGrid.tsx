"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TourCard } from "@/components/saira/tour/TourCard";
import { EmptyState } from "./EmptyState";
import type { Tour } from "@/lib/saira/types";

export function CatalogGrid({ tours }: { tours: Tour[] }) {
  if (tours.length === 0) return <EmptyState />;

  return (
    <motion.div className="saira-catalog-grid" layout>
      <AnimatePresence mode="popLayout">
        {tours.map((tour) => (
          <motion.div
            key={tour.slug}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <TourCard tour={tour} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
