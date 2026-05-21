"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PhoneFrame } from "./PhoneFrame";

export type Chapter = {
  id: string;
  /** Section copy that renders on the left side. */
  content: ReactNode;
  /** Phone UI that becomes active when this chapter's center crosses the viewport center. */
  screen: ReactNode;
};

type Props = {
  /** Eyebrow + title + subtitle + tags. Sits at the top of the left column. */
  header: ReactNode;
  /** Ordered chapters that drive the phone swap as the user scrolls. */
  chapters: Chapter[];
  /** Optional trailing content (highlights, user impact). Does not drive swaps. */
  footer?: ReactNode;
  /** Background color for the inner phone screen. */
  screenBackground?: string;
};

export function CasePreviewLayout({
  header,
  chapters,
  footer,
  screenBackground,
}: Props) {
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id ?? "");
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    // Fires whenever a section's center crosses the viewport's center.
    // With `rootMargin: -50% 0px -50% 0px`, the observer root collapses to a
    // 0-height line at viewport center — a section is "intersecting" only
    // while that line is inside it.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-chapter-id");
            if (id) setActiveId(id);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [chapters]);

  const activeScreen =
    chapters.find((c) => c.id === activeId)?.screen ?? chapters[0]?.screen;

  return (
    <main
      className="min-h-dvh w-full bg-white text-stone-900"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="lg:flex lg:items-start">
        {/* Left: case content (scrolls with page) */}
        <section
          className="
            lg:flex-1 lg:min-w-0
            px-8 sm:px-12 lg:px-12 xl:px-16
            pt-12 lg:pt-20
            pb-16 lg:pb-24
          "
        >
          <div className="max-w-[44ch]">
            {header}
            <div className="mt-12 space-y-16">
              {chapters.map((c) => (
                <section
                  key={c.id}
                  data-chapter-id={c.id}
                  ref={(el) => {
                    if (el) sectionRefs.current.set(c.id, el);
                    else sectionRefs.current.delete(c.id);
                  }}
                >
                  {c.content}
                </section>
              ))}
              {footer ? <div>{footer}</div> : null}
            </div>
          </div>
        </section>

        {/* Right: sticky panel with phone */}
        <aside
          className="
            lg:sticky lg:top-0 lg:self-start
            shrink-0
            bg-[#EAEAEA]
            w-full lg:w-[64.8vw]
            h-[min(100dvw,640px)] lg:h-dvh
            flex items-center justify-center
            px-4 lg:px-6
          "
        >
          <PhoneFrame screenBackground={screenBackground}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute inset-0"
              >
                {activeScreen}
              </motion.div>
            </AnimatePresence>
          </PhoneFrame>
        </aside>
      </div>
    </main>
  );
}
