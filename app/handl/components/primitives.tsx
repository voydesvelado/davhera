"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import s from "../handl.module.css";
import { money } from "../data";

/* ==========================================================================
 * Motion constants
 * ========================================================================== */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_SPRING = [0.34, 1.4, 0.64, 1] as const;

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE_OUT } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.32, ease: EASE_OUT } },
};

/* ==========================================================================
 * Inline SVG line icons (1.8px stroke, currentColor, no icon packages)
 * ========================================================================== */
type IconProps = { size?: number; className?: string };
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const CameraIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}>
    <path d="M4 8h2.5l1.6-2h7.8l1.6 2H20a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13.5" r="3.4" />
  </svg>
);

export const LibraryIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}>
    <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
    <circle cx="9" cy="9.5" r="1.6" />
    <path d="m5.5 18 5-4.5 3 2.5 3.5-3 1.5 1.4" />
  </svg>
);

export const ShieldIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}>
    <path d="M12 3.5 19 6v5c0 4.4-3 8-7 9.5C8 19 5 15.4 5 11V6l7-2.5Z" />
    <path d="m9.2 12 2 2 3.6-3.8" />
  </svg>
);

export const CheckIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

export const PhoneIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}>
    <path d="M6.5 4h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v3a1.8 1.8 0 0 1-2 1.8C10.5 18.6 5.4 13.5 5 6.5A1.8 1.8 0 0 1 6.5 4Z" />
  </svg>
);

export const PinIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}>
    <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const SearchIcon = ({ size = 18, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-3.8-3.8" />
  </svg>
);

export const SendIcon = ({ size = 18, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}>
    <path d="M4 12 20 4l-6 16-2.5-6.5L4 12Z" />
  </svg>
);

export const ChevronRight = ({ size = 18, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const ChevronLeft = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}>
    <path d="m15 5-7 7 7 7" />
  </svg>
);

export const DocIcon = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}>
    <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M14 3v4h4" />
    <path d="M9 12h6M9 16h6" />
  </svg>
);

/* ==========================================================================
 * Avatar with graceful initials fallback
 * ========================================================================== */
export function Avatar({
  initials,
  photo,
  size = 34,
  dark = false,
}: {
  initials: string;
  photo?: string;
  size?: number;
  dark?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`${s.avatar} ${dark ? s.avatarDark : ""}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {photo && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" onError={() => setFailed(true)} />
      ) : (
        initials
      )}
    </div>
  );
}

/* ==========================================================================
 * App bar
 * ========================================================================== */
export function AppBar({
  title,
  avatar,
  onBack,
}: {
  title: string;
  avatar?: { initials: string; photo?: string };
  onBack?: () => void;
}) {
  return (
    <div className={s.appbar}>
      <div className={s.appbarLeft}>
        {onBack && (
          <button className={s.back} onClick={onBack} aria-label="Back">
            <ChevronLeft />
          </button>
        )}
        <span className={s.appbarTitle}>{title}</span>
      </div>
      {avatar && <Avatar initials={avatar.initials} photo={avatar.photo} />}
    </div>
  );
}

/* ==========================================================================
 * Button
 * ========================================================================== */
export function Button({
  variant = "primary",
  children,
  onClick,
  icon,
}: {
  variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
}) {
  const cls =
    variant === "primary"
      ? s.btnPrimary
      : variant === "secondary"
        ? s.btnSecondary
        : s.btnGhost;
  return (
    <button className={`${s.btn} ${cls}`} onClick={onClick}>
      {icon}
      {children}
    </button>
  );
}

/* ==========================================================================
 * Chip
 * ========================================================================== */
export function Chip({
  tone = "lav",
  children,
}: {
  tone?: "ok" | "warn" | "lav" | "peri";
  children: React.ReactNode;
}) {
  const cls =
    tone === "ok"
      ? s.chipOk
      : tone === "warn"
        ? s.chipWarn
        : tone === "peri"
          ? s.chipPeri
          : s.chipLav;
  return <span className={`${s.chip} ${cls}`}>{children}</span>;
}

/* ==========================================================================
 * Confidence dots
 * ========================================================================== */
export function ConfidenceDots({
  filled,
  label,
}: {
  filled: number;
  label?: string;
}) {
  const total = 3;
  const reduced = useReducedMotion();
  return (
    <div className={s.confRow}>
      <div className={s.dots}>
        {Array.from({ length: total }).map((_, i) => (
          <motion.span
            key={i}
            className={`${s.dot} ${i < filled ? s.filled : ""}`}
            initial={reduced ? false : { scale: 1, opacity: i < filled ? 1 : 1 }}
            animate={reduced ? {} : { scale: i < filled ? [1, 1.25, 1] : 1 }}
            transition={{ delay: i * 0.12, duration: 0.3 }}
          />
        ))}
      </div>
      {label && <span className={s.whisper}>{label}</span>}
    </div>
  );
}

/* ==========================================================================
 * Money headline with count-up
 * ========================================================================== */
export function MoneyCount({
  value,
  prefix = "$",
  instant = false,
}: {
  value: number;
  prefix?: string;
  instant?: boolean;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(instant || reduced ? value : 0);

  useEffect(() => {
    if (reduced || instant) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 700;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduced, instant]);

  return (
    <div className={s.money}>
      {prefix}
      {money(display)}
    </div>
  );
}

/* ==========================================================================
 * Path card (entry + recovery)
 * ========================================================================== */
export function PathCard({
  icon,
  title,
  support,
  pre,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  support: string;
  pre?: boolean;
  onClick: () => void;
}) {
  return (
    <button className={`${s.pathcard} ${pre ? s.pre : ""}`} onClick={onClick}>
      <div className={s.pathIcon}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div className={s.pathTitle}>{title}</div>
        <div className={s.pathSupport}>{support}</div>
      </div>
      <span className={s.chevron}>
        <ChevronRight />
      </span>
    </button>
  );
}

/* ==========================================================================
 * Maria row
 * ========================================================================== */
export function MariaRow({
  title = "Prefer a person? Maria can help.",
  sub = "Care navigator · replies within two minutes",
  warm = false,
  onClick,
}: {
  title?: string;
  sub?: string;
  warm?: boolean;
  onClick: () => void;
}) {
  return (
    <button className={`${s.mariarow} ${warm ? s.warm : ""}`} onClick={onClick}>
      <Avatar initials="MT" photo="/handl/img/maria.jpg" dark />
      <div style={{ flex: 1 }}>
        <div className={s.mariaTitle}>{title}</div>
        <div className={s.mariaSub}>{sub}</div>
      </div>
      <span className={s.chevron}>
        <ChevronRight />
      </span>
    </button>
  );
}
