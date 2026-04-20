"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";

export default function UXResearchSection() {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });

  const ease = [0.22, 1, 0.36, 1];

  const leftItem = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 10, filter: "blur(6px)" },
    show: reduceMotion
      ? { opacity: 1 }
      : { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  // Right panel animation (container + stagger cards)
  const panel = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, filter: "blur(10px)" },
    show: reduceMotion ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)" },
  };

  const card = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 14, scale: 0.985, filter: "blur(10px)" },
    show: reduceMotion
      ? { opacity: 1 }
      : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  };

  return (
    <section className="w-full bg-[#0B0B0C] text-white">
      <div className="mx-auto w-full max-w-[1200px] px-8 py-24">
        {/* 2 columns same width */}
        <div
          ref={ref}
          className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16"
        >
          {/* LEFT (vertically centered) */}
          <div className="flex min-h-[560px] items-center">
            <div className="max-w-[520px]">
              <motion.p
                variants={leftItem}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                transition={{ duration: 0.7, ease }}
                className="text-[16px] font-medium tracking-[-0.04em] text-white/80"
              >
                UX Research
              </motion.p>

              <motion.h2
                variants={leftItem}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                transition={{ duration: 0.8, delay: 0.05, ease }}
                className="mt-6 text-[38px] font-medium tracking-[-0.04em] leading-tight"
              >
                Dior teams need clarity and control when planning launches
              </motion.h2>

              <motion.p
                variants={leftItem}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                transition={{ duration: 0.85, delay: 0.1, ease }}
                className="mt-6 text-[20px] font-normal tracking-[-0.04em] leading-relaxed text-white/85"
              >
                Through user interviews and observed task flows, we closely
                analyzed how teams planned and adjusted launches throughout the
                year. Users consistently struggled with basic operations such as
                updating dates, and understanding launch dependencies.
              </motion.p>
            </div>
          </div>

          {/* RIGHT (vertically centered) */}
          <div className="flex min-h-[560px] items-center">
            <motion.div
              variants={panel}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              transition={{ duration: 0.8, ease }}
              className="relative w-full overflow-hidden rounded-2xl bg-[#D5D8E7] p-10"
            >
              {/* Optional subtle depth */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/10" />

              {/* Cards stack */}
              <motion.div
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                transition={{ staggerChildren: 0.14, delayChildren: 0.18 }}
                className="relative mx-auto flex w-full max-w-[560px] flex-col gap-8"
              >
                <InsightCard
                  variants={card}
                  transition={{ duration: 0.85, ease }}
                  text="Complete frequent tasks with fewer steps"
                />
                <InsightCard
                  variants={card}
                  transition={{ duration: 0.85, delay: 0.04, ease }}
                  text="Understand where content lives and why"
                />
                <InsightCard
                  variants={card}
                  transition={{ duration: 0.85, delay: 0.08, ease }}
                  text="Work efficiently without leaving the site"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InsightCard({ text, variants, transition }) {
  return (
    <motion.div
      variants={variants}
      transition={transition}
      className="rounded-2xl bg-black px-10 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
    >
      <p className="text-[22px] font-normal tracking-[-0.04em] leading-snug text-white/95">
        {text}
      </p>
    </motion.div>
  );
}
