'use client';

/**
 * Screen: Booking Sheet — Step 1 · Choose date
 * Flow: Trust-mediated booking (Flow 1)
 * Chapter: booking-flow (autoplay, step 1 of 3)
 * JTBD: When I am committing to a hike, I want to pick a day that fits my plans
 *       and check the weather for that day in the same view, so I don't have to
 *       jump between tabs.
 *
 * Key design decisions:
 * 1. Weather icon per date cell. The biggest disambiguating signal for hiking
 *    isn't "is this date available," it's "will the weather hold." Putting a small
 *    sun/cloud/rain glyph in every available cell turns the calendar into the
 *    decision surface, not just a date picker.
 * 2. Single departure time (6:00 AM) is implicit, not a separate step. Pedra da
 *    Gávea operates on dawn departures; a time picker would be theatre. The time
 *    is shown in the info row and again in the confirmation summary.
 * 3. Cap-of-6 framing surfaced as "3 spots left" in the bottom summary, not in
 *    every cell. The research hypothesis 2 says the small-group framing converts
 *    higher; we honour it without saturating the grid with capacity numbers.
 * 4. Step indicator inline (Step 1 of 3 + three bars). The case layout shows its
 *    own story progress bar above the phone; this inner indicator keeps the screen
 *    sensible if viewed standalone.
 * 5. The selected date animates its fill on screen entry — a one-shot motion that
 *    completes within 500 ms and stays. Compatible with autoplay mode: no scroll
 *    triggers, no viewport intersection observers.
 *
 * Trade-offs considered:
 * - A separate time-of-day step (rejected): adds a fourth step for one fixed value.
 * - Weather forecast strip above the calendar (rejected): duplicates the per-cell
 *   icons and breaks the "calendar as decision surface" idea.
 * - Capacity dots on every cell (rejected): scannable but visually busy. Capacity
 *   matters only for the selected date.
 */

import * as React from 'react';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Tokens
// ─────────────────────────────────────────────────────────────────────────────

const c = {
  trilha: { 50: '#F0F6F7', 100: '#D9E8EA', 300: '#82B0B5', 500: '#2B6770', 600: '#1F4E55', 700: '#173A40', 800: '#112B30' },
  neutral: { 0: '#FFFFFF', 50: '#FAFAF7', 100: '#F2F1ED', 200: '#E5E3DC', 300: '#C9C6BB', 400: '#9C988B', 500: '#6E6B5F', 600: '#4F4D44', 700: '#36352F', 800: '#232220', 900: '#131311' },
  sandstone: { 300: '#E4C7A4', 500: '#C68A56' },
  warning: { 500: '#B86E1E' },
};

const monoFont = '"Geist Mono", ui-monospace, "SF Mono", monospace';
const sansFont = '"Geist Sans", system-ui, -apple-system, "Segoe UI", sans-serif';
const ease: [number, number, number, number] = [0.25, 1, 0.5, 1];

// ─────────────────────────────────────────────────────────────────────────────
// Calendar data — March 2026
// ─────────────────────────────────────────────────────────────────────────────

type Weather = 'sun' | 'partial' | 'rain';
type CellState = 'past' | 'unavailable' | 'available' | 'today' | 'selected';

interface DayCell {
  day: number;
  state: CellState;
  weather?: Weather;
}

// March 1, 2026 is a Sunday. Generate 35 cells (5 rows × 7 days).
// Pattern: unavailable = Tuesdays + Thursdays. Past = before Mar 11. Today = 11.
// Selected = 14 (Saturday).
const TODAY = 11;
const SELECTED = 14;

