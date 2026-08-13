"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import s from "../../handl.module.css";
import { DATA, breakdownMath, DEFAULT_PROVIDER, money, type Provider } from "../../data";
import type { Nav } from "../types";
import {
  AppBar,
  Avatar,
  Button,
  Chip,
  PhoneIcon,
  PinIcon,
  ChevronRight,
  ConfidenceDots,
  staggerContainer,
  fadeUp,
} from "../primitives";

/* ==========================================================================
 * Money range with count-up (both values, en dash static)
 * ========================================================================== */
function useCount(value: number, instant: boolean) {
  const reduced = useReducedMotion();
  const [v, setV] = useState(reduced || instant ? value : 0);
  useEffect(() => {
    if (reduced || instant) {
      setV(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 700);
      setV(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduced, instant]);
  return v;
}

export function MoneyRange({ range }: { range: [number, number] }) {
  const lo = useCount(range[0], false);
  const hi = useCount(range[1], false);
  return (
    <div className={s.money}>
      ${money(lo)} – ${money(hi)}
    </div>
  );
}

/* ==========================================================================
 * Provider card (recommended + embedded)
 * ========================================================================== */
export function ProviderCard({
  provider,
  badge,
  cta,
  onCta,
}: {
  provider: Provider;
  badge: string;
  cta: string;
  onCta?: () => void;
}) {
  return (
    <div className={`${s.provider} ${s.recommended}`}>
      <Avatar initials={provider.name.replace("Dr. ", "").slice(0, 1)} photo={provider.photo} size={44} dark />
      <div className={s.providerBody}>
        <Chip tone="peri">{badge}</Chip>
        <div className={s.providerName} style={{ marginTop: 6 }}>{provider.name}</div>
        <div className={s.providerFacility}>{provider.facility} · {provider.type}</div>
        <div className={s.providerMeta}>
          <div className={s.metaRow}>
            <span className="k" style={{ color: "var(--muted)" }}>Quality, this procedure</span>
            <span className="v">{provider.quality}</span>
          </div>
          <div className={s.metaRow}>
            <span className="k" style={{ color: "var(--muted)" }}>Total cost</span>
            <span className="v">${money(provider.cost)} · <span style={{ color: "var(--muted)", fontWeight: 400 }}>typical here: ${money(provider.typical ?? 0)}</span></span>
          </div>
          <div className={s.metaRow}>
            <span className="k" style={{ color: "var(--muted)" }}>Distance · availability</span>
            <span className="v">{provider.distance} · {provider.availability}</span>
          </div>
        </div>
        {onCta && (
          <div className={s.providerCta}>
            <Button variant="secondary" onClick={onCta}>{cta}</Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
 * 5.5 options
 * ========================================================================== */
export function Options({ nav, onPick }: { nav: Nav; onPick: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [adams, chen, moore] = DATA.providers;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <AppBar title="Knee arthroscopy." onBack={nav.back} />

      <motion.p variants={fadeUp} className={s.lead} style={{ marginTop: 10 }}>
        16 in-network options · ranked by quality and cost together
      </motion.p>

      <motion.div variants={fadeUp}>
        <ProviderCard
          provider={adams}
          badge="Best value for you"
          cta="See your cost with Dr. Adams"
          onCta={() => onPick("adams")}
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        <button className={s.altRow} onClick={() => onPick("chen")}>
          <Avatar initials="C" photo={chen.photo} dark />
          <div>
            <div className={s.altName}>{chen.name} · {chen.facility}</div>
            <div className={s.altFacility}><Chip tone="lav">High quality</Chip> · {chen.distance}</div>
          </div>
          <span className={s.altCost}>${money(chen.cost)}</span>
        </button>
      </motion.div>

      <motion.div variants={fadeUp}>
        <button className={s.altRow} onClick={() => onPick("moore")}>
          <Avatar initials="M" photo={moore.photo} dark />
          <div>
            <div className={s.altName}>{moore.name} · {moore.facility}</div>
            <div className={s.altFacility}><Chip tone="lav">Hospital-based</Chip> · {moore.distance}</div>
          </div>
          <span className={s.altCost}>${money(moore.cost)}</span>
        </button>
      </motion.div>

      {expanded && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div key={i} variants={fadeUp}>
              <div className={s.altRow} style={{ opacity: 0.55, cursor: "default" }}>
                <div className={s.avatar} style={{ background: "var(--lav)", color: "var(--muted)" }}>{"CDM"[i]}</div>
                <div>
                  <div className={s.altName}>Provider {i + 4}</div>
                  <div className={s.altFacility}>Additional option · {["18 min", "22 min", "25 min"][i]}</div>
                </div>
                <span className={s.altCost}>${money([4780, 5210, 5890][i])}</span>
              </div>
            </motion.div>
          ))}
        </>
      )}

      <motion.div variants={fadeUp} className={s.btnStack} style={{ marginTop: 14 }}>
        <Button variant="secondary" onClick={() => setExpanded((e) => !e)}>
          {expanded ? "Show fewer options" : "View all 16 options"}
        </Button>
      </motion.div>

      <motion.p variants={fadeUp} style={{ textAlign: "center", marginTop: 16 }}>
        <button className={s.link} onClick={() => nav.openSheet("ranking")}>
          How we rank providers
        </button>
      </motion.p>
    </motion.div>
  );
}

/* ==========================================================================
 * 5.6 estimate
 * ========================================================================== */
export function Estimate({ nav, provider }: { nav: Nav; provider: Provider }) {
  const d = DATA.user.deductible;
  const pct = Math.round((d.used / d.total) * 100);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <AppBar title={`Your cost · ${provider.name}.`} onBack={nav.back} />

      <motion.p variants={fadeUp} className={s.eyebrow} style={{ marginTop: 10 }}>
        What you'd pay.
      </motion.p>
      <motion.div variants={fadeUp}>
        <MoneyRange range={provider.estimate ?? [0, 0]} />
      </motion.div>
      <motion.p variants={fadeUp} className={s.sub}>
        your part, after your plan pays its part
      </motion.p>

      <motion.div variants={fadeUp}>
        <ConfidenceDots
          filled={provider.confidence === "high" ? 3 : 2}
          label={
            provider.confidence === "high"
              ? "High confidence. Built on this facility's set price and your plan today."
              : "Moderate confidence. This facility's billing varies more than most for this procedure."
          }
        />
      </motion.div>

      <motion.div variants={fadeUp} className={s.card}>
        <div className={s.dedLabel}>
          <span className="l">Your deductible</span>
          <span className="r">${money(d.used)} of ${money(d.total)} used</span>
        </div>
        <div className={s.dedTrack}>
          <motion.div
            className={s.dedFill}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.48, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <p className={s.whisper} style={{ marginTop: 10 }}>
          This is what you pay first each year. After it, your plan pays 85%.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className={s.btnStack}>
        <Button variant="secondary" icon={<ChevronRight />} onClick={() => nav.openSheet("breakdown")}>
          How we got this number
        </Button>
        <Button onClick={() => nav.go("booking")}>Choose Dr. Adams.</Button>
      </motion.div>
    </motion.div>
  );
}

/* ==========================================================================
 * 5.8 estimateWide
 * ========================================================================== */
export function EstimateWide({ nav, provider }: { nav: Nav; provider: Provider }) {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <AppBar title={`Your cost · ${provider.facility}`} onBack={nav.back} />

      <motion.p variants={fadeUp} className={s.eyebrow} style={{ marginTop: 10 }}>
        What you'd pay.
      </motion.p>
      <motion.div variants={fadeUp}>
        <MoneyRange range={provider.estimate ?? [0, 0]} />
      </motion.div>
      <motion.p variants={fadeUp} className={s.sub}>
        a wider range than usual. Here is why.
      </motion.p>

      <motion.div variants={fadeUp}>
        <ConfidenceDots
          filled={2}
          label="Moderate confidence. This facility's billing varies more than most for this procedure."
        />
      </motion.div>

      <motion.div variants={fadeUp} className={s.card}>
        <p className={s.whisper}>
          We would rather show you the honest spread than a precise-looking
          number we cannot stand behind. Two ways to firm it up:
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className={s.btnStack}>
        <Button variant="secondary" onClick={() => nav.go("options")}>
          Compare a narrower option
        </Button>
      </motion.div>

      <motion.div variants={fadeUp}>
        <button className={s.mariarow} onClick={() => nav.go("chatMaria")}>
          <Avatar initials="MT" photo="/handl/img/maria.jpg" dark />
          <div style={{ flex: 1 }}>
            <div className={s.mariaTitle}>Ask Maria to verify with the facility</div>
            <div className={s.mariaSub}>She'll confirm the rate and call you back</div>
          </div>
          <span className={s.chevron}><ChevronRight /></span>
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ==========================================================================
 * 5.9 booking
 * ========================================================================== */
export function Booking({ nav, provider }: { nav: Nav; provider: Provider }) {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <AppBar title={`${provider.name} · chosen.`} onBack={nav.back} />

      <motion.h1 variants={fadeUp} className={s.h1} style={{ marginTop: 10 }}>
        You chose well. Here is everything to book it.
      </motion.h1>

      <motion.div variants={fadeUp} className={s.btnStack}>
        <Button icon={<PhoneIcon />} onClick={() => nav.go("checkin")}>
          Call to schedule · (214) 555-0142
        </Button>
        <Button variant="ghost" icon={<PinIcon />}>
          Directions
        </Button>
      </motion.div>

      <motion.div variants={fadeUp} className={s.card}>
        <div className={s.cardTitle}>Saved here, ready for the visit</div>
        <div className={s.row}>
          <span className={s.rowLabel}>Insurance card</span>
          <Chip tone="ok">saved</Chip>
        </div>
        <div className={s.row}>
          <span className={s.rowLabel}>Doctor's order</span>
          <Chip tone="ok">saved</Chip>
        </div>
        <div className={s.row}>
          <span className={s.rowLabel}>This estimate</span>
          <Chip tone="ok">saved · shareable</Chip>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className={s.card}>
        <p className={s.cardTitle}>When they answer, you can say:</p>
        <p className={s.whisper} style={{ color: "var(--ink)", fontSize: 14, fontStyle: "italic" }}>
          "I'd like to schedule a knee arthroscopy with Dr. Adams. My insurance
          is Acme PPO."
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ==========================================================================
 * Interstitial (time jump)
 * ========================================================================== */
export function Interstitial({ text, onDone }: { text: string; onDone: () => void }) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const t = setTimeout(onDone, reduced ? 150 : 500);
    return () => clearTimeout(t);
  }, [onDone, reduced]);
  return (
    <motion.div
      className={s.interstitial}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.15 : 0.3 }}
    >
      {text}
    </motion.div>
  );
}

