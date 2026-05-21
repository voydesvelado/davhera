import type { CSSProperties, ReactNode } from "react";

type PhoneFrameProps = {
  children: ReactNode;
  /** Background color of the inner screen surface. */
  screenBackground?: string;
};

/**
 * Minimal white phone shell shared across /preview cases.
 *
 * - 390 × 844 aspect ratio (iPhone-class)
 * - Height capped to ~86% of viewport so the phone always fits on MBA → MBP
 * - `container-type: inline-size` lets descendants use `cqw` units to scale
 *   the interior UI with the phone's actual rendered width.
 */
export function PhoneFrame({
  children,
  screenBackground = "#FFFFFF",
}: PhoneFrameProps) {
  return (
    <div
      className="relative shrink-0 max-w-full"
      style={{
        aspectRatio: "390 / 844",
        height: "min(1040px, calc(100dvh * 0.86))",
        containerType: "inline-size",
      } as CSSProperties}
    >
      <div
        className="absolute inset-0 bg-white"
        style={{
          borderRadius: "11.3cqw",
          boxShadow:
            "0 0 0 1px rgba(28,25,23,0.06), 0 20px 60px -15px rgba(28,25,23,0.18)",
        }}
      >
        <div
          className="absolute overflow-hidden"
          style={{
            inset: "2.5cqw",
            borderRadius: "9.2cqw",
            background: screenBackground,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
