"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import s from "../../handl.module.css";
import { DATA, breakdownMath, DEFAULT_PROVIDER, money, type Provider } from "../../data";
import type { Nav } from "../types";
import { ProviderContext } from "../provider-context";
import {
  AppBar,
  Avatar,
  Button,
  Chip,
  EASE_OUT,
  PhoneIcon,
  PinIcon,
  ChevronRight,
  ConfidenceDots,
  staggerContainer,
  fadeUp,
} from "../primitives";

/* ==========================================================================
 * Money range with count-up (both values, en dash static)
 *
 * The money owns the estimate screen, so the count-up starts early and the
 * identity strip enters third. Mount sequence:
 * eyebrow + count-up -> confidence dots -> identity strip -> deductible -> buttons.
 * ========================================================================== */
const COUNT_DELAY = 100;

/** Slightly wider beat than the global stagger, to make room for the strip. */
const estimateStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

/** Lands between the confidence row (0.23s) and the deductible card (0.29s). */
const CONTEXT_DELAY = 0.26;

function useCount(value: number, instant: boolean, delay = 0) {
  const reduced = useReducedMotion();
  const [v, setV] = useState(reduced || instant ? value : 0);
  useEffect(() => {
    if (reduced || instant) {
      setV(value);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / 700);
      setV(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    const timer = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [value, reduced, instant, delay]);
  return v;
}

export function MoneyRange({ range, delay = 0 }: { range: [number, number]; delay?: number }) {
  const lo = useCount(range[0], false, delay);
  const hi = useCount(range[1], false, delay);
  return (
    <div className={s.money}>
      ${money(lo)} – ${money(hi)}
    </div>
  );
}

/* ==========================================================================
 * Provider card pieces — one anatomy, shared by the recommended card and the
 * expandable alternatives so both render the exact same identity and facts.
 * ========================================================================== */
const AVATAR_SIZE = 38;

function initialOf(name: string) {
  return name.replace("Dr. ", "").slice(0, 1);
}

/** avatar · name and facility · type and distance · total cost */
function ProviderIdentity({ provider }: { provider: Provider }) {
  return (
    <>
      <Avatar initials={initialOf(provider.name)} photo={provider.photo} size={AVATAR_SIZE} dark />
      <div className={s.providerText}>
        <div className={s.providerName}>{provider.name} · {provider.facility}</div>
        <div className={s.providerFacility}>{provider.type} · {provider.distance}</div>
      </div>
      <span className={s.providerCost}>${money(provider.cost)}</span>
    </>
  );
}

/** The detail block below the header: same rows, same CTA, for every card. */
function ProviderDetail({
  provider,
  cta,
  onCta,
}: {
  provider: Provider;
  cta: string;
  onCta?: () => void;
}) {
  return (
    <div className={s.providerDetail}>
      <div className={s.providerMeta}>
        <div className={s.metaRow}>
          <span className={s.metaKey}>Total cost</span>
          <span className={s.metaVal}>
            ${money(provider.cost)} · <span className={s.metaSub}>typical here: ${money(provider.typical ?? 0)}</span>
          </span>
        </div>
        <div className={s.metaRow}>
          <span className={s.metaKey}>Distance · availability</span>
          <span className={s.metaVal}>{provider.distance} · {provider.availability}</span>
        </div>
      </div>
      {onCta && (
        <div className={s.providerCta}>
          <Button variant="secondary" onClick={onCta}>{cta}</Button>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
 * Recommended provider card — the same card as an alternative, permanently
 * open, plus the badge and the peri border that mark it as the pick.
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
      <div className={s.providerBadge}>
        <Chip tone="peri">{badge}</Chip>
      </div>
      <div className={s.providerHead}>
        <ProviderIdentity provider={provider} />
      </div>
      <ProviderDetail provider={provider} cta={cta} onCta={onCta} />
    </div>
  );
}

/* ==========================================================================
 * Alternative provider — the same card, collapsed until tapped.
 * ========================================================================== */
function AltProviderCard({
  provider,
  open,
  onToggle,
  onPick,
}: {
  provider: Provider;
  open: boolean;
  onToggle: () => void;
  onPick: () => void;
}) {
  const reduced = useReducedMotion();
  const panelId = `provider-panel-${provider.id}`;

  return (
    <div className={`${s.provider} ${open ? s.providerOpen : ""}`}>
      <button
        type="button"
        className={`${s.providerHead} ${s.providerHeadButton}`}
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <ProviderIdentity provider={provider} />
        <motion.span
          className={s.providerCaret}
          animate={{ rotate: open ? -90 : 90 }}
          initial={false}
          transition={{ duration: reduced ? 0 : 0.24, ease: EASE_OUT }}
        >
          <ChevronRight size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            className={s.providerPanel}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: EASE_OUT }}
          >
            <ProviderDetail
              provider={provider}
              cta={`See your cost with ${provider.name}`}
              onCta={onPick}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
 * 5.5 options
 * ========================================================================== */
export function Options({ nav, onPick }: { nav: Nav; onPick: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [openAlt, setOpenAlt] = useState<string | null>(null);
  const [adams, chen, moore] = DATA.providers;
  const toggleAlt = (id: string) => setOpenAlt((cur) => (cur === id ? null : id));

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <AppBar title="Knee arthroscopy" onBack={nav.back} />

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

      {[chen, moore].map((p) => (
        <motion.div key={p.id} variants={fadeUp}>
          <AltProviderCard
            provider={p}
            open={openAlt === p.id}
            onToggle={() => toggleAlt(p.id)}
            onPick={() => onPick(p.id)}
          />
        </motion.div>
      ))}

      {expanded && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div key={i} variants={fadeUp}>
              <div className={s.provider} style={{ opacity: 0.55 }}>
                <div className={s.providerHead}>
                  <div
                    className={s.avatar}
                    style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, background: "var(--lav)", color: "var(--muted)" }}
                  >
                    {"CDM"[i]}
                  </div>
                  <div className={s.providerText}>
                    <div className={s.providerName}>Provider {i + 4}</div>
                    <div className={s.providerFacility}>Additional option · {["18 min", "22 min", "25 min"][i]}</div>
                  </div>
                  <span className={s.providerCost}>${money([4780, 5210, 5890][i])}</span>
                </div>
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
    <motion.div variants={estimateStagger} initial="hidden" animate="show">
      <AppBar title="Your cost" onBack={nav.back} />

      <ProviderContext provider={provider} onBack={nav.back} delay={CONTEXT_DELAY} />

      <motion.p variants={fadeUp} className={s.eyebrow} style={{ marginTop: 22, marginBottom: 2 }}>
        What you'd pay
      </motion.p>
      <motion.div variants={fadeUp}>
        <MoneyRange range={provider.estimate ?? [0, 0]} delay={COUNT_DELAY} />
      </motion.div>
      <motion.p variants={fadeUp} className={s.sub} style={{ marginTop: 4 }}>
        your part, after your plan pays its part
      </motion.p>

      <motion.div variants={fadeUp} style={{ marginTop: 12 }}>
        <ConfidenceDots
          filled={provider.confidence === "high" ? 3 : 2}
          label={
            provider.confidence === "high"
              ? "High confidence. Built on this facility's set price and your plan today."
              : "Moderate confidence. This facility's billing varies more than most for this procedure."
          }
        />
      </motion.div>

      <motion.div variants={fadeUp} className={s.card} style={{ marginTop: 16 }}>
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
        <Button variant="secondary" onClick={() => nav.openSheet("breakdown")}>
          How we got this number
        </Button>
        <Button onClick={() => nav.go("booking")}>Choose {provider.name}</Button>
      </motion.div>
    </motion.div>
  );
}

/* ==========================================================================
 * 5.8 estimateWide
 * ========================================================================== */
export function EstimateWide({ nav, provider }: { nav: Nav; provider: Provider }) {
  return (
    <motion.div variants={estimateStagger} initial="hidden" animate="show">
      <AppBar title="Your cost" onBack={nav.back} />

      <ProviderContext provider={provider} onBack={nav.back} delay={CONTEXT_DELAY} />

      <motion.p variants={fadeUp} className={s.eyebrow} style={{ marginTop: 22, marginBottom: 2 }}>
        What you'd pay
      </motion.p>
      <motion.div variants={fadeUp}>
        <MoneyRange range={provider.estimate ?? [0, 0]} delay={COUNT_DELAY} />
      </motion.div>
      <motion.p variants={fadeUp} className={s.sub} style={{ marginTop: 4 }}>
        a wider range than usual. Here is why.
      </motion.p>

      <motion.div variants={fadeUp} style={{ marginTop: 12 }}>
        <ConfidenceDots
          filled={2}
          label="Moderate confidence. This facility's billing varies more than most for this procedure."
        />
      </motion.div>

      <motion.div variants={fadeUp} className={s.card} style={{ marginTop: 16 }}>
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
      <AppBar title={`${provider.name} · chosen`} onBack={nav.back} />

      <motion.h1 variants={fadeUp} className={s.h1} style={{ marginTop: 10 }}>
        You chose well. Here is everything to book it
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
          "I'd like to schedule a knee arthroscopy with {provider.name}. My
          insurance is Acme PPO."
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
        Your final cost
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
