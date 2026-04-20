"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll } from "framer-motion";
import CaseStudyFooter from "@/components/CaseStudyFooter";

// ─── Hooks ─────────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, isVisible] as const;
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [ref, isVisible] = useScrollReveal();
  return (
    <section
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-orange-600 uppercase tracking-[0.15em] mb-3">{children}</p>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {children}
    </h2>
  );
}

// ─── Typography Specimen ───────────────────────────────────────────

function TypeSpecimen({ name, family, weight, role, sample, mono = false }: { name: string; family: string; weight: string; role: string; sample: string; mono?: boolean }) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-stone-200 group hover:border-orange-200 transition-colors">
      <p
        className={`text-3xl leading-tight mb-4 ${mono ? "tracking-tight" : ""}`}
        style={{ fontFamily: family, fontWeight: weight }}
      >
        {sample}
      </p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-stone-900">{name}</p>
          <p className="text-xs text-stone-400">{role}</p>
        </div>
        <span className="text-[10px] font-mono text-stone-300 bg-stone-50 px-2 py-0.5 rounded">{weight}</span>
      </div>
    </div>
  );
}

// ─── Color Swatch ──────────────────────────────────────────────────

function ColorSwatch({ color, name, value, usage, large = false }: { color: string; name: string; value: string; usage: string; large?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className={`text-left group transition-all active:scale-95 ${large ? "col-span-2" : ""}`}
    >
      <div
        className={`${large ? "h-28" : "h-20"} rounded-xl mb-2 border border-stone-200/50 transition-shadow group-hover:shadow-md`}
        style={{ backgroundColor: color }}
      />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-stone-900">{name}</p>
          <p className="text-xs text-stone-400">{usage}</p>
        </div>
        <span className="text-[10px] font-mono text-stone-300 group-hover:text-stone-500 transition-colors">
          {copied ? "Copied!" : value}
        </span>
      </div>
    </button>
  );
}

// ─── Animated Spacing Grid ─────────────────────────────────────────

