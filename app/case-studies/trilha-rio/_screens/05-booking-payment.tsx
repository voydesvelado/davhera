'use client';

/**
 * Screen: Booking Sheet — Step 3 · Payment + confirm
 * Flow: Trust-mediated booking (Flow 1)
 * Chapter: booking-flow (autoplay, step 3 of 3)
 * JTBD: When I commit to the booking, I want to pay with a credit card on a
 *       platform that protects me if the guide doesn't show, so I am not handing
 *       cash to someone I have never met.
 *
 * Key design decisions:
 * 1. Review state, not card-entry state. The card has been stored (or just
 *    entered above the fold of the autoplay sub-flow); this screen's job is to
 *    confirm the math, surface the refund policy, and convert intent. A live
 *    Stripe Element form would crowd the trust surface that matters more.
 * 2. Apple Pay express button anchors the payment section. Hannah's persona is
 *    on iPhone; Apple Pay is the realistic one-tap path. Saved Visa is the
 *    fallback below with a "Change" affordance.
 * 3. Order is decomposed plainly: trail line, service fee line, total. No
 *    hidden fees, no asterisks. The math is the trust signal.
 * 4. Currency shown as primary R$ with USD in parentheses. A toggle was
 *    considered and rejected — it adds chrome where the math wants quiet.
 * 5. Cancellation policy lives in a success-tinted chip directly above the CTA.
 *    The single line "Free cancellation until Mar 13, 6:00 AM" answers the
 *    biggest pre-pay anxiety in two seconds.
 * 6. The pay button reads "Pay R$ 516," not "Continue" or "Confirm." This is
 *    the final action; it deserves explicit language.
 *
 * Trade-offs considered:
 * - Full Stripe Elements card form (rejected): more realistic for an empty-state
 *   screen, but the design argument here is trust + decomposition, not form
 *   discipline. Card entry would be the dominant moment, eclipsing the order
 *   summary that the case wants to highlight.
 * - Currency toggle chip in the order header (rejected): chrome.
 * - "Tip your guide" inline option (rejected): not the moment. Tips happen
 *   post-hike, in the review flow (out of scope for this case).
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
  success: { 100: '#DDEBE3', 500: '#1E7A4F', 700: '#125837' },
};

const monoFont = '"Geist Mono", ui-monospace, "SF Mono", monospace';
const sansFont = '"Geist Sans", system-ui, -apple-system, "Segoe UI", sans-serif';
const ease: [number, number, number, number] = [0.25, 1, 0.5, 1];

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const ORDER = {
  trail: 'Pedra da Gávea',
  guide: 'Rodrigo Silva',
  date: 'Sat, Mar 14',
  time: '6:00 AM',
  party: 2,
  pricePerPerson: 240,
  serviceFee: 36,
  get subtotal() {
    return this.party * this.pricePerPerson;
  },
  get total() {
    return this.subtotal + this.serviceFee;
  },
  totalUSD: 103,
};

const SAVED_CARD = {
  brand: 'Visa',
  last4: '4242',
  expMonth: 8,
  expYear: 27,
};

// ─────────────────────────────────────────────────────────────────────────────
// Atoms
// ─────────────────────────────────────────────────────────────────────────────

function StepIndicator() {
  const total = 3;
  const current = 3;
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

function SectionHeading({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h3
        className="text-[11px] font-semibold uppercase leading-4"
        style={{ color: c.neutral[500], letterSpacing: '0.08em' }}
      >
        {children}
      </h3>
      {action}
    </div>
  );
}

function VisaLogo() {
  return (
    <svg width="32" height="20" viewBox="0 0 36 22" fill="none" aria-hidden>
      <rect width="36" height="22" rx="3" fill="#1A1F71" />
      <path
        d="M14.5 7.5 L11.5 14.5 H9.8 L8.3 9 C8.2 8.6 8 8.5 7.6 8.4 C7 8.2 6 8 5 7.9 L5 7.5 H7.8 C8.2 7.5 8.5 7.8 8.6 8.2 L9.4 12.2 L11.4 7.5 H14.5 Z"
        fill="white"
      />
      <path
        d="M18.5 7.5 H20.2 L18.8 14.5 H17.1 L18.5 7.5 Z"
        fill="white"
      />
      <path
        d="M27.5 7.5 H26 C25.6 7.5 25.3 7.6 25.2 8 L22.7 14.5 H24.4 L24.8 13.5 H26.8 L27 14.5 H28.5 L27.5 7.5 Z M25.2 12.3 L26.1 9.7 L26.6 12.3 H25.2 Z"
        fill="white"
      />
      <path
        d="M21.8 7.5 L20.1 14.5 H21.8 L23.5 7.5 H21.8 Z"
        fill="white"
        opacity="0"
      />
    </svg>
  );
}

function AppleLogo({ size = 14, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 20 24" fill={color} aria-hidden>
      <path d="M14.6 12.5c0-2.7 2.2-4 2.3-4.1-1.3-1.8-3.2-2.1-3.9-2.1-1.7-.2-3.3 1-4.1 1-.9 0-2.1-1-3.5-1-1.8 0-3.5 1.1-4.4 2.7-1.9 3.3-.5 8.2 1.3 10.9.9 1.3 2 2.8 3.4 2.7 1.4 0 1.9-.9 3.5-.9 1.6 0 2.1.9 3.5.9 1.5 0 2.4-1.3 3.3-2.7 1-1.5 1.5-3 1.5-3.1-.1-.1-2.9-1.1-2.9-4.3zM12 4.5c.7-.9 1.2-2.1 1.1-3.4-1.1.1-2.4.7-3.2 1.6-.7.8-1.3 2.1-1.1 3.3 1.2.1 2.5-.6 3.2-1.5z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sheet header
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
            {ORDER.trail}
          </p>
          <p className="text-[12px] leading-4" style={{ color: c.neutral[500] }}>
            with {ORDER.guide}
            <span className="mx-1.5" style={{ color: c.neutral[300] }}>·</span>
            <span style={{ fontFamily: monoFont, color: c.neutral[600] }}>
              {ORDER.date}
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
// Order summary
// ─────────────────────────────────────────────────────────────────────────────

function OrderSummary() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.08 }}
      className="rounded-xl"
      style={{
        backgroundColor: c.neutral[0],
        border: `1px solid ${c.neutral[200]}`,
      }}
    >
      <div className="px-4 py-3.5">
        {/* line 1: trail */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className="text-[14px] font-semibold leading-5"
              style={{ color: c.neutral[900], letterSpacing: '-0.005em' }}
            >
              {ORDER.trail}, group hike
            </p>
            <p
              className="mt-0.5 text-[12px] leading-[18px]"
              style={{ color: c.neutral[500] }}
            >
              <span style={{ fontFamily: monoFont, color: c.neutral[600] }}>
                {ORDER.date} · {ORDER.time}
              </span>
              <span className="mx-1.5" style={{ color: c.neutral[300] }}>·</span>
              {ORDER.party} guests × R$ {ORDER.pricePerPerson}
            </p>
          </div>
          <p
            className="shrink-0 text-[14px] font-semibold leading-5"
            style={{ color: c.neutral[900], fontFamily: monoFont }}
          >
            R$ {ORDER.subtotal}
          </p>
        </div>
        {/* line 2: service fee */}
        <div
          className="mt-3 flex items-center justify-between border-t pt-3"
          style={{ borderColor: c.neutral[100] }}
        >
          <div className="flex items-center gap-1.5">
            <p
              className="text-[13px] leading-5"
              style={{ color: c.neutral[600] }}
            >
              Trilha service fee
            </p>
            <button
              type="button"
              className="flex h-4 w-4 items-center justify-center rounded-full"
              style={{ backgroundColor: c.neutral[100] }}
              aria-label="What is the service fee"
            >
              <span
                className="text-[10px] font-semibold leading-none"
                style={{ color: c.neutral[500] }}
              >
                ?
              </span>
            </button>
          </div>
          <p
            className="text-[13px] leading-5"
            style={{ color: c.neutral[700], fontFamily: monoFont }}
          >
            R$ {ORDER.serviceFee}
          </p>
        </div>
        {/* total */}
        <div
          className="mt-3 flex items-baseline justify-between border-t pt-3"
          style={{ borderColor: c.neutral[100] }}
        >
          <p
            className="text-[13px] font-semibold leading-5"
            style={{ color: c.neutral[900] }}
          >
            Total
          </p>
          <div className="text-right">
            <p
              className="text-[20px] font-semibold leading-6"
              style={{ color: c.neutral[900], fontFamily: monoFont, letterSpacing: '-0.01em' }}
            >
              R$ {ORDER.total}
            </p>
            <p
              className="mt-0.5 text-[11px] leading-4"
              style={{ color: c.neutral[500] }}
            >
              ~${ORDER.totalUSD} USD
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Payment method block
// ─────────────────────────────────────────────────────────────────────────────

