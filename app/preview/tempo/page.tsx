import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";

export const metadata: Metadata = {
  title: "Tempo · Case preview · David Herrera",
};

// ─── Case content ───────────────────────────────────────────────────

const overview = [
  {
    title: "Project Overview",
    body: "Tempo helps users manage tasks, track progress, and stay organized through a clean, distraction-free interface. The concept centers on giving people a calm, structured view of their day — every project, deadline, and meeting visible at a glance without the noise of a typical productivity tool.",
  },
  {
    title: "Design Approach",
    body: "The AI-driven workflow brings better prioritization, while a card-based layout makes information easy to scan and act on. From project tracking to daily scheduling, everything is structured to improve focus, clarity, and productivity — soft pastel categories carry meaning without competing for attention.",
  },
];

const highlights = [
  {
    name: "AI-Powered Workflow Management",
    desc: "Smart prioritization that learns from your patterns and surfaces what matters next.",
  },
  {
    name: "Clean & Minimal Dashboard",
    desc: "A distraction-free interface that keeps active projects and progress front and center.",
  },
  {
    name: "Visual Progress Tracking",
    desc: "Striped progress bars and per-project percentages keep momentum visible without extra effort.",
  },
  {
    name: "Organized Daily Schedule",
    desc: "Meetings, reminders, and deliverables collected in one calm, glanceable view.",
  },
  {
    name: "Smooth User Experience",
    desc: "Card-based interactions that feel responsive, tactile, and effortless on mobile.",
  },
];

// ─── Page ───────────────────────────────────────────────────────────

