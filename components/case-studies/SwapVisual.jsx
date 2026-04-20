"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useInView,
  useAnimationControls,
} from "framer-motion";
import { useEffect, useRef } from "react";

export default function SwapVisual({
  // required
  src1,
  src2,

  // optional
  alt1 = "Before",
  alt2 = "After",

  // layout
  containerHeight = 672,
  imageHeight = 600,
  maxWidth = 520,
  widthPercent = 92, // 92% like you have now
  rounded = "rounded-2xl",
  innerRounded = "rounded-xl",
  bgColor = "#D5D8E7",
  showFrame = true,

  // image quality
  quality = 100,
  priority = false,
  sizes = "(max-width: 1200px) 90vw, 520px",

  // timing
  holdMs = 900,
  inDuration = 1.25,
  outDuration = 1.15,
  blurPx = 10,
  inScale = 1.01,
  outScale = 0.995,

  // viewport
  once = true,
  amount = 0.45,
}) {
  const reduceMotion = useReducedMotion();
  const frameRef = useRef(null);
  const inView = useInView(frameRef, { once, amount });

  const oldControls = useAnimationControls();
  const newControls = useAnimationControls();

  useEffect(() => {
    if (!inView) return;

    if (reduceMotion) {
      oldControls.set({ opacity: 0 });
      newControls.set({ opacity: 1, filter: "blur(0px)", scale: 1 });
      return;
    }

    oldControls.set({ opacity: 1, filter: "blur(0px)", scale: 1 });
    newControls.set({
      opacity: 0,
      filter: `blur(${blurPx}px)`,
      scale: inScale,
    });

    const run = async () => {
      await new Promise((r) => setTimeout(r, holdMs));

      newControls.start({
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        transition: { duration: inDuration, ease: [0.22, 1, 0.36, 1] },
      });

      oldControls.start({
        opacity: 0,
        filter: `blur(${blurPx}px)`,
        scale: outScale,
        transition: { duration: outDuration, ease: [0.22, 1, 0.36, 1] },
      });
    };

    run();
  }, [
    inView,
    reduceMotion,
    oldControls,
    newControls,
    holdMs,
    inDuration,
    outDuration,
    blurPx,
    inScale,
    outScale,
  ]);

  // Tailwind doesn't accept dynamic % easily, so we use inline style for width
  const stageWidthStyle = { width: `${widthPercent}%`, maxWidth };

  return (
    <div
      ref={frameRef}
      className={`relative w-full overflow-hidden ${rounded}`}
      style={{ height: containerHeight, backgroundColor: bgColor }}
    >
      {showFrame && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/10" />
      )}

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`relative overflow-hidden ${innerRounded}`}
          style={{ height: imageHeight, ...stageWidthStyle }}
        >
          {/* Image 1 */}
          <motion.div
            className="absolute inset-0"
            animate={oldControls}
            initial={{ opacity: 1 }}
          >
            <Image
              src={src1}
              alt={alt1}
              fill
              className="object-contain"
              sizes={sizes}
              quality={quality}
              priority={priority}
            />
          </motion.div>

          {/* Image 2 */}
          <motion.div
            className="absolute inset-0"
            animate={newControls}
            initial={{ opacity: 0 }}
          >
            <Image
              src={src2}
              alt={alt2}
              fill
              className="object-contain"
              sizes={sizes}
              quality={quality}
              priority={priority}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