function PaymentMethod() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.16 }}
      className="space-y-3"
    >
      {/* Apple Pay express */}
      <button
        type="button"
        className="flex h-12 w-full items-center justify-center gap-1.5 rounded-xl"
        style={{
          backgroundColor: c.neutral[900],
          color: c.neutral[0],
        }}
        aria-label="Pay with Apple Pay"
      >
        <AppleLogo size={14} color={c.neutral[0]} />
        <span className="text-[15px] font-semibold leading-5">Pay</span>
      </button>

      {/* divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ backgroundColor: c.neutral[200] }} />
        <span
          className="text-[10.5px] font-medium uppercase leading-3"
          style={{ color: c.neutral[400], letterSpacing: '0.08em' }}
        >
          or pay with card
        </span>
        <div className="h-px flex-1" style={{ backgroundColor: c.neutral[200] }} />
      </div>

      {/* Saved card */}
      <div
        className="flex items-center justify-between rounded-xl px-4 py-3"
        style={{
          backgroundColor: c.neutral[0],
          border: `1px solid ${c.neutral[200]}`,
        }}
      >
        <div className="flex items-center gap-3">
          <VisaLogo />
          <div>
            <p
              className="text-[13.5px] font-semibold leading-5"
              style={{ color: c.neutral[900] }}
            >
              {SAVED_CARD.brand}
              <span
                className="ml-1 font-normal"
                style={{ color: c.neutral[500] }}
              >
                ending in
              </span>{' '}
              <span style={{ fontFamily: monoFont }}>{SAVED_CARD.last4}</span>
            </p>
            <p
              className="mt-0.5 text-[11px] leading-4"
              style={{ color: c.neutral[500], fontFamily: monoFont }}
            >
              Expires {String(SAVED_CARD.expMonth).padStart(2, '0')}/
              {String(SAVED_CARD.expYear).padStart(2, '0')}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="text-[12.5px] font-semibold leading-4"
          style={{ color: c.trilha[600] }}
        >
          Change
        </button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cancellation policy chip
