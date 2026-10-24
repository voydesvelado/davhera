import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";

export const metadata: Metadata = {
  title: "Finfex · Case preview · David Herrera",
};

// ─── Case content ───────────────────────────────────────────────────

const overview = [
  {
    title: "Project Overview",
    body: "A modern digital debit card interface designed for Finfex, focusing on clarity, accessibility, and everyday financial actions. The screen highlights balance visibility, quick actions, and categorized spending within a clean, dark-themed fintech experience.",
  },
  {
    title: "Design Approach",
    body: "A confident dark surface paired with a single high-energy lime accent keeps focus on the user's money and the actions they're about to take. Every primary task — checking balance, sending, adding, reviewing categories — sits within one tap of the home screen, and the card itself anchors the visual hierarchy as the brand's hero element.",
  },
];

const highlights = [
  {
    name: "Card-First Balance",
    desc: "A textured yellow debit card anchors the screen and surfaces total balance, last four, and expiry in one glance.",
  },
  {
    name: "Quick Money Actions",
    desc: "Send Money and Add Money sit side by side at the top — the two most common tasks always one tap away.",
  },
  {
    name: "Categorized Spending",
    desc: "Entertainment, Grocery, Education, and Transportation each get their own colored card so spend by category is instantly readable.",
  },
  {
    name: "Dark-Theme Confidence",
    desc: "High-contrast type and a single saturated accent keep the interface calm at night without feeling sterile.",
  },
  {
    name: "Accessible Hierarchy",
    desc: "Large numerals for amounts, generous tap targets, and a fixed bottom nav that keeps navigation predictable.",
  },
];

// ─── Page ───────────────────────────────────────────────────────────

