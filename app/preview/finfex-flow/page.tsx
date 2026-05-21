"use client";

import type { ReactNode } from "react";
import {
  CasePreviewLayout,
  type Chapter,
} from "@/components/preview/CasePreviewLayout";

// ─── Shared tokens ──────────────────────────────────────────────────

const LIME = "#D2FF3A";
const CARD_YELLOW = "#E2FF1A";
const SURFACE = "#1A1C1E";
const SURFACE_2 = "#212427";
const BG = "#0E1011";
const ACCENT_TEXT = "#9CB300";

// ─── Page ───────────────────────────────────────────────────────────

export default function FinfexFlowPage() {
  const chapters: Chapter[] = [
    {
      id: "card",
      content: (
        <ChapterCopy
          eyebrow="Chapter 1"
          title="The card is the hero"
          body="The home screen leads with a yellow debit card that anchors the entire identity. Total balance, last four, and expiry are visible in a single glance, while Send Money and Add Money sit one tap away. Below the card, categorized spending stays scannable without competing with the hero element."
        />
      ),
      screen: <MyCardScreen />,
    },
    {
      id: "send",
      content: (
        <ChapterCopy
          eyebrow="Chapter 2"
          title="Sending money in three taps"
          body="Tapping Send Money opens a focused canvas: a single recipient pill, a giant amount field, and a custom keypad. Available balance sits right under the input so users never have to switch context to know what they can spend. The lime CTA only activates once a recipient and amount are set."
        />
      ),
      screen: <SendMoneyScreen />,
    },
    {
      id: "confirmed",
      content: (
        <ChapterCopy
          eyebrow="Chapter 3"
          title="Confirmation that reassures"
          body="After confirming, the success state takes over the full screen. A lime checkmark, the amount, and the recipient sit above a clean receipt card with everything a user needs to forward, screenshot, or reference later. The flow ends on a single decisive action — Done — that returns to the dashboard."
        />
      ),
      screen: <ConfirmedScreen />,
    },
  ];

  return (
    <CasePreviewLayout
      screenBackground={BG}
      header={
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-stone-400 uppercase">
            Case Study · Finfex Flow
          </p>
          <h1
            className="mt-4 text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.05] text-stone-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Finfex&nbsp;Flow
          </h1>
          <p className="mt-4 text-base lg:text-lg text-stone-500 leading-relaxed">
            Three connected screens of the Finfex send-money flow — designed
            around the same dark, lime-accented language used on the home
            dashboard. Scroll down to step through the flow on the phone.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Tag>Product Design</Tag>
            <Tag>UI/UX</Tag>
            <Tag>Mobile</Tag>
            <Tag>Fintech</Tag>
            <Tag>Flow Design</Tag>
          </div>
        </div>
      }
      chapters={chapters}
      footer={
        <article>
          <h2
            className="text-[11px] font-semibold tracking-[0.18em] uppercase"
            style={{ color: ACCENT_TEXT }}
          >
            What this flow proves
          </h2>
          <p className="mt-3 text-[15px] lg:text-base text-stone-600 leading-[1.7]">
            Three screens, one visual language. The dark surface, lime accent,
            and yellow card move with the user from dashboard to amount entry
            to confirmation. The page itself is a single sticky phone — only
            the screen inside changes — so the reader feels the flow rather
            than just reads about it.
          </p>
        </article>
      }
    />
  );
}

function ChapterCopy({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <article>
      <p
        className="text-[11px] font-semibold tracking-[0.22em] uppercase"
        style={{ color: ACCENT_TEXT }}
      >
        {eyebrow}
      </p>
      <h2
        className="mt-2 text-2xl xl:text-3xl font-semibold tracking-tight text-stone-900"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      <p className="mt-3 text-[15px] lg:text-base text-stone-600 leading-[1.7]">
        {body}
      </p>
    </article>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="px-2.5 py-1 text-[11px] font-medium text-stone-600 bg-stone-100 rounded-full border border-stone-200">
      {children}
    </span>
  );
}

// ───────────────────────────────────────────────────────────────────
// Screen 1 — My Card (Finfex home)
// ───────────────────────────────────────────────────────────────────

