"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

export default function CountUpStat({
  value,
  suffix = "%",
  prefix = "+",
  label,
  duration = 1.2,
  delay = 0,
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });

  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [isInView, reduceMotion, value, duration, delay]);

  return (
    <div ref={ref} className="text-[20px] tracking-[-0.04em] text-white">
      <span className="tabular-nums">
        {prefix}
        {display}
        {suffix}
      </span>{" "}
      <span className="text-white/85">{label}</span>
    </div>
  );
}