export default function FinfexPreviewPage() {
  return (
    <main
      className="min-h-dvh w-full bg-white text-stone-900"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="lg:flex lg:items-start">
        {/* ─── Left: case content (scrolls with page) ─── */}
        <section
          className="
            lg:flex-1 lg:min-w-0
            px-8 sm:px-12 lg:px-12 xl:px-16
            pt-12 lg:pt-20
            pb-16 lg:pb-24
          "
        >
          <div className="max-w-[44ch]">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-stone-400 uppercase">
              Case Study · Finfex
            </p>

            <h1
              className="mt-4 text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.05] text-stone-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Finfex
            </h1>

            <p className="mt-4 text-base lg:text-lg text-stone-500 leading-relaxed">
              A modern digital debit card interface focused on clarity,
              accessibility, and the everyday financial actions that matter
              most.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Tag>Product Design</Tag>
              <Tag>UI/UX</Tag>
              <Tag>Mobile</Tag>
              <Tag>Fintech</Tag>
              <Tag>Dark UI</Tag>
            </div>

            <div className="mt-12 space-y-10">
              {overview.map((s) => (
                <article key={s.title}>
                  <h2 className="text-[11px] font-semibold tracking-[0.18em] text-[#9CB300] uppercase">
                    {s.title}
                  </h2>
                  <p className="mt-3 text-[15px] lg:text-base text-stone-600 leading-[1.7]">
                    {s.body}
                  </p>
                </article>
              ))}

              <article>
                <h2 className="text-[11px] font-semibold tracking-[0.18em] text-[#9CB300] uppercase">
                  Key Highlights
                </h2>
                <ul className="mt-4 space-y-4">
                  {highlights.map((h) => (
                    <li key={h.name} className="flex gap-3">
                      <span className="mt-[10px] block h-1 w-1 shrink-0 rounded-full bg-stone-400" />
                      <div>
                        <p className="text-[15px] lg:text-base font-semibold text-stone-900">
                          {h.name}
                        </p>
                        <p className="mt-1 text-[14px] lg:text-[15px] text-stone-500 leading-[1.65]">
                          {h.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>

              <article>
                <h2 className="text-[11px] font-semibold tracking-[0.18em] text-[#9CB300] uppercase">
                  User Impact
                </h2>
                <p className="mt-3 text-[15px] lg:text-base text-stone-600 leading-[1.7]">
                  Finfex turns the home screen of a banking app into a
                  confident, single-glance dashboard — balance, quick actions,
                  and spending categories surfaced exactly where they need to
                  be, without the visual noise that usually weighs fintech
                  interfaces down.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ─── Right: gray panel with phone (sticky) ─── */}
        <aside
          className="
            lg:sticky lg:top-0 lg:self-start
            shrink-0
            bg-[#EAEAEA]
            w-full lg:w-[64.8vw]
            h-[min(100dvw,640px)] lg:h-dvh
            flex items-center justify-center
            px-4 lg:px-6
          "
        >
          <PhoneFrame>
            <FinfexScreen />
          </PhoneFrame>
        </aside>
      </div>
    </main>
  );
}

// ─── Reusable bits ──────────────────────────────────────────────────

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="px-2.5 py-1 text-[11px] font-medium text-stone-600 bg-stone-100 rounded-full border border-stone-200">
      {children}
    </span>
  );
}

function PhoneFrame({ children }: { children: ReactNode }) {
  // Same minimal shell used across /preview cases.
  return (
    <div
      className="relative shrink-0 max-w-full"
      style={{
        aspectRatio: "390 / 844",
        height: "min(1040px, calc(100dvh * 0.86))",
        containerType: "inline-size",
      } as CSSProperties}
    >
      <div
        className="absolute inset-0 bg-white"
        style={{
          borderRadius: "11.3cqw",
          boxShadow:
            "0 0 0 1px rgba(28,25,23,0.06), 0 20px 60px -15px rgba(28,25,23,0.18)",
        }}
      >
        <div
          className="absolute overflow-hidden"
          style={{
            inset: "2.5cqw",
            borderRadius: "9.2cqw",
            background: "#0E1011",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Phone screen ───────────────────────────────────────────────────

const LIME = "#D2FF3A";
const CARD_YELLOW = "#E2FF1A";
const SURFACE = "#1A1C1E";
const SURFACE_2 = "#212427";

const categories = [
  {
    name: "Entertainment",
    amount: "$2694",
    icon: <CupIcon />,
    bg: "rgba(210,255,58,0.18)",
    fg: LIME,
  },
  {
    name: "Grocery",
    amount: "$2368",
    icon: <UtensilsIcon />,
    bg: "rgba(56,143,40,0.25)",
    fg: "#7FCE5A",
  },
  {
    name: "Education",
    amount: "$1469",
    icon: <BookIcon />,
    bg: "rgba(255,138,40,0.18)",
    fg: "#FF9F45",
  },
  {
    name: "Transportation",
    amount: "$1243",
    icon: <BusIcon />,
    bg: "rgba(210,255,58,0.18)",
    fg: LIME,
  },
];

function FinfexScreen() {
  return (
    <div
      className="relative w-full h-full text-white"
      style={{ fontFamily: "var(--font-body)", background: "#0E1011" }}
    >
      {/* Status bar */}
      <div
        className="absolute top-0 left-0 right-0 flex justify-between items-center text-white"
        style={{ padding: "3.6cqw 8cqw 0 8cqw" }}
      >
        <span className="font-semibold" style={{ fontSize: "4.1cqw" }}>
          9:41
        </span>
        <div className="flex items-center" style={{ gap: "1.6cqw" }}>
          <SignalIcon />
          <WifiIcon />
          <BatteryIcon />
        </div>
      </div>

      {/* Content */}
      <div
        className="absolute inset-0"
        style={{ padding: "12cqw 5.5cqw 0 5.5cqw" }}
      >
        {/* Header: title + bell + dots */}
        <div className="flex items-center justify-between">
          <h1
            className="font-semibold"
            style={{
              fontSize: "6.4cqw",
              fontFamily: "var(--font-display)",
            }}
          >
            My Card
          </h1>
          <div className="flex items-center" style={{ gap: "2.4cqw" }}>
            <button
              className="relative rounded-full flex items-center justify-center"
              style={{
                width: "10.5cqw",
                height: "10.5cqw",
                background: SURFACE,
              }}
            >
              <BellIcon />
              <span
                className="absolute rounded-full"
                style={{
                  top: "2cqw",
                  right: "2.8cqw",
                  width: "1.8cqw",
                  height: "1.8cqw",
                  background: LIME,
                }}
              />
            </button>
            <button
              className="rounded-full flex items-center justify-center"
              style={{
                width: "10.5cqw",
                height: "10.5cqw",
                background: SURFACE,
              }}
            >
              <DotsVerticalIcon />
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div
          className="flex items-center"
          style={{ marginTop: "5cqw", gap: "3cqw" }}
        >
          <button
            className="flex-1 rounded-full flex items-center justify-center font-semibold text-[#0E1011] whitespace-nowrap"
            style={{
              padding: "2.6cqw 3cqw",
              gap: "2cqw",
              fontSize: "3.4cqw",
              background: "#FFFFFF",
            }}
          >
            <span
              className="rounded-full flex items-center justify-center"
              style={{ width: "6.8cqw", height: "6.8cqw", background: "#F1F3F2" }}
            >
              <PaperPlaneIcon />
            </span>
            Send Money
          </button>
          <button
            className="flex-1 rounded-full flex items-center justify-center font-semibold text-[#0E1011] whitespace-nowrap"
            style={{
              padding: "2.6cqw 3cqw",
              gap: "2cqw",
              fontSize: "3.4cqw",
              background: LIME,
            }}
          >
            <span
              className="rounded-full flex items-center justify-center"
              style={{
                width: "6.8cqw",
                height: "6.8cqw",
                background: "rgba(14,16,17,0.08)",
              }}
            >
              <PlusIcon stroke="#0E1011" />
            </span>
            Add Money
          </button>
        </div>

        {/* Debit card */}
        <DebitCard />

        {/* View All */}
        <div
          className="flex justify-end"
          style={{ marginTop: "2.5cqw" }}
        >
          <button
            className="font-medium italic"
            style={{ fontSize: "3cqw", color: LIME }}
          >
            View All
          </button>
        </div>

        {/* Categories Expenses */}
        <h2
          className="font-semibold"
          style={{
            marginTop: "3cqw",
            fontSize: "5cqw",
            fontFamily: "var(--font-display)",
          }}
        >
          Categories Expenses
        </h2>

        <div
          className="grid grid-cols-2"
          style={{ marginTop: "3.2cqw", gap: "2.6cqw" }}
        >
          {categories.map((c) => (
            <CategoryCard key={c.name} data={c} />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function DebitCard() {
  return (
    <div
      className="relative overflow-hidden text-[#0E1011]"
      style={{
        marginTop: "4cqw",
        borderRadius: "5cqw",
        padding: "4.5cqw 4.5cqw 5cqw 4.5cqw",
        height: "53cqw",
        background: CARD_YELLOW,
      }}
    >
      {/* Noise / grain overlay */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: "multiply", opacity: 0.35 }}
      >
        <filter id="finfex-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
          <feColorMatrix
            values="0 0 0 0 0.05  0 0 0 0 0.05  0 0 0 0 0.05  0 0 0 0.35 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#finfex-grain)" />
      </svg>

      {/* Top row: mastercard logo + debit label */}
      <div className="relative flex items-start justify-between">
        <Mastercard />
        <p className="font-medium" style={{ fontSize: "3.6cqw" }}>
          Debit Card
        </p>
      </div>

      {/* Card number */}
      <p
        className="relative font-semibold tracking-[0.05em]"
        style={{ marginTop: "7cqw", fontSize: "4.2cqw" }}
      >
        ****&nbsp;&nbsp;****&nbsp;&nbsp;****&nbsp;&nbsp;
        <span className="tracking-[0.25em]">9865</span>
      </p>

      {/* Bottom row */}
      <div
        className="relative flex items-end justify-between"
        style={{ marginTop: "5.5cqw" }}
      >
        <div>
          <p
            className="opacity-65"
            style={{ fontSize: "3cqw", fontWeight: 500 }}
          >
            Total Balance
          </p>
          <p
            className="font-bold"
            style={{
              fontSize: "8.2cqw",
              marginTop: "0.4cqw",
              fontFamily: "var(--font-display)",
            }}
          >
            $8269
          </p>
        </div>
        <div className="text-right" style={{ paddingBottom: "1.4cqw" }}>
          <p
            className="opacity-65"
            style={{ fontSize: "3cqw", fontWeight: 500 }}
          >
            Valid Thu
          </p>
          <p
            className="font-semibold"
            style={{ fontSize: "4cqw", marginTop: "0.6cqw" }}
          >
            07/28
          </p>
        </div>
      </div>
    </div>
  );
}

function Mastercard() {
  return (
    <svg
      style={{ width: "11cqw", height: "7cqw" }}
      viewBox="0 0 40 24"
      aria-hidden="true"
    >
      <circle cx="15" cy="12" r="10" fill="#EA0028" />
      <circle cx="25" cy="12" r="10" fill="#F79E1B" />
      <path
        d="M20 4 a 10 10 0 0 1 0 16 a 10 10 0 0 1 0 -16 Z"
        fill="#FF5F00"
      />
    </svg>
  );
}

function CategoryCard({
  data,
}: {
  data: {
    name: string;
    amount: string;
    icon: ReactNode;
    bg: string;
    fg: string;
  };
}) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: SURFACE,
        borderRadius: "4.5cqw",
        padding: "3.6cqw 3.6cqw 3.8cqw 3.6cqw",
        minHeight: "26cqw",
      }}
    >
      <div className="flex items-center" style={{ gap: "2.2cqw" }}>
        <span
          className="rounded-full flex items-center justify-center"
          style={{
            width: "7.2cqw",
            height: "7.2cqw",
            background: data.bg,
            color: data.fg,
          }}
        >
          {data.icon}
        </span>
        <span
          className="font-medium text-white"
          style={{ fontSize: "3.2cqw" }}
        >
          {data.name}
        </span>
      </div>
      <p
        className="font-bold text-white"
        style={{
          marginTop: "3.5cqw",
          fontSize: "6.4cqw",
          fontFamily: "var(--font-display)",
        }}
      >
        {data.amount}
      </p>
    </div>
  );
}

function BottomNav() {
  return (
    <div
      className="absolute left-0 right-0 flex items-center justify-around"
      style={{
        bottom: "3.5cqw",
        margin: "0 5cqw",
        padding: "2.2cqw 4cqw",
        background: SURFACE_2,
        borderRadius: "999px",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.04), 0 2cqw 6cqw rgba(0,0,0,0.4)",
      }}
    >
      <NavIcon active={false}>
        <NavHomeIcon />
      </NavIcon>
      <NavIcon active={true}>
        <CardIcon color="#0E1011" />
      </NavIcon>
      <NavIcon active={false}>
        <MoneyBagIcon />
      </NavIcon>
      <NavIcon active={false}>
        <BarsIcon />
      </NavIcon>
      <NavIcon active={false}>
        <RobotIcon />
      </NavIcon>
    </div>
  );
}

function NavIcon({
  children,
  active,
}: {
  children: ReactNode;
  active: boolean;
}) {
  return (
    <span
      className="rounded-full flex items-center justify-center"
      style={{
        width: "10.5cqw",
        height: "10.5cqw",
        background: active ? LIME : "transparent",
      }}
    >
      {children}
    </span>
  );
}

// ─── Icons (inline SVG) ─────────────────────────────────────────────

function SignalIcon() {
  return (
    <svg
      style={{ width: "4.4cqw", height: "3.2cqw" }}
      viewBox="0 0 18 12"
      fill="white"
      aria-hidden="true"
    >
      <rect x="0" y="8" width="3" height="4" rx="0.5" />
      <rect x="5" y="5" width="3" height="7" rx="0.5" />
      <rect x="10" y="2" width="3" height="10" rx="0.5" />
      <rect x="15" y="0" width="3" height="12" rx="0.5" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg
      style={{ width: "4cqw", height: "3.2cqw" }}
      viewBox="0 0 16 12"
      fill="white"
      aria-hidden="true"
    >
      <path d="M8 11.5 L 6.2 9.3 a 2.5 2.5 0 0 1 3.6 0 Z" />
      <path d="M11.4 7.7 a 5 5 0 0 0 -6.8 0 l 1.1 1.1 a 3.5 3.5 0 0 1 4.6 0 Z" />
      <path d="M13.7 5.4 a 8.5 8.5 0 0 0 -11.4 0 l 1.1 1.1 a 7 7 0 0 1 9.2 0 Z" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg
      style={{ width: "7cqw", height: "3.4cqw" }}
      viewBox="0 0 26 12"
      fill="none"
      aria-hidden="true"
    >
      <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="white" opacity="0.55" />
      <rect x="24" y="4" width="1.6" height="4" rx="0.8" fill="white" opacity="0.55" />
      <rect x="2" y="2" width="19" height="8" rx="1.5" fill="white" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      style={{ width: "5cqw", height: "5cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 7H4c0-1 2-2 2-7z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

function DotsVerticalIcon() {
  return (
    <svg
      style={{ width: "5cqw", height: "5cqw" }}
      viewBox="0 0 24 24"
      fill="white"
      aria-hidden="true"
    >
      <circle cx="12" cy="5.5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="18.5" r="1.6" />
    </svg>
  );
}

function PaperPlaneIcon() {
  return (
    <svg
      style={{ width: "4cqw", height: "4cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0E1011"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 11.5 L21 3 L15 21 L11.5 13 Z" />
      <line x1="11.5" y1="13" x2="21" y2="3" />
    </svg>
  );
}

function PlusIcon({ stroke = "white" }: { stroke?: string }) {
  return (
    <svg
      style={{ width: "4.2cqw", height: "4.2cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CupIcon() {
  return (
    <svg
      style={{ width: "4cqw", height: "4cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 8 h12 v6 a4 4 0 0 1 -4 4 h -4 a 4 4 0 0 1 -4 -4 z" />
      <path d="M17 10 h2 a2 2 0 0 1 0 4 h -2" />
      <line x1="8" y1="3" x2="8" y2="5.5" />
      <line x1="11" y1="3" x2="11" y2="5.5" />
      <line x1="14" y1="3" x2="14" y2="5.5" />
    </svg>
  );
}

function UtensilsIcon() {
  return (
    <svg
      style={{ width: "4cqw", height: "4cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3 v18" />
      <path d="M9 3 v5 a 3 3 0 0 1 -6 0 v -5" />
      <path d="M18 3 v18" />
      <path d="M21 3 c0 4 -3 5 -3 9 h6 c0 -4 -3 -5 -3 -9" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      style={{ width: "4cqw", height: "4cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 5 a 2 2 0 0 1 2 -2 h 12 a 2 2 0 0 1 2 2 v 14 a 2 2 0 0 1 -2 2 H 6 a 2 2 0 0 1 -2 -2 z" />
      <line x1="8" y1="3" x2="8" y2="21" />
    </svg>
  );
}

function BusIcon() {
  return (
    <svg
      style={{ width: "4cqw", height: "4cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="5" width="16" height="12" rx="2.5" />
      <line x1="4" y1="11" x2="20" y2="11" />
      <line x1="8" y1="17" x2="8" y2="19.5" />
      <line x1="16" y1="17" x2="16" y2="19.5" />
      <circle cx="8" cy="14" r="0.8" fill="currentColor" />
      <circle cx="16" cy="14" r="0.8" fill="currentColor" />
    </svg>
  );
}

function NavHomeIcon() {
  return (
    <svg
      style={{ width: "5.4cqw", height: "5.4cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 11 L 12 3.5 L 21 11 V 20 a 1 1 0 0 1 -1 1 h-5 v -6 h -4 v 6 H 5 a 1 1 0 0 1 -1 -1 V 11" />
    </svg>
  );
}

function CardIcon({ color = "white" }: { color?: string }) {
  return (
    <svg
      style={{ width: "5.4cqw", height: "5.4cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <line x1="3" y1="11" x2="21" y2="11" />
      <line x1="7" y1="15.5" x2="11" y2="15.5" />
    </svg>
  );
}

function MoneyBagIcon() {
  return (
    <svg
      style={{ width: "5.4cqw", height: "5.4cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 3 h6 l -1 3 h -4 z" />
      <path d="M8 6 c -3 3 -4 8 -4 11 a 5 5 0 0 0 5 4 h 6 a 5 5 0 0 0 5 -4 c 0 -3 -1 -8 -4 -11 z" />
      <path d="M12 11 v6" />
      <path d="M10.5 12.5 h3 a 1.4 1.4 0 0 1 0 2.8 h -3 a 1.4 1.4 0 0 0 0 2.8 h 3" />
    </svg>
  );
}

function BarsIcon() {
  return (
    <svg
      style={{ width: "5.4cqw", height: "5.4cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="6" y1="20" x2="6" y2="13" />
      <line x1="12" y1="20" x2="12" y2="8" />
      <line x1="18" y1="20" x2="18" y2="4" />
    </svg>
  );
}

function RobotIcon() {
  return (
    <svg
      style={{ width: "5.4cqw", height: "5.4cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="7" width="16" height="12" rx="3" />
      <line x1="12" y1="3" x2="12" y2="7" />
      <circle cx="9" cy="13" r="1.2" fill="white" />
      <circle cx="15" cy="13" r="1.2" fill="white" />
      <line x1="2.5" y1="13" x2="4" y2="13" />
      <line x1="20" y1="13" x2="21.5" y2="13" />
    </svg>
  );
}
