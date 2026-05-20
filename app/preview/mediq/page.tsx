import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";

export const metadata: Metadata = {
  title: "MediQ · Case preview · David Herrera",
};

// ─── Case content ───────────────────────────────────────────────────

const overview = [
  {
    title: "Project Overview",
    body: "MediQ is a premium mobile healthcare solution designed to simplify the patient journey. By focusing on high-fidelity visual concepts, the app provides a seamless interface for users to discover and connect with medical specialists across various fields.",
  },
  {
    title: "Client Challenge",
    body: "The primary challenge was to transform a typically stressful process — finding and booking medical care — into an intuitive, trust-building experience. We needed to balance complex data, such as doctor availability and pricing, with a clean and approachable UI that doesn't overwhelm the user.",
  },
  {
    title: "Our Approach",
    body: "As a product designer, I prioritized visual hierarchy and breathability. The design utilizes a soft blue palette to evoke calm, paired with high-contrast card components that make critical information — like Dr. Joseph Mark's $190 session fee — instantly scannable.",
  },
];

const highlights = [
  {
    name: "MediQ Search System",
    desc: "An integrated filtering system for Cardiology, Neurology, and more, designed for rapid navigation.",
  },
  {
    name: "High-Fidelity Portraits",
    desc: "Professional imagery and clear typography to establish immediate credibility for healthcare providers.",
  },
  {
    name: "Optimized Booking Flow",
    desc: 'A high-conversion "Book Now" call-to-action placed for ergonomic ease on mobile devices.',
  },
  {
    name: "Personalized Dashboard",
    desc: "A welcoming, user-centric home screen featuring real-time notifications and a tailored greeting.",
  },
];

// ─── Page ───────────────────────────────────────────────────────────

