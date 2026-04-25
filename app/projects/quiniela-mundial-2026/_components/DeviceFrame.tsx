"use client";

import type { ReactNode } from "react";
import { StatusBar } from "./StatusBar";

interface DeviceFrameProps {
  children: ReactNode;
  /** Slot for a floating control rendered inside the frame (desktop only). */
  floatingSlot?: ReactNode;
  /** Slot rendered below the device frame on desktop, fixed-bottom on mobile. */
  belowFrameSlot?: ReactNode;
  caption?: string;
}

export function DeviceFrame({ children, floatingSlot, belowFrameSlot, caption }: DeviceFrameProps) {
  return (
    <div className="min-h-[100dvh] w-full bg-[radial-gradient(ellipse_at_top,_#0B1424_0%,_#040710_70%)]">
      {/* Mobile: full-bleed prototype with a definite height so descendants
          using h-full / flex-1 resolve correctly (using min-h breaks the chain). */}
      <div className="block lg:hidden h-[100dvh] overflow-hidden bg-stadium-midnight">
        <div className="mx-auto h-full w-full max-w-[430px]">{children}</div>
        {belowFrameSlot && (
          <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[430px] px-3 pb-3">
            {belowFrameSlot}
          </div>
        )}
      </div>

      <div className="hidden lg:flex min-h-[100dvh] flex-col items-center justify-center py-12">
        <div className="relative">
          <div
            className="relative overflow-hidden rounded-[40px] border border-stadium-border bg-stadium-midnight shadow-[0_50px_120px_rgb(0_0_0_/_0.6),0_0_0_2px_rgb(255_255_255_/_0.02)_inset]"
            style={{ width: 375, height: 812 }}
          >
            {/* Notch */}
            <div className="pointer-events-none absolute left-1/2 top-2 z-30 h-[28px] w-[130px] -translate-x-1/2 rounded-full bg-stadium-deep" />
            {floatingSlot}
            <div className="relative z-10 flex h-full flex-col">
              <StatusBar />
              <div className="flex-1 overflow-hidden">{children}</div>
            </div>
          </div>
          {belowFrameSlot && (
            <div className="mx-auto mt-5 w-[375px]">{belowFrameSlot}</div>
          )}
          {caption && (
            <p className="mt-5 text-center text-[13px] text-stadium-text-muted">{caption}</p>
          )}
        </div>
      </div>
    </div>
  );
}
