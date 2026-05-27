"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

/* ---------------- Design tokens (Menura) ---------------- */
const COLORS = {
  orange500: "#F97316",
  orange600: "#EA580C",
  orange700: "#C2410C",
  stone900: "#1C1917",
  stone700: "#44403C",
  stone600: "#57534E",
  stone500: "#78716C",
  stone400: "#A8A29E",
  stone300: "#D6D3D1",
  stone200: "#E7E5E4",
  stone100: "#F5F5F4",
  stone50: "#FAFAF9",
  white: "#FFFFFF",
};

const FONT_DISPLAY = "var(--font-display), 'Plus Jakarta Sans', sans-serif";
const FONT_BODY = "var(--font-body), 'DM Sans', sans-serif";
const FONT_MONO = "var(--font-mono), 'JetBrains Mono', monospace";

const TOTAL_SLIDES = 9;

/* ---------------- Animation primitives ---------------- */
const slideVariants: Variants = {
  enter: { opacity: 0, y: 24 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

/* ---------------- Small shared bits ---------------- */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      variants={fadeUp}
      className="text-xs font-semibold uppercase"
      style={{
        color: COLORS.orange600,
        letterSpacing: "0.18em",
        fontFamily: FONT_BODY,
      }}
    >
      {children}
    </motion.p>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: FONT_MONO,
        color: COLORS.orange600,
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </span>
  );
}

/* =====================================================
 *  Slide 1 — Title
 * ===================================================== */
function Slide1() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="w-full h-full flex flex-col justify-center items-start px-16 md:px-32"
      style={{ backgroundColor: COLORS.stone50 }}
    >
      <motion.div variants={fadeUp} className="mb-10">
        <Kicker>Teach-back · 8 min</Kicker>
      </motion.div>

      <motion.h1
        variants={fadeUp}
        className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-8"
        style={{
          fontFamily: FONT_DISPLAY,
          color: COLORS.stone900,
          maxWidth: "20ch",
        }}
      >
        How backend decisions{" "}
        <span style={{ color: COLORS.orange500 }}>shape UX.</span>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="text-xl md:text-2xl leading-relaxed mb-16"
        style={{
          fontFamily: FONT_BODY,
          color: COLORS.stone500,
          maxWidth: "40ch",
        }}
      >
        And how a design engineer should work because of it.
      </motion.p>

      <motion.div
        variants={fadeUp}
        className="flex items-center gap-3"
        style={{ fontFamily: FONT_BODY }}
      >
        <div
          className="w-8 h-px"
          style={{ backgroundColor: COLORS.stone300 }}
        />
        <p
          className="text-sm font-medium"
          style={{ color: COLORS.stone600 }}
        >
          David Herrera — Design Engineer
        </p>
      </motion.div>
    </motion.div>
  );
}

/* =====================================================
 *  Slide 2 — Thesis
 * ===================================================== */
function Slide2() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="w-full h-full flex flex-col justify-center items-center px-16 md:px-32 text-center"
      style={{ backgroundColor: COLORS.stone50 }}
    >
      <motion.div variants={fadeUp} className="mb-12">
        <SectionLabel>The thesis</SectionLabel>
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]"
        style={{
          fontFamily: FONT_DISPLAY,
          color: COLORS.stone900,
          maxWidth: "22ch",
        }}
      >
        The data model is{" "}
        <span style={{ color: COLORS.orange500 }}>half</span> the UX.
      </motion.h2>

      <motion.svg
        variants={fadeIn}
        width="120"
        height="2"
        className="mt-16"
        viewBox="0 0 120 2"
      >
        <motion.line
          x1="0"
          y1="1"
          x2="120"
          y2="1"
          stroke={COLORS.orange500}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
        />
      </motion.svg>
    </motion.div>
  );
}

/* =====================================================
 *  Slide 3 — The trap
 * ===================================================== */
