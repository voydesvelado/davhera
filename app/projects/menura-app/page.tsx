"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import CaseStudyFooter from "@/components/CaseStudyFooter";

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }} className={className}>
      {children}
    </motion.section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: "#F97316" }}>{children}</p>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{children}</h2>;
}

function SectionDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-base text-stone-500 leading-relaxed max-w-2xl mb-10">{children}</p>;
}


function FeatureDetail({ title, description, details }: { title: string; description: string; details?: string[] }) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-stone-200">
      <h4 className="text-sm font-bold text-stone-900 mb-1.5">{title}</h4>
      <p className="text-xs text-stone-500 leading-relaxed mb-3">{description}</p>
      {details && <div className="flex flex-wrap gap-1.5">{details.map((d) => <span key={d} className="px-2 py-0.5 text-[9px] font-medium text-stone-400 bg-stone-50 rounded border border-stone-100">{d}</span>)}</div>}
    </div>
  );
}

function FlowSteps({ steps }: { steps: string[] }) {
  return (
    <div className="flex items-center gap-1 flex-wrap mb-8">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-medium text-stone-600">
            <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
            {step}
          </div>
          {i < steps.length - 1 && <svg width="14" height="14" viewBox="0 0 14 14" className="text-stone-200 flex-shrink-0"><path d="M5 3.5l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" /></svg>}
        </div>
      ))}
    </div>
  );
}

function IterationNote({ before, after, reason }: { before: string; after: string; reason: string }) {
  return (
    <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 mt-6">
      <div className="flex items-center gap-2 mb-2">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7a5 5 0 1 1 5 5" stroke="#F97316" strokeWidth="1.3" strokeLinecap="round" /><path d="M2 10V7h3" stroke="#F97316" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span className="text-[10px] font-semibold text-orange-600 uppercase tracking-wider">Iteration</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
        <div><p className="text-[10px] font-semibold text-stone-400 uppercase mb-0.5">Before</p><p className="text-xs text-stone-500">{before}</p></div>
        <div><p className="text-[10px] font-semibold text-orange-500 uppercase mb-0.5">After</p><p className="text-xs text-stone-700">{after}</p></div>
      </div>
      <p className="text-[10px] text-stone-400 italic">{reason}</p>
    </div>
  );
}

