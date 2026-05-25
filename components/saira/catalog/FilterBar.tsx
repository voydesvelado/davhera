"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const CATEGORIES = ["all", "ecotour", "aventura"] as const;
const DIFFICULTIES = ["all", "easy", "moderate", "hard"] as const;

export function FilterBar() {
  const t = useTranslations("filters");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") ?? "all";
  const currentDifficulty = searchParams.get("difficulty") ?? "all";

  const updateFilter = (key: "category" | "difficulty", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `?${qs}` : "?", { scroll: false });
    });
  };

  return (
    <div className={"saira-filter-bar" + (isPending ? " is-pending" : "")}>
      <div className="saira-filter-group">
        <span className="saira-filter-label">{t("category")}</span>
        <div className="saira-filter-chips">
          {CATEGORIES.map((cat) => {
            const active = currentCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                className={"saira-filter-chip" + (active ? " is-active" : "")}
                onClick={() => updateFilter("category", cat)}
                aria-pressed={active}
              >
                {t(`categories.${cat}`)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="saira-filter-group">
        <span className="saira-filter-label">{t("difficulty")}</span>
        <div className="saira-filter-chips">
          {DIFFICULTIES.map((diff) => {
            const active = currentDifficulty === diff;
            return (
              <button
                key={diff}
                type="button"
                className={"saira-filter-chip" + (active ? " is-active" : "")}
                onClick={() => updateFilter("difficulty", diff)}
                aria-pressed={active}
              >
                {t(`difficulties.${diff}`)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
