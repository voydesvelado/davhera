"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll } from "framer-motion";
import CaseStudyFooter from "@/components/CaseStudyFooter";

// ─── Animated SVG Components ───────────────────────────────────────

function PhoneFrame({ children, className = "" }) {
  return (
    <div className={`relative mx-auto ${className}`} style={{ width: 220 }}>
      <div
        className="bg-white rounded-[28px] overflow-hidden"
        style={{
          boxShadow:
            "0 0 0 1px rgba(28,25,23,0.06), 0 8px 40px rgba(28,25,23,0.10)",
        }}
      >
        <div className="h-4" />
        {children}
        <div className="h-3" />
      </div>
    </div>
  );
}

function AnimatedMenuSVG() {
  return (
    <PhoneFrame>
      <svg viewBox="0 0 220 360" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Header */}
        <text x="20" y="28" fill="#1C1917" fontSize="16" fontWeight="700" fontFamily="sans-serif">Cafetería</text>

        {/* Search bar */}
        <rect x="16" y="40" width="188" height="28" rx="14" fill="#F5F5F4" />
        <circle cx="30" cy="54" r="5" stroke="#A8A29E" strokeWidth="1.2" fill="none" />
        <text x="42" y="58" fill="#A8A29E" fontSize="9" fontFamily="sans-serif">Buscar en el menú</text>

        {/* Category chips with stagger animation */}
        <g>
          <rect x="16" y="78" width="40" height="22" rx="11" fill="#F97316">
            <animate attributeName="opacity" values="0;1" dur="0.4s" begin="0.2s" fill="freeze" />
          </rect>
          <text x="25" y="93" fill="white" fontSize="8" fontWeight="600" fontFamily="sans-serif">
            <animate attributeName="opacity" values="0;1" dur="0.4s" begin="0.2s" fill="freeze" />
            Todo
          </text>

          <rect x="62" y="78" width="52" height="22" rx="11" fill="#F5F5F4" stroke="#E7E5E4" strokeWidth="0.5">
            <animate attributeName="opacity" values="0;1" dur="0.4s" begin="0.35s" fill="freeze" />
          </rect>
          <text x="70" y="93" fill="#57534E" fontSize="8" fontFamily="sans-serif">
            <animate attributeName="opacity" values="0;1" dur="0.4s" begin="0.35s" fill="freeze" />
            Café y té
          </text>

          <rect x="120" y="78" width="52" height="22" rx="11" fill="#F5F5F4" stroke="#E7E5E4" strokeWidth="0.5">
            <animate attributeName="opacity" values="0;1" dur="0.4s" begin="0.5s" fill="freeze" />
          </rect>
          <text x="126" y="93" fill="#57534E" fontSize="8" fontFamily="sans-serif">
            <animate attributeName="opacity" values="0;1" dur="0.4s" begin="0.5s" fill="freeze" />
            Postres
          </text>
        </g>

        {/* Category label */}
        <text x="16" y="124" fill="#A8A29E" fontSize="8" fontWeight="600" letterSpacing="1" fontFamily="sans-serif">
          CAFÉ Y TÉ
        </text>
        <line x1="16" y1="130" x2="204" y2="130" stroke="#F5F5F4" strokeWidth="1" />

        {/* Dish 1 */}
        <g>
          <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.6s" fill="freeze" />
          <text x="16" y="152" fill="#1C1917" fontSize="11" fontWeight="600" fontFamily="sans-serif">Cappuccino</text>
          <text x="16" y="165" fill="#A8A29E" fontSize="8" fontFamily="sans-serif">Espresso doble con leche</text>
          <text x="16" y="180" fill="#F97316" fontSize="10" fontWeight="700" fontFamily="monospace">$65</text>
          <rect x="158" y="140" width="46" height="46" rx="10" fill="#E7E5E4">
            <animate attributeName="fill" values="#E7E5E4;#D6D3D1;#E7E5E4" dur="1.5s" repeatCount="indefinite" />
          </rect>
          <rect x="158" y="140" width="46" height="46" rx="10" fill="#D4C4A8" opacity="0">
            <animate attributeName="opacity" values="0;1" dur="0.3s" begin="1.2s" fill="freeze" />
          </rect>
        </g>

        {/* Dish 2 */}
        <g>
          <animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.8s" fill="freeze" />
          <text x="16" y="216" fill="#1C1917" fontSize="11" fontWeight="600" fontFamily="sans-serif">Matcha Latte</text>
          <text x="16" y="229" fill="#A8A29E" fontSize="8" fontFamily="sans-serif">Matcha ceremonial con leche</text>
          <text x="16" y="244" fill="#F97316" fontSize="10" fontWeight="700" fontFamily="monospace">$80</text>
          <rect x="158" y="204" width="46" height="46" rx="10" fill="#C8D4A8" opacity="0">
            <animate attributeName="opacity" values="0;1" dur="0.3s" begin="1.4s" fill="freeze" />
          </rect>
        </g>

        {/* Dish 3 */}
        <g>
          <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.0s" fill="freeze" />
          <text x="16" y="280" fill="#1C1917" fontSize="11" fontWeight="600" fontFamily="sans-serif">Chai Latte</text>
          <text x="16" y="293" fill="#A8A29E" fontSize="8" fontFamily="sans-serif">Especias con leche espumada</text>
          <text x="16" y="308" fill="#F97316" fontSize="10" fontWeight="700" fontFamily="monospace">$70</text>
          <rect x="158" y="268" width="46" height="46" rx="10" fill="#C4A87D" opacity="0">
            <animate attributeName="opacity" values="0;1" dur="0.3s" begin="1.6s" fill="freeze" />
          </rect>
        </g>

        {/* Footer badge */}
        <g opacity="0.4">
          <text x="68" y="348" fill="#A8A29E" fontSize="7" fontFamily="sans-serif">Hecho con menura</text>
        </g>
      </svg>
    </PhoneFrame>
  );
}