export default function MenuraAppCaseStudy() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollYProgress: globalProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.7], [0, -40]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.025]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left bg-orange-500" style={{ scaleX: globalProgress }} />

      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="fixed top-0 left-0 right-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200/50">
        <div className="max-w-5xl mx-auto px-6 sm:px-0 h-14 flex items-center justify-between">
          <a href="/" className="text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors">← Portfolio</a>
          <div className="flex items-center gap-4">
            <span className="text-xs text-stone-400 tracking-wider uppercase hidden sm:block">Menura · App</span>
            <a href="https://menura.mx" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 active:scale-95 transition-all">Try it live ↗</a>
          </div>
        </div>
      </motion.nav>

      <motion.header ref={heroRef} style={{ opacity: heroOpacity, y: heroY }} className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 mb-6"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /><span className="text-xs font-medium text-orange-700">Product Deep Dive</span></div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }} className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Every screen.<br />Every interaction.<br /><span style={{ color: "#F97316" }}>Every decision explained.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="text-lg text-stone-500 max-w-xl mx-auto leading-relaxed">
            A walkthrough of the complete Menura app — from the moment a restaurant owner creates their menu to the moment a diner scans the QR.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }} className="flex justify-center gap-3 mt-8 flex-wrap">
            {["Onboarding", "Public Menu", "CMS Editor", "Settings", "Multi-Carta", "Payments"].map((tag) => <span key={tag} className="px-3 py-1 text-xs font-medium text-stone-500 bg-white rounded-full border border-stone-200">{tag}</span>)}
          </motion.div>
        </div>
      </motion.header>

      {/* ONBOARDING */}
      <Section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Flow 1 · Onboarding</SectionLabel>
          <SectionTitle>Value first. Register later.</SectionTitle>
          <SectionDescription>The user creates their entire menu before seeing a registration screen. By the time they're asked to sign up, they've invested 10 minutes and seen their menu rendered — they don't want to lose it.</SectionDescription>
          <FlowSteps steps={["Restaurant info", "Categories + Dishes", "Live preview", "Google Sign-in"]} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <motion.div ref={useRef(null)} initial={{ opacity: 0, y: 30, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }} className="group relative">
              <div className="aspect-square rounded-[24px] overflow-hidden bg-stone-100 border border-stone-200 relative transition-all duration-300 group-hover:border-stone-300 group-hover:shadow-lg group-hover:shadow-stone-200/40">
                <video src="/videos/menura-app/1.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-3 left-3"><span className="px-2 py-0.5 text-[9px] font-mono font-medium text-stone-400 bg-white/90 backdrop-blur-sm rounded-md border border-stone-100">Wizard — Full Flow</span></div>
              </div>
            </motion.div>
            <motion.div ref={useRef(null)} initial={{ opacity: 0, y: 30, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }} className="group relative">
              <div className="aspect-square rounded-[24px] overflow-hidden bg-stone-100 border border-stone-200 relative transition-all duration-300 group-hover:border-stone-300 group-hover:shadow-lg group-hover:shadow-stone-200/40">
                <video src="/videos/menura-app/2.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-3 left-3"><span className="px-2 py-0.5 text-[9px] font-mono font-medium text-stone-400 bg-white/90 backdrop-blur-sm rounded-md border border-stone-100">Preview = Public Menu</span></div>
              </div>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureDetail title="localStorage persistence" description="All wizard data lives in localStorage with 7-day TTL. Photos go to a temporary Supabase bucket. User can leave and return without losing progress." details={["7-day TTL", "Temp bucket", "No account needed"]} />
            <FeatureDetail title="Migration on registration" description="On Google sign-in, a Server Action migrates all data from localStorage + temp bucket to PostgreSQL + permanent storage atomically." details={["Atomic migration", "Temp → permanent", "Zero data loss"]} />
          </div>
          <IterationNote before="Required registration before creating the menu. 70%+ drop-off at sign-up." after="Menu creation first, registration after the 'aha moment' preview." reason="Users who've already built their menu don't want to lose their work. Sunk-cost works in our favor." />
        </div>
      </Section>

      {/* PUBLIC MENU */}
      <Section className="px-6 py-24 bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Flow 2 · Public Menu</SectionLabel>
          <SectionTitle>What the diner sees.</SectionTitle>
          <SectionDescription>Native-feeling menu that loads in under 3 seconds on 3G. No app download, no login. Scan → browse with photos, categories, search → swipe detail drawer → order.</SectionDescription>
          <FlowSteps steps={["Scan QR", "Browse + filter", "Dish detail", "Order"]} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <motion.div ref={useRef(null)} initial={{ opacity: 0, y: 30, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }} className="group relative">
              <div className="aspect-square rounded-[24px] overflow-hidden bg-stone-100 border border-stone-200 relative transition-all duration-300 group-hover:border-stone-300 group-hover:shadow-lg group-hover:shadow-stone-200/40">
                <video src="/videos/menura-app/3.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-3 left-3"><span className="px-2 py-0.5 text-[9px] font-mono font-medium text-stone-400 bg-white/90 backdrop-blur-sm rounded-md border border-stone-100">Browse, Filter & Search</span></div>
              </div>
            </motion.div>
            <motion.div ref={useRef(null)} initial={{ opacity: 0, y: 30, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }} className="group relative">
              <div className="aspect-square rounded-[24px] overflow-hidden bg-stone-100 border border-stone-200 relative transition-all duration-300 group-hover:border-stone-300 group-hover:shadow-lg group-hover:shadow-stone-200/40">
                <video src="/videos/menura-app/4.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-3 left-3"><span className="px-2 py-0.5 text-[9px] font-mono font-medium text-stone-400 bg-white/90 backdrop-blur-sm rounded-md border border-stone-100">Dish Detail Drawer</span></div>
              </div>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureDetail title="SSG + ISR" description="Pre-rendered and cached on CDN. Zero DB queries per visit. Revalidates on-demand when the owner edits." details={["<2s on 3G", "CDN cached", "ISR revalidation"]} />
            <FeatureDetail title="Vaul drawer" description="Spring physics, scroll-aware close detection. Skeleton while loading, 300ms opacity fade. key={id} resets between dishes." details={["Swipe dismiss", "Scroll-aware", "Skeleton → fade"]} />
            <FeatureDetail title="Dynamic theming" description="Color + font via CSS custom properties. Android status bar matches via dynamic theme-color meta tag per restaurant." details={["--menu-color", "3 font themes", "Android meta"]} />
          </div>
          <IterationNote before="No category chips. Diners scrolled through everything." after="Horizontal chips with 'Todo' default. Tap to jump to any section." reason="Field testing at a café with 8+ categories: diners couldn't find desserts." />
        </div>
      </Section>

      {/* CMS EDITOR */}
      <Section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Flow 3 · CMS Editor</SectionLabel>
          <SectionTitle>Edit a price in 30 seconds. From your phone.</SectionTitle>
          <SectionDescription>Designed for a restaurant owner editing on their phone with one hand in the kitchen. Auto-save everywhere. No "Save" button. Consistent orange focus rings. Touch targets ≥44px.</SectionDescription>
          <FlowSteps steps={["Open CMS", "Tap to edit", "Auto-saved ✓"]} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <motion.div ref={useRef(null)} initial={{ opacity: 0, y: 30, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }} className="group relative">
              <div className="aspect-square rounded-[24px] overflow-hidden bg-stone-100 border border-stone-200 relative transition-all duration-300 group-hover:border-stone-300 group-hover:shadow-lg group-hover:shadow-stone-200/40">
                <video src="/videos/menura-app/5.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-3 left-3"><span className="px-2 py-0.5 text-[9px] font-mono font-medium text-stone-400 bg-white/90 backdrop-blur-sm rounded-md border border-stone-100">Inline Editing — All Fields</span></div>
              </div>
            </motion.div>
            <motion.div ref={useRef(null)} initial={{ opacity: 0, y: 30, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }} className="group relative">
              <div className="aspect-square rounded-[24px] overflow-hidden bg-stone-100 border border-stone-200 relative transition-all duration-300 group-hover:border-stone-300 group-hover:shadow-lg group-hover:shadow-stone-200/40">
                <video src="/videos/menura-app/6.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-3 left-3"><span className="px-2 py-0.5 text-[9px] font-mono font-medium text-stone-400 bg-white/90 backdrop-blur-sm rounded-md border border-stone-100">Organize & Manage</span></div>
              </div>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureDetail title="Auto-save" description="No 'Save' button anywhere. Every edit persists immediately with optimistic updates. Toast confirms." details={["Optimistic UI", "Toast", "ISR revalidation"]} />
            <FeatureDetail title="Consistent focus" description="Every editable field: same orange border on focus. border-transparent when idle — zero layout shift." details={["border-orange-400", "ring-orange-500/20", "All inputs"]} />
            <FeatureDetail title="Auto-resize textarea" description="Description grows with content. rows=1 at rest. No scrollbar, no resize handle. scrollHeight sync on every keystroke." details={["scrollHeight", "resize-none", "overflow-hidden"]} />
          </div>
          <IterationNote before="V1 had a 'Save' button. Users kept asking 'did it save?'" after="Removed all save buttons. Auto-save + toast on every change." reason="The cognitive load of wondering is worse than just auto-saving." />
        </div>
      </Section>

      {/* MULTI-CARTA + SETTINGS */}
      <Section className="px-6 py-24 bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Features · Multi-Carta & Customization</SectionLabel>
          <SectionTitle>Multiple menus by time of day. Your brand, your look.</SectionTitle>
          <SectionDescription>Separate cartas for breakfast/lunch/dinner with auto-detection. Plus colors, typography, and logo — all free. A strategic decision for adoption in a tough market.</SectionDescription>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <motion.div ref={useRef(null)} initial={{ opacity: 0, y: 30, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }} className="group relative">
              <div className="aspect-square rounded-[24px] overflow-hidden bg-stone-100 border border-stone-200 relative transition-all duration-300 group-hover:border-stone-300 group-hover:shadow-lg group-hover:shadow-stone-200/40">
                <video src="/videos/menura-app/7.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-3 left-3"><span className="px-2 py-0.5 text-[9px] font-mono font-medium text-stone-400 bg-white/90 backdrop-blur-sm rounded-md border border-stone-100">Multi-Carta Flow</span></div>
              </div>
            </motion.div>
            <motion.div ref={useRef(null)} initial={{ opacity: 0, y: 30, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }} className="group relative">
              <div className="aspect-square rounded-[24px] overflow-hidden bg-stone-100 border border-stone-200 relative transition-all duration-300 group-hover:border-stone-300 group-hover:shadow-lg group-hover:shadow-stone-200/40">
                <video src="/videos/menura-app/8.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-3 left-3"><span className="px-2 py-0.5 text-[9px] font-mono font-medium text-stone-400 bg-white/90 backdrop-blur-sm rounded-md border border-stone-100">Appearance Settings</span></div>
              </div>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureDetail title="Time-based detection" description="Reads the browser's time, matches against each carta's schedule. Handles midnight-crossing. Diner can also switch manually." details={["Client-side", "Midnight crossing", "Manual override"]} />
            <FeatureDetail title="Free personalization" description="Colors (10 presets + custom hex) and typography (3 themes with live preview) are free. CSS variables, zero build step." details={["Strategic decision", "CSS vars", "Retention driver"]} />
          </div>
          <IterationNote before="Color and typography were Pro-only ($249/mo)." after="Moved to free. Pro retains: unlimited dishes, no badge, translation, analytics." reason="Free personalization makes the menu feel 'owned'. Retention increased." />
        </div>
      </Section>

      {/* NAVIGATION + PAYMENTS + INVITATION */}
      <Section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Dashboard · Payments · Sales</SectionLabel>
          <SectionTitle>Native navigation. Two-tap upgrade. Zero-friction sales.</SectionTitle>
          <SectionDescription>Bottom nav with optimistic switching. Stripe-powered upgrade with annual toggle. And the most powerful tool: create a menu for a restaurant, send them a link, they claim it with one tap.</SectionDescription>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <motion.div ref={useRef(null)} initial={{ opacity: 0, y: 30, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }} className="group relative">
              <div className="aspect-square rounded-[24px] overflow-hidden bg-stone-100 border border-stone-200 relative transition-all duration-300 group-hover:border-stone-300 group-hover:shadow-lg group-hover:shadow-stone-200/40">
                <video src="/videos/menura-app/9.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-3 left-3"><span className="px-2 py-0.5 text-[9px] font-mono font-medium text-stone-400 bg-white/90 backdrop-blur-sm rounded-md border border-stone-100">Dashboard Navigation</span></div>
              </div>
            </motion.div>
            <motion.div ref={useRef(null)} initial={{ opacity: 0, y: 30, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }} className="group relative">
              <div className="aspect-square rounded-[24px] overflow-hidden bg-stone-100 border border-stone-200 relative transition-all duration-300 group-hover:border-stone-300 group-hover:shadow-lg group-hover:shadow-stone-200/40">
                <video src="/videos/menura-app/10.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-3 left-3"><span className="px-2 py-0.5 text-[9px] font-mono font-medium text-stone-400 bg-white/90 backdrop-blur-sm rounded-md border border-stone-100">Upgrade to Pro</span></div>
              </div>
            </motion.div>
            <motion.div ref={useRef(null)} initial={{ opacity: 0, y: 30, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, delay: 0.24, ease: [0.25, 0.1, 0.25, 1] }} className="group relative">
              <div className="aspect-square rounded-[24px] overflow-hidden bg-stone-100 border border-stone-200 relative transition-all duration-300 group-hover:border-stone-300 group-hover:shadow-lg group-hover:shadow-stone-200/40">
                <video src="/videos/menura-app/11.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-3 left-3"><span className="px-2 py-0.5 text-[9px] font-mono font-medium text-stone-400 bg-white/90 backdrop-blur-sm rounded-md border border-stone-100">Menu Invitation</span></div>
              </div>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureDetail title="Optimistic nav" description="useTransition + optimistic state highlights tabs instantly. 2px progress bar only if nav >100ms." details={["useTransition", "Conditional bar", "active:scale-90"]} />
            <FeatureDetail title="Pricing psychology" description="Toggle defaults to annual ($200/mo vs $249). '🔥 Oferta por tiempo limitado' badge creates urgency without pressure." details={["Default annual", "-20% badge", "Value-first CTA"]} />
            <FeatureDetail title="Atomic transfer" description="Menu invitation: one UPDATE transfers the restaurant with all dishes, photos, and analytics to the new owner." details={["30-day token", "Single UPDATE", "WhatsApp delivery"]} />
          </div>
        </div>
      </Section>

      {/* MICRO-INTERACTIONS */}

      <CaseStudyFooter title="menura" subtitle="Designed & engineered by David — Design Engineer" ctaLabel="Try Menura →" ctaHref="https://menura.mx" />

      <style>{`@keyframes shimmerSlow { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
    </div>
  );
}