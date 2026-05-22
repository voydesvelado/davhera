'use client';

/**
 * Screen: Trail Detail (Pedra da Gávea)
 * Flow: Trust-mediated booking (Flow 1)
 * JTBD: When I am comparing guides for the same trail, I want evidence each one
 *       is a real person with verifiable credentials, so I can stop second-guessing.
 *       Also: when the trail has a rock scramble, I want to know exactly how
 *       technical it is, so I can decide whether I am the right person for it.
 *
 * Key design decisions:
 * 1. Photo zone capped at 200px. The screen privileges content over scenery — the
 *    argument is "trust in 90 seconds," not "look at the mountain." Most trail-detail
 *    pages in this category bury the trust information under 600px of hero photo;
 *    we invert that.
 * 2. Difficulty explainer is its own block, with the named technical section spelled
 *    out: "Carrasqueira section · 30 m · grade 5.2 scramble. Your guide brings safety
 *    rigging." This is the research insight (Insight 2 — specificity beats polish)
 *    made visible.
 * 3. Cadastur badge is a first-class UI primitive — trilha-500 background, white text,
 *    shield-check icon, paired with a small (i) info indicator. Every guide row carries
 *    it. The user learns the trust pattern in two seconds.
 * 4. Foreign-reviewer signal as "30 international" inline with the review count. The
 *    research showed reviews from foreigners weigh more than aggregate rating for
 *    Hannah's persona; this surface treatment honors that without flags or emojis.
 * 5. Three guides shown, intentionally varied: Rodrigo (mid-priced, top reviewed),
 *    Sergio (most experienced, highest price), Mariana (lowest price, perfect rating).
 *    The case shows how the design accommodates a real range of guide tiers without
 *    the layout breaking.
 * 6. Sticky bottom CTA is split — price summary left, primary action right. Familiar
 *    Airbnb-style pattern; rendered with our type and color discipline.
 *
 * Trade-offs considered:
 * - Hero photo full-screen with overlaid name (rejected): Airbnb's pattern, but it
 *   pushes the trust information below the fold. The thesis is the opposite.
 * - Two-level tabs (Group/Private nested inside Guides) (rejected): too much navigation
 *   in a single screen. The Group/Private decision lives in the booking sheet, where
 *   it has a step of its own.
 * - "Cadastur" expanded inline as "Verified by Brazil's Ministry of Tourism" (rejected
 *   for the badge label, kept for the info popover): the acronym is shorter and reads
 *   as a credential rather than marketing copy. The badge is tappable for the full
 *   explainer.
 */

import * as React from 'react';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Tokens (inlined from 03_tokens.ts)
// ─────────────────────────────────────────────────────────────────────────────

const c = {
  trilha: { 50: '#F0F6F7', 100: '#D9E8EA', 300: '#82B0B5', 500: '#2B6770', 600: '#1F4E55', 700: '#173A40', 800: '#112B30', 900: '#0B1D20' },
  neutral: { 0: '#FFFFFF', 50: '#FAFAF7', 100: '#F2F1ED', 200: '#E5E3DC', 300: '#C9C6BB', 400: '#9C988B', 500: '#6E6B5F', 600: '#4F4D44', 700: '#36352F', 800: '#232220', 900: '#131311' },
  sandstone: { 100: '#F6EBDC', 300: '#E4C7A4', 500: '#C68A56', 700: '#8A5A30' },
  warning: { 100: '#F6E5D0', 500: '#B86E1E', 700: '#854D14' },
};

const monoFont = '"Geist Mono", ui-monospace, "SF Mono", monospace';
const sansFont = '"Geist Sans", system-ui, -apple-system, "Segoe UI", sans-serif';
const ease: [number, number, number, number] = [0.25, 1, 0.5, 1];

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const TRAIL = {
  name: 'Pedra da Gávea',
  neighborhood: 'Itanhangá, Rio de Janeiro',
  distanceKm: 7.5,
  gainM: 720,
  durationHours: 6,
  technicalSections: 1,
  difficulty: 'Challenging' as const,
  priceFrom: 220,
  about:
    'A six-hour out-and-back through Atlantic Forest to an 842 m granite summit overlooking Barra da Tijuca and São Conrado. The final ascent crosses one rock scramble.',
};

interface Guide {
  id: string;
  name: string;
  initials: string;
  years: number;
  languages: string[];
  rating: number;
  reviewCount: number;
  internationalReviews: number;
  groupPrice: number;
  privatePrice: number;
  highlight?: string;
  avatarGradient: { from: string; to: string };
}

