'use client';

/**
 * Trilha Rio — case study page
 *
 * Renders the case study using CasePreviewLayout. Four chapters:
 *
 *   1. discovery       (scroll)        → 01-browse.tsx
 *   2. trail-detail    (scroll)        → 02-trail-detail.tsx
 *   3. booking-flow    (autoplay × 3)  → 03-booking-date.tsx
 *                                       04-booking-party.tsx
 *                                       05-booking-payment.tsx
 *                                       durations: 5500ms / 6000ms / 7000ms
 *   4. meeting-point   (scroll)        → 06-meeting-point.tsx
 */

import * as React from 'react';
import {
  CasePreviewLayout,
  type Chapter,
} from '@/components/preview/CasePreviewLayoutV2';

import BrowseScreen from './_screens/01-browse';
import TrailDetailScreen from './_screens/02-trail-detail';
import BookingDateScreen from './_screens/03-booking-date';
import BookingPartyScreen from './_screens/04-booking-party';
import BookingPaymentScreen from './_screens/05-booking-payment';
import MeetingPointScreen from './_screens/06-meeting-point';

// ─────────────────────────────────────────────────────────────────────────────
// Shared tokens (mirrored from 03_tokens.ts for inline consumption)
// ─────────────────────────────────────────────────────────────────────────────

const c = {
  trilha: { 50: '#F0F6F7', 500: '#2B6770', 600: '#1F4E55', 700: '#173A40', 800: '#112B30' },
  neutral: { 0: '#FFFFFF', 50: '#FAFAF7', 100: '#F2F1ED', 200: '#E5E3DC', 300: '#C9C6BB', 400: '#9C988B', 500: '#6E6B5F', 600: '#4F4D44', 700: '#36352F', 800: '#232220', 900: '#131311' },
  sandstone: { 300: '#E4C7A4', 500: '#C68A56' },
};

const fontSans =
  '"Geist Sans", system-ui, -apple-system, "Segoe UI", sans-serif';
const fontMono =
  '"Geist Mono", ui-monospace, "SF Mono", monospace';

// ─────────────────────────────────────────────────────────────────────────────
// Typography atoms — single source for all case copy styling
// ─────────────────────────────────────────────────────────────────────────────

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block"
      style={{
        fontFamily: fontSans,
        fontSize: 11.5,
        lineHeight: '16px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: c.neutral[500],
      }}
    >
      {children}
    </span>
  );
}

function TagDot() {
  return (
    <span
      className="mx-2 inline-block align-middle"
      style={{
        width: 3,
        height: 3,
        borderRadius: '50%',
        backgroundColor: c.neutral[300],
      }}
      aria-hidden
    />
  );
}

function Eyebrow({ children, tone = 'brand' }: { children: React.ReactNode; tone?: 'brand' | 'muted' }) {
  return (
    <p
      style={{
        fontFamily: fontSans,
        fontSize: 11.5,
        lineHeight: '16px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: tone === 'brand' ? c.trilha[600] : c.neutral[500],
      }}
    >
      {children}
    </p>
  );
}

function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1
      style={{
        fontFamily: fontSans,
        fontSize: 56,
        lineHeight: '60px',
        fontWeight: 500,
        letterSpacing: '-0.025em',
        color: c.neutral[900],
        marginTop: 14,
      }}
    >
      {children}
    </h1>
  );
}

function Subtitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: fontSans,
        fontSize: 19,
        lineHeight: '28px',
        fontWeight: 400,
        color: c.neutral[600],
        letterSpacing: '-0.005em',
        marginTop: 16,
        maxWidth: '36ch',
      }}
    >
      {children}
    </p>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: fontSans,
        fontSize: 11.5,
        lineHeight: '16px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: c.neutral[500],
      }}
    >
      {children}
    </p>
  );
}

function ChapterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: fontSans,
        fontSize: 32,
        lineHeight: '38px',
        fontWeight: 500,
        letterSpacing: '-0.02em',
        color: c.neutral[900],
        marginTop: 8,
      }}
    >
      {children}
    </h2>
  );
}

