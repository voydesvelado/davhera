'use client';

/**
 * Screen: Meeting Point · Day-of
 * Flow: Pre-hike logistics (Flow 2)
 * Chapter: meeting-point (scroll)
 * JTBD: When the trail starts at 6 AM in a neighborhood I don't know, I want a
 *       precise meeting point with a map, transport options, and a what-to-bring
 *       list, so I am not Googling Itanhangá at 5:30 AM.
 *
 * This is the case study's design kicker — the screen that no incumbent gets
 * right. Every element on it traces to a specific research insight.
 *
 * Key design decisions:
 * 1. The screen opens with TIME, not location. "Tomorrow at 6:00 AM · 14 hours
 *    from now" answers the first question Hannah has at 9 PM the night before:
 *    am I in the right window. Mono numerals carry the time data.
 * 2. The map is stylized, not photographic. A minimalist Apple-Maps-light
 *    rendering with a Tijuca-forest blob, warm road network, and a single
 *    pin with halo ripple. The pin is the only visual anchor that matters.
 * 3. Transport options as three rows, ranked by realistic preference for the
 *    persona. Uber first (Hannah's default), Drive second, Public transit last
 *    with an honest "Not recommended at this hour" rather than dropping it.
 * 4. Hour-by-hour weather, not a daily summary. The hike starts at 6 AM and
 *    the user will check this exactly once — at 9 PM the night before. They
 *    care about 6/7/8/9 AM specifically, not "today's weather."
 * 5. The what-to-bring checklist persists local state. Pre-checked: shoes and
 *    water (the essentials Rodrigo would refuse to start without). The user
 *    ticks the rest as they pack.
 * 6. Last guide message inline. The thread is one tap away; the most recent
 *    line is shown because that's what the user actually needs to remember
 *    ("Bring closed shoes!"). Sticky bottom CTA opens the full thread.
 * 7. No celebratory motion. Pin drops once on entry, halo ripples once, and
 *    everything else fades in calmly. The seriousness of a 6 AM start is the
 *    emotional register; the screen honours that.
 *
 * Trade-offs considered:
 * - Map at the top, full-bleed hero (rejected): pushes the time information
 *   below the fold. Time is the primary question; the map is the second one.
 * - Single transport recommendation only (rejected): the user wants to compare,
 *   not be told. Three options with honest commentary preserves trust.
 * - Forecast as a daily summary (rejected): generic and unhelpful for a fixed
 *   start time. The hour-by-hour strip is specific to the booked window.
 * - Auto-checking the entire packing list (rejected): infantilising and
 *   destroys the trust that the screen knows what's important.
 */

import * as React from 'react';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Tokens
// ─────────────────────────────────────────────────────────────────────────────

const c = {
  trilha: { 50: '#F0F6F7', 100: '#D9E8EA', 300: '#82B0B5', 500: '#2B6770', 600: '#1F4E55', 700: '#173A40', 800: '#112B30', 900: '#0B1D20' },
  neutral: { 0: '#FFFFFF', 50: '#FAFAF7', 100: '#F2F1ED', 200: '#E5E3DC', 300: '#C9C6BB', 400: '#9C988B', 500: '#6E6B5F', 600: '#4F4D44', 700: '#36352F', 800: '#232220', 900: '#131311' },
  sandstone: { 100: '#F6EBDC', 300: '#E4C7A4', 500: '#C68A56', 700: '#8A5A30' },
  success: { 100: '#DDEBE3', 500: '#1E7A4F', 700: '#125837' },
  warning: { 100: '#F6E5D0', 500: '#B86E1E', 700: '#854D14' },
};

const monoFont = '"Geist Mono", ui-monospace, "SF Mono", monospace';
const sansFont = '"Geist Sans", system-ui, -apple-system, "Segoe UI", sans-serif';
const ease: [number, number, number, number] = [0.25, 1, 0.5, 1];

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const MEETING = {
  trail: 'Pedra da Gávea',
  guide: 'Rodrigo Silva',
  guideInitials: 'RS',
  whenLabel: 'Tomorrow at 6:00 AM',
  countdown: '14 hours from now',
  address: 'Estrada Sorimã, 932',
  neighborhood: 'Itanhangá',
};

interface Transport {
  id: string;
  label: string;
  detail: string;
  icon: 'car' | 'bus' | 'wheel';
  recommended?: boolean;
  cautioned?: boolean;
}