function buildMonth(): (DayCell | null)[] {
  const cells: (DayCell | null)[] = [];
  // March 1 starts at column 0 (Sunday). 31 days. Total cells = 35 (or 42).
  for (let d = 1; d <= 31; d++) {
    const col = (d - 1) % 7; // 0=Sun,1=Mon,2=Tue,...
    const isTuesday = col === 2;
    const isThursday = col === 4;

    let state: CellState;
    let weather: Weather | undefined;

    if (d < TODAY) {
      state = 'past';
    } else if (d === SELECTED) {
      state = 'selected';
      weather = 'sun';
    } else if (d === TODAY) {
      state = 'today';
      weather = 'partial';
    } else if (isTuesday || isThursday) {
      state = 'unavailable';
    } else {
      state = 'available';
      // Deterministic weather pattern for visual variety
      const mod = d % 5;
      weather = mod === 0 ? 'rain' : mod === 1 || mod === 3 ? 'sun' : 'partial';
    }

    cells.push({ day: d, state, weather });
  }
  // Pad end to fill the grid to 35 cells
  while (cells.length < 35) cells.push(null);
  return cells;
}

const MONTH = buildMonth();

// ─────────────────────────────────────────────────────────────────────────────
// Atoms
// ─────────────────────────────────────────────────────────────────────────────

function WeatherIcon({ kind, color }: { kind: Weather; color: string }) {
  if (kind === 'sun') {
    return (
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
        <circle cx="6" cy="6" r="2.4" fill={color} />
        <g stroke={color} strokeWidth="1.1" strokeLinecap="round">
          <path d="M6 1.3 V2.5" />
          <path d="M6 9.5 V10.7" />
          <path d="M1.3 6 H2.5" />
          <path d="M9.5 6 H10.7" />
          <path d="M2.5 2.5 L3.35 3.35" />
          <path d="M8.65 8.65 L9.5 9.5" />
          <path d="M2.5 9.5 L3.35 8.65" />
          <path d="M8.65 3.35 L9.5 2.5" />
        </g>
      </svg>
    );
  }
  if (kind === 'partial') {
    return (
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
        <circle cx="4.2" cy="4.4" r="1.8" fill={color} />
        <path
          d="M3 9 A2.6 2.6 0 0 1 5.6 6.4 A2.6 2.6 0 0 1 8.2 8 A2 2 0 0 1 9.5 12 H3 A2 2 0 0 1 3 9 Z"
          fill={color}
          opacity="0.85"
        />
      </svg>
    );
  }
  // rain
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M3 7 A2.4 2.4 0 0 1 5.4 4.6 A2.4 2.4 0 0 1 7.8 6 A1.8 1.8 0 0 1 9 9.5 H3 A1.6 1.6 0 0 1 3 7 Z"
        fill={color}
        opacity="0.9"
      />
      <g stroke={color} strokeWidth="1" strokeLinecap="round">
        <path d="M4 10.8 L3.5 11.8" />
        <path d="M6 10.8 L5.5 11.8" />
        <path d="M8 10.8 L7.5 11.8" />
      </g>
    </svg>
  );
}

