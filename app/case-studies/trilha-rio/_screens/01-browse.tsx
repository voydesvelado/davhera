'use client';

/**
 * Screen: Browse / Discover
 * Flow: Trust-mediated booking (Flow 1)
 * JTBD: When I'm planning my Rio trip and trying to slot in one outdoor day,
 *       I want to understand which trail matches my fitness and timing,
 *       so I can commit to it and move on.
 *
 * Key design decisions:
 * 1. Curation, not catalog — five visible trails framed as "Curated guides, 17 trails."
 *    The product holds 15–25 total. We never load 100 generic results.
 * 2. Featured card uses a magazine-style overlay (scrim + content on photo zone).
 *    Catalog cards use Airbnb-style photo-above-content composition. The contrast
 *    signals editorial weight without inflating the screen count.
 * 3. Trail facts in mono (Geist Mono). Numbers are facts; mono is the structural
 *    signal that separates data from prose.
 * 4. Difficulty pips (1–4 filled of 4) — AllTrails-inspired, scannable at 10px,
 *    never relies on colour alone.
 * 5. No external images. Multi-stop CSS gradients + SVG silhouettes establish visual
 *    identity without claiming to be photographic. Production photography drops in
 *    later without changing the layout.
 *
 * Trade-offs considered:
 * - Filter chips visible by default (rejected): adds noise to the discovery aesthetic.
 *   A single collapsed "All trails ▾" preserves the curated-list feel.
 * - Map view (rejected): hiking discovery is trail-driven, not geo-driven. The user
 *   is choosing what to hike, not where to be.
 * - Search bar in header (rejected): with 17 trails total, search adds friction
 *   without payoff. Browse the list.
 */