function SpacingGrid() {
  const values = [4, 8, 12, 16, 20, 24, 32, 40, 48];
  return (
    <div className="space-y-2">
      {values.map((v) => (
        <div key={v} className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-stone-400 w-6 text-right">{v}</span>
          <div
            className="h-3 rounded-sm bg-orange-500/20 border-l-2 border-orange-500 transition-all duration-500"
            style={{ width: `${v * 3}px` }}
          >
            <div className="h-full bg-orange-500/10 rounded-r-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Animated Theme Switcher SVG ───────────────────────────────────

function ThemeSwitcherDemo() {
  const [activeTheme, setActiveTheme] = useState(0);
  const themes = [
    { name: "Moderna", font: "'Plus Jakarta Sans', sans-serif", color: "#F97316", sample: "Cappuccino" },
    { name: "Minimal", font: "'Courier New', monospace", color: "#1C1917", sample: "Cappuccino" },
    { name: "Clásica", font: "Georgia, serif", color: "#7C3AED", sample: "Cappuccino" },
  ];

  useEffect(() => {
    const t = setInterval(() => setActiveTheme((s) => (s + 1) % 3), 2500);
    return () => clearInterval(t);
  }, []);

  const theme = themes[activeTheme];

  return (
    <div className="relative w-full max-w-[260px] mx-auto">
      <div
        className="bg-white rounded-[28px] overflow-hidden transition-all duration-500"
        style={{
          boxShadow: "0 0 0 1px rgba(28,25,23,0.06), 0 8px 40px rgba(28,25,23,0.08)",
        }}
      >
        {/* Top color bar */}
        <div
          className="h-1.5 transition-colors duration-700"
          style={{ backgroundColor: theme.color }}
        />
        <div className="p-5">
          {/* Restaurant name */}
          <p
            className="text-lg font-bold text-stone-900 mb-1 transition-all duration-500"
            style={{ fontFamily: theme.font }}
          >
            Cafetería Nimbus
          </p>
          <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-4" style={{ fontFamily: theme.font }}>
            Café de especialidad
          </p>

          {/* Chip */}
          <div className="flex gap-1.5 mb-4">
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-semibold text-white transition-colors duration-500"
              style={{ backgroundColor: theme.color }}
            >
              Todo
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] text-stone-500 bg-stone-100">Café</span>
            <span className="px-2.5 py-1 rounded-full text-[10px] text-stone-500 bg-stone-100">Postres</span>
          </div>

          {/* Dish */}
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-stone-900 transition-all duration-500" style={{ fontFamily: theme.font }}>
                {theme.sample}
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5 leading-relaxed" style={{ fontFamily: theme.font }}>
                Espresso doble con leche texturizada
              </p>
              <p
                className="text-sm font-bold mt-1.5 transition-colors duration-500"
                style={{ color: theme.color, fontFamily: activeTheme === 1 ? "monospace" : theme.font }}
              >
                $65
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-stone-200 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Theme selector pills */}
      <div className="flex justify-center gap-2 mt-4">
        {themes.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setActiveTheme(i)}
            className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all ${
              activeTheme === i
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-400"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Restaurant Color Demo ─────────────────────────────────────────

function ColorInjectionDemo() {
  const [activeColor, setActiveColor] = useState(0);
  const colors = [
    { hex: "#F97316", name: "Naranja" },
    { hex: "#16A34A", name: "Verde" },
    { hex: "#2563EB", name: "Azul" },
    { hex: "#DC2626", name: "Rojo" },
    { hex: "#7C3AED", name: "Morado" },
  ];
  const color = colors[activeColor];

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {colors.map((c, i) => (
          <button
            key={c.hex}
            onClick={() => setActiveColor(i)}
            className={`w-8 h-8 rounded-full border-2 transition-all active:scale-90 ${
              activeColor === i ? "border-stone-900 scale-110" : "border-transparent"
            }`}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>

      {/* Mini menu preview */}
      <div
        className="max-w-[200px] mx-auto bg-white rounded-2xl overflow-hidden transition-all duration-300"
        style={{ boxShadow: "0 0 0 1px rgba(28,25,23,0.06), 0 4px 16px rgba(28,25,23,0.06)" }}
      >
        <div className="p-3">
          <div className="flex gap-1.5 mb-3">
            <span
              className="px-2 py-0.5 rounded-full text-[8px] font-bold text-white transition-colors duration-300"
              style={{ backgroundColor: color.hex }}
            >
              Todo
            </span>
            <span className="px-2 py-0.5 rounded-full text-[8px] text-stone-400 bg-stone-100">Café</span>
          </div>
          <div className="space-y-2">
            {["Cappuccino", "Matcha Latte"].map((dish) => (
              <div key={dish} className="flex items-center justify-between">
                <p className="text-[10px] font-medium text-stone-700">{dish}</p>
                <p
                  className="text-[10px] font-bold transition-colors duration-300"
                  style={{ color: color.hex }}
                >
                  $65
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] font-mono text-stone-400">
        --menu-color: <span className="transition-colors duration-300" style={{ color: color.hex }}>{color.hex}</span>
      </p>
    </div>
  );
}

// ─── Interaction Pattern Card ──────────────────────────────────────

function InteractionCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-stone-200">
      <div className="mb-4">{children}</div>
      <h3 className="text-sm font-bold text-stone-900 mb-1">{title}</h3>
      <p className="text-xs text-stone-400 leading-relaxed">{description}</p>
    </div>
  );
}

// ─── Auto-save Animation ───────────────────────────────────────────

function AutoSaveDemo() {
  const [price, setPrice] = useState("$65");
  const [showToast, setShowToast] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = [
      () => { setPrice("$6"); setStep(1); },
      () => { setPrice("$68"); setStep(2); },
      () => { setShowToast(true); setStep(3); },
      () => { setShowToast(false); setStep(0); setPrice("$65"); },
    ];
    let i = 0;
    const t = setInterval(() => {
      sequence[i]();
      i = (i + 1) % sequence.length;
    }, 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-16 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <span className="text-xs text-stone-400">Precio:</span>
        <span
          className={`text-lg font-bold font-mono px-2 py-0.5 rounded-lg border transition-all duration-200 ${
            step === 1 || step === 2
              ? "border-orange-400 ring-2 ring-orange-500/20 text-stone-900"
              : "border-transparent text-stone-900"
          }`}
        >
          {price}
        </span>
      </div>

      {/* Toast */}
      <div
        className={`absolute -bottom-1 right-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900 text-white text-[10px] font-medium transition-all duration-300 ${
          showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 5.5L4 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Guardado
      </div>
    </div>
  );
}

// ─── Skeleton Shimmer Demo ─────────────────────────────────────────

function SkeletonShimmerDemo() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setLoaded((v) => !v), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full h-16 rounded-xl overflow-hidden relative">
      {/* Skeleton */}
      <div
        className={`absolute inset-0 bg-stone-100 transition-opacity duration-300 ${loaded ? "opacity-0" : "opacity-100"}`}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(168,162,158,0.15), transparent)",
            animation: "shimmer 1.5s infinite",
          }}
        />
      </div>

      {/* Loaded image placeholder */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300 rounded-xl transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

// ─── Optimistic Nav Demo ───────────────────────────────────────────

function OptimisticNavDemo() {
  const [active, setActive] = useState(0);
  const tabs = ["Menú", "Publicar", "Cuenta"];

  useEffect(() => {
    const t = setInterval(() => setActive((s) => (s + 1) % 3), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center justify-center gap-6">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => setActive(i)}
          className="flex flex-col items-center gap-1 transition-all"
        >
          <div
            className={`w-5 h-5 rounded-md transition-all duration-200 ${
              active === i ? "bg-orange-500 scale-110" : "bg-stone-200"
            }`}
          />
          <span
            className={`text-[9px] font-medium transition-colors duration-200 ${
              active === i ? "text-orange-600 font-semibold" : "text-stone-400"
            }`}
          >
            {tab}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Responsive Demo ───────────────────────────────────────────────

function ResponsiveDemo() {
  return (
    <div className="flex items-end justify-center gap-4">
      {/* Mobile */}
      <div className="text-center">
        <div className="w-14 h-24 rounded-lg border-2 border-stone-300 bg-white p-1">
          <div className="w-full h-1 bg-stone-200 rounded mb-1" />
          <div className="w-full h-1 bg-stone-100 rounded mb-1" />
          <div className="flex gap-0.5 mb-1">
            <div className="w-2 h-1 bg-orange-500 rounded-full" />
            <div className="w-2 h-1 bg-stone-100 rounded-full" />
          </div>
          <div className="space-y-0.5">
            <div className="w-full h-2 bg-stone-50 rounded" />
            <div className="w-full h-2 bg-stone-50 rounded" />
            <div className="w-full h-2 bg-stone-50 rounded" />
          </div>
          {/* Bottom nav */}
          <div className="flex justify-around mt-1 pt-0.5 border-t border-stone-100">
            <div className="w-1.5 h-1.5 rounded-sm bg-orange-500" />
            <div className="w-1.5 h-1.5 rounded-sm bg-stone-200" />
            <div className="w-1.5 h-1.5 rounded-sm bg-stone-200" />
          </div>
        </div>
        <p className="text-[9px] text-stone-400 mt-1.5">375px</p>
        <p className="text-[8px] text-orange-500 font-semibold">Primary</p>
      </div>

      {/* Tablet */}
      <div className="text-center">
        <div className="w-20 h-28 rounded-lg border-2 border-stone-200 bg-white p-1.5">
          <div className="w-full h-1.5 bg-stone-200 rounded mb-1" />
          <div className="flex gap-0.5 mb-1.5">
            <div className="w-3 h-1 bg-orange-500 rounded-full" />
            <div className="w-3 h-1 bg-stone-100 rounded-full" />
            <div className="w-3 h-1 bg-stone-100 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-0.5">
            <div className="h-4 bg-stone-50 rounded" />
            <div className="h-4 bg-stone-50 rounded" />
            <div className="h-4 bg-stone-50 rounded" />
            <div className="h-4 bg-stone-50 rounded" />
          </div>
        </div>
        <p className="text-[9px] text-stone-400 mt-1.5">768px</p>
      </div>

      {/* Desktop */}
      <div className="text-center">
        <div className="w-32 h-20 rounded-lg border-2 border-stone-200 bg-white p-1.5">
          <div className="flex gap-1 mb-1">
            <div className="w-1 h-1 rounded-full bg-stone-200" />
            <div className="w-1 h-1 rounded-full bg-stone-200" />
            <div className="w-1 h-1 rounded-full bg-stone-200" />
          </div>
          <div className="flex gap-1">
            <div className="w-6 h-12 bg-stone-50 rounded" />
            <div className="flex-1 space-y-0.5">
              <div className="w-full h-2 bg-stone-100 rounded" />
              <div className="grid grid-cols-3 gap-0.5">
                <div className="h-3 bg-stone-50 rounded" />
                <div className="h-3 bg-stone-50 rounded" />
                <div className="h-3 bg-stone-50 rounded" />
              </div>
            </div>
          </div>
        </div>
        <p className="text-[9px] text-stone-400 mt-1.5">1280px</p>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────

export default function DesignSystemCaseStudy() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left bg-orange-500" style={{ scaleX: scrollYProgress }} />

      {/* ─── Nav ─── */}
      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="fixed top-0 left-0 right-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200/50">
        <div className="max-w-5xl mx-auto px-6 sm:px-0 h-14 flex items-center justify-between">
          <a href="/" className="text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors">← Portfolio</a>
          <div className="flex items-center gap-4">
            <span className="text-xs text-stone-400 tracking-wider uppercase hidden sm:block">Menura · Design System</span>
            <span className="px-3 py-1.5 text-xs font-semibold text-stone-500 bg-white rounded-lg border border-stone-200">Design System</span>
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <header className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 mb-6">
            <span className="text-xs font-medium text-stone-500">System v1.0 · April 2026</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-stone-900 mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            A design system built for
            <br />
            <span style={{ color: "#F97316" }}>warmth, speed, and trust.</span>
          </h1>

          <p className="text-lg text-stone-500 max-w-xl mx-auto leading-relaxed">
            Every decision — from typography to micro-interactions — was shaped by one question:
            can a restaurant owner who's never used a CMS feel confident using this on their phone?
          </p>
        </div>
      </header>

      {/* ─── Typography ─── */}
      <Section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Typography</SectionLabel>
          <SectionTitle>Three fonts. Three roles. Zero ambiguity.</SectionTitle>
          <p className="text-base text-stone-500 max-w-2xl mb-10">
            Each font has a single purpose. Display attracts. Body informs. Mono quantifies.
            Restaurants can choose between three themes — the typography changes, the hierarchy doesn't.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <TypeSpecimen
              name="Plus Jakarta Sans"
              family="'Plus Jakarta Sans', sans-serif"
              weight="700"
              role="Display · Headings"
              sample="Cafetería"
            />
            <TypeSpecimen
              name="DM Sans"
              family="'DM Sans', sans-serif"
              weight="400"
              role="Body · Descriptions"
              sample="Pan de masa madre dorada en mantequilla"
            />
            <TypeSpecimen
              name="JetBrains Mono"
              family="'JetBrains Mono', monospace"
              weight="700"
              role="Prices · Data"
              sample="$125"
              mono
            />
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-6">Theme Switcher — Live Preview</p>
            <ThemeSwitcherDemo />
          </div>
        </div>
      </Section>

      {/* ─── Color ─── */}
      <Section className="px-6 py-24 bg-white border-y border-stone-200">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Color</SectionLabel>
          <SectionTitle>Warm by default. Personal by choice.</SectionTitle>
          <p className="text-base text-stone-500 max-w-2xl mb-10">
            Orange for action. Stone for everything else. No harsh blacks — the darkest value is stone-900.
            Each restaurant injects their own primary via CSS custom properties. The system adapts without breaking.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <ColorSwatch color="#F97316" name="Orange 500" value="#F97316" usage="Primary · CTAs · Prices" large />
            <ColorSwatch color="#C2410C" name="Orange 700" value="#C2410C" usage="Text on white" large />
            <ColorSwatch color="#1C1917" name="Stone 900" value="#1C1917" usage="Headlines · Bold text" />
            <ColorSwatch color="#57534E" name="Stone 600" value="#57534E" usage="Body text" />
            <ColorSwatch color="#A8A29E" name="Stone 400" value="#A8A29E" usage="Secondary text" />
            <ColorSwatch color="#F5F5F4" name="Stone 100" value="#F5F5F4" usage="Backgrounds · Chips" />
            <ColorSwatch color="#FAFAF9" name="Stone 50" value="#FAFAF9" usage="Page background" />
            <ColorSwatch color="#FFFFFF" name="White" value="#FFFFFF" usage="Cards · Containers" />
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-6">Dynamic Color Injection</p>
            <p className="text-sm text-stone-500 mb-6 max-w-lg">
              Each restaurant's primary color is injected as <code className="text-xs font-mono bg-white px-1.5 py-0.5 rounded border border-stone-200">--menu-color</code> on the menu container. Chips, prices, and accents consume it. The system never breaks because it never hardcodes color — it references the variable.
            </p>
            <ColorInjectionDemo />
          </div>
        </div>
      </Section>

      {/* ─── Spacing & Layout ─── */}
      <Section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Spacing & Layout</SectionLabel>
          <SectionTitle>8px grid. Two density modes.</SectionTitle>
          <p className="text-base text-stone-500 max-w-2xl mb-10">
            The public menu uses generous spacing — it should feel premium, like a well-set table.
            The CMS uses compact spacing — it should feel efficient, like a kitchen during service.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-stone-200">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">Scale (base: 4px)</p>
              <SpacingGrid />
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">Responsive</p>
              <p className="text-xs text-stone-500 leading-relaxed mb-6">
                Designed at 375px first. Desktop is an enhancement, not the starting point.
                Touch targets: 44-48px minimum. CTAs sticky at thumb reach.
              </p>
              <ResponsiveDemo />
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Interaction Patterns ─── */}
      <Section className="px-6 py-24 bg-white border-y border-stone-200">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Interaction</SectionLabel>
          <SectionTitle>Every tap has a response. Every response has a purpose.</SectionTitle>
          <p className="text-base text-stone-500 max-w-2xl mb-10">
            The system was designed for a user who's never used a CMS — and is editing their menu while standing in their kitchen
            with flour on their hands. Every interaction must be obvious, instant, and forgiving.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InteractionCard
              title="Auto-save with toast"
              description="No 'Save' button anywhere. Every edit persists immediately with optimistic updates. A subtle toast confirms — the user never wonders 'did it save?'"
            >
              <AutoSaveDemo />
            </InteractionCard>

            <InteractionCard
              title="Skeleton shimmer → fade-in"
              description="Images show a shimmer placeholder while loading, then fade in over 300ms. The key={dish.id} trick resets state between different dishes."
            >
              <SkeletonShimmerDemo />
            </InteractionCard>

            <InteractionCard
              title="Optimistic navigation"
              description="Bottom nav tabs activate instantly via useTransition + optimistic state. A 2px progress bar appears only if navigation exceeds 100ms."
            >
              <OptimisticNavDemo />
            </InteractionCard>

            <InteractionCard
              title="Tactile scale feedback"
              description="Every tappable element uses active:scale-90 with 75ms duration. Subtle but critical — it's the difference between 'this is a website' and 'this is an app.'"
            >
              <div className="flex justify-center gap-3">
                {["Primary", "Secondary", "Ghost"].map((label, i) => (
                  <button
                    key={label}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-90 duration-75 ${
                      i === 0
                        ? "bg-orange-500 text-white"
                        : i === 1
                        ? "bg-stone-100 text-stone-600 border border-stone-200"
                        : "text-stone-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </InteractionCard>
          </div>

          {/* Additional patterns */}
          <div className="mt-8 p-6 rounded-2xl bg-stone-50 border border-stone-200">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">More Patterns</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: "Swipe dismiss", desc: "Vaul drawer with spring physics. Scroll-aware — only closes when scrolled to top.", icon: "↕" },
                { name: "Focus ring", desc: "border-transparent → border-orange-400 on focus. Always present, never causes layout shift.", icon: "◯" },
                { name: "Confirm destructive", desc: "Auto-save for edits. Dialog confirmation only for deletions. Asymmetric trust.", icon: "⚠" },
              ].map((p) => (
                <div key={p.name} className="p-3 rounded-xl bg-white border border-stone-200">
                  <span className="text-lg mb-2 block">{p.icon}</span>
                  <p className="text-xs font-semibold text-stone-900 mb-0.5">{p.name}</p>
                  <p className="text-[10px] text-stone-400 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Component Anatomy ─── */}
      <Section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Components</SectionLabel>
          <SectionTitle>Two spaces. Different densities. Same system.</SectionTitle>
          <p className="text-base text-stone-500 max-w-2xl mb-10">
            The public menu and the CMS share the same design tokens but use them at different densities.
            Premium spacing for diners. Compact efficiency for operators.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Public menu components */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <p className="text-xs font-semibold text-stone-900 uppercase tracking-wider">Public Menu</p>
              </div>
              <div className="space-y-2 text-xs text-stone-500">
                {[
                  "RestaurantHeader — name, cuisine, logo",
                  "CategoryChips — horizontal scroll, color-aware",
                  "MenuSection — category title + dish list",
                  "DishDetailDrawer — swipe dismiss, skeleton images",
                  "SearchBar — instant filter, debounced",
                  "MenuFooter — Menura badge (Free only)",
                  "ThemeColorMeta — dynamic Android status bar",
                ].map((c) => (
                  <div key={c} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-orange-300" />
                    <p>{c}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CMS components */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-stone-400" />
                <p className="text-xs font-semibold text-stone-900 uppercase tracking-wider">CMS Dashboard</p>
              </div>
              <div className="space-y-2 text-xs text-stone-500">
                {[
                  "BottomNav — native-style, optimistic state",
                  "MenuTabs — carta selector, horizontal scroll",
                  "DishEditRow — inline edit, auto-resize textarea",
                  "ColorPicker — 10 presets + custom hex input",
                  "FontPicker — Instagram-style, live preview",
                  "InviteOwnerButton — generate link + WhatsApp share",
                  "PlanSection — pricing toggle, Stripe checkout",
                ].map((c) => (
                  <div key={c} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-stone-300" />
                    <p>{c}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Principles ─── */}
      <Section className="px-6 py-24 bg-white border-y border-stone-200">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#F97316" }}>Principles</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            The rules behind the system.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                num: "01",
                title: "Mobile-first is not responsive",
                body: "Every component is designed at 375px first. Desktop doesn't add features — it adds breathing room. The CMS has no sidebar. Navigation lives at the bottom, within thumb reach.",
              },
              {
                num: "02",
                title: "The restaurant's identity, not ours",
                body: "Color and typography are free for all plans. When a restaurant owner sees their brand color and chosen font on their menu, it stops being 'a Menura menu' and becomes 'their menu.'",
              },
              {
                num: "03",
                title: "Zero-instruction interfaces",
                body: "If a UI needs a tooltip, the design failed. Every input, button, and gesture must be obvious to someone who only uses WhatsApp and their bank app. Label everything. Animate with purpose.",
              },
              {
                num: "04",
                title: "Speed is a design decision",
                body: "SSG for sub-2s loads. Optimistic updates for zero-latency editing. Skeleton shimmers instead of spinners. Auto-save instead of 'Submit'. The user should never feel like they're waiting.",
              },
              {
                num: "05",
                title: "Consistency over cleverness",
                body: "Same orange focus ring on every input. Same scale-90 on every button. Same toast for every save. The user builds muscle memory fast because the system never surprises them.",
              },
              {
                num: "06",
                title: "Generous defaults, graceful upgrades",
                body: "30 dishes, 15 photos, custom colors, custom fonts, multi-menu — all free. The free plan must feel complete, not crippled. Pro adds scale, not identity.",
              },
            ].map((p) => (
              <div key={p.num} className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-orange-200 hover:shadow-sm transition-all duration-200">
                <span className="text-xs font-mono font-semibold mb-3 block" style={{ color: "#F97316" }}>{p.num}</span>
                <h3 className="text-base font-bold text-stone-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Footer ─── */}
      <CaseStudyFooter title="menura" subtitle="Design System v1.0 · Designed & engineered by David" ctaLabel="Try Menura →" ctaHref="https://menura.mx" />
    </div>
  );
}