function StepIndicator() {
  const total = 3;
  const current = 1;
  return (
    <div className="flex items-center gap-3">
      <span
        className="text-[10.5px] font-semibold uppercase leading-3"
        style={{ color: c.neutral[500], letterSpacing: '0.07em' }}
      >
        Step {current} of {total}
      </span>
      <div className="flex items-center gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className="block rounded-full"
            style={{
              height: 3,
              width: i + 1 === current ? 16 : 8,
              backgroundColor: i + 1 === current ? c.trilha[500] : c.neutral[200],
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sheet header (trail context + close)
// ─────────────────────────────────────────────────────────────────────────────

function SheetHeader() {
  return (
    <div className="flex items-center justify-between px-4 pt-4">
      <div className="flex items-center gap-3">
        <div
          className="relative h-10 w-10 overflow-hidden rounded-lg"
          style={{
            background: `linear-gradient(165deg, ${c.trilha[800]} 0%, ${c.trilha[600]} 55%, ${c.sandstone[300]} 100%)`,
          }}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            <path
              d="M0,100 L0,72 L20,62 L36,38 L52,28 L66,46 L80,55 L100,52 L100,100 Z"
              fill="rgba(11,29,32,0.55)"
            />
          </svg>
        </div>
        <div>
          <p
            className="text-[14px] font-semibold leading-[18px]"
            style={{ color: c.neutral[900], letterSpacing: '-0.005em' }}
          >
            Pedra da Gávea
          </p>
          <p className="text-[12px] leading-4" style={{ color: c.neutral[500] }}>
            with Rodrigo Silva
          </p>
        </div>
      </div>
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: c.neutral[100] }}
        aria-label="Close"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M3 3 L11 11 M11 3 L3 11"
            stroke={c.neutral[800]}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Info row
// ─────────────────────────────────────────────────────────────────────────────

function InfoRow() {
  return (
    <div
      className="mx-4 mt-4 flex items-center gap-1.5 rounded-lg px-3 py-2.5"
      style={{ backgroundColor: c.neutral[100] }}
    >
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
        <circle cx="7" cy="7" r="5.4" stroke={c.neutral[600]} strokeWidth="1.3" />
        <path
          d="M7 4 V7.2 L9 8.5"
          stroke={c.neutral[600]}
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-[12px] leading-4" style={{ color: c.neutral[600] }}>
        <span style={{ fontFamily: monoFont, color: c.neutral[800] }}>6:00 AM</span>
        <span className="mx-1.5" style={{ color: c.neutral[300] }}>·</span>
        Group hike
        <span className="mx-1.5" style={{ color: c.neutral[300] }}>·</span>
        Max 6 people
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Month strip
// ─────────────────────────────────────────────────────────────────────────────

function MonthHeader() {
  return (
    <div className="mt-5 flex items-center justify-between px-4">
      <h2
        className="text-[17px] font-semibold leading-[22px]"
        style={{ color: c.neutral[900], letterSpacing: '-0.01em' }}
      >
        March 2026
      </h2>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: c.neutral[100] }}
          aria-label="Previous month"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M7.5 2 L3.5 6 L7.5 10"
              stroke={c.neutral[400]}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: c.neutral[100] }}
          aria-label="Next month"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M4.5 2 L8.5 6 L4.5 10"
              stroke={c.neutral[800]}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function WeekdayStrip() {
  const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return (
    <div className="mt-3 grid grid-cols-7 px-4">
      {labels.map((l, i) => (
        <div
          key={i}
          className="text-center text-[10.5px] font-medium uppercase leading-4"
          style={{ color: c.neutral[400], letterSpacing: '0.06em' }}
        >
          {l}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Calendar grid
// ─────────────────────────────────────────────────────────────────────────────

function DateCell({ cell, idx }: { cell: DayCell | null; idx: number }) {
  if (!cell) {
    return <div aria-hidden />;
  }

  const styles = (() => {
    switch (cell.state) {
      case 'past':
        return { bg: 'transparent', fg: c.neutral[300], dim: true };
      case 'unavailable':
        return { bg: 'transparent', fg: c.neutral[300], dim: true };
      case 'available':
        return { bg: c.neutral[0], fg: c.neutral[900], dim: false };
      case 'today':
        return { bg: c.neutral[0], fg: c.neutral[900], dim: false };
      case 'selected':
        return { bg: c.trilha[500], fg: c.neutral[0], dim: false };
    }
  })();

  const weatherColor =
    cell.state === 'selected'
      ? c.neutral[0]
      : cell.weather === 'rain'
      ? c.neutral[400]
      : cell.weather === 'partial'
      ? c.neutral[500]
      : c.sandstone[500];

  const isSelected = cell.state === 'selected';
  const isToday = cell.state === 'today';

  return (
    <div className="flex aspect-square items-center justify-center p-[3px]">
      <motion.div
        initial={isSelected ? { scale: 0.86, backgroundColor: c.neutral[0] } : false}
        animate={
          isSelected
            ? {
                scale: 1,
                backgroundColor: c.trilha[500],
                transition: { duration: 0.4, ease, delay: 0.25 + idx * 0.005 },
              }
            : undefined
        }
        className="relative flex h-full w-full flex-col items-center justify-center rounded-lg"
        style={{
          backgroundColor: styles.bg,
          border:
            cell.state === 'available' || cell.state === 'today'
              ? `1px solid ${c.neutral[100]}`
              : 'none',
          boxShadow: isSelected
            ? '0 2px 8px rgba(43,103,112,0.28)'
            : 'none',
        }}
      >
        <span
          className="text-[13.5px] font-semibold leading-4"
          style={{
            color: styles.fg,
            fontFamily: monoFont,
            opacity: styles.dim ? 0.55 : 1,
          }}
        >
          {cell.day}
        </span>
        {cell.weather && (
          <span className="mt-0.5" style={{ opacity: styles.dim ? 0.55 : 1 }}>
            <WeatherIcon kind={cell.weather} color={weatherColor} />
          </span>
        )}
        {isToday && (
          <span
            className="absolute -bottom-px h-[3px] w-[3px] rounded-full"
            style={{ backgroundColor: c.trilha[500] }}
            aria-hidden
          />
        )}
      </motion.div>
    </div>
  );
}

function CalendarGrid() {
  return (
    <div className="mt-1 grid grid-cols-7 px-3">
      {MONTH.map((cell, i) => (
        <DateCell key={i} cell={cell} idx={i} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Legend
// ─────────────────────────────────────────────────────────────────────────────

function Legend() {
  const items = [
    { label: 'Available', dot: c.neutral[0], border: c.neutral[200] },
    { label: 'Unavailable', dot: 'transparent', border: c.neutral[200], dim: true },
    { label: 'Selected', dot: c.trilha[500], border: c.trilha[500] },
  ];
  return (
    <div className="mt-4 flex items-center justify-center gap-4 px-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            className="block h-2.5 w-2.5 rounded-sm"
            style={{
              backgroundColor: item.dot,
              border: `1px solid ${item.border}`,
              opacity: item.dim ? 0.4 : 1,
            }}
            aria-hidden
          />
          <span
            className="text-[11px] leading-4"
            style={{ color: c.neutral[500] }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
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
            Selected
          </p>
          <p
            className="mt-1 text-[14px] font-semibold leading-5"
            style={{ color: c.neutral[900] }}
          >
            <span style={{ fontFamily: monoFont }}>Sat, Mar 14</span>
            <span className="mx-1.5" style={{ color: c.neutral[300] }}>·</span>
            <span style={{ color: c.warning[500], fontWeight: 600 }}>
              3 spots left
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
          Continue
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

export default function BookingDateScreen() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        backgroundColor: c.neutral[50],
        color: c.neutral[900],
        fontFamily: sansFont,
      }}
    >
      {/* dim strip at top to imply a modal sheet */}
      <div
        className="h-6 w-full"
        style={{
          background: `linear-gradient(to bottom, rgba(35,32,22,0.18), rgba(35,32,22,0))`,
        }}
        aria-hidden
      />
      {/* sheet container */}
      <div
        className="relative -mt-3 h-[calc(100%-12px)] w-full overflow-y-auto pb-[100px]"
        style={{
          backgroundColor: c.neutral[0],
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          boxShadow: '0 -4px 16px rgba(35,32,22,0.06)',
        }}
      >
        {/* drag handle */}
        <div className="flex w-full items-center justify-center pt-2">
          <span
            className="block h-1 w-9 rounded-full"
            style={{ backgroundColor: c.neutral[200] }}
            aria-hidden
          />
        </div>

        <SheetHeader />

        <div className="mt-4 px-4">
          <StepIndicator />
        </div>

        <InfoRow />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.12 }}
        >
          <MonthHeader />
          <WeekdayStrip />
          <CalendarGrid />
          <Legend />
        </motion.div>
      </div>

      <StickyBottomCTA />
    </div>
  );
}
