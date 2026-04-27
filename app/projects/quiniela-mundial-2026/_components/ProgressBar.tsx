"use client";

interface ProgressBarProps {
  current: number; // 1-based
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={Math.min(current, total)}
      aria-label={`Pregunta ${current} de ${total}`}
      className="flex w-full flex-col gap-2"
    >
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => {
          const idx = i + 1;
          const state = idx < current ? "done" : idx === current ? "active" : "pending";
          const color =
            state === "done"
              ? "bg-stadium-pitch"
              : state === "active"
                ? "bg-stadium-pitch/50"
                : "bg-stadium-surface-hover";
          return (
            <span
              key={idx}
              aria-hidden="true"
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ease-out ${color}`}
            />
          );
        })}
      </div>
      <span className="block text-center text-[13px] text-stadium-text-muted">
        Pregunta {Math.min(current, total)} de {total}
      </span>
    </div>
  );
}