const categories = [
  { name: "Entertainment", amount: "$2694", icon: <CupIcon />, bg: "rgba(210,255,58,0.18)", fg: LIME },
  { name: "Grocery", amount: "$2368", icon: <UtensilsIcon />, bg: "rgba(56,143,40,0.25)", fg: "#7FCE5A" },
  { name: "Education", amount: "$1469", icon: <BookIcon />, bg: "rgba(255,138,40,0.18)", fg: "#FF9F45" },
  { name: "Transportation", amount: "$1243", icon: <BusIcon />, bg: "rgba(210,255,58,0.18)", fg: LIME },
];

function MyCardScreen() {
  return (
    <div
      className="relative w-full h-full text-white"
      style={{ fontFamily: "var(--font-body)", background: BG }}
    >
      <StatusBar />

      <div
        className="absolute inset-0"
        style={{ padding: "12cqw 5.5cqw 0 5.5cqw" }}
      >
        <div className="flex items-center justify-between">
          <h1
            className="font-semibold"
            style={{ fontSize: "6.4cqw", fontFamily: "var(--font-display)" }}
          >
            My Card
          </h1>
          <div className="flex items-center" style={{ gap: "2.4cqw" }}>
            <IconButton>
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
            </IconButton>
            <IconButton>
              <DotsVerticalIcon />
            </IconButton>
          </div>
        </div>

        <div
          className="flex items-center"
          style={{ marginTop: "5cqw", gap: "3cqw" }}
        >
          <ActionPill background="#FFFFFF" iconBg="#F1F3F2">
            <PaperPlaneIcon />
            <span>Send Money</span>
          </ActionPill>
          <ActionPill background={LIME} iconBg="rgba(14,16,17,0.08)">
            <PlusIcon stroke="#0E1011" />
            <span>Add Money</span>
          </ActionPill>
        </div>

        <DebitCard />

        <div className="flex justify-end" style={{ marginTop: "2.5cqw" }}>
          <button
            className="font-medium italic"
            style={{ fontSize: "3cqw", color: LIME }}
          >
            View All
          </button>
        </div>

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

      <BottomNav active="card" />
    </div>
  );
}