function Body({ children, mt = 16 }: { children: React.ReactNode; mt?: number }) {
  return (
    <p
      style={{
        fontFamily: fontSans,
        fontSize: 17,
        lineHeight: '28px',
        fontWeight: 400,
        color: c.neutral[700],
        marginTop: mt,
        maxWidth: '38ch',
      }}
    >
      {children}
    </p>
  );
}

function BodySmall({ children, mt = 12 }: { children: React.ReactNode; mt?: number }) {
  return (
    <p
      style={{
        fontFamily: fontSans,
        fontSize: 15,
        lineHeight: '24px',
        fontWeight: 400,
        color: c.neutral[600],
        marginTop: mt,
        maxWidth: '40ch',
      }}
    >
      {children}
    </p>
  );
}

function Divider({ mt = 32, mb = 32 }: { mt?: number; mb?: number }) {
  return (
    <div
      style={{
        width: 48,
        height: 1,
        backgroundColor: c.neutral[200],
        marginTop: mt,
        marginBottom: mb,
      }}
      aria-hidden
    />
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return <span style={{ fontFamily: fontMono }}>{children}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Page header (top of left column)
// ─────────────────────────────────────────────────────────────────────────────

function HeaderBlock() {
  return (
    <div>
      {/* Tags */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <Tag>Design engineering</Tag>
        <TagDot />
        <Tag>Marketplace</Tag>
        <TagDot />
        <Tag>Mobile-first</Tag>
        <TagDot />
        <Tag>Solo · 2026</Tag>
      </div>

      <PageTitle>Trilha Rio</PageTitle>
      <Subtitle>
        A marketplace for guided Rio hikes, designed for a tourist with five days
        in the city and no Portuguese.
      </Subtitle>

      <Divider mt={48} mb={32} />

      <SectionLabel>Context</SectionLabel>
      <Body>
        Rio de Janeiro received <Mono>2.1 million</Mono> international visitors in
        2025, up <Mono>44.8%</Mono> year over year. Tijuca National Park alone
        draws <Mono>4.5 million</Mono> people. But for a tourist who wants to book
        one guided hike before their five-day trip ends, the path is broken:
        Reddit threads from 2019, Instagram bios in Portuguese, WhatsApp
        negotiations with strangers, cash payments at a 6 AM meeting point in a
        neighborhood they cannot pronounce.
      </Body>
      <Body mt={20}>
        The opportunity is not information — TripAdvisor covers the trails. The
        opportunity is trust and transaction. A marketplace with vetted guides,
        English-first UX, and protected payment converts where horizontal
        platforms cannot. Trilha Rio is that wedge, designed and shipped as a
        single-creator case study.
      </Body>

      <Divider mt={40} mb={32} />

      <SectionLabel>Research highlight</SectionLabel>
      <Body>
        Two insights shaped every screen.{' '}
        <span style={{ color: c.neutral[900], fontWeight: 500 }}>
          Trust is sold on the listing page, not on the homepage.
        </span>{' '}
        A foreign tourist gives the product 90 seconds to convince them on first
        open. If the listing does not communicate that the service is operated by
        real people with verifiable credentials, the tab closes.{' '}
        <span style={{ color: c.neutral[900], fontWeight: 500 }}>
          The post-booking confirmation is the most under-designed surface in the
          entire category
        </span>{' '}
        — and the screen where the marketplace can earn the value of being a
        marketplace, not a directory.
      </Body>

      <Divider mt={40} mb={32} />

      <SectionLabel>Design system note</SectionLabel>
      <Body>
        The visual system triangulates four references:{' '}
        <span style={{ color: c.neutral[900], fontWeight: 500 }}>Linear</span>{' '}
        for structural discipline,{' '}
        <span style={{ color: c.neutral[900], fontWeight: 500 }}>Stripe</span>{' '}
        for transactional confidence,{' '}
        <span style={{ color: c.neutral[900], fontWeight: 500 }}>Airbnb</span>{' '}
        for marketplace card vocabulary, and{' '}
        <span style={{ color: c.neutral[900], fontWeight: 500 }}>AllTrails</span>{' '}
        for trail-data specificity. The brand color is Trilha Teal — a mineral
        teal that evokes the Atlantic coast where Rio&apos;s most photographed hikes
        end, owned by nobody else in the category. Typography is Geist Sans for
        prose and Geist Mono for any numerical data the user might want to
        verify.
      </Body>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chapter copy components
// ─────────────────────────────────────────────────────────────────────────────

function DiscoveryCopy() {
  return (
    <div>
      <Eyebrow>Chapter 1 · Discovery</Eyebrow>
      <ChapterHeading>Curation is the moat</ChapterHeading>
      <Body>
        The catalog holds <Mono>17</Mono> trails. Not five hundred. Not even a
        hundred. Most platforms in this category surface as much inventory as
        their long-tail SEO can carry — and conversion suffers because the user
        cannot choose. Trilha Rio takes the opposite position. A curated set of
        named Rio trails, each with verified guides attached, lets the design
        privilege editorial confidence over search-result density. Featuring
        matters when curation is finite.
      </Body>
    </div>
  );
}

function TrailDetailCopy() {
  return (
    <div>
      <Eyebrow>Chapter 2 · Trail detail</Eyebrow>
      <ChapterHeading>Trust in ninety seconds</ChapterHeading>
      <Body>
        The trail page does five jobs at once: name the hike, name the technical
        section by its real name (<Mono>Carrasqueira, 30 m, grade 5.2</Mono>),
        surface every guide with a Cadastur badge, count reviews from foreign
        travelers separately, and price both group and private modes side by
        side. Each guide carries the same trust pattern, repeated three times on
        the page, so the user learns to scan it in two seconds. Photography sits
        beneath; data sits on top.
      </Body>
    </div>
  );
}

function BookingFlowFrame({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Eyebrow>Chapter 3 · Booking</Eyebrow>
      <ChapterHeading>One sheet, three decisions</ChapterHeading>
      <Body>
        A modal sheet, three sequential decisions, one running total. Date,
        party, payment. The user can move forward, move back, or change their
        mind. The math is shown plainly throughout — there is no surprise at the
        end.
      </Body>
      <Divider mt={28} mb={20} />
      {children}
    </div>
  );
}

function BookingStep1Copy() {
  return (
    <BookingFlowFrame>
      <Eyebrow tone="muted">Step 1 of 3 · Date</Eyebrow>
      <BodySmall mt={10}>
        Weather lives inside the date picker. The hike is a weather-bound
        activity; the calendar should treat it that way.
      </BodySmall>
    </BookingFlowFrame>
  );
}

function BookingStep2Copy() {
  return (
    <BookingFlowFrame>
      <Eyebrow tone="muted">Step 2 of 3 · Group or private</Eyebrow>
      <BodySmall mt={10}>
        Group is anchored, private is offered. Capacity is shown as a visual
        bar — <Mono>3 of 6</Mono> spots filled, <Mono>3</Mono> left.
      </BodySmall>
    </BookingFlowFrame>
  );
}

function BookingStep3Copy() {
  return (
    <BookingFlowFrame>
      <Eyebrow tone="muted">Step 3 of 3 · Payment</Eyebrow>
      <BodySmall mt={10}>
        Order decomposed, service fee shown, cancellation policy inline. The
        pay button reads <Mono>&quot;Pay R$ 516,&quot;</Mono> not &quot;Continue.&quot;
      </BodySmall>
    </BookingFlowFrame>
  );
}

function MeetingPointCopy() {
  return (
    <div>
      <Eyebrow>Chapter 4 · The meeting point</Eyebrow>
      <ChapterHeading>Where the marketplace earns its commission</ChapterHeading>
      <Body>
        At <Mono>5:15 AM</Mono> the user is standing on a road in Itanhangá.
        Every booking platform in the category gives them a confirmation email
        and a calendar invite. Trilha Rio gives them this screen: countdown,
        stylized map with a precise pin, transport ranked by realistic
        preference, hour-by-hour weather, a checklist they can tick as they
        pack, and the guide&apos;s last message visible without opening a thread. No
        incumbent treats this surface as a first-class screen. That is the
        argument of the case.
      </Body>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer (bottom of left column)
// ─────────────────────────────────────────────────────────────────────────────

function FooterBlock() {
  return (
    <div>
      <SectionLabel>Trade-offs and reflection</SectionLabel>
      <Body>
        The product as designed is the tourist side of the marketplace only.
        There is no guide dashboard, no listing creation flow, no admin tools. A
        real launch would require all three; the case study deliberately scopes
        them out to keep the design argument coherent.
      </Body>
      <Body mt={20}>
        Three trade-offs sit deeper inside the design. The{' '}
        <span style={{ color: c.neutral[900], fontWeight: 500 }}>
          Cadastur badge
        </span>{' '}
        expects the user either to recognize the word or to trust an unfamiliar
        acronym — a tooltip and an inline explainer compensate, but the right
        answer is empirical and would need a comparative test. The{' '}
        <span style={{ color: c.neutral[900], fontWeight: 500 }}>
          difficulty taxonomy
        </span>{' '}
        (Easy / Moderate / Challenging / Technical, four pips) was chosen over
        a numeric or YDS climbing-grade system; for the foreign-tourist audience
        the read is defensible, but climbers might want grades exposed. The{' '}
        <span style={{ color: c.neutral[900], fontWeight: 500 }}>
          packing list
        </span>{' '}
        pre-checks shoes and water but leaves the rest to the user, assuming a
        certain level of self-respect from the persona; an alternative version
        would auto-check the trail-specific essentials and let the user dismiss
        them.
      </Body>
      <Body mt={20}>
        Three metrics I would watch in the first ninety days:{' '}
        <Mono>search-to-listing conversion</Mono> (does the curated discovery
        thesis hold), <Mono>listing-to-booking conversion</Mono> (does the trust
        pattern on the trail detail convert at a higher rate than Airbnb
        Experiences for the same trails), and <Mono>no-show rate</Mono> (does
        the meeting point screen eliminate the most common failure mode). Of
        those, the third is the one the case is staked on.
      </Body>
      <Body mt={20}>
        If I were starting over, the change would be at the IA level: a
        guide-first discovery path parallel to the trail-first one. Hannah&apos;s
        persona shops trails; another persona — the repeat traveler, the
        climber, the photographer — shops guides. The marketplace should let
        both modes coexist.
      </Body>

      <Divider mt={48} mb={28} />

      <SectionLabel>Credits</SectionLabel>
      <BodySmall mt={14}>
        <span style={{ color: c.neutral[900], fontWeight: 500 }}>Role</span>
        {' — '}Single creator. Research, information architecture, visual
        system, components, copy in EN and ES.
      </BodySmall>
      <BodySmall mt={6}>
        <span style={{ color: c.neutral[900], fontWeight: 500 }}>Stack</span>
        {' — '}
        <Mono>
          Next.js · React · TypeScript · Tailwind CSS · Framer Motion
        </Mono>
        . Geist Sans + Geist Mono.
      </BodySmall>
      <BodySmall mt={6}>
        <span style={{ color: c.neutral[900], fontWeight: 500 }}>Notes</span>
        {' — '}Custom SVG silhouettes and stylized map. No external image
        dependencies; every visual self-contained.
      </BodySmall>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chapters (the body of the case)
// ─────────────────────────────────────────────────────────────────────────────

const chapters: Chapter[] = [
  {
    mode: 'scroll',
    id: 'discovery',
    content: <DiscoveryCopy />,
    screen: <BrowseScreen />,
  },
  {
    mode: 'scroll',
    id: 'trail-detail',
    content: <TrailDetailCopy />,
    screen: <TrailDetailScreen />,
  },
  {
    mode: 'autoplay',
    id: 'booking-flow',
    steps: [
      {
        id: 'date',
        content: <BookingStep1Copy />,
        screen: <BookingDateScreen />,
        durationMs: 5500,
      },
      {
        id: 'party',
        content: <BookingStep2Copy />,
        screen: <BookingPartyScreen />,
        durationMs: 6000,
      },
      {
        id: 'payment',
        content: <BookingStep3Copy />,
        screen: <BookingPaymentScreen />,
        durationMs: 7000,
      },
    ],
  },
  {
    mode: 'scroll',
    id: 'meeting-point',
    content: <MeetingPointCopy />,
    screen: <MeetingPointScreen />,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function TrilhaRioCasePage() {
  return (
    <CasePreviewLayout
      header={<HeaderBlock />}
      chapters={chapters}
      footer={<FooterBlock />}
      screenBackground={c.neutral[50]}
      panelBackground="#EAE6DD"
    />
  );
}