import * as React from 'react';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Tokens (inlined for self-contained rendering inside the phone mockup.
// In a real project these are imported from 03_tokens.ts.)
// ─────────────────────────────────────────────────────────────────────────────

const c = {
  trilha: { 50: '#F0F6F7', 100: '#D9E8EA', 300: '#82B0B5', 500: '#2B6770', 600: '#1F4E55', 700: '#173A40', 800: '#112B30', 900: '#0B1D20' },
  neutral: { 0: '#FFFFFF', 50: '#FAFAF7', 100: '#F2F1ED', 200: '#E5E3DC', 300: '#C9C6BB', 400: '#9C988B', 500: '#6E6B5F', 600: '#4F4D44', 700: '#36352F', 800: '#232220', 900: '#131311' },
  sandstone: { 100: '#F6EBDC', 300: '#E4C7A4', 500: '#C68A56', 700: '#8A5A30' },
  success: { 500: '#1E7A4F' },
  warning: { 100: '#F6E5D0', 700: '#854D14' },
  error: { 100: '#F4DEDB', 700: '#7D2620' },
};

const ease = [0.25, 1, 0.5, 1] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

type Difficulty = 'Easy' | 'Moderate' | 'Challenging' | 'Technical';
type Silhouette = 'peaks' | 'jungle' | 'coast' | 'twin';

interface Trail {
  id: string;
  name: string;
  neighborhood: string;
  distanceKm: number;
  gainM: number;
  durationHours: number;
  technicalSections?: number;
  difficulty: Difficulty;
  priceFrom: number;
  guideCount: number;
  gradient: { from: string; via?: string; to: string; angle: number };
  silhouette: Silhouette;
}

const FEATURED: Trail = {
  id: 'pedra-bonita',
  name: 'Pedra Bonita',
  neighborhood: 'São Conrado',
  distanceKm: 3.4,
  gainM: 280,
  durationHours: 2,
  difficulty: 'Easy',
  priceFrom: 95,
  guideCount: 6,
  gradient: { from: c.trilha[800], via: c.sandstone[500], to: c.sandstone[300], angle: 145 },
  silhouette: 'peaks',
};

const CATALOG: Trail[] = [
  {
    id: 'pedra-da-gavea',
    name: 'Pedra da Gávea',
    neighborhood: 'Itanhangá',
    distanceKm: 7.5,
    gainM: 720,
    durationHours: 6,
    technicalSections: 1,
    difficulty: 'Challenging',
    priceFrom: 240,
    guideCount: 5,
    gradient: { from: c.trilha[900], via: c.trilha[600], to: c.sandstone[300], angle: 165 },
    silhouette: 'peaks',
  },
  {
    id: 'dois-irmaos',
    name: 'Dois Irmãos',
    neighborhood: 'Vidigal',
    distanceKm: 4.2,
    gainM: 380,
    durationHours: 3,
    difficulty: 'Moderate',
    priceFrom: 160,
    guideCount: 4,
    gradient: { from: c.sandstone[700], via: c.sandstone[500], to: c.trilha[500], angle: 150 },
    silhouette: 'twin',
  },
  {
    id: 'pico-da-tijuca',
    name: 'Pico da Tijuca',
    neighborhood: 'Tijuca',
    distanceKm: 6.0,
    gainM: 540,
    durationHours: 4,
    difficulty: 'Moderate',
    priceFrom: 180,
    guideCount: 7,
    gradient: { from: c.trilha[900], via: c.trilha[700], to: c.success[500], angle: 160 },
    silhouette: 'jungle',
  },
  {
    id: 'morro-da-babilonia',
    name: 'Morro da Babilônia',
    neighborhood: 'Leme',
    distanceKm: 2.8,
    gainM: 180,
    durationHours: 1.5,
    difficulty: 'Easy',
    priceFrom: 95,
    guideCount: 3,
    gradient: { from: c.trilha[500], via: c.trilha[300], to: c.sandstone[100], angle: 175 },
    silhouette: 'coast',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Atoms
// ─────────────────────────────────────────────────────────────────────────────

const DIFF_TO_PIPS: Record<Difficulty, number> = {
  Easy: 1,
  Moderate: 2,
  Challenging: 3,
  Technical: 4,
};

const DIFF_STYLES: Record<Difficulty, { bg: string; fg: string }> = {
  Easy: { bg: c.neutral[100], fg: c.neutral[700] },
  Moderate: { bg: c.trilha[100], fg: c.trilha[700] },
  Challenging: { bg: c.warning[100], fg: c.warning[700] },
  Technical: { bg: c.error[100], fg: c.error[700] },
};

function DifficultyBadge({ level }: { level: Difficulty }) {
  const s = DIFF_STYLES[level];
  const filled = DIFF_TO_PIPS[level];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium leading-4"
      style={{ backgroundColor: s.bg, color: s.fg }}
      aria-label={`Difficulty: ${level}`}
    >
      <span className="inline-flex items-center gap-[2px]" aria-hidden>
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="block rounded-full"
            style={{
              width: 4,
              height: 4,
              backgroundColor: i < filled ? 'currentColor' : 'transparent',
              boxShadow: i < filled ? 'none' : 'inset 0 0 0 1px currentColor',
              opacity: i < filled ? 1 : 0.45,
            }}
          />
        ))}
      </span>
      {level}
    </span>
  );
}

