"use client";

import { memo, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Particle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  color: string;
}

const COLORS = [
  "rgb(0 230 118 / 0.18)",
  "rgb(255 215 64 / 0.12)",
  "rgb(68 138 255 / 0.10)",
];

const HERO_GRADIENT =
  "linear-gradient(135deg, #0B1120 0%, #1A2332 40%, #0D3A2A 100%)";

function rand(seed: number, salt: number) {
  const x = Math.sin(seed * 9301 + salt * 49297) * 233280;
  return x - Math.floor(x);
}

function StadiumBackgroundImpl() {
  const reduced = useReducedMotion();

  const particles = useMemo<Particle[]>(() => {
    const out: Particle[] = [];
    for (let i = 0; i < 15; i++) {
      out.push({
        id: i,
        left: rand(i, 1) * 100,
        size: 2 + rand(i, 2) * 2,
        duration: 15 + rand(i, 3) * 15,
        delay: rand(i, 4) * 18,
        drift: 8 + rand(i, 5) * 14,
        color: COLORS[i % COLORS.length],
      });
    }
    return out;
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden"
      style={{ background: HERO_GRADIENT }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[60%]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgb(0 230 118 / 0.06), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgb(255 215 64 / 0.04), transparent 50%)",
        }}
      />

      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: "-4%",
            width: p.size,
            height: p.size,
            background: p.color,
            willChange: reduced ? undefined : "transform, opacity",
          }}
          initial={{ y: 0, x: 0, opacity: 0 }}
          animate={
            reduced
              ? { opacity: 0.3 }
              : {
                  y: ["0vh", "-110vh"],
                  x: [0, p.drift, 0],
                  opacity: [0, 0.8, 0],
                }
          }
          transition={
            reduced
              ? { duration: 0 }
              : {
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
        />
      ))}
    </div>
  );
}

export const StadiumBackground = memo(StadiumBackgroundImpl);
