"use client";

import { useEffect, useState, type ReactNode } from "react";

interface PortfolioWrapperProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  contextLine?: string;
  caseStudyHref?: string;
  onReset?: () => void;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function StatusBar() {
  const [time, setTime] = useState("9:41");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(`${d.getHours()}:${pad(d.getMinutes())}`);
    };
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="flex h-8 w-full items-center justify-between px-6 pt-1 text-[12px] font-semibold text-stadium-text-secondary"
    >
      <span className="tabular-nums">{time}</span>
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 18 12" className="h-3 w-[18px]" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="0.5" />
          <rect x="5" y="5" width="3" height="7" rx="0.5" />
          <rect x="10" y="2" width="3" height="10" rx="0.5" />
          <rect x="15" y="0" width="3" height="12" rx="0.5" />
        </svg>
        <svg viewBox="0 0 16 12" className="h-3 w-4" fill="currentColor">
          <path d="M8 2.5c2.1 0 4 .8 5.4 2.1l1.4-1.4C13.1 1.5 10.6.5 8 .5S2.9 1.5 1.2 3.2l1.4 1.4C4 3.3 5.9 2.5 8 2.5zm0 4c1 0 1.9.4 2.6 1l1.4-1.4C10.9 5.1 9.5 4.5 8 4.5s-2.9.6-4 1.6l1.4 1.4c.7-.6 1.6-1 2.6-1zm0 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
        </svg>
        <div className="flex h-3 w-6 items-center rounded-[3px] border border-stadium-text-secondary px-[1px]">
          <span className="block h-1.5 w-3.5 rounded-[1px] bg-stadium-text-secondary" />
        </div>
      </div>
    </div>
  );
}

function ResetButton({ onReset }: { onReset?: () => void }) {
  const handleClick = () => {
    if (onReset) {
      onReset();
      return;
    }
    if (typeof window !== "undefined") window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Reiniciar prototipo"
      title="Reiniciar prototipo"
      className="absolute right-3 top-12 z-30 hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full text-stadium-text-muted opacity-30 transition-opacity duration-150 hover:opacity-70 focus-visible:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch lg:inline-flex"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <polyline points="3 4 3 9 8 9" />
      </svg>
    </button>
  );
}

export function PortfolioWrapper({
  children,
  title,
  subtitle,
  contextLine,
  caseStudyHref,
  onReset,
}: PortfolioWrapperProps) {
  return (
    <div className="min-h-[100dvh] w-full bg-[radial-gradient(ellipse_at_top,_#0B1424_0%,_#040710_70%)]">
      {/* Mobile: full-bleed (≤430px) */}
      <div className="block lg:hidden h-[100dvh] overflow-hidden bg-stadium-midnight">
        <div className="mx-auto h-full w-full max-w-[430px]">{children}</div>
      </div>

      {/* Desktop: iPhone frame */}
      <div className="hidden lg:flex min-h-[100dvh] flex-col items-center justify-center py-12">
        <div className="relative">
          <div
            className="relative overflow-hidden rounded-[40px] border border-stadium-border bg-stadium-midnight shadow-[0_50px_120px_rgb(0_0_0_/_0.6),0_0_0_2px_rgb(255_255_255_/_0.02)_inset]"
            style={{ width: 375, height: 812 }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-2 z-30 h-[28px] w-[130px] -translate-x-1/2 rounded-full bg-stadium-deep"
            />
            <ResetButton onReset={onReset} />
            <div className="relative z-10 flex h-full flex-col">
              <StatusBar />
              <div className="flex-1 overflow-hidden">{children}</div>
            </div>
          </div>

          {(title || subtitle || contextLine || caseStudyHref) && (
            <div className="mx-auto mt-6 w-[375px] text-center">
              {title && (
                <p className="text-[14px] font-semibold text-stadium-text-primary">{title}</p>
              )}
              {subtitle && (
                <p className="mt-1 text-[13px] text-stadium-text-secondary">{subtitle}</p>
              )}
              {contextLine && (
                <p className="mt-1 text-[12px] text-stadium-text-muted">{contextLine}</p>
              )}
              {caseStudyHref && (
                <a
                  href={caseStudyHref}
                  className="mt-2 inline-block text-[12px] font-medium text-stadium-electric transition-opacity hover:opacity-80"
                >
                  Ver caso de estudio →
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