function Slide3() {
  const questions = [
    "Should this field be optional?",
    "Should this be one type or two?",
    "Should we track this state?",
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="w-full h-full flex flex-col justify-center px-16 md:px-32"
      style={{ backgroundColor: COLORS.stone50 }}
    >
      <motion.div variants={fadeUp} className="mb-10">
        <SectionLabel>The trap</SectionLabel>
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="text-3xl md:text-5xl font-bold tracking-tight mb-16"
        style={{
          fontFamily: FONT_DISPLAY,
          color: COLORS.stone900,
          maxWidth: "20ch",
        }}
      >
        These feel technical.
      </motion.h2>

      <motion.div
        variants={staggerContainer}
        className="flex flex-col gap-8 mb-20"
      >
        {questions.map((q, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="flex items-baseline gap-6"
          >
            <span
              style={{
                fontFamily: FONT_MONO,
                color: COLORS.stone400,
                fontSize: 16,
                width: 36,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <p
              className="text-2xl md:text-3xl font-medium"
              style={{
                fontFamily: FONT_DISPLAY,
                color: COLORS.stone700,
              }}
            >
              {q}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        variants={fadeUp}
        className="text-2xl md:text-3xl font-bold"
        style={{
          fontFamily: FONT_DISPLAY,
          color: COLORS.stone900,
        }}
      >
        They&apos;re not. They&apos;re product questions{" "}
        <span style={{ color: COLORS.orange500 }}>
          wearing engineering clothing.
        </span>
      </motion.p>
    </motion.div>
  );
}

/* =====================================================
 *  Slide 4 — Three cases intro
 * ===================================================== */
function Slide4() {
  const cases = [
    {
      n: "01",
      title: "The survey that captures partial responses",
      tag: "Got it right — because the client forced me to.",
    },
    {
      n: "02",
      title: "The variants I didn't model",
      tag: "Got it wrong. Paying for it now.",
    },
    {
      n: "03",
      title: "The franchise the structure can't support",
      tag: "Active ceiling. Blocking real business this month.",
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="w-full h-full flex flex-col justify-center px-16 md:px-32"
      style={{ backgroundColor: COLORS.stone50 }}
    >
      <motion.div variants={fadeUp} className="mb-8">
        <SectionLabel>Three cases · from a real client</SectionLabel>
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="text-4xl md:text-6xl font-bold tracking-tight mb-3"
        style={{
          fontFamily: FONT_DISPLAY,
          color: COLORS.stone900,
        }}
      >
        Menura
      </motion.h2>

      <motion.p
        variants={fadeUp}
        className="text-lg md:text-xl mb-14"
        style={{ fontFamily: FONT_BODY, color: COLORS.stone500 }}
      >
        QR menu SaaS for independent restaurants in Mexico.
      </motion.p>

      <motion.div variants={staggerContainer} className="flex flex-col gap-6">
        {cases.map((c) => (
          <motion.div
            key={c.n}
            variants={fadeUp}
            className="flex items-start gap-6 pb-6"
            style={{ borderBottom: `1px solid ${COLORS.stone200}` }}
          >
            <span
              style={{
                fontFamily: FONT_MONO,
                color: COLORS.orange500,
                fontSize: 14,
                fontWeight: 600,
                paddingTop: 6,
                minWidth: 36,
              }}
            >
              {c.n}
            </span>
            <div className="flex-1">
              <p
                className="text-xl md:text-2xl font-bold mb-1"
                style={{
                  fontFamily: FONT_DISPLAY,
                  color: COLORS.stone900,
                }}
              >
                {c.title}
              </p>
              <p
                className="text-sm md:text-base"
                style={{
                  fontFamily: FONT_BODY,
                  color: COLORS.stone500,
                }}
              >
                {c.tag}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* =====================================================
 *  Slide 5 — Case 1: The survey (with animated SVG state diagram)
 * ===================================================== */
function Slide5() {
  const states = [
    { label: "tapped rating", x: 80 },
    { label: "added comment", x: 280 },
    { label: "added contact", x: 480 },
    { label: "completed", x: 680 },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="w-full h-full flex flex-col justify-center px-16 md:px-32"
      style={{ backgroundColor: COLORS.stone50 }}
    >
      <motion.div variants={fadeUp} className="mb-6 flex items-center gap-4">
        <span
          style={{
            fontFamily: FONT_MONO,
            color: COLORS.orange500,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          CASE 01
        </span>
        <div className="h-px flex-1" style={{ backgroundColor: COLORS.stone200 }} />
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
        style={{ fontFamily: FONT_DISPLAY, color: COLORS.stone900 }}
      >
        The survey that captures everything.
      </motion.h2>

      <motion.p
        variants={fadeUp}
        className="text-xl md:text-2xl mb-16"
        style={{
          fontFamily: FONT_BODY,
          color: COLORS.stone500,
          maxWidth: "44ch",
        }}
      >
        &quot;I want to capture the rating even if the user doesn&apos;t finish.&quot;
      </motion.p>

      {/* Animated state diagram */}
      <motion.div variants={fadeIn} className="w-full">
        <svg
          viewBox="0 0 800 140"
          className="w-full"
          style={{ maxWidth: "900px" }}
        >
          {/* Connecting line */}
          <motion.line
            x1="100"
            y1="50"
            x2="700"
            y2="50"
            stroke={COLORS.stone300}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: 0.6, ease: "easeOut" }}
          />

          {states.map((s, i) => (
            <motion.g
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.8 + i * 0.2,
                ease: "easeOut",
              }}
            >
              <circle
                cx={s.x + 20}
                cy="50"
                r="10"
                fill={i === states.length - 1 ? COLORS.orange500 : COLORS.white}
                stroke={COLORS.orange500}
                strokeWidth="2"
              />
              <text
                x={s.x + 20}
                y="95"
                textAnchor="middle"
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 14,
                  fill: COLORS.stone700,
                  fontWeight: 500,
                }}
              >
                {s.label}
              </text>
              <text
                x={s.x + 20}
                y="118"
                textAnchor="middle"
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  fill: COLORS.stone400,
                  letterSpacing: "0.08em",
                }}
              >
                STATE {i + 1}
              </text>
            </motion.g>
          ))}
        </svg>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="mt-16 p-6 rounded-2xl"
        style={{
          backgroundColor: COLORS.white,
          border: `1px solid ${COLORS.stone200}`,
        }}
      >
        <p
          className="text-lg md:text-xl font-medium"
          style={{ fontFamily: FONT_DISPLAY, color: COLORS.stone900 }}
        >
          If the schema doesn&apos;t know about abandonment,{" "}
          <span style={{ color: COLORS.orange600 }}>
            the dashboard can never show it.
          </span>
        </p>
        <p
          className="text-sm mt-2"
          style={{
            fontFamily: FONT_MONO,
            color: COLORS.stone400,
            letterSpacing: "0.04em",
          }}
        >
          Not hard to build — impossible to build.
        </p>
      </motion.div>
    </motion.div>
  );
}

/* =====================================================
 *  Slide 6 — Case 2: The variants
 * ===================================================== */
function Slide6() {
  const sizeOptions = [
    { label: "Regular", price: "$45", selected: true },
    { label: "Large", price: "+$15", selected: false },
  ];
  const milkOptions = [
    { label: "Whole", price: "+$0", selected: true },
    { label: "Oat", price: "+$10", selected: false },
    { label: "Almond", price: "+$10", selected: false },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="w-full h-full flex flex-col justify-center px-12 md:px-24 py-12 overflow-hidden"
      style={{ backgroundColor: COLORS.stone50 }}
    >
      <motion.div variants={fadeUp} className="mb-4 flex items-center gap-4">
        <span
          style={{
            fontFamily: FONT_MONO,
            color: COLORS.orange500,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.1em",
          }}
        >
          CASE 02
        </span>
        <div className="h-px flex-1" style={{ backgroundColor: COLORS.stone200 }} />
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="text-3xl md:text-5xl font-bold tracking-tight mb-2"
        style={{ fontFamily: FONT_DISPLAY, color: COLORS.stone900 }}
      >
        The variants I didn&apos;t model.
      </motion.h2>

      <motion.p
        variants={fadeUp}
        className="text-base md:text-lg mb-10"
        style={{ fontFamily: FONT_BODY, color: COLORS.stone500 }}
      >
        &quot;Each cappuccino can be decaf, oat milk, or a different size.&quot;
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* LEFT — Today */}
        <motion.div variants={fadeUp}>
          <p
            className="text-[11px] uppercase mb-3"
            style={{
              fontFamily: FONT_MONO,
              color: COLORS.stone400,
              letterSpacing: "0.18em",
            }}
          >
            What I built
          </p>
          <div
            className="p-6 rounded-2xl"
            style={{
              backgroundColor: COLORS.white,
              border: `1px solid ${COLORS.stone200}`,
              boxShadow:
                "0 0 0 1px rgba(28,25,23,0.04), 0 4px 16px rgba(28,25,23,0.04)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: FONT_DISPLAY, color: COLORS.stone900 }}
                >
                  Cappuccino
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: FONT_BODY, color: COLORS.stone500 }}
                >
                  Espresso doble con leche texturizada.
                </p>
              </div>
              <p
                className="text-2xl font-bold whitespace-nowrap"
                style={{ fontFamily: FONT_MONO, color: COLORS.orange500 }}
              >
                $45
              </p>
            </div>

            <div
              className="mt-5 pt-4 flex items-center gap-2"
              style={{ borderTop: `1px solid ${COLORS.stone100}` }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: COLORS.stone300 }}
              />
              <p
                className="text-xs"
                style={{ fontFamily: FONT_BODY, color: COLORS.stone400 }}
              >
                One item, one price.
              </p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — What's needed */}
        <motion.div variants={fadeUp}>
          <p
            className="text-[11px] uppercase mb-3"
            style={{
              fontFamily: FONT_MONO,
              color: COLORS.orange600,
              letterSpacing: "0.18em",
            }}
          >
            What the client needs
          </p>
          <div
            className="p-6 rounded-2xl"
            style={{
              backgroundColor: COLORS.white,
              border: `1px solid ${COLORS.stone200}`,
              boxShadow:
                "0 0 0 1px rgba(28,25,23,0.04), 0 8px 32px rgba(249,115,22,0.08)",
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex-1">
                <p
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: FONT_DISPLAY, color: COLORS.stone900 }}
                >
                  Cappuccino
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: FONT_BODY, color: COLORS.stone500 }}
                >
                  Espresso doble con leche texturizada.
                </p>
              </div>
              <div className="text-right whitespace-nowrap">
                <p
                  className="text-[10px] uppercase"
                  style={{
                    fontFamily: FONT_MONO,
                    color: COLORS.stone400,
                    letterSpacing: "0.1em",
                  }}
                >
                  From
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ fontFamily: FONT_MONO, color: COLORS.orange500 }}
                >
                  $45
                </p>
              </div>
            </div>

            {/* Size variants */}
            <div className="mb-4">
              <p
                className="text-[10px] uppercase mb-2"
                style={{
                  fontFamily: FONT_MONO,
                  color: COLORS.stone400,
                  letterSpacing: "0.15em",
                }}
              >
                Size
              </p>
              <div className="flex gap-2">
                {sizeOptions.map((opt) => (
                  <div
                    key={opt.label}
                    className="flex-1 px-3 py-2 rounded-lg flex items-center justify-between"
                    style={{
                      backgroundColor: opt.selected
                        ? COLORS.stone900
                        : COLORS.stone100,
                      border: `1px solid ${
                        opt.selected ? COLORS.stone900 : COLORS.stone200
                      }`,
                    }}
                  >
                    <span
                      className="text-xs font-semibold"
                      style={{
                        fontFamily: FONT_BODY,
                        color: opt.selected ? COLORS.white : COLORS.stone700,
                      }}
                    >
                      {opt.label}
                    </span>
                    <span
                      className="text-xs"
                      style={{
                        fontFamily: FONT_MONO,
                        color: opt.selected ? COLORS.stone300 : COLORS.stone400,
                      }}
                    >
                      {opt.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Milk variants */}
            <div className="mb-4">
              <p
                className="text-[10px] uppercase mb-2"
                style={{
                  fontFamily: FONT_MONO,
                  color: COLORS.stone400,
                  letterSpacing: "0.15em",
                }}
              >
                Milk
              </p>
              <div className="flex flex-wrap gap-2">
                {milkOptions.map((opt) => (
                  <div
                    key={opt.label}
                    className="px-3 py-1.5 rounded-full flex items-center gap-2"
                    style={{
                      backgroundColor: opt.selected
                        ? COLORS.stone900
                        : COLORS.stone100,
                      border: `1px solid ${
                        opt.selected ? COLORS.stone900 : COLORS.stone200
                      }`,
                    }}
                  >
                    <span
                      className="text-xs font-semibold"
                      style={{
                        fontFamily: FONT_BODY,
                        color: opt.selected ? COLORS.white : COLORS.stone700,
                      }}
                    >
                      {opt.label}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{
                        fontFamily: FONT_MONO,
                        color: opt.selected ? COLORS.stone300 : COLORS.stone400,
                      }}
                    >
                      {opt.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decaf toggle */}
            <div
              className="flex items-center justify-between pt-4 mt-1"
              style={{ borderTop: `1px solid ${COLORS.stone100}` }}
            >
              <span
                className="text-sm font-medium"
                style={{ fontFamily: FONT_BODY, color: COLORS.stone700 }}
              >
                Decaf
              </span>
              <div
                className="w-9 h-5 rounded-full p-0.5 flex items-center"
                style={{ backgroundColor: COLORS.stone200 }}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS.white, boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={fadeUp}
        className="mt-10 p-5 rounded-xl"
        style={{
          backgroundColor: COLORS.white,
          border: `1px solid ${COLORS.stone200}`,
        }}
      >
        <p
          className="text-lg md:text-xl font-semibold"
          style={{ fontFamily: FONT_DISPLAY, color: COLORS.stone900 }}
        >
          Flexibility in the schema is{" "}
          <span style={{ color: COLORS.orange500 }}>
            rigidity in the interface.
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
}

/* =====================================================
 *  Slide 7 — Case 3: The franchise (side-by-side diagrams)
 * ===================================================== */
function Slide7() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="w-full h-full flex flex-col justify-center px-10 md:px-16 py-10 overflow-hidden"
      style={{ backgroundColor: COLORS.stone50 }}
    >
      <motion.div variants={fadeUp} className="mb-3 flex items-center gap-4">
        <span
          style={{
            fontFamily: FONT_MONO,
            color: COLORS.orange500,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.1em",
          }}
        >
          CASE 03
        </span>
        <div className="h-px flex-1" style={{ backgroundColor: COLORS.stone200 }} />
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="text-3xl md:text-4xl font-bold tracking-tight mb-2"
        style={{ fontFamily: FONT_DISPLAY, color: COLORS.stone900 }}
      >
        The franchise the structure{" "}
        <span style={{ color: COLORS.orange500 }}>can&apos;t support.</span>
      </motion.h2>

      <motion.p
        variants={fadeUp}
        className="text-base mb-8"
        style={{ fontFamily: FONT_BODY, color: COLORS.stone500 }}
      >
        &quot;I want to start franchising — multiple locations, shared brand.&quot;
      </motion.p>

      {/* TWO COLUMNS — fixed, side by side */}
      <div className="grid grid-cols-2 gap-6 items-stretch">
        {/* COLUMN 1 — What I built */}
        <motion.div variants={fadeUp} className="flex flex-col">
          <p
            className="text-[11px] uppercase mb-3"
            style={{
              fontFamily: FONT_MONO,
              color: COLORS.stone400,
              letterSpacing: "0.18em",
            }}
          >
            What I built
          </p>
          <div
            className="flex-1 p-5 rounded-2xl"
            style={{
              backgroundColor: COLORS.white,
              border: `1px solid ${COLORS.stone200}`,
              boxShadow:
                "0 0 0 1px rgba(28,25,23,0.04), 0 4px 16px rgba(28,25,23,0.04)",
            }}
          >
            {/* Restaurant card */}
            <div
              className="p-3 rounded-xl mb-3"
              style={{
                backgroundColor: COLORS.stone900,
                color: COLORS.white,
              }}
            >
              <p
                className="text-[9px] uppercase mb-0.5"
                style={{
                  fontFamily: FONT_MONO,
                  color: COLORS.stone400,
                  letterSpacing: "0.15em",
                }}
              >
                Root entity
              </p>
              <p
                className="text-base font-bold"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                Restaurant
              </p>
            </div>

            <div
              className="pl-3 space-y-1.5"
              style={{ borderLeft: `2px solid ${COLORS.stone200}` }}
            >
              {["Menu", "Items", "Categories"].map((label) => (
                <div
                  key={label}
                  className="px-2.5 py-1.5 rounded-lg flex items-center gap-2"
                  style={{
                    backgroundColor: COLORS.stone100,
                    border: `1px solid ${COLORS.stone200}`,
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: COLORS.stone400 }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ fontFamily: FONT_BODY, color: COLORS.stone700 }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <p
              className="text-[11px] mt-3"
              style={{ fontFamily: FONT_BODY, color: COLORS.stone400 }}
            >
              One owner. One menu. One identity.
            </p>
          </div>
        </motion.div>

        {/* COLUMN 2 — What the client needs */}
        <motion.div variants={fadeUp} className="flex flex-col">
          <p
            className="text-[11px] uppercase mb-3"
            style={{
              fontFamily: FONT_MONO,
              color: COLORS.orange600,
              letterSpacing: "0.18em",
            }}
          >
            What the client needs
          </p>
          <div
            className="flex-1 p-5 rounded-2xl"
            style={{
              backgroundColor: COLORS.white,
              border: `1px solid ${COLORS.stone200}`,
              boxShadow:
                "0 0 0 1px rgba(28,25,23,0.04), 0 8px 32px rgba(249,115,22,0.08)",
            }}
          >
            {/* Brand card */}
            <div
              className="p-3 rounded-xl mb-3"
              style={{
                backgroundColor: COLORS.orange500,
                color: COLORS.white,
              }}
            >
              <p
                className="text-[9px] uppercase mb-0.5"
                style={{
                  fontFamily: FONT_MONO,
                  color: "rgba(255,255,255,0.75)",
                  letterSpacing: "0.15em",
                }}
              >
                New root entity
              </p>
              <p
                className="text-base font-bold"
                style={{ fontFamily: FONT_DISPLAY }}
              >
                Brand
              </p>
            </div>

            <div
              className="pl-3 space-y-1.5"
              style={{ borderLeft: `2px solid ${COLORS.orange500}` }}
            >
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="px-2.5 py-2 rounded-lg"
                  style={{
                    backgroundColor: COLORS.stone50,
                    border: `1px solid ${COLORS.stone200}`,
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: COLORS.orange500 }}
                      />
                      <span
                        className="text-xs font-bold"
                        style={{
                          fontFamily: FONT_DISPLAY,
                          color: COLORS.stone900,
                        }}
                      >
                        Location {n}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {["Menu", "Items"].map((label) => (
                        <span
                          key={label}
                          className="px-1.5 py-0.5 rounded text-[9px] font-medium"
                          style={{
                            fontFamily: FONT_BODY,
                            backgroundColor: COLORS.white,
                            color: COLORS.stone600,
                            border: `1px solid ${COLORS.stone200}`,
                          }}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p
              className="text-[11px] mt-3"
              style={{ fontFamily: FONT_BODY, color: COLORS.stone500 }}
            >
              One brand. Many locations. Shared identity.
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={fadeUp}
        className="mt-6 p-4 rounded-xl"
        style={{
          backgroundColor: COLORS.white,
          border: `1px solid ${COLORS.stone200}`,
        }}
      >
        <p
          className="text-sm md:text-base font-medium italic"
          style={{ fontFamily: FONT_BODY, color: COLORS.stone700 }}
        >
          The most expensive decisions aren&apos;t the ones that feel complex.{" "}
          <span
            className="not-italic font-semibold"
            style={{ color: COLORS.stone900, fontFamily: FONT_DISPLAY }}
          >
            They&apos;re the ones that feel obvious.
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
}

/* =====================================================
 *  Slide 8 — Five practices
 * ===================================================== */
function Slide8() {
  const practices = [
    {
      title: "Be in the room when structure gets decided.",
      sub: "Ask: what experience becomes impossible if we build it this way?",
    },
    {
      title: "Push for states to be explicit, not inferred.",
      sub: "State machines belong in the schema, not patched on top by the frontend.",
    },
    {
      title: "Backend and interface should speak the same language.",
      sub: "Shared vocabulary is a feature, not a polish step.",
    },
    {
      title: "Treat edge cases as part of the product, not cleanup.",
      sub: "Empty, errored, partial, denied — model them upfront.",
    },
    {
      title: "Agree on the shape of data before either of you builds.",
      sub: "Define what the component needs, not what the database stores.",
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="w-full h-full flex flex-col justify-center px-16 md:px-32"
      style={{ backgroundColor: COLORS.stone50 }}
    >
      <motion.div variants={fadeUp} className="mb-6">
        <SectionLabel>Five practices</SectionLabel>
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="text-3xl md:text-5xl font-bold tracking-tight mb-14"
        style={{
          fontFamily: FONT_DISPLAY,
          color: COLORS.stone900,
          maxWidth: "22ch",
        }}
      >
        What a good design engineer brings to the relationship.
      </motion.h2>

      <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        {practices.map((p, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="flex gap-5 pb-5"
            style={{ borderBottom: `1px solid ${COLORS.stone200}` }}
          >
            <span
              style={{
                fontFamily: FONT_MONO,
                color: COLORS.orange500,
                fontSize: 14,
                fontWeight: 600,
                minWidth: 28,
                paddingTop: 4,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p
                className="text-lg md:text-xl font-bold mb-1"
                style={{ fontFamily: FONT_DISPLAY, color: COLORS.stone900 }}
              >
                {p.title}
              </p>
              <p
                className="text-sm md:text-base"
                style={{ fontFamily: FONT_BODY, color: COLORS.stone500 }}
              >
                {p.sub}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* =====================================================
 *  Slide 9 — Closing
 * ===================================================== */
function Slide9() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="w-full h-full flex flex-col justify-center items-center text-center px-16 md:px-32"
      style={{ backgroundColor: COLORS.stone50 }}
    >
      <motion.div variants={fadeUp} className="mb-12">
        <SectionLabel>The takeaway</SectionLabel>
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-16"
        style={{
          fontFamily: FONT_DISPLAY,
          color: COLORS.stone900,
          maxWidth: "24ch",
        }}
      >
        We sit between{" "}
        <span style={{ color: COLORS.orange500 }}>data and experience</span>,
        not just between design and code.
      </motion.h2>

      <motion.div variants={fadeIn} className="mb-16">
        <svg width="2" height="60" viewBox="0 0 2 60">
          <motion.line
            x1="1"
            y1="0"
            x2="1"
            y2="60"
            stroke={COLORS.orange500}
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </svg>
      </motion.div>

      <motion.p
        variants={fadeUp}
        className="text-2xl md:text-3xl font-medium"
        style={{ fontFamily: FONT_DISPLAY, color: COLORS.stone900 }}
      >
        Questions?
      </motion.p>

      <motion.p
        variants={fadeUp}
        className="text-sm mt-8"
        style={{
          fontFamily: FONT_MONO,
          color: COLORS.stone400,
          letterSpacing: "0.1em",
        }}
      >
        DAVID HERRERA · DESIGN ENGINEER
      </motion.p>
    </motion.div>
  );
}

/* =====================================================
 *  Main presentation shell
 * ===================================================== */
const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8, Slide9];

export default function TeachbackPresentation() {
  const [index, setIndex] = useState(0);

  const next = useCallback(
    () => setIndex((i) => Math.min(i + 1, TOTAL_SLIDES - 1)),
    []
  );
  const prev = useCallback(
    () => setIndex((i) => Math.max(i - 1, 0)),
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      } else if (/^[1-9]$/.test(e.key)) {
        const n = parseInt(e.key, 10) - 1;
        if (n < TOTAL_SLIDES) setIndex(n);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const SlideComponent = SLIDES[index];

  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ backgroundColor: COLORS.stone50 }}
    >
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] z-50"
        style={{ backgroundColor: COLORS.stone200 }}
      >
        <motion.div
          className="h-full origin-left"
          style={{ backgroundColor: COLORS.orange500 }}
          animate={{ scaleX: (index + 1) / TOTAL_SLIDES }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        />
      </div>

      {/* Slide stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          className="w-full h-full"
        >
          <SlideComponent />
        </motion.div>
      </AnimatePresence>

      {/* Slide counter + hint */}
      <div className="fixed bottom-6 left-0 right-0 flex items-center justify-between px-8 z-50 pointer-events-none">
        <div
          className="flex items-center gap-3"
          style={{
            fontFamily: FONT_MONO,
            color: COLORS.stone400,
            fontSize: 12,
            letterSpacing: "0.1em",
          }}
        >
          <span style={{ color: COLORS.orange500 }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>/</span>
          <span>{String(TOTAL_SLIDES).padStart(2, "0")}</span>
        </div>

        <div
          style={{
            fontFamily: FONT_MONO,
            color: COLORS.stone300,
            fontSize: 11,
            letterSpacing: "0.1em",
          }}
        >
          ← → TO NAVIGATE
        </div>
      </div>
    </div>
  );
}
