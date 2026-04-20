"use client";

import { useState } from "react";
import Link from "next/link";

const StarIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5231 29.2759C12.6685 22.5706 7.42938 17.3315 0.724097 15.4769C0.240255 15.3431 0.240255 14.657 0.724097 14.5231C7.42938 12.6685 12.6685 7.42939 14.5231 0.724099C14.6569 0.240257 15.343 0.240257 15.4769 0.724099C17.3315 7.42939 22.5706 12.6685 29.2759 14.5231C29.7597 14.657 29.7597 15.343 29.2759 15.4769C22.5706 17.3315 17.3315 22.5706 15.4769 29.2759C15.343 29.7597 14.657 29.7597 14.5231 29.2759Z" fill="currentColor" />
  </svg>
);

const mono = "font-[family-name:var(--font-mono)] uppercase";

const navLinks = [
  { href: "/", label: "Work", activeExact: true },
  { href: "/about", label: "About", activeExact: false },
];

const colorFull = "var(--project-ink)";
const colorMuted = "var(--project-ink-muted)";

export default function Navbar({ activePath = "/" }: { activePath?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact: boolean) =>
    exact ? activePath === href : activePath.startsWith(href);

  return (
    <>
      <div className="flex justify-center px-6 py-5 z-50 bg-background gap-6 border-b border-foreground/10 lg:h-16 items-center relative min-h-[32px]">
        <div className="max-w-[1800px] w-full flex items-center gap-6 relative">

          {/* Logo / Name */}
          <div className="flex items-center w-full">
            <Link href="/" className={`${mono} flex flex-col sm:flex-row sm:inline-flex sm:gap-4 gap-0 cursor-pointer`}>
              <span className="text-sm font-medium" style={{ color: colorFull }}>David Herrera</span>
              <span className="text-sm" style={{ color: colorMuted }}>Designer + Developer</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="md:flex hidden gap-8 w-full justify-end items-center">
            <div className={`${mono} flex gap-8 items-center`}>
              {navLinks.map(({ href, label, activeExact }) => (
                <Link key={href} href={href} className="text-sm transition-colors duration-150">
                  <span style={{ color: isActive(href, activeExact) ? colorFull : colorMuted }}>
                    {label}
                  </span>
                </Link>
              ))}
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors duration-150" style={{ color: colorMuted }}>
                Resume
              </a>
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex gap-4 items-center">
            <button onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ color: colorMuted }}>
                <path className="transition-all duration-300 origin-center" d={mobileOpen ? "M6 6L18 18" : "M4 8H20"} stroke="currentColor" strokeWidth="1.5" />
                <path className="transition-all duration-300 origin-center" d={mobileOpen ? "M18 6L6 18" : "M4 16H20"} stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div className={[
          "md:hidden absolute left-0 right-0 z-60 top-full px-6 py-5 border-b border-foreground/10 bg-background",
          "transition-all duration-300 ease-in-out",
          mobileOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none",
        ].join(" ")}>
          <div className={`${mono} flex flex-col gap-4`}>
            {navLinks.map(({ href, label, activeExact }) => (
              <Link key={href} href={href} className="text-sm transition-colors duration-150" onClick={() => setMobileOpen(false)}>
                <span style={{ color: isActive(href, activeExact) ? colorFull : colorMuted }}>{label}</span>
              </Link>
            ))}
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: colorMuted }} onClick={() => setMobileOpen(false)}>
              Resume
            </a>
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <button
        className="md:hidden fixed z-[60] flex items-center justify-center active:scale-95 transition-all duration-200 rounded-full shadow-lg w-11 h-11"
        style={{
          backgroundColor: colorFull,
          color: "#FAFCFD",
          bottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))",
          right: "max(1.5rem, env(safe-area-inset-right, 1.5rem))",
        }}
        aria-label="Open AI chat"
      >
        <StarIcon size={18} />
      </button>
    </>
  );
}
