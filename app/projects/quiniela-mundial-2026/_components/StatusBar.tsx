"use client";

import { useEffect, useState } from "react";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function StatusBar() {
  const [time, setTime] = useState<string>("9:41");

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
      className="flex h-8 w-full items-center justify-between px-6 text-[12px] font-semibold text-stadium-text-secondary"
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
