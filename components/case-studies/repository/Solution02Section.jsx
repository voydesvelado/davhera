"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import SwapVisual from "@/components/case-studies/SwapVisual";
import CountUpStat from "@/components/case-studies/CountUpStat";

export default function Solution02Section() {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const ease = [0.22, 1, 0.36, 1];

  const item = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 10, filter: "blur(6px)" },
    show: reduceMotion
      ? { opacity: 1 }
      : { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <section className="w-full bg-[#0B0B0C] text-white">
      <div ref={ref} className="mx-auto w-full max-w-[1200px] px-8 py-28">
        {/* Two columns */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* LEFT — text (vertically centered) */}
          <div className="flex items-center">
            <div className="max-w-[520px]">
              <motion.p
                variants={item}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                transition={{ duration: 0.7, ease }}
                className="text-[16px] font-medium tracking-[-0.04em] text-white/80"
              >
                02
              </motion.p>

              <motion.h3
                variants={item}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                transition={{ duration: 0.8, delay: 0.05, ease }}
                className="mt-6 text-[38px] font-medium tracking-[-0.04em] leading-tight"
              >
                Designing an intuitive and mobile-ready file experience
              </motion.h3>

              <motion.p
                variants={item}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                transition={{ duration: 0.85, delay: 0.1, ease }}
                className="mt-6 text-[20px] font-normal tracking-[-0.04em] leading-relaxed text-white/85"
              >
                The interface was redesigned to align with file management tools
                users were already familiar with, making the experience
                intuitive from the first interaction. We also introduced a fully
                responsive mobile version, enabling teams to access and manage
                assets on the go—addressing a key need expressed during
                research.
              </motion.p>

              {/* Metrics */}
              {/* <motion.div
                variants={item}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                transition={{ duration: 0.9, delay: 0.1, ease }}
                className="mt-10 space-y-3"
              >
                <CountUpStat
                  value={20}
                  label="faster asset discoverys"
                  duration={1.4}
                  delay={0.1}
                />
              </motion.div> */}
            </div>
          </div>

          {/* RIGHT — visual placeholder */}
          <div className="flex items-center">
            <motion.div
              variants={item}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              transition={{
                duration: 0.9,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full"
            >
              <SwapVisual
                src1="/case-studies/dior/solution301.png"
                src2="/case-studies/dior/solution302.png"
                alt1="Unified calendar — version 1"
                alt2="Unified calendar — refined version"
                bgColor="#E9DFE5"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
