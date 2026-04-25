"use client";

import { ResultRow } from "./ResultRow";
import type { ResultQuestion } from "../../_data/mockResults";

interface ResultComparisonProps {
  questions: ResultQuestion[];
}

export function ResultComparison({ questions }: ResultComparisonProps) {
  return (
    <section aria-label="Comparativa de respuestas">
      <p className="px-1 text-[15px] font-bold text-stadium-text-primary">Tus respuestas</p>
      <ul role="list" className="mt-3 flex flex-col gap-2">
        {questions.map((q, i) => (
          <ResultRow key={q.id} question={q} index={i} />
        ))}
      </ul>
    </section>
  );
}