/* ==========================================================================
 * 5.10 checkin
 * ========================================================================== */
export function Checkin({ nav }: { nav: Nav }) {
  const [jumped, setJumped] = useState(false);
  return (
    <>
      {!jumped ? (
        <Interstitial text="A day later" onDone={() => setJumped(true)} />
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="show">
          <AppBar title="Acme Benefits" avatar={{ initials: DATA.user.initials }} />

          <motion.h1 variants={fadeUp} className={s.h1} style={{ marginTop: 14 }}>
            Did the booking work out?
          </motion.h1>
          <motion.p variants={fadeUp} className={s.sub}>
            One tap, and you are done. We will also remind you what to bring
            before the day.
          </motion.p>

          <motion.div variants={fadeUp}>
            <button className={s.pathcard} onClick={() => nav.go("receipt")}>
              <div className={s.pathIcon}><CheckGlyph /></div>
              <div style={{ flex: 1 }}>
                <div className={s.pathTitle}>Booked</div>
                <div className={s.pathSupport}>Scheduled for next week</div>
              </div>
              <span className={s.chevron}><ChevronRight /></span>
            </button>
          </motion.div>
          <motion.div variants={fadeUp}>
            <button className={s.pathcard} onClick={() => nav.go("booking")}>
              <div className={s.pathIcon}><CheckGlyph /></div>
              <div style={{ flex: 1 }}>
                <div className={s.pathTitle}>Not yet</div>
                <div className={s.pathSupport}>I'll call later</div>
              </div>
              <span className={s.chevron}><ChevronRight /></span>
            </button>
          </motion.div>
          <motion.div variants={fadeUp}>
            <button className={s.pathcard} onClick={() => nav.go("chatMaria")}>
              <div className={s.pathIcon}><CheckGlyph /></div>
              <div style={{ flex: 1 }}>
                <div className={s.pathTitle}>I ran into a problem</div>
                <div className={s.pathSupport}>Maria will take it from here</div>
              </div>
              <span className={s.chevron}><ChevronRight /></span>
            </button>
          </motion.div>

          <motion.div variants={fadeUp} className={s.card}>
            <p className={s.whisper}>
              After your visit, we compare your final bill to this estimate and
              show you how close we came.
            </p>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

function CheckGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

/* ==========================================================================
 * 5.11 receipt
 * ========================================================================== */
export function Receipt({ nav }: { nav: Nav }) {
  const [jumped, setJumped] = useState(false);
  const [sweep, setSweep] = useState(false);
  const reduced = useReducedMotion();
  const bill = DATA.finalBill;
  const range = DEFAULT_PROVIDER.estimate ?? [0, 0];

  useEffect(() => {
    if (!jumped) return;
    const t = setTimeout(() => setSweep(true), reduced ? 0 : 1200);
    return () => clearTimeout(t);
  }, [jumped, reduced]);

  if (!jumped) {
    return <Interstitial text="Weeks later, after your claim." onDone={() => setJumped(true)} />;
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <AppBar title="Acme Benefits" avatar={{ initials: DATA.user.initials }} />

      <motion.p variants={fadeUp} className={s.eyebrow} style={{ marginTop: 10 }}>
        Your final cost.
      </motion.p>
      <motion.div variants={fadeUp}>
        <MoneyValue value={bill} />
      </motion.div>

      <motion.div variants={fadeUp}>
        <ConfidenceDots filled={3} label="Inside the range we estimated." />
      </motion.div>

      <motion.div variants={fadeUp} className={s.card}>
        <div className={`${s.sweep}`} style={{ margin: -16, padding: 16, borderRadius: 12 }}>
          {sweep && (
            <motion.span
              className={s.sweepLayer}
              initial={{ transform: "translateX(-100%)" }}
              animate={{ transform: "translateX(100%)" }}
              transition={{ duration: reduced ? 0.15 : 0.5, ease: "easeInOut" }}
            />
          )}
          <div className={s.row} style={{ border: "none", padding: "6px 0" }}>
            <span className={s.rowLabel}>We estimated</span>
            <span className={s.rowValue}>${money(range[0])} – ${money(range[1])}</span>
          </div>
        </div>
        <div className={s.row}>
          <span className={s.rowLabel}>You paid</span>
          <span className={s.rowValue}>${money(bill)}</span>
        </div>
        <div className={s.row}>
          <span className={s.rowLabel}>Your deductible</span>
          <Chip tone="ok">met</Chip>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className={s.card}>
        <p className={s.whisper}>
          Your deductible is met, so care costs you far less for the rest of the
          year. Your next estimates start from here.
        </p>
      </motion.div>
    </motion.div>
  );
}

function MoneyValue({ value }: { value: number }) {
  const v = useCount(value, false);
  return <div className={s.money}>${money(v)}</div>;
}