const TRANSPORT: Transport[] = [
  {
    id: 'uber',
    label: 'Uber from Ipanema',
    detail: '28 min · R$ 42–55',
    icon: 'car',
    recommended: true,
  },
  {
    id: 'drive',
    label: 'Drive yourself',
    detail: '26 min · Free parking at trailhead',
    icon: 'wheel',
  },
  {
    id: 'transit',
    label: 'Public transit',
    detail: 'Not recommended at this hour',
    icon: 'bus',
    cautioned: true,
  },
];

interface Forecast {
  hour: string;
  weather: 'sun' | 'partial' | 'cloud';
  temp: number;
}

const WEATHER: Forecast[] = [
  { hour: '6 AM', weather: 'sun', temp: 19 },
  { hour: '7 AM', weather: 'sun', temp: 21 },
  { hour: '8 AM', weather: 'partial', temp: 23 },
  { hour: '9 AM', weather: 'partial', temp: 24 },
];

interface ChecklistItem {
  id: string;
  label: string;
  hint?: string;
  essential?: boolean;
  done: boolean;
}

const CHECKLIST: ChecklistItem[] = [
  { id: 'shoes', label: 'Closed shoes with grip', hint: 'Trail runners or light hikers', essential: true, done: true },
  { id: 'water', label: '2 L water', hint: 'Refill at base; nothing on trail', essential: true, done: true },
  { id: 'jacket', label: 'Light long-sleeve', hint: 'Cool at the summit before sunrise', done: false },
  { id: 'snacks', label: 'Snacks for the descent', done: false },
  { id: 'sunscreen', label: 'Sunscreen SPF 50', hint: 'Last shade ends at the Carrasqueira', done: false },
  { id: 'cash', label: 'R$ 60 cash for the return Uber', done: false },
  { id: 'id', label: 'Photo ID', hint: 'Required by Tijuca National Park', done: false },
];

const LAST_MESSAGE = {
  who: 'Rodrigo',
  whenLabel: '9:47 PM',
  body:
    'All set for tomorrow. Meet me at the green gate on Estrada Sorimã at 5:55 AM — closed shoes only. Going to be a clear morning.',
};

// ─────────────────────────────────────────────────────────────────────────────
// Atoms
// ─────────────────────────────────────────────────────────────────────────────

