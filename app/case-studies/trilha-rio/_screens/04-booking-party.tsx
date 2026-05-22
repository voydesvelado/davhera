'use client';

/**
 * Screen: Booking Sheet — Step 2 · Hike type + party size
 * Flow: Trust-mediated booking (Flow 1)
 * Chapter: booking-flow (autoplay, step 2 of 3)
 * JTBD: When I am committing to a hike, I want to choose group or private and
 *       set my party size in one place, so the price updates in front of me and
 *       I can decide without comparing tabs.
 *
 * Key design decisions:
 * 1. Stacked option cards (not side-by-side toggle). At 390 px there isn't room
 *    for two cards with capacity progress bars side-by-side; stacking gives each
 *    option enough room to communicate its trade-off.
 * 2. Group card carries the visual weight — 2 px trilha border, trilha-50 tint,
 *    radio filled, "Popular" eyebrow. Honours design principle P6: group is
 *    anchored, private is offered.
 * 3. Spots-remaining shown as a progress bar (booked = filled, remaining = empty)
 *    plus a text label. The dual channel reads at a glance: bar shape signals
 *    "how full" before the eye reaches the number.
 * 4. Party-size stepper sized for thumb taps (44 × 44 hit targets) with the
 *    count in Geist Mono at data-l size. Stripe / iOS-style minus/plus circles,
 *    not chips.
 * 5. Live price strip appears between the cards and the stepper so the user
 *    sees the math update as they tap minus/plus. The math is the trust signal.
 *
 * Trade-offs considered:
 * - A horizontal Group / Private tab pill (rejected): a tab pattern compresses
 *   each option to a label, losing capacity, "what you get," and price-per-unit
 *   differentiation. The choice is too consequential for a 60 px tab.
 * - "Group, Private, Solo" as three options (rejected): Solo on Pedra da Gávea
 *   isn't sold by Rodrigo and would muddy the decision. Two options, decisive.
 * - Hiding the price math behind a chevron (rejected): the booking funnel is
 *   the highest-trust surface in the product. Show the numbers, plainly.
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
// Data
// ─────────────────────────────────────────────────────────────────────────────

const BOOKING = {
  trail: 'Pedra da Gávea',
  guide: 'Rodrigo Silva',
  date: 'Sat, Mar 14',
  time: '6:00 AM',
  group: {
    pricePerPerson: 240,
    maxParty: 6,
    bookedSpots: 3,
  },
  private: {
    flatPrice: 680,
    maxParty: 4,
  },
};

const SELECTED_MODE: 'group' | 'private' = 'group';
const PARTY_SIZE = 2;

// ─────────────────────────────────────────────────────────────────────────────
// Atoms
// ─────────────────────────────────────────────────────────────────────────────

function StepIndicator() {
  const total = 3;
  const current = 2;
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
              backgroundColor:
                i + 1 < current
                  ? c.trilha[300]
                  : i + 1 === current
                  ? c.trilha[500]
                  : c.neutral[200],
            }}
          />
        ))}
      </div>
    </div>
  );
}

function RadioDot({ filled }: { filled: boolean }) {
  return (
    <span
      className="relative block h-[18px] w-[18px] shrink-0 rounded-full"
      style={{
        backgroundColor: c.neutral[0],
        boxShadow: filled
          ? `inset 0 0 0 2px ${c.trilha[500]}`
          : `inset 0 0 0 1.5px ${c.neutral[300]}`,
      }}
      aria-hidden
    >
      {filled && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, ease, delay: 0.15 }}
          className="absolute left-1/2 top-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: c.trilha[500] }}
        />
      )}
    </span>
  );
}

function CapacityBar({ booked, total }: { booked: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`${total - booked} of ${total} spots left`}>
      <div
        className="relative h-1.5 w-[88px] overflow-hidden rounded-full"
        style={{ backgroundColor: c.neutral[200] }}
        aria-hidden
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(booked / total) * 100}%` }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
          className="h-full rounded-full"
          style={{ backgroundColor: c.trilha[500] }}
        />
      </div>
      <span
        className="text-[11.5px] font-medium leading-4"
        style={{ color: c.neutral[600], fontFamily: monoFont }}
      >
        {total - booked} of {total} left
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sheet header (same chrome as S3)
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
            {BOOKING.trail}
          </p>
          <p
            className="text-[12px] leading-4"
            style={{ color: c.neutral[500] }}
          >
            with {BOOKING.guide}
            <span className="mx-1.5" style={{ color: c.neutral[300] }}>·</span>
            <span style={{ fontFamily: monoFont, color: c.neutral[600] }}>
              {BOOKING.date}
            </span>
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
// Section heading
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-[11px] font-semibold uppercase leading-4"
      style={{ color: c.neutral[500], letterSpacing: '0.08em' }}
    >
      {children}
    </h3>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Group option card
// ─────────────────────────────────────────────────────────────────────────────

function GroupCard({ selected }: { selected: boolean }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.1 }}
      className="w-full overflow-hidden rounded-xl text-left"
      style={{
        backgroundColor: selected ? c.trilha[50] : c.neutral[0],
        border: selected
          ? `2px solid ${c.trilha[500]}`
          : `1px solid ${c.neutral[200]}`,
        padding: selected ? '15px 15px' : '16px 16px',
      }}
      aria-pressed={selected}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <RadioDot filled={selected} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-[15px] font-semibold leading-5"
              style={{ color: c.neutral[900], letterSpacing: '-0.005em' }}
            >
              Group hike
            </span>
            <span
              className="rounded-full px-1.5 py-[2px] text-[9.5px] font-semibold uppercase leading-3"
              style={{
                backgroundColor: c.trilha[500],
                color: c.neutral[0],
                letterSpacing: '0.05em',
              }}
            >
              Popular
            </span>
          </div>
          <p
            className="mt-1.5 text-[12.5px] leading-[18px]"
            style={{ color: c.neutral[600] }}
          >
            Join the scheduled departure with up to {BOOKING.group.maxParty} hikers.
            Cheaper per person; you&apos;ll meet other travelers on the trail.
          </p>
          <div className="mt-2.5">
            <CapacityBar
              booked={BOOKING.group.bookedSpots}
              total={BOOKING.group.maxParty}
            />
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p
            className="text-[16px] font-semibold leading-5"
            style={{ color: c.neutral[900], fontFamily: monoFont }}
          >
            R$ {BOOKING.group.pricePerPerson}
          </p>
          <p
            className="mt-0.5 text-[11px] leading-4"
            style={{ color: c.neutral[500] }}
          >
            per person
          </p>
        </div>
      </div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Private option card
// ─────────────────────────────────────────────────────────────────────────────

function PrivateCard({ selected }: { selected: boolean }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.16 }}
      className="w-full overflow-hidden rounded-xl text-left"
      style={{
        backgroundColor: selected ? c.trilha[50] : c.neutral[0],
        border: selected
          ? `2px solid ${c.trilha[500]}`
          : `1px solid ${c.neutral[200]}`,
        padding: selected ? '15px 15px' : '16px 16px',
      }}
      aria-pressed={selected}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <RadioDot filled={selected} />
        </div>
        <div className="flex-1 min-w-0">
          <span
            className="text-[15px] font-semibold leading-5"
            style={{ color: c.neutral[900], letterSpacing: '-0.005em' }}
          >
            Private hike
          </span>
          <p
            className="mt-1.5 text-[12.5px] leading-[18px]"
            style={{ color: c.neutral[600] }}
          >
            Just your party, up to {BOOKING.private.maxParty} people. Flat price;
            choose any date your guide is available.
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p
            className="text-[16px] font-semibold leading-5"
            style={{ color: c.neutral[900], fontFamily: monoFont }}
          >
            R$ {BOOKING.private.flatPrice}
          </p>
          <p
            className="mt-0.5 text-[11px] leading-4"
            style={{ color: c.neutral[500] }}
          >
            total
          </p>
        </div>
      </div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Party stepper
// ─────────────────────────────────────────────────────────────────────────────

function PartyStepper({ value, max }: { value: number; max: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.24 }}
      className="rounded-xl"
      style={{
        backgroundColor: c.neutral[0],
        border: `1px solid ${c.neutral[200]}`,
      }}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <div>
          <p
            className="text-[14px] font-semibold leading-5"
            style={{ color: c.neutral[900], letterSpacing: '-0.005em' }}
          >
            Party size
          </p>
          <p
            className="mt-0.5 text-[12px] leading-[18px]"
            style={{ color: c.neutral[500] }}
          >
            You and {value - 1} other
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full"
            style={{
              backgroundColor: c.neutral[100],
              opacity: value <= 1 ? 0.4 : 1,
            }}
            aria-label="Decrease party size"
            disabled={value <= 1}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M3 7 H11"
                stroke={c.neutral[800]}
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="w-9 text-center">
            <motion.span
              key={value}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.18, ease }}
              className="block text-[22px] font-semibold leading-7"
              style={{ color: c.neutral[900], fontFamily: monoFont }}
            >
              {value}
            </motion.span>
            <span
              className="text-[10.5px] font-medium uppercase leading-3"
              style={{ color: c.neutral[500], letterSpacing: '0.06em' }}
            >
              guests
            </span>
          </div>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full"
            style={{
              backgroundColor: c.trilha[500],
              opacity: value >= max ? 0.4 : 1,
            }}
            aria-label="Increase party size"
            disabled={value >= max}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M3 7 H11 M7 3 V11"
                stroke={c.neutral[0]}
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        className="border-t px-4 py-3"
        style={{ borderColor: c.neutral[100] }}
      >
        <p className="text-[12px] leading-[18px]" style={{ color: c.neutral[500] }}>
          Max party for this group: {max} hikers
          <span className="mx-1.5" style={{ color: c.neutral[300] }}>·</span>
          You can add up to {max - BOOKING.group.bookedSpots}.
        </p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Live price preview
// ─────────────────────────────────────────────────────────────────────────────

function PricePreview({ party, pricePer }: { party: number; pricePer: number }) {
  const total = party * pricePer;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease, delay: 0.3 }}
      className="mt-4 flex items-center justify-between rounded-lg px-4 py-2.5"
      style={{ backgroundColor: c.neutral[100] }}
    >
      <p className="text-[12.5px] leading-5" style={{ color: c.neutral[600] }}>
        <span style={{ fontFamily: monoFont, color: c.neutral[800] }}>
          {party}
        </span>{' '}
        guests ×{' '}
        <span style={{ fontFamily: monoFont, color: c.neutral[800] }}>
          R$ {pricePer}
        </span>
      </p>
      <p
        className="text-[14px] font-semibold leading-5"
        style={{ color: c.neutral[900], fontFamily: monoFont }}
      >
        R$ {total}
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sticky bottom CTA
// ─────────────────────────────────────────────────────────────────────────────

function StickyBottomCTA({ party, total }: { party: number; total: number }) {
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
            {party} guests
          </p>
          <p
            className="mt-1 text-[18px] font-semibold leading-5"
            style={{ color: c.neutral[900], fontFamily: monoFont }}
          >
            R$ {total}
            <span
              className="ml-1 text-[12px] font-normal"
              style={{ color: c.neutral[500] }}
            >
              total
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

export default function BookingPartyScreen() {
  const isGroup = SELECTED_MODE === 'group';
  const pricePer = isGroup ? BOOKING.group.pricePerPerson : BOOKING.private.flatPrice;
  const total = isGroup ? pricePer * PARTY_SIZE : BOOKING.private.flatPrice;

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        backgroundColor: c.neutral[50],
        color: c.neutral[900],
        fontFamily: sansFont,
      }}
    >
      {/* dim strip */}
      <div
        className="h-6 w-full"
        style={{
          background:
            'linear-gradient(to bottom, rgba(35,32,22,0.18), rgba(35,32,22,0))',
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

        <div className="mt-5 px-4">
          <SectionHeading>Hike type</SectionHeading>
          <div className="mt-3 space-y-2.5">
            <GroupCard selected={isGroup} />
            <PrivateCard selected={!isGroup} />
          </div>
        </div>

        <div className="mt-6 px-4">
          <SectionHeading>Party</SectionHeading>
          <div className="mt-3">
            <PartyStepper value={PARTY_SIZE} max={BOOKING.group.maxParty - BOOKING.group.bookedSpots + PARTY_SIZE} />
          </div>
          {isGroup && (
            <PricePreview party={PARTY_SIZE} pricePer={pricePer} />
          )}
        </div>
      </div>

      <StickyBottomCTA party={PARTY_SIZE} total={total} />
    </div>
  );
}
