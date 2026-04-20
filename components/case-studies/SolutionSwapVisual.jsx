"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useInView,
  useAnimationControls,
} from "framer-motion";
import { useEffect, useRef } from "react";

export default function SolutionSwapVisual() {
  const reduceMotion = useReducedMotion();
  const frameRef = useRef(null);
  const inView = useInView(frameRef, { once: true, amount: 0.45 });

  const oldControls = useAnimationControls();
  const newControls = useAnimationControls();

  useEffect(() => {
    if (!inView) return;

    if (reduceMotion) {
      oldControls.set({ opacity: 0 });
      newControls.set({ opacity: 1, filter: "blur(0px)", scale: 1 });
      return;
    }

    // Start: show 101 clearly, keep 102 hidden/blurry
    oldControls.set({ opacity: 1, filter: "blur(0px)", scale: 1 });
    newControls.set({ opacity: 0, filter: "blur(10px)", scale: 1.01 });

    const run = async () => {
      // ✅ Hold so user can see the first image
      await new Promise((r) => setTimeout(r, 900));

      // Bring in new image slowly (editorial)
      newControls.start({
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        transition: { duration: 1.25, ease: [0.22, 1, 0.36, 1] },
      });

      // Fade out old with slight blur
      oldControls.start({
        opacity: 0,
        filter: "blur(10px)",
        scale: 0.995,
        transition: { duration: 1.15, ease: [0.22, 1, 0.36, 1] },
      });
    };

    run();
  }, [inView, reduceMotion, oldControls, newControls]);

  return (
    <div
      ref={frameRef}
      className="relative w-full overflow-hidden rounded-2xl bg-[#D5D8E7]"
      style={{ height: 672 }}
    >
      {/* subtle frame */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/10" />

      {/* Centered 600px-tall stage */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[600px] w-[92%] max-w-[520px] overflow-hidden rounded-xl">
          {/* Image 101 */}
          <motion.div
            className="absolute inset-0"
            animate={oldControls}
            initial={{ opacity: 1 }}
          >
            <Image
              src="/case-studies/dior/solution101.png"
              alt="Unified calendar — version 1"
              fill
              className="object-contain"
              sizes="(max-width: 1200px) 90vw, 520px"
              quality={100}
              priority={false}
            />
          </motion.div>

          {/* Image 102 */}
          <motion.div
            className="absolute inset-0"
            animate={newControls}
            initial={{ opacity: 0 }}
          >
            <Image
              src="/case-studies/dior/solution102.png"
              alt="Unified calendar — refined version"
              fill
              className="object-contain"
              sizes="(max-width: 1200px) 90vw, 520px"
              quality={100}
              priority={false}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