function AnimatedPDFvsMenura() {
  return (
    <div className="flex items-center gap-6 justify-center">
      {/* PDF side */}
      <div className="text-center">
        <div
          className="w-36 h-52 bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-center overflow-hidden relative"
        >
          <svg viewBox="0 0 144 208" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Simulated tiny text — illegible */}
            {Array.from({ length: 18 }).map((_, i) => {
              const w = 50 + ((i * 37 + 13) % 40);
              const ox = 100 + ((i * 17 + 7) % 20);
              return (
                <g key={i}>
                  <rect x="12" y={16 + i * 10} width={w} height="3" rx="1.5" fill="#D6D3D1" />
                  <rect x={ox} y={16 + i * 10} width="20" height="3" rx="1.5" fill="#D6D3D1" />
                </g>
              );
            })}
            {/* Zoom gesture */}
            <g opacity="0">
              <animate attributeName="opacity" values="0;0.8;0" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
              <circle cx="72" cy="104" r="20" stroke="#F97316" strokeWidth="1.5" fill="none" strokeDasharray="4 3">
                <animate attributeName="r" values="16;28" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
              </circle>
              {/* Fingers */}
              <circle cx="62" cy="96" r="4" fill="#F97316" opacity="0.4">
                <animate attributeName="cx" values="66;58" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
                <animate attributeName="cy" values="100;92" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
              </circle>
              <circle cx="82" cy="112" r="4" fill="#F97316" opacity="0.4">
                <animate attributeName="cx" values="78;86" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
                <animate attributeName="cy" values="108;116" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
              </circle>
            </g>
          </svg>
        </div>
        <p className="text-xs text-stone-400 mt-3 font-medium">PDF en 6"</p>
      </div>

      {/* Arrow */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-stone-300 flex-shrink-0">
        <path d="M8 16h14M18 11l4.5 5-4.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* Menura side */}
      <div className="text-center">
        <div
          className="w-36 h-52 bg-white rounded-2xl border border-stone-200 overflow-hidden"
          style={{ boxShadow: "0 4px 20px rgba(28,25,23,0.06)" }}
        >
          <svg viewBox="0 0 144 208" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Header */}
            <text x="12" y="22" fill="#1C1917" fontSize="11" fontWeight="700" fontFamily="sans-serif">Cafetería</text>

            {/* Chips */}
            <rect x="10" y="30" width="30" height="14" rx="7" fill="#F97316" />
            <text x="16" y="40" fill="white" fontSize="6" fontWeight="600" fontFamily="sans-serif">Todo</text>
            <rect x="44" y="30" width="38" height="14" rx="7" fill="#F5F5F4" />
            <text x="49" y="40" fill="#78716C" fontSize="6" fontFamily="sans-serif">Café y té</text>

            {/* Items with photos */}
            <g>
              <text x="12" y="64" fill="#1C1917" fontSize="8" fontWeight="600" fontFamily="sans-serif">Cappuccino</text>
              <text x="12" y="74" fill="#A8A29E" fontSize="6" fontFamily="sans-serif">Espresso doble con leche</text>
              <text x="12" y="86" fill="#F97316" fontSize="8" fontWeight="700" fontFamily="monospace">$65</text>
              <rect x="104" y="56" width="30" height="30" rx="8" fill="#D4C4A8" />
            </g>

            <line x1="12" y1="96" x2="132" y2="96" stroke="#F5F5F4" />

            <g>
              <text x="12" y="112" fill="#1C1917" fontSize="8" fontWeight="600" fontFamily="sans-serif">Matcha Latte</text>
              <text x="12" y="122" fill="#A8A29E" fontSize="6" fontFamily="sans-serif">Matcha ceremonial</text>
              <text x="12" y="134" fill="#F97316" fontSize="8" fontWeight="700" fontFamily="monospace">$80</text>
              <rect x="104" y="104" width="30" height="30" rx="8" fill="#C8D4A8" />
            </g>

            <line x1="12" y1="144" x2="132" y2="144" stroke="#F5F5F4" />

            <g>
              <text x="12" y="160" fill="#1C1917" fontSize="8" fontWeight="600" fontFamily="sans-serif">Chai Latte</text>
              <text x="12" y="170" fill="#A8A29E" fontSize="6" fontFamily="sans-serif">Especias con leche</text>
              <text x="12" y="182" fill="#F97316" fontSize="8" fontWeight="700" fontFamily="monospace">$70</text>
              <rect x="104" y="152" width="30" height="30" rx="8" fill="#C4A87D" />
            </g>
          </svg>
        </div>
        <p className="text-xs text-orange-600 mt-3 font-semibold">Menura</p>
      </div>
    </div>
  );
}

