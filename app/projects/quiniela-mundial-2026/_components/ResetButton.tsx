"use client";

interface ResetButtonProps {
  onReset: () => void;
}

export function ResetButton({ onReset }: ResetButtonProps) {
  const handleClick = () => {
    if (typeof window === "undefined") return;
    const ok = window.confirm("¿Reiniciar el demo? Se borrarán las respuestas guardadas.");
    if (ok) onReset();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Reiniciar demo"
      title="Reiniciar demo"
      className="absolute right-3 top-12 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full text-stadium-text-muted hover:text-stadium-text-primary hover:bg-stadium-surface-elevated transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <polyline points="3 4 3 9 8 9" />
      </svg>
    </button>
  );
}