function Avatar({ initials, size = 32 }: { initials: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${c.trilha[600]}, ${c.trilha[800]})`,
      }}
    >
      <span
        className="font-semibold leading-none"
        style={{
          color: c.neutral[0],
          fontSize: size * 0.36,
          letterSpacing: '0.01em',
        }}
      >
        {initials}
      </span>
    </div>
  );
}

function WeatherGlyph({ kind, size = 18, tint = c.sandstone[500] }: { kind: Forecast['weather']; size?: number; tint?: string }) {
  if (kind === 'sun') {
    return (
      <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden>
        <circle cx="9" cy="9" r="3.6" fill={tint} />
        <g stroke={tint} strokeWidth="1.4" strokeLinecap="round">
          <path d="M9 1.6 V3.4" />
          <path d="M9 14.6 V16.4" />
          <path d="M1.6 9 H3.4" />
          <path d="M14.6 9 H16.4" />
          <path d="M3.6 3.6 L4.9 4.9" />
          <path d="M13.1 13.1 L14.4 14.4" />
          <path d="M3.6 14.4 L4.9 13.1" />
          <path d="M13.1 4.9 L14.4 3.6" />
        </g>
      </svg>
    );
  }
  if (kind === 'partial') {
    return (
      <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden>
        <circle cx="6.2" cy="6.6" r="2.6" fill={tint} />
        <path
          d="M4.4 13.2 A3.8 3.8 0 0 1 8.2 9.4 A3.8 3.8 0 0 1 12 11.8 A2.6 2.6 0 0 1 13.8 16.4 H4.4 A2 2 0 0 1 4.4 13.2 Z"
          fill={c.neutral[400]}
        />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M4 12 A3.4 3.4 0 0 1 7.4 8.6 A3.4 3.4 0 0 1 10.8 11 A2.4 2.4 0 0 1 12.4 15.4 H4 A2 2 0 0 1 4 12 Z"
        fill={c.neutral[400]}
      />
    </svg>
  );
}

function TransportIcon({ kind }: { kind: Transport['icon'] }) {
  if (kind === 'car' || kind === 'wheel') {
    return (
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path
          d="M3 10 L4 6.5 A1.5 1.5 0 0 1 5.4 5.5 H12.6 A1.5 1.5 0 0 1 14 6.5 L15 10 M3 10 V13 A0.6 0.6 0 0 0 3.6 13.6 H4.8 A0.6 0.6 0 0 0 5.4 13 V12 M15 10 V13 A0.6 0.6 0 0 1 14.4 13.6 H13.2 A0.6 0.6 0 0 1 12.6 13 V12 M3 10 H15 M5.4 12 H12.6"
          stroke={c.neutral[700]}
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="6" cy="11" r="0.8" fill={c.neutral[700]} />
        <circle cx="12" cy="11" r="0.8" fill={c.neutral[700]} />
      </svg>
    );
  }
  // bus
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect
        x="4"
        y="4"
        width="10"
        height="9"
        rx="1.4"
        stroke={c.neutral[700]}
        strokeWidth="1.3"
        fill="none"
      />
      <path
        d="M4 8 H14 M6 13 V14.5 M12 13 V14.5"
        stroke={c.neutral[700]}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="6.5" cy="11" r="0.7" fill={c.neutral[700]} />
      <circle cx="11.5" cy="11" r="0.7" fill={c.neutral[700]} />
    </svg>
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
      <div className="text-center">
        <p
          className="text-[10.5px] font-medium uppercase leading-3"
          style={{ color: c.neutral[400], letterSpacing: '0.06em' }}
        >
          Meeting point
        </p>
        <p
          className="mt-0.5 text-[13px] font-semibold leading-4"
          style={{ color: c.neutral[900], letterSpacing: '-0.005em' }}
        >
          {MEETING.trail}
        </p>
      </div>
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: c.neutral[100] }}
        aria-label="More options"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <circle cx="3.5" cy="7" r="1.1" fill={c.neutral[800]} />
          <circle cx="7" cy="7" r="1.1" fill={c.neutral[800]} />
          <circle cx="10.5" cy="7" r="1.1" fill={c.neutral[800]} />
        </svg>
      </button>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Countdown hero
// ─────────────────────────────────────────────────────────────────────────────

function CountdownHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.05 }}
      className="px-4 pb-5 pt-6"
    >
      <p
        className="text-[10.5px] font-semibold uppercase leading-3"
        style={{ color: c.trilha[600], letterSpacing: '0.08em' }}
      >
        Confirmed
      </p>
      <h1
        className="mt-1.5 text-[26px] font-semibold leading-[30px]"
        style={{ color: c.neutral[900], letterSpacing: '-0.018em' }}
      >
        {MEETING.whenLabel}
      </h1>
      <p
        className="mt-1 text-[13px] leading-5"
        style={{ color: c.neutral[500], fontFamily: monoFont }}
      >
        {MEETING.countdown}
      </p>
      <div
        className="mt-4 flex items-center gap-2.5 rounded-full px-2 py-1.5 pr-3.5"
        style={{
          backgroundColor: c.trilha[50],
          width: 'fit-content',
        }}
      >
        <Avatar initials={MEETING.guideInitials} size={26} />
        <p className="text-[12.5px] font-medium leading-4" style={{ color: c.trilha[700] }}>
          {MEETING.guide}
          <span className="ml-1.5 font-normal" style={{ color: c.trilha[600], opacity: 0.7 }}>
            · Your guide
          </span>
        </p>
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Map preview
// ─────────────────────────────────────────────────────────────────────────────

function MapPreview() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease, delay: 0.1 }}
      className="relative mx-4 overflow-hidden rounded-2xl"
      style={{
        height: 180,
        backgroundColor: c.sandstone[100],
        border: `1px solid ${c.neutral[100]}`,
      }}
    >
      {/* base background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, ${c.sandstone[100]} 0%, ${c.neutral[100]} 100%)`,
        }}
        aria-hidden
      />
      {/* SVG map: forest + roads */}
      <svg
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {/* Tijuca Forest blob (organic shape, success-100 with low opacity) */}
        <path
          d="M -10 90 C 30 50, 90 60, 130 95 C 165 130, 90 165, 50 175 C 20 185, -10 175, -10 150 Z"
          fill={c.success[100]}
          opacity="0.9"
        />
        <path
          d="M 260 -10 C 330 -10, 410 25, 410 80 C 410 130, 350 140, 300 130 C 250 120, 240 65, 260 -10 Z"
          fill={c.success[100]}
          opacity="0.7"
        />
        {/* Road network */}
        <g stroke={c.sandstone[300]} strokeLinecap="round" fill="none">
          <path d="M -10 130 C 80 125, 160 110, 230 105 C 290 100, 360 105, 410 110" strokeWidth="6" opacity="0.55" />
          <path d="M 200 -10 C 195 40, 210 80, 225 110 C 235 140, 220 180, 215 220" strokeWidth="5" opacity="0.45" />
          <path d="M 120 60 C 160 80, 190 95, 230 100" strokeWidth="3" opacity="0.4" />
          <path d="M 230 105 C 260 130, 290 155, 330 175" strokeWidth="3" opacity="0.4" />
        </g>
        {/* light grain */}
        <rect
          width="400"
          height="200"
          fill="url(#grain)"
          opacity="0.4"
        />
        <defs>
          <pattern id="grain" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.4" fill={c.neutral[300]} opacity="0.5" />
          </pattern>
        </defs>
      </svg>

      {/* Halo ripple (one-shot) */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0.6 }}
        animate={{ scale: 2.6, opacity: 0 }}
        transition={{ duration: 1.4, ease, delay: 0.55 }}
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          marginLeft: -28,
          marginTop: -28,
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: c.trilha[500],
          opacity: 0.3,
        }}
        aria-hidden
      />

      {/* Pin (drops in) */}
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.4, 0.64, 1], delay: 0.35 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
      >
        <div className="relative">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{
              backgroundColor: c.trilha[500],
              boxShadow: '0 4px 10px rgba(11, 29, 32, 0.28)',
              border: `2px solid ${c.neutral[0]}`,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M7 1.5 C9.5 1.5 11.5 3.5 11.5 6 C11.5 8.5 7 12.5 7 12.5 C7 12.5 2.5 8.5 2.5 6 C2.5 3.5 4.5 1.5 7 1.5 Z"
                fill={c.neutral[0]}
              />
              <circle cx="7" cy="6" r="1.6" fill={c.trilha[500]} />
            </svg>
          </div>
          {/* shadow under pin */}
          <div
            className="absolute left-1/2 top-full h-1 w-4 -translate-x-1/2 rounded-full"
            style={{ backgroundColor: 'rgba(11, 29, 32, 0.18)', filter: 'blur(2px)' }}
          />
        </div>
      </motion.div>

      {/* Neighborhood label */}
      <div
        className="absolute right-3 top-3 rounded-full px-2 py-1"
        style={{
          backgroundColor: `${c.neutral[0]}E6`,
          backdropFilter: 'blur(8px)',
        }}
      >
        <p
          className="text-[10px] font-semibold uppercase leading-3"
          style={{ color: c.neutral[700], letterSpacing: '0.08em' }}
        >
          {MEETING.neighborhood}
        </p>
      </div>

      {/* Forest label */}
      <div className="absolute bottom-3 left-3">
        <p
          className="text-[9.5px] font-medium uppercase leading-3"
          style={{ color: c.success[700], letterSpacing: '0.1em', opacity: 0.7 }}
        >
          Tijuca Forest
        </p>
      </div>

      {/* Open in Maps */}
      <button
        type="button"
        className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-4"
        style={{
          backgroundColor: c.neutral[900],
          color: c.neutral[0],
        }}
      >
        Open in Maps
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path
            d="M3 1.5 H8.5 V7 M8.5 1.5 L2.5 7.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Address row
// ─────────────────────────────────────────────────────────────────────────────

function AddressRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.15 }}
      className="mx-4 mt-3 flex items-start gap-3"
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: c.neutral[100] }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M7 1.5 C9.5 1.5 11.5 3.5 11.5 6 C11.5 8.5 7 12.5 7 12.5 C7 12.5 2.5 8.5 2.5 6 C2.5 3.5 4.5 1.5 7 1.5 Z M7 4.6 A1.4 1.4 0 1 1 7 7.4 A1.4 1.4 0 1 1 7 4.6 Z"
            stroke={c.neutral[700]}
            strokeWidth="1.3"
            fill="none"
          />
        </svg>
      </div>
      <div className="min-w-0 pt-0.5">
        <p
          className="text-[14px] font-semibold leading-[18px]"
          style={{ color: c.neutral[900] }}
        >
          {MEETING.address}
        </p>
        <p className="text-[12px] leading-4" style={{ color: c.neutral[500] }}>
          {MEETING.neighborhood}, Rio de Janeiro
          <span className="mx-1" style={{ color: c.neutral[300] }}>·</span>
          Green gate, west side
        </p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Transport list