function FlowDiagram({ steps, activeStep }) {
  return (
    <div className="flex items-center gap-1 justify-center flex-wrap">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-1">
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-500 ${
              i <= activeStep
                ? "bg-orange-500 text-white"
                : "bg-stone-100 text-stone-400"
            }`}
          >
            {step}
          </div>
          {i < steps.length - 1 && (
            <svg width="16" height="16" viewBox="0 0 16 16" className={`transition-colors duration-500 ${i < activeStep ? "text-orange-300" : "text-stone-200"}`}>
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

function StatBlock({ value, label, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 1200;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numericValue));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, numericValue]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl font-bold text-stone-900 tabular-nums tracking-tight">
        {value.startsWith("<") && "<"}{value.startsWith("+") && "+"}{count}{suffix}
      </p>
      <p className="text-xs text-stone-400 mt-1">{label}</p>
    </div>
  );
}

function useScrollReveal() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

function Section({ children, className = "" }) {
  const [ref, isVisible] = useScrollReveal();
  return (
    <section
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </section>
  );
}

// ─── Main Case Study Page ──────────────────────────────────────────

export default function MenuraCaseStudy() {
  const { scrollYProgress } = useScroll();
  const [activeOnboardingStep, setActiveOnboardingStep] = useState(0);
  const [activeEditStep, setActiveEditStep] = useState(0);

  useEffect(() => {
    const t1 = setInterval(() => setActiveOnboardingStep((s) => (s + 1) % 5), 2000);
    const t2 = setInterval(() => setActiveEditStep((s) => (s + 1) % 4), 2200);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left bg-orange-500" style={{ scaleX: scrollYProgress }} />

      {/* ─── Nav ─── */}
      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="fixed top-0 left-0 right-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200/50">
        <div className="max-w-5xl mx-auto px-6 sm:px-0 h-14 flex items-center justify-between">
          <a href="/" className="text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors">← Portfolio</a>
          <div className="flex items-center gap-4">
            <span className="text-xs text-stone-400 tracking-wider uppercase hidden sm:block">Menura · Case Study</span>
            <a href="https://menura.mx" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 active:scale-95 transition-all">Try it live ↗</a>
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <header className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-medium text-orange-700">Live at menura.mx</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-stone-900 mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Replacing PDFs with menus
            <br />
            <span style={{ color: "#F97316" }}>restaurants actually deserve.</span>
          </h1>

          <p className="text-lg text-stone-500 max-w-xl mx-auto leading-relaxed">
            A mobile-first digital menu platform for 736,000+ restaurants in Mexico.
            Designed and built as a solo Design Engineer — from research to production.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {["UX Research", "Product Design", "Design System", "Frontend Dev", "Full-Stack"].map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs font-medium text-stone-500 bg-white rounded-full border border-stone-200">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ─── The Problem ─── */}
      <Section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-3">The Problem</p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            The menu is a restaurant's #1 sales tool.<br />
            And it's broken on every phone.
          </h2>
          <p className="text-base text-stone-500 leading-relaxed max-w-2xl mb-12">
            After COVID, Mexican restaurants adopted QR codes. But they just uploaded their print-designed PDF — a format made for paper, forced onto 6-inch screens. The result: tiny text, no photos, no navigation, and diners who give up and ask the waiter.
          </p>

          <AnimatedPDFvsMenura />
        </div>
      </Section>

      {/* ─── Research Insights ─── */}
      <Section className="px-6 pb-24 bg-white border-y border-stone-200">
        <div className="max-w-4xl mx-auto py-20">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-3">Research</p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            What the data told us
          </h2>
          <p className="text-base text-stone-500 max-w-2xl mb-12">
            Secondary research across INEGI, CANIRAC, DENUE, and 10+ competitor audits revealed three Jobs-to-be-Done that shaped every design decision.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                job: "J1",
                quote: "When a diner scans the QR, I want them to see a visual, fast, navigable menu.",
                insight: "If the menu isn't better than the PDF, nothing else matters.",
              },
              {
                job: "J5",
                quote: "When I first open, I want my digital menu ready in under 10 minutes.",
                insight: "Restaurateurs have 10 minutes of attention before the kitchen calls.",
              },
              {
                job: "J6",
                quote: "When prices change, I want to update in seconds from my phone.",
                insight: "If updating takes more than 30 seconds, it loses its reason to exist.",
              },
            ].map((item) => (
              <div
                key={item.job}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200"
              >
                <span className="inline-block px-2 py-0.5 text-xs font-bold text-orange-600 bg-orange-50 rounded-md mb-3">
                  {item.job} — P0
                </span>
                <p className="text-sm text-stone-700 font-medium leading-relaxed italic mb-3">
                  "{item.quote}"
                </p>
                <p className="text-xs text-stone-400 leading-relaxed">
                  {item.insight}
                </p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-stone-100">
            <StatBlock value="736000" suffix="+" label="Restaurants in Mexico" />
            <StatBlock value="96" suffix="%" label="Are microenterprises" />
            <StatBlock value="30" suffix="%" label="Sales uplift with photos" />
            <StatBlock value="47" suffix="M" label="Tourists in 2025" />
          </div>
        </div>
      </Section>

      {/* ─── Users ─── */}
      <Section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-3">Users</p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Sell to the owner. Design for the manager.
          </h2>
          <p className="text-base text-stone-500 max-w-2xl mb-10">
            The pitch is emotional. Retention is operational.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-stone-200">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="7" r="3.5" stroke="#78716C" strokeWidth="1.5" />
                  <path d="M3 17.5c0-3.5 3-5.5 7-5.5s7 2 7 5.5" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="font-bold text-stone-900 mb-1">Beto — The Owner</h3>
              <p className="text-xs text-stone-400 mb-3">45 years old · Runs a seafood restaurant · 12-hour days</p>
              <p className="text-sm text-stone-500 leading-relaxed">
                His digital life is WhatsApp and his bank app. His nephew made the menu in Canva two years ago. Changing a price means calling the nephew and waiting 2–7 days.
              </p>
              <div className="mt-4 px-3 py-2 rounded-lg bg-orange-50 text-xs text-orange-700 font-medium">
                "I want my clients to see a professional menu with photos and change prices myself."
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="7" r="3.5" stroke="#F97316" strokeWidth="1.5" />
                  <path d="M3 17.5c0-3.5 3-5.5 7-5.5s7 2 7 5.5" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="font-bold text-stone-900 mb-1">Mariana — The Manager</h3>
              <p className="text-xs text-stone-400 mb-3">32 years old · Runs everything · Lives on her phone</p>
              <p className="text-sm text-stone-500 leading-relaxed">
                She manages operations, social media, suppliers, and staff. She's the one who googles solutions and recommends them to the owner. She needs tools that explain themselves.
              </p>
              <div className="mt-4 px-3 py-2 rounded-lg bg-orange-50 text-xs text-orange-700 font-medium">
                "Can I change a price in 30 seconds from my phone?"
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Core Flows ─── */}
      <Section className="px-6 py-24 bg-white border-y border-stone-200">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-3">Design</p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Three flows, iterated through field visits
          </h2>
          <p className="text-base text-stone-500 max-w-2xl mb-12">
            Each flow was defined by research, built, tested with real restaurant owners in Puebla, and refined based on where they got stuck.
          </p>

          {/* Flow 1: Onboarding */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">1</span>
              <h3 className="font-bold text-lg text-stone-900">Value-First Onboarding</h3>
            </div>
            <p className="text-sm text-stone-500 mb-6 max-w-xl">
              The user creates their menu <strong>before</strong> registering. They see the "aha moment" — their menu rendered beautifully — and only then are asked to sign up. This inverts the traditional funnel.
            </p>
            <FlowDiagram
              steps={["Landing", "Create menu", "Add dishes", "Preview ✨", "Google Sign-in"]}
              activeStep={activeOnboardingStep}
            />
            <div className="mt-6 p-4 rounded-xl bg-stone-50 border border-stone-100">
              <p className="text-xs text-stone-500">
                <span className="font-semibold text-stone-700">Iteration:</span> Initially required registration first. Field testing showed 70%+ drop-off at the sign-up screen. Inverting to value-first increased completion dramatically — users who see their menu rendered don't want to lose it.
              </p>
            </div>
          </div>

          {/* Flow 2: Public Menu */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">2</span>
              <h3 className="font-bold text-lg text-stone-900">Public Menu Experience</h3>
            </div>
            <p className="text-sm text-stone-500 mb-6 max-w-xl">
              The diner scans a QR and gets a native-feeling menu that loads in under 3 seconds on 3G. Categories, search, photos, and a swipe-to-dismiss detail drawer with skeleton shimmer.
            </p>

            <div className="flex justify-center">
              <AnimatedMenuSVG />
            </div>

            <div className="mt-8 p-4 rounded-xl bg-stone-50 border border-stone-100">
              <p className="text-xs text-stone-500">
                <span className="font-semibold text-stone-700">Iteration:</span> V1 had no category chips — users scrolled through everything. Field testing showed diners at cafés with 8+ categories couldn't find desserts. Adding horizontal filter chips reduced average time-to-order by letting diners jump to what they want.
              </p>
            </div>
          </div>

          {/* Flow 3: Daily Editing */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">3</span>
              <h3 className="font-bold text-lg text-stone-900">30-Second Editing</h3>
            </div>
            <p className="text-sm text-stone-500 mb-6 max-w-xl">
              The owner opens the CMS on their phone, taps a price, types the new one — done. Auto-save with optimistic updates. No "Save" button, no loading spinner, no waiting.
            </p>
            <FlowDiagram
              steps={["Open CMS", "Find dish", "Edit price", "Auto-saved ✓"]}
              activeStep={activeEditStep}
            />
            <div className="mt-6 p-4 rounded-xl bg-stone-50 border border-stone-100">
              <p className="text-xs text-stone-500">
                <span className="font-semibold text-stone-700">Iteration:</span> V1 had a "Save" button. Users kept asking "did it save?" — the anxiety of unsaved changes was worse than just auto-saving. We removed the button and added toast confirmations. Zero complaints since.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Design System ─── */}
      <Section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-3">Design System</p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Built for warmth, speed, and trust
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Typography */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">Typography</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Plus Jakarta Sans</p>
                  <p className="text-xs text-stone-400">Display · Headings</p>
                </div>
                <div>
                  <p className="text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>DM Sans</p>
                  <p className="text-xs text-stone-400">Body · Descriptions</p>
                </div>
                <div>
                  <p className="text-lg font-semibold" style={{ fontFamily: "monospace" }}>JetBrains Mono</p>
                  <p className="text-xs text-stone-400">Prices · Data</p>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">Colors</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500" />
                  <div>
                    <p className="text-sm font-medium">#F97316</p>
                    <p className="text-xs text-stone-400">Primary · Actions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-900" />
                  <div>
                    <p className="text-sm font-medium">#1C1917</p>
                    <p className="text-xs text-stone-400">Text · Headlines</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200" />
                  <div>
                    <p className="text-sm font-medium">Stone Scale</p>
                    <p className="text-xs text-stone-400">Warm neutrals</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-stone-400 mt-4 leading-relaxed">
                Per-restaurant colors injected as CSS custom properties. 10 presets + custom hex.
              </p>
            </div>

            {/* Principles */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">Interaction</p>
              <div className="space-y-3">
                {[
                  { label: "Auto-save", desc: "No save button. Toast confirms." },
                  { label: "Optimistic UI", desc: "Drag reorder updates instantly." },
                  { label: "Swipe dismiss", desc: "Spring physics via Vaul." },
                  { label: "Skeleton shimmer", desc: "Images fade-in on load." },
                  { label: "Scale feedback", desc: "active:scale-90 on all taps." },
                ].map((p) => (
                  <div key={p.label}>
                    <p className="text-sm font-semibold text-stone-900">{p.label}</p>
                    <p className="text-xs text-stone-400">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Tech (brief) ─── */}
      <Section className="px-6 py-20 bg-stone-900 text-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">Implementation</p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            One person. Full stack.
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { tech: "Next.js 16", role: "Framework" },
              { tech: "TypeScript", role: "Language" },
              { tech: "Tailwind", role: "Styling" },
              { tech: "Supabase", role: "Backend" },
              { tech: "Stripe", role: "Payments" },
              { tech: "Vercel", role: "Hosting" },
              { tech: "shadcn/ui", role: "Components" },
              { tech: "Resend", role: "Email" },
            ].map((item) => (
              <div key={item.tech} className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm font-semibold text-white">{item.tech}</p>
                <p className="text-xs text-stone-400">{item.role}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-sm text-stone-300 leading-relaxed">
              <span className="text-white font-semibold">Key architectural decisions: </span>
              SSG + ISR for sub-2-second menu loads on 3G. Row Level Security as the primary security layer. CSS custom properties for per-restaurant theming. Server Actions via {"<form action={}>"} to avoid iOS Safari silent failures. Optimistic nav state with useTransition for native-feeling tab switches.
            </p>
          </div>
        </div>
      </Section>

      {/* ─── Key Learnings ─── */}
      <Section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-3">Learnings</p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            What I'd tell myself at the start
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "The preview is the conversion moment",
                body: "Everything exists to get the user to the preview. If it doesn't look spectacular, nothing else matters.",
              },
              {
                title: "Generosity beats pressure",
                body: "We started with 15 dishes / 5 photos (too restrictive). Moving to 30/15 and making colors + typography free increased retention significantly.",
              },
              {
                title: "Field visits are irreplaceable",
                body: "Sitting in a restaurant, seeing handwritten price corrections, and talking to the owner reveals insights no analytics can provide.",
              },
              {
                title: "Design Engineer = speed",
                body: "No handoff between design and code. Seeing a UX bug, understanding the code, and fixing it in the same session creates iteration velocity a separated team can't match.",
              },
            ].map((l) => (
              <div key={l.title} className="p-5 rounded-2xl bg-white border border-stone-200">
                <h3 className="font-bold text-stone-900 mb-2">{l.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Footer ─── */}
      <CaseStudyFooter title="menura" subtitle="Designed & built by David — Design Engineer" ctaLabel="Try Menura →" ctaHref="https://menura.mx" />
    </div>
  );
}