export default function TempoPreviewPage() {
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
              Case Study · Tempo
            </p>

            <h1
              className="mt-4 text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.05] text-stone-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Tempo
            </h1>

            <p className="mt-4 text-base lg:text-lg text-stone-500 leading-relaxed">
              A smart and intuitive task management mobile app designed to
              simplify daily workflows with the power of AI.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Tag>Product Design</Tag>
              <Tag>UI/UX</Tag>
              <Tag>Mobile</Tag>
              <Tag>AI</Tag>
              <Tag>Productivity</Tag>
            </div>

            <div className="mt-12 space-y-10">
              {overview.map((s) => (
                <article key={s.title}>
                  <h2 className="text-[11px] font-semibold tracking-[0.18em] text-[#5A4AD1] uppercase">
                    {s.title}
                  </h2>
                  <p className="mt-3 text-[15px] lg:text-base text-stone-600 leading-[1.7]">
                    {s.body}
                  </p>
                </article>
              ))}

              <article>
                <h2 className="text-[11px] font-semibold tracking-[0.18em] text-[#5A4AD1] uppercase">
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
                <h2 className="text-[11px] font-semibold tracking-[0.18em] text-[#5A4AD1] uppercase">
                  User Impact
                </h2>
                <p className="mt-3 text-[15px] lg:text-base text-stone-600 leading-[1.7]">
                  Built to help users manage work smarter and stay in control of
                  their day — turning a long to-do list into a confident,
                  structured plan.
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
            <TempoScreen />
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
  // Same minimal shell used across /preview cases: white body, subtle shadow,
  // thin inner bezel. Descendants use cqw units so the UI scales with width.
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
          className="absolute overflow-hidden bg-white"
          style={{
            inset: "2.5cqw",
            borderRadius: "9.2cqw",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Phone screen ───────────────────────────────────────────────────

const NAV_DARK = "#1B2440";

const tasks: TaskCardData[] = [
  {
    title: "Qudra Website Design",
    date: "15 September | 11:00 AM",
    percent: 50,
    track: "#E2D9F2",
    fill: "#B9A4E3",
    text: "#3D2F6E",
  },
  {
    title: "Medix App",
    date: "05 August | 08:00 PM",
    percent: 75,
    track: "#F1E6C0",
    fill: "#D4BC72",
    text: "#5C4A1A",
  },
  {
    title: "Fintech App Design & Dev.",
    date: "12 November | 08:00 AM",
    percent: 30,
    track: "#D2E2CE",
    fill: "#8FB68A",
    text: "#2F4F2C",
  },
  {
    title: "Ameer Website Redesign",
    date: "16 August | 10:00 PM",
    percent: 80,
    track: "#C3CDC7",
    fill: "#7C8F89",
    text: "#2E3A36",
    avatars: ["#D8A48F", "#C2A687", "#8E7C70"],
  },
];

type TaskCardData = {
  title: string;
  date: string;
  percent: number;
  track: string;
  fill: string;
  text: string;
  avatars?: string[];
};

function TempoScreen() {
  return (
    <div
      className="relative w-full h-full bg-white"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Status bar */}
      <div
        className="absolute top-0 left-0 right-0 flex justify-between items-center text-stone-900"
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

      {/* Page content */}
      <div
        className="absolute inset-0"
        style={{ padding: "13cqw 5.5cqw 0 5.5cqw" }}
      >
        {/* Greeting + Bell + Plus */}
        <div className="flex items-center justify-between">
          <p
            className="text-stone-900"
            style={{ fontSize: "4.6cqw" }}
          >
            <span className="font-light text-stone-500">Hello,</span>{" "}
            <span className="font-semibold">Alex !</span>
          </p>
          <div className="flex items-center" style={{ gap: "2.4cqw" }}>
            <button
              className="relative bg-white rounded-full flex items-center justify-center"
              style={{
                width: "10.5cqw",
                height: "10.5cqw",
                boxShadow:
                  "0 0 0 1px rgba(15,23,42,0.06), 0 1cqw 3cqw rgba(15,23,42,0.05)",
              }}
            >
              <BellIcon />
              <span
                className="absolute font-semibold text-white rounded-full flex items-center justify-center"
                style={{
                  top: "-0.4cqw",
                  right: "-0.4cqw",
                  width: "4.4cqw",
                  height: "4.4cqw",
                  fontSize: "2.4cqw",
                  background: NAV_DARK,
                }}
              >
                2
              </span>
            </button>
            <button
              className="rounded-full flex items-center justify-center"
              style={{
                width: "10.5cqw",
                height: "10.5cqw",
                background: NAV_DARK,
              }}
            >
              <PlusIcon />
            </button>
          </div>
        </div>

        {/* Main heading */}
        <h2
          className="font-semibold leading-[1.1] text-stone-900"
          style={{
            marginTop: "5cqw",
            fontSize: "8.4cqw",
            fontFamily: "var(--font-display)",
          }}
        >
          Manage Your Daily
          <br />
          Workflow{" "}
          <span className="text-stone-900 font-semibold">(4)</span>
        </h2>

        {/* Task grid */}
        <div
          className="grid grid-cols-2"
          style={{ marginTop: "5cqw", gap: "3cqw" }}
        >
          {tasks.map((t) => (
            <TaskCard key={t.title} data={t} />
          ))}
        </div>

        {/* Today's Schedule header */}
        <div
          className="flex items-end justify-between"
          style={{ marginTop: "5.5cqw" }}
        >
          <h3
            className="font-semibold text-stone-900"
            style={{ fontSize: "4.6cqw", fontFamily: "var(--font-display)" }}
          >
            Today&rsquo;s Schedule
          </h3>
          <button
            className="text-stone-500 font-medium"
            style={{ fontSize: "3.2cqw" }}
          >
            See More
          </button>
        </div>

        {/* Meeting card */}
        <div
          className="bg-white"
          style={{
            marginTop: "3cqw",
            borderRadius: "5cqw",
            padding: "4cqw",
            boxShadow:
              "0 0 0 1px rgba(15,23,42,0.05), 0 1.5cqw 4cqw rgba(15,23,42,0.04)",
          }}
        >
          <div className="flex items-center" style={{ gap: "1.6cqw" }}>
            <CalendarOutlineIcon size="3.4cqw" />
            <span
              className="text-stone-500 font-medium"
              style={{ fontSize: "3cqw" }}
            >
              Meeting
            </span>
          </div>
          <div
            className="flex items-center justify-between"
            style={{ marginTop: "1.6cqw" }}
          >
            <div>
              <p
                className="font-semibold text-stone-900"
                style={{ fontSize: "4.2cqw" }}
              >
                Adam Zlotnik
              </p>
              <p
                className="text-stone-400"
                style={{ marginTop: "0.8cqw", fontSize: "3cqw" }}
              >
                Today 06:30 PM
              </p>
            </div>
            <div className="flex items-center" style={{ gap: "2cqw" }}>
              <AvatarStack
                colors={["#D8A48F", "#C2A687", "#8E7C70"]}
                size="6cqw"
                ring="white"
              />
              <button
                className="text-white font-medium rounded-full"
                style={{
                  background: NAV_DARK,
                  padding: "2.4cqw 3.6cqw",
                  fontSize: "3cqw",
                }}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav (floating) */}
      <BottomNav />
    </div>
  );
}

function TaskCard({ data }: { data: TaskCardData }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: data.track,
        borderRadius: "4.5cqw",
        padding: "3.5cqw",
        minHeight: "32cqw",
      }}
    >
      <p
        className="font-semibold leading-[1.15]"
        style={{
          fontSize: "3.6cqw",
          color: data.text,
          fontFamily: "var(--font-display)",
        }}
      >
        {data.title}
      </p>

      <div
        className="flex items-center"
        style={{ marginTop: "2.5cqw", gap: "1.4cqw" }}
      >
        <CalendarOutlineIcon size="2.8cqw" color={data.text} opacity={0.65} />
        <span
          style={{
            fontSize: "2.5cqw",
            color: data.text,
            opacity: 0.75,
          }}
        >
          {data.date}
        </span>
      </div>

      {data.avatars ? (
        <div style={{ marginTop: "2.5cqw" }}>
          <AvatarStack colors={data.avatars} size="5cqw" ring={data.track} />
        </div>
      ) : null}

      {/* Progress */}
      <div
        className="flex items-center"
        style={{ marginTop: "auto", gap: "2cqw", paddingTop: "2.5cqw" }}
      >
        <div
          className="flex-1 rounded-full overflow-hidden"
          style={{ height: "2.2cqw", background: "rgba(255,255,255,0.45)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${data.percent}%`,
              background: `repeating-linear-gradient(-45deg, ${data.fill} 0, ${data.fill} 1.4cqw, rgba(255,255,255,0.55) 1.4cqw, rgba(255,255,255,0.55) 2.4cqw)`,
            }}
          />
        </div>
        <span
          className="font-semibold"
          style={{ fontSize: "2.8cqw", color: data.text }}
        >
          {data.percent}%
        </span>
      </div>
    </div>
  );
}

