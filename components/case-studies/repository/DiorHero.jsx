"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function DiorHero() {
  const reduceMotion = useReducedMotion();

  const easeOut = [0.22, 1, 0.36, 1];

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.06,
      },
    },
  };

  const fadeUp = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 14, filter: "blur(8px)" },
    show: reduceMotion
      ? { opacity: 1 }
      : { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  // Unique image reveal: clip-path “curtain” + slight 3D tilt + gloss sweep
  const imageWrap = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          y: 12,
          rotateX: 6,
          rotateY: -10,
          scale: 0.98,
          filter: "blur(10px)",
          clipPath: "inset(0 0 100% 0 round 18px)",
        },
    show: reduceMotion
      ? { opacity: 1 }
      : {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          filter: "blur(0px)",
          clipPath: "inset(0 0 0% 0 round 18px)",
        },
  };

  const gloss = {
    hidden: { x: "-140%", opacity: 0 },
    show: {
      x: "140%",
      opacity: [0, 1, 0],
      transition: { duration: 1.2, ease: easeOut, delay: 0.35 },
    },
  };

  return (
    <section className="relative w-full bg-white text-black">
      <div className="mx-auto w-full max-w-[1200px] px-8 pt-10">
        {/* Top bar */}
        <motion.header
          initial={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="flex items-center justify-between"
        >
          {/* Name / Home */}
          <Link
            href="/"
            className="text-[20px] font-medium tracking-tight text-black/90 hover:text-black transition"
          >
            ✦ David Herrera
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <a
              href="https://drive.google.com/file/d/1wvcBV-DnJHviOw3tdjd7WX6Y3Xrggdlg/view"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[20px] font-medium tracking-tight text-black/70 hover:text-black transition"
            >
              Resumé
            </a>

            <a
              href="https://www.linkedin.com/in/herreraux/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[20px] font-medium tracking-tight text-black/70 hover:text-black transition"
            >
              LinkedIn
            </a>

            <a
              href="mailto:ework.dave@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[20px] font-medium tracking-tight text-black/70 hover:text-black transition"
            >
              Email
            </a>
          </nav>
        </motion.header>

        {/* Main grid */}
        <div className="mt-24 grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_520px]">
          {/* Left copy */}
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.9, ease: easeOut }}
              className="text-[56px] font-medium leading-[0.96] tracking-[-0.02em] sm:text-[64px] lg:text-[76px]"
            >
              Removing friction from everyday work
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.9, ease: easeOut }}
              className="mt-10 max-w-[640px] text-[22px] font-normal leading-[1.2] tracking-tight text-black/70 sm:text-[26px] lg:text-[30px]"
            >
              Redesigning Dior Latin America’s file repository to help teams
              access, manage, and reuse files faster with a clearer and more
              intuitive experience.
            </motion.p>
          </motion.div>

          {/* Right image */}
          <motion.div
            className="relative mx-auto w-full max-w-[520px]"
            style={{ perspective: 1200 }}
          >
            <motion.div
              variants={imageWrap}
              initial="hidden"
              animate="show"
              transition={{ duration: 1.05, ease: easeOut }}
              className="relative overflow-hidden rounded-[18px]"
            >
              {/* subtle paper-ish shadow like screenshot */}
              <div className="pointer-events-none absolute inset-0 rounded-[18px] shadow-[0_18px_50px_rgba(0,0,0,0.10)]" />

              {/* gloss sweep */}
              {!reduceMotion && (
                <motion.div
                  variants={gloss}
                  initial="hidden"
                  animate="show"
                  className="pointer-events-none absolute inset-[-40%] rotate-[18deg]"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                  }}
                />
              )}

              <Image
                src="/case-studies/dior/hero101.png"
                alt="Dior LatAm intranet redesign hero preview"
                width={1040}
                height={760}
                priority
                className="h-auto w-full select-none"
              />

              {/* tiny grain for premium feel */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-multiply"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(0,0,0,0.35) 1px, transparent 1px)",
                  backgroundSize: "3px 3px",
                }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom meta row */}
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOut, delay: 0.15 }}
          className="mt-24 pb-14"
        >
          <div className="grid grid-cols-2 gap-y-8 text-[18px] tracking-tight font-medium text-black/70 sm:grid-cols-4">
            <div>Dior Latam</div>
            <div>8 months</div>
            <div>Web, Responsive</div>
            <div className="text-black/80">Design Lead</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
