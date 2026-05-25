"use client";

import { Minus, Plus } from "lucide-react";

export function NumberStepper({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  hint?: string;
}) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className="flex items-center justify-between gap-6 py-4 border-b border-border-token">
      <div>
        <label htmlFor={id} className="block text-body font-medium text-fg">
          {label}
        </label>
        {hint ? (
          <p className="text-body-sm text-fg-muted mt-1">{hint}</p>
        ) : null}
      </div>
      <div className="inline-flex items-center gap-2">
        <button
          type="button"
          aria-label={`Disminuir ${label.toLowerCase()}`}
          onClick={dec}
          disabled={value <= min}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-token text-fg hover:bg-fg/5 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          data-form-trigger="false"
        >
          <Minus className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isNaN(n)) return;
            onChange(Math.min(max, Math.max(min, n)));
          }}
          className="w-12 text-center text-body font-medium text-fg bg-transparent border-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-md"
          aria-live="polite"
        />
        <button
          type="button"
          aria-label={`Aumentar ${label.toLowerCase()}`}
          onClick={inc}
          disabled={value >= max}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-token text-fg hover:bg-fg/5 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          data-form-trigger="false"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