function AvatarStack({
  colors,
  size,
  ring,
}: {
  colors: string[];
  size: string;
  ring: string;
}) {
  return (
    <div className="flex" style={{ marginLeft: `calc(${size} * 0.3)` }}>
      {colors.map((c, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: size,
            height: size,
            background: c,
            marginLeft: `calc(${size} * -0.3)`,
            boxShadow: `0 0 0 0.5cqw ${ring}`,
            zIndex: colors.length - i,
            position: "relative",
          }}
        />
      ))}
    </div>
  );
}

function BottomNav() {
  return (
    <div
      className="absolute left-0 right-0 flex items-center"
      style={{ bottom: "3.5cqw", padding: "0 5cqw", gap: "2.2cqw" }}
    >
      <button
        className="rounded-full flex items-center justify-center shrink-0"
        style={{
          width: "13cqw",
          height: "13cqw",
          background: NAV_DARK,
          boxShadow: "0 2cqw 6cqw rgba(15,23,42,0.18)",
        }}
      >
        <HomeIcon color="white" size="5.4cqw" />
      </button>
      <div
        className="flex-1 flex items-center justify-around bg-white rounded-full"
        style={{
          padding: "3.2cqw 0",
          boxShadow:
            "0 0 0 1px rgba(15,23,42,0.04), 0 2cqw 6cqw rgba(15,23,42,0.06)",
        }}
      >
        <CalendarOutlineIcon size="5cqw" color="#5F6B7C" />
        <ChartIcon />
        <UserIcon />
      </div>
    </div>
  );
}

// ─── Icons (inline SVG) ─────────────────────────────────────────────

function SignalIcon() {
  return (
    <svg
      style={{ width: "4.4cqw", height: "3.2cqw" }}
      viewBox="0 0 18 12"
      fill="currentColor"
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
      fill="currentColor"
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
      <rect
        x="0.5"
        y="0.5"
        width="22"
        height="11"
        rx="3"
        stroke="currentColor"
        opacity="0.5"
      />
      <rect x="24" y="4" width="1.6" height="4" rx="0.8" fill="currentColor" opacity="0.5" />
      <rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      style={{ width: "5cqw", height: "5cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1A2233"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 7H4c0-1 2-2 2-7z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      style={{ width: "5.4cqw", height: "5.4cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CalendarOutlineIcon({
  size = "5cqw",
  color = "#5F6B7C",
  opacity = 1,
}: {
  size?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      style={{ width: size, height: size, opacity }}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <line x1="3.5" y1="10" x2="20.5" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      style={{ width: "5cqw", height: "5cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#5F6B7C"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3,17 9,11 13,15 21,7" />
      <polyline points="15,7 21,7 21,13" />
    </svg>
  );
}

function HomeIcon({
  color = "white",
  size = "5cqw",
}: {
  color?: string;
  size?: string;
}) {
  return (
    <svg
      style={{ width: size, height: size }}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 11 L 12 3.5 L 21 11 V 20 a 1 1 0 0 1 -1 1 h-5 v -6 h -4 v 6 H 5 a 1 1 0 0 1 -1 -1 V 11" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      style={{ width: "5cqw", height: "5cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#5F6B7C"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </svg>
  );
}
