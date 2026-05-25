"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function EmptyState() {
  const t = useTranslations("catalog.empty");
  const router = useRouter();
  const pathname = usePathname();

  return (
    <motion.div
      className="saira-empty"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="saira-empty-glyph" aria-hidden="true">
        <svg
          viewBox="0 0 120 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        >
          <path d="M5 45 Q 25 20, 45 35 T 85 25 T 115 40" opacity="0.4" />
          <path d="M5 50 Q 30 30, 55 40 T 95 35 T 115 48" opacity="0.6" />
          <circle cx="60" cy="32" r="2.5" fill="currentColor" stroke="none" />
        </svg>
      </div>

      <h2 className="saira-empty-title">{t("title")}</h2>
      <p className="saira-empty-body">{t("body")}</p>

      <button
        type="button"
        className="saira-btn saira-btn-secondary saira-btn-md"
        onClick={() => router.replace(pathname, { scroll: false })}
      >
        {t("clearFilters")}
      </button>
    </motion.div>
  );
}