function TrailFacts({ trail, tone = 'dark' }: { trail: Trail; tone?: 'dark' | 'light' }) {
  const fg = tone === 'dark' ? c.neutral[600] : 'rgba(255,255,255,0.85)';
  const dot = tone === 'dark' ? c.neutral[300] : 'rgba(255,255,255,0.45)';
  const facts = [
    `${trail.distanceKm} km`,
    `${trail.gainM} m`,
    `${trail.durationHours}h`,
    trail.technicalSections ? `${trail.technicalSections} scramble` : null,
  ].filter(Boolean) as string[];
  return (
    <div
      className="flex items-center text-[12px] font-medium leading-[18px]"
      style={{ color: fg, fontFamily: '"Geist Mono", ui-monospace, SF Mono, monospace' }}
    >
      {facts.map((f, i) => (
        <React.Fragment key={f}>
          {i > 0 && <span className="mx-1.5" style={{ color: dot }}>·</span>}
          <span>{f}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

// SVG silhouettes — flat-bottomed paths sitting at the base of the photo zone
function Silhouette({ kind }: { kind: Silhouette }) {
  const paths: Record<Silhouette, string> = {
    peaks: 'M0,100 L0,72 L12,55 L22,68 L34,42 L48,60 L62,38 L76,58 L88,50 L100,55 L100,100 Z',
    twin: 'M0,100 L0,80 L20,82 L36,40 L50,75 L62,42 L78,82 L100,80 L100,100 Z',
    jungle: 'M0,100 L0,75 L8,68 L16,72 L22,62 L32,70 L42,60 L52,72 L62,58 L74,68 L84,62 L94,70 L100,65 L100,100 Z',
    coast: 'M0,100 L0,88 L18,86 L32,82 L46,78 L58,60 L70,80 L84,84 L100,82 L100,100 Z',
  };
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <path d={paths[kind]} fill="rgba(11, 29, 32, 0.42)" />
      <path
        d={paths[kind]}
        fill="rgba(11, 29, 32, 0.55)"
        transform="translate(0, 6) scale(1, 0.95)"
        style={{ transformOrigin: 'bottom' }}
      />
    </svg>
  );
}

function PhotoZone({ trail, className = '' }: { trail: Trail; className?: string }) {
  const g = trail.gradient;
  const bg = g.via
    ? `linear-gradient(${g.angle}deg, ${g.from} 0%, ${g.via} 55%, ${g.to} 100%)`
    : `linear-gradient(${g.angle}deg, ${g.from} 0%, ${g.to} 100%)`;
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: bg }}>
      {/* warm sun-glow radial accent in upper right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 85% 18%, rgba(246, 235, 220, 0.28) 0%, rgba(246, 235, 220, 0) 50%)',
        }}
        aria-hidden
      />
      <Silhouette kind={trail.silhouette} />
      {/* subtle grain via small dots */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
        }}
        aria-hidden
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center justify-between border-b px-4"
      style={{
        backgroundColor: `${c.neutral[0]}E6`,
        backdropFilter: 'blur(12px)',
        borderColor: c.neutral[100],
      }}
    >
      <div className="flex items-center gap-1.5">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M2 16 L7 9 L10 12 L13 6 L18 16 Z"
            fill={c.trilha[500]}
          />
          <path
            d="M13 6 L14.5 4 L16 6"
            stroke={c.trilha[500]}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <span
          className="text-[15px] font-semibold tracking-tight"
          style={{ color: c.neutral[900], letterSpacing: '-0.01em' }}
        >
          Trilha
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-8 items-center gap-1 rounded-full border px-2.5 text-[12px] font-medium"
          style={{
            borderColor: c.neutral[200],
            color: c.neutral[700],
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M1.5 6 H10.5 M6 1.5 C7.5 3 7.5 9 6 10.5 C4.5 9 4.5 3 6 1.5"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
            />
          </svg>
          EN
        </button>
        <div
          className="h-8 w-8 rounded-full"
          style={{
            background: `linear-gradient(135deg, ${c.sandstone[300]}, ${c.sandstone[500]})`,
          }}
          aria-label="Profile"
        />
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Featured card (magazine-style overlay)
// ─────────────────────────────────────────────────────────────────────────────

function FeaturedCard({ trail }: { trail: Trail }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease, delay: 0.05 }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        height: 260,
        boxShadow: '0 4px 12px rgba(35,32,22,0.06), 0 8px 24px rgba(35,32,22,0.06)',
      }}
    >
      <PhotoZone trail={trail} className="absolute inset-0" />
      {/* scrim for text legibility on bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-3/5"
        style={{
          background:
            'linear-gradient(to bottom, rgba(11,29,32,0) 0%, rgba(11,29,32,0.55) 70%, rgba(11,29,32,0.78) 100%)',
        }}
        aria-hidden
      />
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-1 w-1 rounded-full"
            style={{ backgroundColor: c.sandstone[300] }}
          />
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            Featured this week
          </span>
        </div>
        <div className="space-y-3">
          <div>
            <h2
              className="text-[26px] font-medium leading-[30px]"
              style={{ color: c.neutral[0], letterSpacing: '-0.018em' }}
            >
              {trail.name}
            </h2>
            <p
              className="mt-0.5 text-[13px] leading-5"
              style={{ color: 'rgba(255,255,255,0.78)' }}
            >
              {trail.neighborhood}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <TrailFacts trail={trail} tone="light" />
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-medium leading-4"
              style={{
                backgroundColor: 'rgba(255,255,255,0.16)',
                color: c.neutral[0],
                backdropFilter: 'blur(8px)',
              }}
            >
              from R$ {trail.priceFrom}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Catalog card (photo above content)
// ─────────────────────────────────────────────────────────────────────────────

function TrailCard({ trail, index }: { trail: Trail; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.15 + index * 0.06 }}
      className="overflow-hidden rounded-xl"
      style={{
        backgroundColor: c.neutral[0],
        boxShadow: '0 1px 2px rgba(35,32,22,0.04), 0 1px 1px rgba(35,32,22,0.02)',
        border: `1px solid ${c.neutral[100]}`,
      }}
    >
      <PhotoZone trail={trail} className="h-[120px] w-full" />
      <div className="px-4 pb-4 pt-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className="truncate text-[17px] font-medium leading-[22px]"
              style={{ color: c.neutral[900], letterSpacing: '-0.01em' }}
            >
              {trail.name}
            </h3>
            <p
              className="mt-0.5 text-[12px] leading-[18px]"
              style={{ color: c.neutral[500] }}
            >
              {trail.neighborhood}
            </p>
          </div>
          <div className="text-right">
            <p
              className="text-[15px] font-medium leading-5"
              style={{ color: c.neutral[900], fontFamily: '"Geist Mono", ui-monospace, monospace' }}
            >
              R$ {trail.priceFrom}
            </p>
            <p
              className="mt-0.5 text-[11px] leading-4"
              style={{ color: c.neutral[500] }}
            >
              from
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <TrailFacts trail={trail} />
          <DifficultyBadge level={trail.difficulty} />
        </div>
      </div>
    </motion.article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page title block
// ─────────────────────────────────────────────────────────────────────────────

function PageTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="pb-4 pt-5"
    >
      <p
        className="text-[11px] font-semibold uppercase leading-4"
        style={{ color: c.trilha[600], letterSpacing: '0.08em' }}
      >
        Rio de Janeiro
      </p>
      <h1
        className="mt-1.5 text-[26px] font-medium leading-[30px]"
        style={{ color: c.neutral[900], letterSpacing: '-0.018em' }}
      >
        Trails worth your morning
      </h1>
      <p
        className="mt-1.5 text-[13px] leading-[20px]"
        style={{ color: c.neutral[500] }}
      >
        17 trails · Curated guides · Cadastur-verified
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section header for the catalog
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease, delay: 0.12 }}
      className="flex items-center justify-between pb-3 pt-7"
    >
      <h2
        className="text-[13px] font-semibold uppercase leading-4"
        style={{ color: c.neutral[700], letterSpacing: '0.07em' }}
      >
        All trails
      </h2>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-medium"
        style={{
          borderColor: c.neutral[200],
          color: c.neutral[700],
        }}
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path
            d="M2 3 H10 M3.5 6 H8.5 M5 9 H7"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
        Filter
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Bottom nav
// ─────────────────────────────────────────────────────────────────────────────

function BottomNav() {
  const items = [
    { label: 'Browse', active: true },
    { label: 'Trips', active: false },
    { label: 'Messages', active: false },
    { label: 'Profile', active: false },
  ];
  return (
    <nav
      className="absolute inset-x-0 bottom-0 flex h-[68px] items-start justify-around border-t pb-2 pt-2"
      style={{
        backgroundColor: `${c.neutral[0]}F2`,
        backdropFilter: 'blur(12px)',
        borderColor: c.neutral[100],
      }}
    >
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          className="flex flex-1 flex-col items-center gap-1 pt-1.5"
        >
          <span
            className="block h-[18px] w-[18px] rounded-sm"
            style={{
              backgroundColor: item.active ? c.trilha[500] : c.neutral[300],
            }}
            aria-hidden
          />
          <span
            className="text-[10.5px] font-medium leading-3"
            style={{ color: item.active ? c.trilha[700] : c.neutral[500] }}
          >
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function BrowseScreen() {
  return (
    <div
      className="relative h-full w-full overflow-hidden font-sans"
      style={{
        backgroundColor: c.neutral[50],
        color: c.neutral[900],
        fontFamily:
          '"Geist Sans", system-ui, -apple-system, "Segoe UI", sans-serif',
      }}
    >
      <Header />
      <div
        className="overflow-y-auto"
        style={{ height: 'calc(100% - 56px - 68px)' }}
      >
        <div className="px-4">
          <PageTitle />
          <FeaturedCard trail={FEATURED} />
          <SectionHeader />
          <div className="space-y-3 pb-6">
            {CATALOG.map((trail, i) => (
              <TrailCard key={trail.id} trail={trail} index={i} />
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