const GUIDES: Guide[] = [
  {
    id: 'rodrigo',
    name: 'Rodrigo Silva',
    initials: 'RS',
    years: 8,
    languages: ['EN', 'PT', 'ES'],
    rating: 4.9,
    reviewCount: 47,
    internationalReviews: 30,
    groupPrice: 240,
    privatePrice: 680,
    highlight: 'Most booked this month',
    avatarGradient: { from: c.trilha[600], to: c.trilha[800] },
  },
  {
    id: 'sergio',
    name: 'Sérgio Almeida',
    initials: 'SA',
    years: 12,
    languages: ['EN', 'PT', 'FR'],
    rating: 4.8,
    reviewCount: 64,
    internationalReviews: 38,
    groupPrice: 255,
    privatePrice: 720,
    avatarGradient: { from: c.sandstone[500], to: c.sandstone[700] },
  },
  {
    id: 'mariana',
    name: 'Mariana Costa',
    initials: 'MC',
    years: 5,
    languages: ['EN', 'PT'],
    rating: 5.0,
    reviewCount: 22,
    internationalReviews: 18,
    groupPrice: 220,
    privatePrice: 640,
    avatarGradient: { from: c.trilha[500], to: c.sandstone[500] },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Atoms
// ─────────────────────────────────────────────────────────────────────────────

function CadasturBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-1.5 py-[3px] text-[9.5px] font-semibold uppercase leading-3"
      style={{
        backgroundColor: c.trilha[500],
        color: c.neutral[0],
        letterSpacing: '0.05em',
      }}
      aria-label="Cadastur-verified guide, certified by Brazil's Ministry of Tourism"
    >
      <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path
          d="M6 1.2 L10 2.6 V6 C10 8.4 8.2 10.2 6 10.8 C3.8 10.2 2 8.4 2 6 V2.6 Z"
          fill="currentColor"
        />
        <path
          d="M4.2 6 L5.4 7.2 L7.9 4.7"
          stroke={c.trilha[500]}
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      Cadastur
    </span>
  );
}

function DifficultyPill() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium leading-4"
      style={{ backgroundColor: c.warning[100], color: c.warning[700] }}
    >
      <span className="inline-flex items-center gap-[2px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="block rounded-full"
            style={{
              width: 4,
              height: 4,
              backgroundColor: i < 3 ? 'currentColor' : 'transparent',
              boxShadow: i < 3 ? 'none' : 'inset 0 0 0 1px currentColor',
              opacity: i < 3 ? 1 : 0.45,
            }}
          />
        ))}
      </span>
      Challenging
    </span>
  );
}

function TrailFactsRow() {
  return (
    <div
      className="flex items-center text-[13px] font-medium leading-5"
      style={{ color: c.neutral[700], fontFamily: monoFont }}
    >
      <span>{TRAIL.distanceKm} km</span>
      <span className="mx-2" style={{ color: c.neutral[300] }}>·</span>
      <span>{TRAIL.gainM} m</span>
      <span className="mx-2" style={{ color: c.neutral[300] }}>·</span>
      <span>{TRAIL.durationHours}h</span>
      <span className="mx-2" style={{ color: c.neutral[300] }}>·</span>
      <span>
        {TRAIL.technicalSections} scramble
      </span>
    </div>
  );
}

function Avatar({ initials, gradient, size = 44 }: { initials: string; gradient: { from: string; to: string }; size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
      }}
    >
      <span
        className="text-[13px] font-semibold leading-none"
        style={{ color: c.neutral[0], letterSpacing: '0.01em' }}
      >
        {initials}
      </span>
    </div>
  );
}

function StarIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M6 1.3 L7.45 4.55 L11 5 L8.4 7.5 L9.1 11 L6 9.25 L2.9 11 L3.6 7.5 L1 5 L4.55 4.55 Z"
        fill={c.trilha[600]}
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header
      className="absolute inset-x-0 top-0 z-30 flex h-14 items-center justify-between px-4"
      style={{
        backgroundColor: `${c.neutral[0]}E6`,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${c.neutral[100]}`,
      }}
    >
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: c.neutral[100] }}
        aria-label="Back"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M10 3 L5 8 L10 13"
            stroke={c.neutral[800]}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: c.neutral[100] }}
        aria-label="Share trail"
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M11 4 L11 11 M11 4 L8.5 6.5 M11 4 L13.5 6.5 M4 8 V12.5 A0.5 0.5 0 0 0 4.5 13 H13.5 A0.5 0.5 0 0 0 14 12.5 V8"
            stroke={c.neutral[800]}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero photo zone
// ─────────────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: 200,
        background: `linear-gradient(165deg, ${c.trilha[900]} 0%, ${c.trilha[600]} 55%, ${c.sandstone[300]} 100%)`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 82% 22%, rgba(246,235,220,0.32) 0%, rgba(246,235,220,0) 55%)',
        }}
        aria-hidden
      />
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {/* back layer ridge */}
        <path
          d="M0,100 L0,68 L18,55 L34,62 L48,38 L62,52 L78,32 L92,50 L100,46 L100,100 Z"
          fill="rgba(11,29,32,0.32)"
        />
        {/* front layer ridge (dramatic Gávea peak) */}
        <path
          d="M0,100 L0,78 L14,72 L28,70 L42,52 L52,18 L62,42 L74,55 L88,62 L100,58 L100,100 Z"
          fill="rgba(11,29,32,0.62)"
        />
      </svg>
      {/* faint grain */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
        }}
        aria-hidden
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Trail meta block (name + facts + difficulty)
// ─────────────────────────────────────────────────────────────────────────────

function TrailMeta() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.06 }}
      className="px-4 pt-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1
            className="text-[26px] font-medium leading-[30px]"
            style={{ color: c.neutral[900], letterSpacing: '-0.018em' }}
          >
            {TRAIL.name}
          </h1>
          <p
            className="mt-1 text-[13px] leading-5"
            style={{ color: c.neutral[500] }}
          >
            {TRAIL.neighborhood}
          </p>
        </div>
        <DifficultyPill />
      </div>
      <div className="mt-3.5">
        <TrailFactsRow />
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Difficulty explainer card
// ─────────────────────────────────────────────────────────────────────────────

function DifficultyExplainer() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.12 }}
      className="mx-4 mt-5 overflow-hidden rounded-xl"
      style={{
        backgroundColor: c.warning[100],
        border: `1px solid ${c.sandstone[300]}`,
      }}
    >
      <div className="flex items-start gap-3 p-4">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: c.neutral[0] }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path
              d="M1.5 16 L9 3 L16.5 16 Z"
              stroke={c.warning[700]}
              strokeWidth="1.5"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M9 8 L9 11.5 M9 13.5 L9 13.6"
              stroke={c.warning[700]}
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <h3
            className="text-[14px] font-semibold leading-5"
            style={{ color: c.warning[700], letterSpacing: '-0.005em' }}
          >
            One technical section: Carrasqueira
          </h3>
          <p
            className="mt-1 text-[13px] leading-[19px]"
            style={{ color: c.neutral[700] }}
          >
            A 30 m rock scramble graded 5.2 near the summit. Your guide brings safety
            rigging; you&apos;ll need closed shoes with grip and a free pair of hands.
          </p>
          <button
            type="button"
            className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold leading-4"
            style={{ color: c.warning[700] }}
          >
            See the scramble in 15 seconds
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path d="M3 1.5 L6.5 5 L3 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </button>
        </div>
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tabs
// ─────────────────────────────────────────────────────────────────────────────

function Tabs() {
  const tabs = ['About', 'Guides', 'Reviews'];
  const active = 'Guides';
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease, delay: 0.18 }}
      className="mt-7 border-b px-4"
      style={{ borderColor: c.neutral[100] }}
    >
      <div className="flex items-center gap-6">
        {tabs.map((label) => {
          const isActive = label === active;
          return (
            <button
              key={label}
              type="button"
              className="relative pb-3 pt-1 text-[14px] font-medium leading-5"
              style={{
                color: isActive ? c.neutral[900] : c.neutral[500],
              }}
            >
              {label}
              {isActive && (
                <span
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full"
                  style={{ backgroundColor: c.trilha[500] }}
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Guide card
// ─────────────────────────────────────────────────────────────────────────────

function GuideCard({ guide, index }: { guide: Guide; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.22 + index * 0.06 }}
      className="rounded-xl"
      style={{
        backgroundColor: c.neutral[0],
        border: `1px solid ${c.neutral[100]}`,
      }}
    >
      <div className="p-3.5">
        <div className="flex items-start gap-3">
          <Avatar initials={guide.initials} gradient={guide.avatarGradient} size={44} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h4
                className="text-[15px] font-semibold leading-5"
                style={{ color: c.neutral[900], letterSpacing: '-0.005em' }}
              >
                {guide.name}
              </h4>
              <CadasturBadge />
            </div>
            <p
              className="mt-1 text-[12px] leading-[18px]"
              style={{ color: c.neutral[500] }}
            >
              {guide.years} years guiding
              <span className="mx-1.5" style={{ color: c.neutral[300] }}>·</span>
              <span style={{ fontFamily: monoFont, color: c.neutral[600] }}>
                {guide.languages.join(' · ')}
              </span>
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <StarIcon size={12} />
              <span
                className="text-[13px] font-semibold leading-5"
                style={{ color: c.neutral[800] }}
              >
                {guide.rating.toFixed(1)}
              </span>
              <span
                className="text-[12px] leading-5"
                style={{ color: c.neutral[500] }}
              >
                ({guide.reviewCount})
              </span>
              <span className="mx-0.5" style={{ color: c.neutral[300] }}>·</span>
              <span
                className="text-[12px] leading-5"
                style={{ color: c.neutral[600] }}
              >
                {guide.internationalReviews} international
              </span>
            </div>
            {guide.highlight && (
              <span
                className="mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-medium uppercase leading-4"
                style={{
                  backgroundColor: c.trilha[50],
                  color: c.trilha[700],
                  letterSpacing: '0.04em',
                }}
              >
                {guide.highlight}
              </span>
            )}
          </div>
        </div>
        <div
          className="mt-3.5 flex items-center justify-between border-t pt-3"
          style={{ borderColor: c.neutral[100] }}
        >
          <div className="flex items-baseline gap-4">
            <div>
              <p
                className="text-[10.5px] font-medium uppercase leading-3"
                style={{ color: c.neutral[500], letterSpacing: '0.06em' }}
              >
                Group
              </p>
              <p
                className="mt-0.5 text-[14px] font-semibold leading-5"
                style={{ color: c.neutral[900], fontFamily: monoFont }}
              >
                R$ {guide.groupPrice}
                <span
                  className="ml-0.5 text-[11px] font-normal"
                  style={{ color: c.neutral[500] }}
                >
                  /pp
                </span>
              </p>
            </div>
            <div>
              <p
                className="text-[10.5px] font-medium uppercase leading-3"
                style={{ color: c.neutral[500], letterSpacing: '0.06em' }}
              >
                Private
              </p>
              <p
                className="mt-0.5 text-[14px] font-semibold leading-5"
                style={{ color: c.neutral[900], fontFamily: monoFont }}
              >
                R$ {guide.privatePrice}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[12.5px] font-semibold leading-4"
            style={{
              backgroundColor: c.neutral[900],
              color: c.neutral[0],
            }}
          >
            View
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path d="M3 1.5 L6.5 5 L3 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </button>
        </div>
      </div>
    </motion.article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sticky bottom CTA
// ─────────────────────────────────────────────────────────────────────────────

function StickyBottomCTA() {
  return (
    <div
      className="absolute inset-x-0 bottom-0 z-20 border-t px-4 pb-6 pt-3"
      style={{
        backgroundColor: `${c.neutral[0]}F2`,
        backdropFilter: 'blur(12px)',
        borderColor: c.neutral[100],
      }}
    >
      <div className="flex items-end justify-between gap-3">
        <div>
          <p
            className="text-[10.5px] font-medium uppercase leading-3"
            style={{ color: c.neutral[500], letterSpacing: '0.06em' }}
          >
            From
          </p>
          <p
            className="mt-1 text-[18px] font-semibold leading-5"
            style={{ color: c.neutral[900], fontFamily: monoFont }}
          >
            R$ {TRAIL.priceFrom}
            <span
              className="ml-0.5 text-[12px] font-normal"
              style={{ color: c.neutral[500] }}
            >
              /person
            </span>
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full px-5 text-[14.5px] font-semibold leading-5"
          style={{
            backgroundColor: c.trilha[500],
            color: c.neutral[0],
            boxShadow: '0 4px 12px rgba(43,103,112,0.22)',
          }}
        >
          Choose a guide
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M3 2 L8 6 L3 10"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function TrailDetailScreen() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        backgroundColor: c.neutral[50],
        color: c.neutral[900],
        fontFamily: sansFont,
      }}
    >
      <div className="h-full overflow-y-auto pb-[100px]">
        <Hero />
        <TrailMeta />
        <DifficultyExplainer />
        <Tabs />
        <div className="space-y-2.5 px-4 pt-4">
          {GUIDES.map((guide, i) => (
            <GuideCard key={guide.id} guide={guide} index={i} />
          ))}
        </div>
        <div className="px-4 pt-4">
          <p
            className="text-[11px] leading-[16px]"
            style={{ color: c.neutral[400] }}
          >
            All guides are verified through Cadastur, Brazil&apos;s federal tourism
            registry. Tap the badge for details.
          </p>
        </div>
      </div>
      <Header />
      <StickyBottomCTA />
    </div>
  );
}