// ─────────────────────────────────────────────────────────────────────────────

function CancellationChip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.24 }}
      className="flex items-start gap-2.5 rounded-xl px-3.5 py-3"
      style={{
        backgroundColor: c.success[100],
        border: `1px solid ${c.success[500]}33`,
      }}
    >
      <div
        className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: c.success[500] }}
      >
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path
            d="M2.5 5 L4.2 6.7 L7.5 3.4"
            stroke={c.neutral[0]}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="min-w-0">
        <p
          className="text-[12.5px] font-semibold leading-[17px]"
          style={{ color: c.success[700] }}
        >
          Free cancellation until Mar 13, 6:00 AM
        </p>
        <p
          className="mt-0.5 text-[11.5px] leading-[16px]"
          style={{ color: c.success[700], opacity: 0.85 }}
        >
          50% refund until 6 AM Mar 14. No refund after start time.
          <span
            className="ml-1 underline underline-offset-2"
            style={{ color: c.success[700] }}
          >
            Full policy
          </span>
        </p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer reassurance
// ─────────────────────────────────────────────────────────────────────────────

function FooterReassurance() {
  return (
    <p
      className="px-1 text-[11px] leading-[16px]"
      style={{ color: c.neutral[400] }}
    >
      Card charged when your guide confirms within 2 hours. If we can&apos;t confirm,
      you are not charged.
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
        className="flex h-13 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold leading-5"
        style={{
          height: 52,
          backgroundColor: c.trilha[500],
          color: c.neutral[0],
          boxShadow: '0 4px 12px rgba(43,103,112,0.22)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M3.5 6.5 V4.2 A3.5 3.5 0 0 1 10.5 4.2 V6.5"
            stroke={c.neutral[0]}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <rect
            x="2.5"
            y="6.3"
            width="9"
            height="6.4"
            rx="1.4"
            stroke={c.neutral[0]}
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
        Pay <span style={{ fontFamily: monoFont }}>R$ {ORDER.total}</span>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function BookingPaymentScreen() {
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
      {/* sheet */}
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
          <SectionHeading>Order</SectionHeading>
          <div className="mt-3">
            <OrderSummary />
          </div>
        </div>

        <div className="mt-6 px-4">
          <SectionHeading>Pay with</SectionHeading>
          <div className="mt-3">
            <PaymentMethod />
          </div>
        </div>

        <div className="mt-5 px-4">
          <CancellationChip />
        </div>

        <div className="mt-3 px-4">
          <FooterReassurance />
        </div>
      </div>

      <StickyBottomCTA />
    </div>
  );
}