export default function MediQPreviewPage() {
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
              Case Study · MediQ
            </p>

            <h1
              className="mt-4 text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.05] text-stone-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              MediQ
            </h1>

            <p className="mt-4 text-base lg:text-lg text-stone-500 leading-relaxed">
              A premium mobile healthcare concept that turns finding a
              specialist into a calm, confident moment.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Tag>Product Design</Tag>
              <Tag>UI/UX</Tag>
              <Tag>Mobile</Tag>
              <Tag>Health-tech</Tag>
            </div>

            <div className="mt-12 space-y-10">
              {overview.map((s) => (
                <article key={s.title}>
                  <h2 className="text-[11px] font-semibold tracking-[0.18em] text-[#2F62F6] uppercase">
                    {s.title}
                  </h2>
                  <p className="mt-3 text-[15px] lg:text-base text-stone-600 leading-[1.7]">
                    {s.body}
                  </p>
                </article>
              ))}

              <article>
                <h2 className="text-[11px] font-semibold tracking-[0.18em] text-[#2F62F6] uppercase">
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
                <h2 className="text-[11px] font-semibold tracking-[0.18em] text-[#2F62F6] uppercase">
                  User Impact
                </h2>
                <p className="mt-3 text-[15px] lg:text-base text-stone-600 leading-[1.7]">
                  The MediQ interface reduces cognitive load, allowing patients
                  to book appointments with confidence. This project showcases a
                  commitment to improving user experience in the health-tech
                  sector through polished, high-standard UI/UX design.
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
            <MediQScreen />
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
  // Phone shell — matches the minimal style used at /preview: white outer
  // body, subtle shadow, no dark bezel or Dynamic Island. The outer wrapper
  // establishes the container query context; descendants use `cqw` units so
  // the UI scales with the phone's actual rendered width.
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
          className="absolute overflow-hidden bg-[#EDF2FA]"
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

function MediQScreen() {
  return (
    <div
      className="relative w-full h-full"
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
        style={{ padding: "16cqw 6.5cqw 0 6.5cqw" }}
      >
        {/* Avatar + Bell */}
        <div className="flex items-center justify-between">
          <div
            className="rounded-full bg-stone-200 overflow-hidden flex items-center justify-center"
            style={{ width: "11cqw", height: "11cqw" }}
          >
            <PersonIcon size="6.5cqw" color="#A8B2C0" />
          </div>
          <button
            className="relative bg-white rounded-full flex items-center justify-center"
            style={{
              width: "11cqw",
              height: "11cqw",
              boxShadow: "0 1cqw 3cqw rgba(15,23,42,0.06)",
            }}
          >
            <BellIcon />
            <span
              className="absolute bg-[#2F62F6] text-white font-semibold rounded-full flex items-center justify-center"
              style={{
                top: "-0.6cqw",
                right: "-0.6cqw",
                width: "4.6cqw",
                height: "4.6cqw",
                fontSize: "2.6cqw",
              }}
            >
              2
            </span>
          </button>
        </div>

        {/* Greeting */}
        <p
          className="leading-none"
          style={{ marginTop: "4.5cqw", fontSize: "5cqw" }}
        >
          <span className="italic font-light text-stone-700">Hello,</span>{" "}
          <span
            className="font-semibold italic text-stone-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Michael !
          </span>
        </p>

        {/* Main heading */}
        <h2
          className="font-semibold leading-[1.08] text-stone-900"
          style={{
            marginTop: "3.2cqw",
            fontSize: "8.2cqw",
            fontFamily: "var(--font-display)",
          }}
        >
          Find your Specialist
          <br />
          Doctor <span className="text-stone-300 font-medium">(22)</span>
        </h2>

        {/* Filter row */}
        <div
          className="flex items-center"
          style={{ marginTop: "4.5cqw", gap: "2.8cqw" }}
        >
          <div
            className="flex-1 bg-white rounded-full flex items-center justify-between"
            style={{
              padding: "2.8cqw 4cqw",
              boxShadow: "0 1cqw 3cqw rgba(15,23,42,0.05)",
            }}
          >
            <div className="flex items-center" style={{ gap: "2.5cqw" }}>
              <HeartIcon />
              <span
                className="font-medium text-stone-800"
                style={{ fontSize: "3.8cqw" }}
              >
                Cardiology
              </span>
            </div>
            <ChevronDownIcon />
          </div>
          <button
            className="bg-white rounded-full flex items-center justify-center"
            style={{
              width: "11cqw",
              height: "11cqw",
              boxShadow: "0 1cqw 3cqw rgba(15,23,42,0.05)",
            }}
          >
            <SlidersIcon />
          </button>
        </div>

        {/* Doctor card */}
        <div
          className="relative overflow-hidden bg-[#3A6DF4] text-white"
          style={{
            marginTop: "4.2cqw",
            borderRadius: "6cqw",
            padding: "4.5cqw 4.5cqw 5cqw 4.5cqw",
            height: "62cqw",
          }}
        >
          <div className="relative z-10" style={{ maxWidth: "55%" }}>
            <p
              className="font-medium text-white/90"
              style={{ fontSize: "3.4cqw" }}
            >
              Neurology
            </p>
            <h3
              className="italic font-medium leading-[1.05]"
              style={{
                marginTop: "1.6cqw",
                fontSize: "6.8cqw",
                fontFamily: "var(--font-display)",
              }}
            >
              Dr. Joseph
              <br />
              Mark
            </h3>
            <p
              className="font-semibold"
              style={{ marginTop: "4cqw", fontSize: "4.2cqw" }}
            >
              <span className="italic">$190</span>
              <span className="font-normal text-white/70"> /Session</span>
            </p>
          </div>
          <DoctorSilhouette />
        </div>

        {/* Action bar */}
        <div
          className="flex items-center"
          style={{ marginTop: "3cqw", gap: "2.4cqw" }}
        >
          <button
            className="flex-1 bg-white rounded-full text-[#2F62F6] font-semibold italic"
            style={{
              padding: "3.2cqw 0",
              fontSize: "4cqw",
              boxShadow: "0 1cqw 3cqw rgba(15,23,42,0.05)",
            }}
          >
            Book Now
          </button>
          <button
            className="bg-white rounded-full flex items-center justify-center"
            style={{
              width: "11cqw",
              height: "11cqw",
              boxShadow: "0 1cqw 3cqw rgba(15,23,42,0.05)",
            }}
          >
            <CalendarIcon />
          </button>
          <div
            className="bg-white rounded-full flex items-center"
            style={{
              padding: "0 3.4cqw",
              height: "11cqw",
              gap: "1.4cqw",
              boxShadow: "0 1cqw 3cqw rgba(15,23,42,0.05)",
            }}
          >
            <StarIcon />
            <span
              className="font-semibold text-stone-900"
              style={{ fontSize: "3.8cqw" }}
            >
              4.9
            </span>
          </div>
        </div>

        {/* Next card peek */}
        <div
          className="relative overflow-hidden bg-white"
          style={{
            marginTop: "3.5cqw",
            borderRadius: "6cqw",
            padding: "4.5cqw",
            height: "30cqw",
          }}
        >
          <p className="font-medium text-stone-500" style={{ fontSize: "3.4cqw" }}>
            Gynecologic
          </p>
          <h3
            className="italic font-medium leading-[1.05] text-stone-900"
            style={{
              marginTop: "1.6cqw",
              fontSize: "6.8cqw",
              fontFamily: "var(--font-display)",
              maxWidth: "55%",
            }}
          >
            Dr. William
            <br />
            Richard
          </h3>
          <DoctorSilhouette secondary />
        </div>
      </div>

      {/* Bottom nav (floating) */}
      <BottomNav />
    </div>
  );
}

function BottomNav() {
  return (
    <div
      className="absolute left-0 right-0 flex items-center justify-between"
      style={{ bottom: "3cqw", padding: "0 5cqw", gap: "1.5cqw" }}
    >
      <div
        className="flex items-center bg-stone-900 text-white rounded-full"
        style={{
          padding: "3cqw 4.5cqw",
          gap: "1.8cqw",
          boxShadow: "0 2cqw 6cqw rgba(15,23,42,0.18)",
        }}
      >
        <HomeIcon />
        <span className="font-medium" style={{ fontSize: "3.6cqw" }}>
          Home
        </span>
      </div>
      <div
        className="flex-1 flex items-center justify-around bg-white rounded-full"
        style={{
          padding: "1.6cqw",
          marginLeft: "1.5cqw",
          boxShadow: "0 2cqw 6cqw rgba(15,23,42,0.08)",
        }}
      >
        <NavIconButton><NotebookIcon /></NavIconButton>
        <NavIconButton><SearchIcon /></NavIconButton>
        <NavIconButton><MessageIcon /></NavIconButton>
        <NavIconButton><UserIcon /></NavIconButton>
      </div>
    </div>
  );
}

function NavIconButton({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-full flex items-center justify-center"
      style={{ width: "9cqw", height: "9cqw" }}
    >
      {children}
    </div>
  );
}

// ─── Doctor placeholder ─────────────────────────────────────────────

function DoctorSilhouette({ secondary = false }: { secondary?: boolean }) {
  const fill = secondary ? "#D7DEE9" : "#FFFFFF";
  const opacity = secondary ? 1 : 0.92;
  return (
    <svg
      viewBox="0 0 200 240"
      preserveAspectRatio="xMaxYMax slice"
      className="absolute"
      style={{
        right: 0,
        bottom: 0,
        height: "100%",
        width: secondary ? "38%" : "55%",
      }}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={secondary ? "clip-doc-2" : "clip-doc-1"}>
          <rect x="0" y="0" width="200" height="240" rx="0" ry="0" />
        </clipPath>
      </defs>
      <g
        clipPath={`url(#${secondary ? "clip-doc-2" : "clip-doc-1"})`}
        fill={fill}
        opacity={opacity}
      >
        {/* Head */}
        <circle cx="115" cy="92" r="38" />
        {/* Body / coat */}
        <path d="M40 240 C 40 175, 80 145, 115 145 C 150 145, 195 175, 195 240 Z" />
        {/* Coat lapel notch */}
        <path
          d="M115 145 L 100 175 L 115 200 L 130 175 Z"
          fill={secondary ? "#C1CAD9" : "#E6ECF7"}
        />
      </g>
    </svg>
  );
}

// ─── Icons (inline SVG) ─────────────────────────────────────────────

function PersonIcon({ size = "5cqw", color = "currentColor" }: { size?: string; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </svg>
  );
}

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
      <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" opacity="0.5" />
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

function HeartIcon() {
  return (
    <svg
      style={{ width: "4.4cqw", height: "4.4cqw" }}
      viewBox="0 0 24 24"
      fill="#E63946"
      stroke="#9A1B27"
      strokeWidth="0.6"
      aria-hidden="true"
    >
      <path d="M12 21s-7-4.5-9.5-9.2C0.6 8.1 2.7 4 6.3 4c2 0 3.5 1.1 4.6 2.6h0.2C12.2 5.1 13.7 4 15.7 4c3.6 0 5.7 4.1 3.8 7.8C19 16.5 12 21 12 21z" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      style={{ width: "4cqw", height: "4cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6B7280"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function SlidersIcon() {
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
      <line x1="4" y1="8" x2="20" y2="8" />
      <line x1="4" y1="16" x2="20" y2="16" />
      <circle cx="9" cy="8" r="2.2" fill="white" />
      <circle cx="15" cy="16" r="2.2" fill="white" />
    </svg>
  );
}

function CalendarIcon() {
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
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      style={{ width: "4.4cqw", height: "4.4cqw" }}
      viewBox="0 0 24 24"
      fill="#F5A524"
      aria-hidden="true"
    >
      <path d="M12 2.5l2.9 5.9 6.6.95-4.75 4.6 1.1 6.55L12 17.4l-5.9 3.1 1.1-6.55L2.5 9.35l6.6-.95L12 2.5z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      style={{ width: "4.4cqw", height: "4.4cqw" }}
      viewBox="0 0 24 24"
      fill="white"
      aria-hidden="true"
    >
      <path d="M12 3 3 11h2v9h5v-6h4v6h5v-9h2z" />
    </svg>
  );
}

function NotebookIcon() {
  return (
    <svg
      style={{ width: "4.4cqw", height: "4.4cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#5F6B7C"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <line x1="9" y1="3.5" x2="9" y2="20.5" />
      <line x1="12" y1="8" x2="16.5" y2="8" />
      <line x1="12" y1="12" x2="16.5" y2="12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      style={{ width: "4.4cqw", height: "4.4cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#5F6B7C"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="6" />
      <line x1="15" y1="15" x2="20" y2="20" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      style={{ width: "4.4cqw", height: "4.4cqw" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#5F6B7C"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a8 8 0 1 1-3.6-6.7L21 4l-1.3 3.7A8 8 0 0 1 21 12z" />
      <circle cx="9" cy="12" r="0.6" fill="#5F6B7C" />
      <circle cx="13" cy="12" r="0.6" fill="#5F6B7C" />
      <circle cx="17" cy="12" r="0.6" fill="#5F6B7C" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      style={{ width: "4.4cqw", height: "4.4cqw" }}
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