// ─────────────────────────────────────────────────────────────────────────────

function TransportList() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.2 }}
      className="mx-4 mt-5"
    >
      <h3
        className="px-1 text-[11px] font-semibold uppercase leading-4"
        style={{ color: c.neutral[500], letterSpacing: '0.08em' }}
      >
        Getting there
      </h3>
      <div
        className="mt-2.5 overflow-hidden rounded-xl"
        style={{
          backgroundColor: c.neutral[0],
          border: `1px solid ${c.neutral[200]}`,
        }}
      >
        {TRANSPORT.map((t, i) => (
          <div
            key={t.id}
            className="flex items-center gap-3 px-3.5 py-3"
            style={{
              borderTop: i === 0 ? 'none' : `1px solid ${c.neutral[100]}`,
            }}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: c.neutral[100] }}
            >
              <TransportIcon kind={t.icon} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p
                  className="text-[13.5px] font-semibold leading-[18px]"
                  style={{
                    color: t.cautioned ? c.neutral[500] : c.neutral[900],
                  }}
                >
                  {t.label}
                </p>
                {t.recommended && (
                  <span
                    className="rounded-full px-1.5 py-[1px] text-[9px] font-semibold uppercase leading-3"
                    style={{
                      backgroundColor: c.success[100],
                      color: c.success[700],
                      letterSpacing: '0.05em',
                    }}
                  >
                    Best
                  </span>
                )}
              </div>
              <p
                className="mt-0.5 text-[12px] leading-4"
                style={{
                  color: t.cautioned ? c.warning[700] : c.neutral[600],
                  fontFamily: t.cautioned ? sansFont : monoFont,
                }}
              >
                {t.detail}
              </p>
            </div>
            {!t.cautioned && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path
                  d="M4 2 L8 6 L4 10"
                  stroke={c.neutral[400]}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Weather strip
// ─────────────────────────────────────────────────────────────────────────────

function WeatherStrip() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.25 }}
      className="mx-4 mt-5"
    >
      <div className="flex items-baseline justify-between px-1">
        <h3
          className="text-[11px] font-semibold uppercase leading-4"
          style={{ color: c.neutral[500], letterSpacing: '0.08em' }}
        >
          Weather at the trailhead
        </h3>
        <p className="text-[10.5px] leading-4" style={{ color: c.neutral[400] }}>
          Updated 8 min ago
        </p>
      </div>
      <div
        className="mt-2.5 grid grid-cols-4 overflow-hidden rounded-xl"
        style={{
          backgroundColor: c.neutral[0],
          border: `1px solid ${c.neutral[200]}`,
        }}
      >
        {WEATHER.map((w, i) => (
          <div
            key={w.hour}
            className="flex flex-col items-center gap-1.5 py-3"
            style={{
              borderLeft: i === 0 ? 'none' : `1px solid ${c.neutral[100]}`,
              backgroundColor: i === 0 ? c.sandstone[100] : 'transparent',
            }}
          >
            <p
              className="text-[10.5px] font-medium uppercase leading-3"
              style={{
                color: i === 0 ? c.sandstone[700] : c.neutral[500],
                letterSpacing: '0.05em',
              }}
            >
              {w.hour}
            </p>
            <WeatherGlyph
              kind={w.weather}
              size={20}
              tint={
                w.weather === 'sun'
                  ? c.sandstone[500]
                  : w.weather === 'partial'
                  ? c.neutral[500]
                  : c.neutral[400]
              }
            />
            <p
              className="text-[13px] font-semibold leading-4"
              style={{ color: c.neutral[900], fontFamily: monoFont }}
            >
              {w.temp}°
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Checklist
// ─────────────────────────────────────────────────────────────────────────────

function Checklist() {
  const [items, setItems] = React.useState<ChecklistItem[]>(CHECKLIST);
  const done = items.filter((i) => i.done).length;
  const total = items.length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.3 }}
      className="mx-4 mt-5"
    >
      <div className="flex items-baseline justify-between px-1">
        <h3
          className="text-[11px] font-semibold uppercase leading-4"
          style={{ color: c.neutral[500], letterSpacing: '0.08em' }}
        >
          What to bring
        </h3>
        <p
          className="text-[11px] font-medium leading-4"
          style={{ color: c.neutral[600], fontFamily: monoFont }}
        >
          {done} / {total}
        </p>
      </div>
      <div
        className="mt-2.5 overflow-hidden rounded-xl"
        style={{
          backgroundColor: c.neutral[0],
          border: `1px solid ${c.neutral[200]}`,
        }}
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              setItems((curr) =>
                curr.map((c, idx) => (idx === i ? { ...c, done: !c.done } : c))
              )
            }
            className="flex w-full items-start gap-3 px-3.5 py-2.5 text-left"
            style={{
              borderTop: i === 0 ? 'none' : `1px solid ${c.neutral[100]}`,
            }}
          >
            <span
              className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded"
              style={{
                backgroundColor: item.done ? c.trilha[500] : 'transparent',
                border: item.done
                  ? `1px solid ${c.trilha[500]}`
                  : `1.5px solid ${c.neutral[300]}`,
              }}
            >
              {item.done && (
                <motion.svg
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2, ease }}
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M2 5 L4 7 L8 3"
                    stroke={c.neutral[0]}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className="text-[13.5px] leading-5"
                style={{
                  color: item.done ? c.neutral[500] : c.neutral[900],
                  textDecoration: item.done ? 'line-through' : 'none',
                  fontWeight: item.essential ? 500 : 400,
                }}
              >
                {item.label}
                {item.essential && !item.done && (
                  <span
                    className="ml-1.5 text-[10px] font-semibold uppercase"
                    style={{ color: c.warning[700], letterSpacing: '0.05em' }}
                  >
                    Essential
                  </span>
                )}
              </p>
              {item.hint && !item.done && (
                <p
                  className="mt-0.5 text-[11.5px] leading-4"
                  style={{ color: c.neutral[500] }}
                >
                  {item.hint}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Message preview
// ─────────────────────────────────────────────────────────────────────────────

function MessagePreview() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.4 }}
      className="mx-4 mt-5"
    >
      <h3
        className="px-1 text-[11px] font-semibold uppercase leading-4"
        style={{ color: c.neutral[500], letterSpacing: '0.08em' }}
      >
        Last from {LAST_MESSAGE.who}
      </h3>
      <div
        className="mt-2.5 rounded-xl p-3.5"
        style={{
          backgroundColor: c.trilha[50],
          border: `1px solid ${c.trilha[100]}`,
        }}
      >
        <div className="flex items-start gap-3">
          <Avatar initials={MEETING.guideInitials} size={32} />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <p
                className="text-[13px] font-semibold leading-4"
                style={{ color: c.trilha[800] }}
              >
                {LAST_MESSAGE.who}
              </p>
              <p
                className="text-[11px] leading-4"
                style={{ color: c.trilha[600], opacity: 0.7, fontFamily: monoFont }}
              >
                {LAST_MESSAGE.whenLabel}
              </p>
            </div>
            <p
              className="mt-1 text-[13px] leading-[19px]"
              style={{ color: c.neutral[800] }}
            >
              {LAST_MESSAGE.body}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cancellation reminder
// ─────────────────────────────────────────────────────────────────────────────

function CancellationReminder() {
  return (
    <p
      className="mx-4 mt-5 px-1 text-[11.5px] leading-[17px]"
      style={{ color: c.neutral[400] }}
    >
      Free cancellation closed at 6:00 AM today. After 5:55 AM tomorrow, no refund.
      Need to reschedule?{' '}
      <span className="underline underline-offset-2" style={{ color: c.neutral[600] }}>
        Message Rodrigo
      </span>
      .
    </p>
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
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold leading-5"
        style={{
          height: 52,
          backgroundColor: c.trilha[500],
          color: c.neutral[0],
          boxShadow: '0 4px 12px rgba(43,103,112,0.22)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M2 3.5 A1.5 1.5 0 0 1 3.5 2 H12.5 A1.5 1.5 0 0 1 14 3.5 V10.5 A1.5 1.5 0 0 1 12.5 12 H6 L3 14.5 V12 H3.5 A1.5 1.5 0 0 1 2 10.5 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        Message Rodrigo
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function MeetingPointScreen() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        backgroundColor: c.neutral[50],
        color: c.neutral[900],
        fontFamily: sansFont,
      }}
    >
      <Header />
      <div
        className="overflow-y-auto"
        style={{ height: 'calc(100% - 56px)' }}
      >
        <div className="pb-[110px]">
          <CountdownHero />
          <MapPreview />
          <AddressRow />
          <TransportList />
          <WeatherStrip />
          <Checklist />
          <MessagePreview />
          <CancellationReminder />
        </div>
      </div>
      <StickyBottomCTA />
    </div>
  );
}
