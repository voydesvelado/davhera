"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import s from "../../handl.module.css";
import { DATA } from "../../data";
import type { Nav } from "../types";
import {
  AppBar,
  Avatar,
  Button,
  SearchIcon,
  MariaRow,
  PathCard,
  staggerContainer,
  fadeUp,
} from "../primitives";

/* ==========================================================================
 * Typing simulation (25ms/char + jitter)
 * ========================================================================== */
function useTypewriter(text: string, start: boolean) {
  const reduced = useReducedMotion();
  const [out, setOut] = useState("");
  const idx = useRef(0);

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setOut(text);
      return;
    }
    setOut("");
    idx.current = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      idx.current += 1;
      setOut(text.slice(0, idx.current));
      if (idx.current < text.length) {
        const jitter = Math.random() * 80 + 60;
        timer = setTimeout(tick, 25 + (idx.current % 3 === 0 ? jitter : 0));
      }
    };
    timer = setTimeout(tick, 200);
    return () => clearTimeout(timer);
  }, [text, start, reduced]);

  return out;
}

/* ==========================================================================
 * 5.12 describe
 * ========================================================================== */
const BODY_PARTS = ["Head", "Chest", "Back", "Knee", "Stomach", "Skin"];
const PRE_TYPED = "my doctor says I need my knee operated";

export function Describe({ nav }: { nav: Nav }) {
  const [typed] = useState(true);
  const value = useTypewriter(PRE_TYPED, typed);
  const [part, setPart] = useState("Knee");
  const typing = value.length < PRE_TYPED.length;

  const submit = () => {
    if (value.toLowerCase().includes("knee") || value.toLowerCase().includes("operat")) {
      nav.go("question");
    } else {
      nav.go("recovery");
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <AppBar title="Tell us what's going on" onBack={nav.back} />

      <motion.h1 variants={fadeUp} className={s.h1} style={{ marginTop: 10 }}>
        In your own words
      </motion.h1>
      <motion.p variants={fadeUp} className={s.sub}>
        Plain words are perfect. Whatever your doctor said, however you remember
        it.
      </motion.p>

      <motion.div variants={fadeUp} style={{ marginTop: 16 }}>
        <div className={s.input} style={{ minHeight: 72, lineHeight: 1.5 }}>
          {value}
          {typing && <span className={s.caret} />}
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <p className={s.micro} style={{ marginTop: 14 }}>
          Or start from where it hurts:
        </p>
        <div className={s.chipsrow}>
          {BODY_PARTS.map((p) => (
            <button
              key={p}
              className={`${s.chipbtn} ${part === p ? s.selected : ""}`}
              onClick={() => setPart(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className={s.btnStack}>
        <Button onClick={submit}>Continue</Button>
      </motion.div>

      <motion.div variants={fadeUp}>
        <MariaRow
          title="Rather just talk it through?"
          sub="Maria, care navigator · free, no appointment"
          onClick={() => nav.go("chatMaria")}
        />
      </motion.div>
    </motion.div>
  );
}

/* ==========================================================================
 * 5.13 question
 * ========================================================================== */
const OPTIONS = [
  { title: "Arthroscopy", sub: "A small camera repairs the joint. Often same-day, usually the least costly." },
  { title: "Meniscus repair", sub: "Common after sports injuries." },
  { title: "Knee replacement", sub: "Partial or total. A larger surgery." },
  { title: "None of these sound familiar", sub: "Totally fine. We will get there another way." },
];

export function Question({ nav }: { nav: Nav }) {
  const [sel, setSel] = useState(0);

  const submit = () => {
    if (sel === 3) nav.go("recovery");
    else nav.go("confirm");
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <AppBar title="Question 1 of 2" onBack={nav.back} />

      <motion.div variants={fadeUp} style={{ marginTop: 12 }}>
        <div className={s.progressTrack}>
          <div className={s.progressFill} style={{ width: "50%" }} />
        </div>
      </motion.div>

      <motion.h1 variants={fadeUp} className={s.h1}>
        Did your doctor mention any of these?
      </motion.h1>
      <motion.p variants={fadeUp} className={s.sub}>
        Different knee procedures come with very different costs. This narrows
        it to yours.
      </motion.p>

      {OPTIONS.map((o, i) => (
        <motion.div variants={fadeUp} key={i}>
          <button className={`${s.radio} ${sel === i ? s.selected : ""}`} onClick={() => setSel(i)}>
            <span className={s.radioDot} />
            <div>
              <div className={s.radioTitle}>{o.title}</div>
              <div className={s.radioSub}>{o.sub}</div>
            </div>
          </button>
        </motion.div>
      ))}

      <motion.div variants={fadeUp} className={s.btnStack}>
        <Button onClick={submit}>Continue</Button>
      </motion.div>
    </motion.div>
  );
}

/* ==========================================================================
 * 5.14 recovery
 * ========================================================================== */
export function Recovery({ nav }: { nav: Nav }) {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <AppBar title="Let's try another way" onBack={nav.back} />

      <motion.h1 variants={fadeUp} className={s.h1} style={{ marginTop: 10 }}>
        We couldn't match that yet
      </motion.h1>
      <motion.p variants={fadeUp} className={s.sub}>
        That is on us, not you. Your description was fine. Pick whichever feels
        easiest:
      </motion.p>

      <motion.div variants={fadeUp}>
        <PathCard
          title="Browse knee procedures"
          support="Start from the body area instead"
          onClick={() => nav.go("question")}
        />
      </motion.div>
      <motion.div variants={fadeUp}>
        <PathCard
          title="Say it differently"
          support="Any words. Nicknames, brand names, Spanish."
          onClick={() => nav.go("describe")}
        />
      </motion.div>
      <motion.div variants={fadeUp}>
        <PathCard
          title="Photograph the order"
          support="We'll read the clinical text for you."
          onClick={() => nav.go("capture")}
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        <MariaRow
          warm
          title="Or hand it to Maria"
          sub="She can already see what you tried. No repeating yourself."
          onClick={() => nav.go("chatMaria")}
        />
      </motion.div>
    </motion.div>
  );
}

/* ==========================================================================
 * 5.15 directSearch
 * ========================================================================== */
const QUERY = "knee arthro";
const RESULTS = [
  { title: "Knee arthroscopy", sub: "Small-camera repair of the joint · outpatient", to: "confirm" as const },
  { title: "Knee replacement, partial or total", sub: "Larger surgery · hospital stay likely", to: null },
  { title: "Knee MRI, without contrast", sub: "Imaging · often needed before surgery", to: null },
];

export function DirectSearch({ nav }: { nav: Nav }) {
  const value = useTypewriter(QUERY, true);
  const done = value.length >= QUERY.length;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <AppBar title="Search a procedure" onBack={nav.back} />

      <motion.div variants={fadeUp} style={{ marginTop: 12 }}>
        <div className={s.input} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SearchIcon />
          <span style={{ flex: 1 }}>
            {value}
            {!done && <span className={s.caret} />}
          </span>
        </div>
      </motion.div>

      {done && (
        <div>
          {RESULTS.map((r, i) => (
            <motion.button
              key={r.title}
              className={s.altRow}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i, duration: 0.3 }}
              onClick={() => r.to && nav.go(r.to)}
              style={{ cursor: r.to ? "pointer" : "default" }}
            >
              <div>
                <div className={s.altName}>{r.title}</div>
                <div className={s.altFacility}>{r.sub}</div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <motion.p variants={fadeUp} className={s.footnote}>
        You will confirm the exact procedure before any numbers appear. Same
        door as every path.
      </motion.p>
    </motion.div>
  );
}
