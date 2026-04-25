"use client";

import { memo, useMemo } from "react";
import { useReducedMotion } from "framer-motion";

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

function rand(seed: number, salt: number) {
  // Deterministic pseudo-random so SSR + client agree.
  const x = Math.sin(seed * 9301 + salt * 49297) * 233280;
  return x - Math.floor(x);
}

function StadiumBackgroundImpl() {
  const reduced = useReducedMotion();

  const particles = useMemo<Particle[]>(() => {
    const out: Particle[] = [];
    for (let i = 0; i < 18; i++) {
      out.push({
        id: i,
        left: rand(i, 1) * 100,
        size: 2 + rand(i, 2) * 2.5,
        duration: 18 + rand(i, 3) * 14,
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
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0B1120 0%, #1A2332 40%, #0D3A2A 100%)",
      }}
    >
      {/* Top stadium-light wash */}
      <div
        className="absolute inset-x-0 top-0 h-[60%]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgb(0 230 118 / 0.06) 0%, transparent 70%)",
        }}
      />
      {/* Bottom warm wash */}
      <div
        className="absolute inset-x-0 bottom-0 h-[50%]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgb(255 215 64 / 0.04) 0%, transparent 60%)",
        }}
      />
      {/* Decorative pitch lines */}
      <div className="absolute inset-x-6 top-[33%] h-px bg-stadium-border-subtle/30" />
      <div className="absolute inset-x-6 top-[66%] h-px bg-stadium-border-subtle/30" />

      {/* Particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: "-8%",
            width: p.size,
            height: p.size,
            background: p.color,
            willChange: reduced ? undefined : "transform, opacity",
            animation: reduced
              ? undefined
              : `stadium-particle-float ${p.duration}s ${p.delay}s linear infinite`,
            // CSS variable consumed by the keyframe for horizontal drift amount
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

export const StadiumBackground = memo(StadiumBackgroundImpl);
