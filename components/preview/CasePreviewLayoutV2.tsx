"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PhoneFrame } from "./PhoneFrame";

export type AutoplayStep = {
  id: string;
  content: ReactNode;
  screen: ReactNode;
  durationMs: number;
};

export type Chapter =
  | {
      mode: "scroll";
      id: string;
      content: ReactNode;
      screen: ReactNode;
    }
  | {
      mode: "autoplay";
      id: string;
      steps: AutoplayStep[];
    };

type Props = {
  header: ReactNode;
  chapters: Chapter[];
  footer?: ReactNode;
  screenBackground?: string;
  panelBackground?: string;
};

export function CasePreviewLayout({
  header,
  chapters,
  footer,
  screenBackground,
  panelBackground = "#EAEAEA",
}: Props) {
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id ?? "");
  const [stepByChapter, setStepByChapter] = useState<Record<string, number>>(
    {},
  );
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
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

  const activeChapter = chapters.find((c) => c.id === activeId) ?? chapters[0];

  useEffect(() => {
    if (!activeChapter || activeChapter.mode !== "autoplay") return;
    const idx = stepByChapter[activeChapter.id] ?? 0;
    const current = activeChapter.steps[idx];
    if (!current) return;
    const t = window.setTimeout(() => {
      setStepByChapter((prev) => ({
        ...prev,
        [activeChapter.id]: (idx + 1) % activeChapter.steps.length,
      }));
    }, current.durationMs);
    return () => window.clearTimeout(t);
  }, [activeChapter, stepByChapter]);

  let activeScreen: ReactNode = null;
  let activeKey = activeChapter?.id ?? "";
  if (activeChapter) {
    if (activeChapter.mode === "scroll") {
      activeScreen = activeChapter.screen;
    } else {
      const idx = stepByChapter[activeChapter.id] ?? 0;
      const step = activeChapter.steps[idx];
      activeScreen = step?.screen ?? null;
      activeKey = `${activeChapter.id}:${step?.id ?? idx}`;
    }
  }

  const panelStyle: CSSProperties = { backgroundColor: panelBackground };

  return (
    <main
      className="min-h-dvh w-full bg-white text-stone-900"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="lg:flex lg:items-start">
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
                  {c.mode === "scroll" ? (
                    c.content
                  ) : (
                    <AutoplayContent
                      chapter={c}
                      stepIdx={stepByChapter[c.id] ?? 0}
                    />
                  )}
                </section>
              ))}
              {footer ? <div>{footer}</div> : null}
            </div>
          </div>
        </section>

        <aside
          className="
            lg:sticky lg:top-0 lg:self-start
            shrink-0
            w-full lg:w-[64.8vw]
            h-[min(100dvw,640px)] lg:h-dvh
            flex items-center justify-center
            px-4 lg:px-6
          "
          style={panelStyle}
        >
          <PhoneFrame screenBackground={screenBackground}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeKey}
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

function AutoplayContent({
  chapter,
  stepIdx,
}: {
  chapter: Extract<Chapter, { mode: "autoplay" }>;
  stepIdx: number;
}) {
  const step = chapter.steps[stepIdx];
  if (!step) return null;
  return (
    <div
      key={step.id}
      className="animate-case-fade-in"
      style={{ animationDuration: "0.4s" }}
    >
      {step.content}
    </div>
  );
}