function ActionPill({
  children,
  background,
  iconBg,
}: {
  children: ReactNode;
  background: string;
  iconBg: string;
}) {
  const items = Array.isArray(children) ? children : [children];
  const [icon, label] = items;
  return (
    <button
      className="flex-1 rounded-full flex items-center justify-center font-semibold text-[#0E1011] whitespace-nowrap"
      style={{
        padding: "2.6cqw 3cqw",
        gap: "2cqw",
        fontSize: "3.4cqw",
        background,
      }}
    >
      <span
        className="rounded-full flex items-center justify-center"
        style={{ width: "6.8cqw", height: "6.8cqw", background: iconBg }}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}

function IconButton({ children }: { children: ReactNode }) {
  return (
    <button
      className="relative rounded-full flex items-center justify-center"
      style={{ width: "10.5cqw", height: "10.5cqw", background: SURFACE }}
    >
      {children}
    </button>
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
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: "multiply", opacity: 0.35 }}
      >
        <filter id="finfex-flow-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
          <feColorMatrix values="0 0 0 0 0.05  0 0 0 0 0.05  0 0 0 0 0.05  0 0 0 0.35 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#finfex-flow-grain)" />
      </svg>

      <div className="relative flex items-start justify-between">
        <Mastercard />
        <p className="font-medium" style={{ fontSize: "3.6cqw" }}>
          Debit Card
        </p>
      </div>

      <p
        className="relative font-semibold tracking-[0.05em]"
        style={{ marginTop: "7cqw", fontSize: "4.2cqw" }}
      >
        ****&nbsp;&nbsp;****&nbsp;&nbsp;****&nbsp;&nbsp;
        <span className="tracking-[0.25em]">9865</span>
      </p>

      <div
        className="relative flex items-end justify-between"
        style={{ marginTop: "5.5cqw" }}
      >
        <div>
          <p className="opacity-65" style={{ fontSize: "3cqw", fontWeight: 500 }}>
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
          <p className="opacity-65" style={{ fontSize: "3cqw", fontWeight: 500 }}>
            Valid Thu
          </p>
          <p className="font-semibold" style={{ fontSize: "4cqw", marginTop: "0.6cqw" }}>
            07/28
          </p>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({
  data,
}: {
  data: { name: string; amount: string; icon: ReactNode; bg: string; fg: string };
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
        <span className="font-medium text-white" style={{ fontSize: "3.2cqw" }}>
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

// ───────────────────────────────────────────────────────────────────
// Screen 2 — Send Money
// ───────────────────────────────────────────────────────────────────

function SendMoneyScreen() {
  const keys: Array<{ label: ReactNode; sub?: string; isBackspace?: boolean }> = [
    { label: "1" },
    { label: "2", sub: "ABC" },
    { label: "3", sub: "DEF" },
    { label: "4", sub: "GHI" },
    { label: "5", sub: "JKL" },
    { label: "6", sub: "MNO" },
    { label: "7", sub: "PQRS" },
    { label: "8", sub: "TUV" },
    { label: "9", sub: "WXYZ" },
    { label: "." },
    { label: "0" },
    { label: <BackspaceIcon />, isBackspace: true },
  ];

  return (
    <div
      className="relative w-full h-full text-white"
      style={{ fontFamily: "var(--font-body)", background: BG }}
    >
      <StatusBar />

      <div
        className="absolute inset-0"
        style={{ padding: "12cqw 5.5cqw 0 5.5cqw" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <IconButton>
            <BackArrowIcon />
          </IconButton>
          <p
            className="font-semibold"
            style={{ fontSize: "4.4cqw", fontFamily: "var(--font-display)" }}
          >
            Send Money
          </p>
          <IconButton>
            <CloseIcon />
          </IconButton>
        </div>

        {/* Recipient */}
        <p
          className="font-medium uppercase tracking-[0.18em] text-stone-400"
          style={{ marginTop: "6cqw", fontSize: "2.6cqw" }}
        >
          Send to
        </p>
        <div
          className="flex items-center"
          style={{
            marginTop: "2.2cqw",
            gap: "3cqw",
            padding: "3cqw 3.5cqw",
            background: SURFACE,
            borderRadius: "999px",
          }}
        >
          <span
            className="rounded-full flex items-center justify-center font-semibold"
            style={{
              width: "9cqw",
              height: "9cqw",
              background: "linear-gradient(135deg, #D2FF3A 0%, #94B812 100%)",
              color: "#0E1011",
              fontSize: "3.6cqw",
            }}
          >
            SK
          </span>
          <div className="flex-1">
            <p className="font-semibold" style={{ fontSize: "3.6cqw" }}>
              Sara Kim
            </p>
            <p className="text-stone-400" style={{ fontSize: "2.8cqw", marginTop: "0.2cqw" }}>
              Chase •••• 4421
            </p>
          </div>
          <ChevronRightIcon />
        </div>

        {/* Amount */}
        <div
          className="text-center"
          style={{ marginTop: "8cqw" }}
        >
          <p
            className="font-medium uppercase tracking-[0.18em] text-stone-400"
            style={{ fontSize: "2.6cqw" }}
          >
            Amount
          </p>
          <p
            className="font-bold inline-flex items-center justify-center"
            style={{
              marginTop: "3cqw",
              fontSize: "14cqw",
              lineHeight: 1,
              fontFamily: "var(--font-display)",
              gap: "1cqw",
            }}
          >
            <span style={{ color: "#5B6168", fontSize: "9cqw" }}>$</span>
            <span>240</span>
            <span
              className="inline-block"
              style={{
                width: "0.6cqw",
                height: "12cqw",
                background: LIME,
                marginLeft: "0.8cqw",
                animation: "finfex-cursor 1s steps(1) infinite",
              }}
            />
          </p>
          <p
            className="text-stone-400"
            style={{ marginTop: "2.4cqw", fontSize: "3cqw" }}
          >
            Available <span className="text-white font-semibold">$8,269.00</span>
          </p>
        </div>

        {/* Keypad */}
        <div
          className="grid grid-cols-3"
          style={{ marginTop: "6cqw", gap: "1.6cqw" }}
        >
          {keys.map((k, i) => (
            <button
              key={i}
              className="rounded-2xl flex flex-col items-center justify-center font-semibold"
              style={{
                padding: "2.2cqw 0",
                fontSize: "5.6cqw",
                fontFamily: "var(--font-display)",
                background: "transparent",
                color: "white",
                minHeight: "11cqw",
              }}
            >
              {k.label}
              {k.sub ? (
                <span
                  className="text-stone-400 font-medium tracking-[0.2em]"
                  style={{ fontSize: "1.8cqw", marginTop: "0.2cqw" }}
                >
                  {k.sub}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Send CTA */}
        <button
          className="absolute left-0 right-0 mx-auto font-semibold flex items-center justify-center"
          style={{
            bottom: "18cqw",
            width: "calc(100% - 11cqw)",
            padding: "4cqw 0",
            background: LIME,
            color: "#0E1011",
            borderRadius: "999px",
            fontSize: "4cqw",
            gap: "2cqw",
          }}
        >
          <PaperPlaneIcon />
          Send $240
        </button>
      </div>

      <BottomNav active="card" />

      <style>{`@keyframes finfex-cursor { 50% { opacity: 0; } }`}</style>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// Screen 3 — Transaction Confirmed
// ───────────────────────────────────────────────────────────────────

function ConfirmedScreen() {
  return (
    <div
      className="relative w-full h-full text-white"
      style={{ fontFamily: "var(--font-body)", background: BG }}
    >
      <StatusBar />

      <div
        className="absolute inset-0 flex flex-col"
        style={{ padding: "16cqw 5.5cqw 0 5.5cqw" }}
      >
        {/* Checkmark */}
        <div className="flex justify-center" style={{ marginTop: "4cqw" }}>
          <span
            className="rounded-full flex items-center justify-center relative"
            style={{
              width: "22cqw",
              height: "22cqw",
              background: LIME,
              boxShadow: "0 0 0 4cqw rgba(210,255,58,0.12), 0 0 0 9cqw rgba(210,255,58,0.05)",
            }}
          >
            <CheckIcon />
          </span>
        </div>

        {/* Title */}
        <p
          className="text-center font-semibold"
          style={{
            marginTop: "8cqw",
            fontSize: "6cqw",
            fontFamily: "var(--font-display)",
          }}
        >
          Transaction Successful
        </p>
        <p
          className="text-center text-stone-400"
          style={{ marginTop: "1.5cqw", fontSize: "3.4cqw" }}
        >
          Sent to <span className="text-white font-medium">Sara Kim</span>
        </p>

        {/* Amount */}
        <p
          className="text-center font-bold"
          style={{
            marginTop: "5cqw",
            fontSize: "13cqw",
            lineHeight: 1,
            fontFamily: "var(--font-display)",
          }}
        >
          <span style={{ color: "#5B6168", fontSize: "8cqw" }}>$</span>
          240<span style={{ color: "#5B6168", fontSize: "6cqw", marginLeft: "0.5cqw" }}>.00</span>
        </p>

        {/* Receipt */}
        <div
          style={{
            marginTop: "7cqw",
            background: SURFACE,
            borderRadius: "4.5cqw",
            padding: "4cqw 4.5cqw",
          }}
        >
          <ReceiptRow label="From" value="My Card •••• 9865" />
          <ReceiptDivider />
          <ReceiptRow label="To" value="Sara Kim · Chase •••• 4421" />
          <ReceiptDivider />
          <ReceiptRow label="Date" value="Today, 9:41 AM" />
          <ReceiptDivider />
          <ReceiptRow label="Reference" value="#FNX-19282" mono />
        </div>

        {/* Buttons */}
        <div
          className="flex items-center"
          style={{ marginTop: "auto", marginBottom: "21cqw", gap: "2.6cqw" }}
        >
          <button
            className="flex-1 rounded-full font-semibold flex items-center justify-center"
            style={{
              padding: "3.4cqw 0",
              background: "transparent",
              color: "white",
              border: "1px solid rgba(255,255,255,0.18)",
              fontSize: "3.6cqw",
              gap: "1.6cqw",
            }}
          >
            <ShareIcon /> Share Receipt
          </button>
          <button
            className="flex-1 rounded-full font-semibold flex items-center justify-center"
            style={{
              padding: "3.4cqw 0",
              background: LIME,
              color: "#0E1011",
              fontSize: "3.6cqw",
            }}
          >
            Done
          </button>
        </div>
      </div>

      <BottomNav active="card" />
    </div>
  );
}

function ReceiptRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ padding: "2cqw 0" }}
    >
      <span className="text-stone-400" style={{ fontSize: "3cqw" }}>
        {label}
      </span>
      <span
        className="font-medium"
        style={{
          fontSize: "3.2cqw",
          fontFamily: mono ? "var(--font-mono)" : undefined,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function ReceiptDivider() {
  return (
    <div
      style={{
        height: "1px",
        background: "rgba(255,255,255,0.05)",
      }}
    />
  );
}

// ─── Bottom nav (shared across all 3 screens) ───────────────────────

type NavId = "home" | "card" | "money" | "bars" | "robot";

function BottomNav({ active }: { active: NavId }) {
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
      <NavIcon active={active === "home"}>
        <NavHomeIcon active={active === "home"} />
      </NavIcon>
      <NavIcon active={active === "card"}>
        <CardIcon color={active === "card" ? "#0E1011" : "white"} />
      </NavIcon>
      <NavIcon active={active === "money"}>
        <MoneyBagIcon />
      </NavIcon>
      <NavIcon active={active === "bars"}>
        <BarsIcon />
      </NavIcon>
      <NavIcon active={active === "robot"}>
        <RobotIcon />
      </NavIcon>
    </div>
  );
}

function NavIcon({ children, active }: { children: ReactNode; active: boolean }) {
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

// ─── Status bar ─────────────────────────────────────────────────────

function StatusBar() {
  return (
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
  );
}

// ─── Icons ──────────────────────────────────────────────────────────

function SignalIcon() {
  return (
    <svg style={{ width: "4.4cqw", height: "3.2cqw" }} viewBox="0 0 18 12" fill="white" aria-hidden="true">
      <rect x="0" y="8" width="3" height="4" rx="0.5" />
      <rect x="5" y="5" width="3" height="7" rx="0.5" />
      <rect x="10" y="2" width="3" height="10" rx="0.5" />
      <rect x="15" y="0" width="3" height="12" rx="0.5" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg style={{ width: "4cqw", height: "3.2cqw" }} viewBox="0 0 16 12" fill="white" aria-hidden="true">
      <path d="M8 11.5 L 6.2 9.3 a 2.5 2.5 0 0 1 3.6 0 Z" />
      <path d="M11.4 7.7 a 5 5 0 0 0 -6.8 0 l 1.1 1.1 a 3.5 3.5 0 0 1 4.6 0 Z" />
      <path d="M13.7 5.4 a 8.5 8.5 0 0 0 -11.4 0 l 1.1 1.1 a 7 7 0 0 1 9.2 0 Z" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg style={{ width: "7cqw", height: "3.4cqw" }} viewBox="0 0 26 12" fill="none" aria-hidden="true">
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
    <svg style={{ width: "5cqw", height: "5cqw" }} viewBox="0 0 24 24" fill="white" aria-hidden="true">
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

function BackArrowIcon() {
  return (
    <svg
      style={{ width: "5cqw", height: "5cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="11 18 5 12 11 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      style={{ width: "4.6cqw", height: "4.6cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      style={{ width: "4cqw", height: "4cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8E9398"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

function BackspaceIcon() {
  return (
    <svg
      style={{ width: "5.2cqw", height: "5.2cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 6 H 10 L 4 12 l 6 6 H 22 a 2 2 0 0 0 2 -2 V 8 a 2 2 0 0 0 -2 -2 z" />
      <line x1="14" y1="10" x2="18" y2="14" />
      <line x1="18" y1="10" x2="14" y2="14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      style={{ width: "11cqw", height: "11cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0E1011"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="5 12 10 17 19 7" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      style={{ width: "3.6cqw", height: "3.6cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <line x1="8.3" y1="11" x2="15.7" y2="7.2" />
      <line x1="8.3" y1="13" x2="15.7" y2="16.8" />
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

function NavHomeIcon({ active = false }: { active?: boolean }) {
  return (
    <svg
      style={{ width: "5.4cqw", height: "5.4cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#0E1011" : "white"}
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

function Mastercard() {
  return (
    <svg style={{ width: "11cqw", height: "7cqw" }} viewBox="0 0 40 24" aria-hidden="true">
      <circle cx="15" cy="12" r="10" fill="#EA0028" />
      <circle cx="25" cy="12" r="10" fill="#F79E1B" />
      <path d="M20 4 a 10 10 0 0 1 0 16 a 10 10 0 0 1 0 -16 Z" fill="#FF5F00" />
    </svg>
  );
}
