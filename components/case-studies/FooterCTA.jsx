"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export default function FooterCTA({
  eyebrow = "Let’s build something together",
  titleA = "Ready to ship your",
  titleB = "next",
  titleC = "project?",
  description = "I design and build clean, scalable interfaces—fast. If you’re working on something ambitious, let’s talk.",
  name = "David Herrera",
  year = new Date().getFullYear(),
}) {
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1];

  const wrap = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.04 },
    },
  };

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: reduce ? 0 : 14,
      filter: reduce ? "none" : "blur(8px)",
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease },
    },
  };

  const line = {
    hidden: { scaleX: 0, opacity: 0 },
    show: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 0.9, ease },
    },
  };

  const button = {
    hidden: {
      opacity: 0,
      y: reduce ? 0 : 10,
      scale: reduce ? 1 : 0.98,
      filter: reduce ? "none" : "blur(6px)",
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.85, ease, delay: 0.05 },
    },
  };

  return (
    <footer className="relative w-full bg-[#0B0B0C]">
      {/* CTA */}
      <div className="mx-auto w-full max-w-6xl px-6 pb-14 pt-24">
        <motion.div
          variants={wrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.45 }}
          className="text-center"
        >
          {/* Eyebrow */}
          <motion.div
            variants={fadeUp}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <motion.span
              variants={line}
              className="hidden h-px w-16 bg-white/15 sm:block"
            />
            <span className="text-sm font-medium tracking-wide text-white/55">
              {eyebrow}
            </span>
            <motion.span
              variants={line}
              className="hidden h-px w-16 bg-white/15 sm:block"
            />
          </motion.div>

          {/* Title */}
          <motion.h2
            variants={fadeUp}
            className="mx-auto max-w-5xl text-balance text-[44px] font-medium leading-[0.96] tracking-[-0.02em] text-white sm:text-[64px] md:text-[76px]"
          >
            {titleA} <span className="text-white/55">{titleB}</span> {titleC}
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-3xl text-balance text-[18px] leading-[1.55] text-white/55 sm:text-[20px]"
          >
            {description}
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={button} className="mt-10 flex justify-center">
            <motion.a
              href="mailto:contactochka@gmail.com"
              whileHover={reduce ? {} : { y: -1, scale: 1.01 }}
              whileTap={reduce ? {} : { scale: 0.99 }}
              transition={{ duration: 0.35, ease }}
              className="
      inline-flex items-center gap-3
      rounded-full bg-white
      px-8 py-4
      text-[16px] font-medium text-black
      shadow-[0_10px_30px_rgba(0,0,0,0.45)]
    "
              aria-label="Contact me"
            >
              {/* Mail icon – no container */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-80"
              >
                <path
                  d="M4 8.5V17a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M6.2 7h11.6c.6 0 1.1.2 1.5.6.4.4.7.9.7 1.5v.2L12 14 4 9.3V9c0-.6.2-1.1.7-1.5.4-.4.9-.6 1.5-.6Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>

              <span>Contact me</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <p className="text-sm text-white/45">
            © {year} {name}. All rights reserved.
          </p>

          <nav className="flex items-center gap-6">
            <a
              href="https://www.linkedin.com/in/herreraux/"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-white/55 transition-colors hover:text-white"
            >
              LinkedIn
            </a>
            <a
              href="https://wa.me/526641265999"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-white/55 transition-colors hover:text-white"
            >
              WhatsApp
            </a>
          </nav>
        </div>
      </div>

      {/* Subtle vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(900px 320px at 50% 20%, rgba(255,255,255,0.06), transparent 60%)",
        }}
      />
    </footer>
  );
}
