"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";
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

function BeforeAfter({ src1, alt1, src2, alt2 }: { src1: string; alt1: string; src2: string; alt2: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }} className="space-y-3">
      <div className="rounded-[20px] overflow-hidden border border-stone-200">
        <div className="px-3 pt-3 pb-1 flex items-center gap-2 bg-stone-50">
          <span className="px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-stone-400 bg-white rounded border border-stone-100">Before</span>
        </div>
        <Image src={src1} alt={alt1} width={1600} height={1000} className="w-full h-auto" />
      </div>
      <div className="rounded-[20px] overflow-hidden border border-orange-100">
        <div className="px-3 pt-3 pb-1 flex items-center gap-2 bg-orange-50/60">
          <span className="px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-orange-600 bg-white rounded border border-orange-100">After</span>
        </div>
        <Image src={src2} alt={alt2} width={1600} height={1000} className="w-full h-auto" />
      </div>
    </motion.div>
  );
}

function InsightCard({ text, index = 0 }: { text: string; index?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className="p-5 rounded-2xl bg-white border border-stone-200 flex items-start gap-3">
      <div className="w-5 h-5 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{index + 1}</div>
      <p className="text-sm font-medium text-stone-700 leading-snug">{text}</p>
    </motion.div>
  );
}

function StatBadge({ value, label }: { value: number; label: string }) {
  return (
    <div className="inline-flex items-baseline gap-1.5 px-4 py-3 rounded-2xl bg-orange-50 border border-orange-100">
      <span className="text-3xl font-bold" style={{ color: "#F97316" }}>{value}%</span>
      <span className="text-sm text-stone-500 max-w-[160px] leading-tight">{label}</span>
    </div>
  );
}

export default function DiorRepositoryCaseStudy() {
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
            <span className="text-xs text-stone-400 tracking-wider uppercase hidden sm:block">Dior LatAm · Repository</span>
            <span className="px-3 py-1.5 text-xs font-semibold text-stone-500 bg-white rounded-lg border border-stone-200">Design Lead</span>
          </div>
        </div>
      </motion.nav>

      <motion.header ref={heroRef} style={{ opacity: heroOpacity, y: heroY }} className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span className="text-xs font-medium text-orange-700">Case Study</span>
                </div>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }} className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Removing friction<br />from everyday work.
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="text-lg text-stone-500 leading-relaxed mb-8 max-w-lg">
                Redesigning Dior Latin America's file repository to help teams access, manage, and reuse files faster with a clearer and more intuitive experience.
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[["Client", "Dior Latam"], ["Duration", "8 months"], ["Platform", "Web, Responsive"], ["Role", "Design Lead"]].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-stone-700">{value}</p>
                  </div>
                ))}
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="rounded-[24px] overflow-hidden border border-stone-200 shadow-lg shadow-stone-200/40">
              <Image src="/case-studies/dior/hero101.png" alt="Dior LatAm repository redesign" width={1040} height={760} priority className="w-full h-auto" />
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* BACKGROUND */}
      <Section className="px-6 py-24 bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Background</SectionLabel>
          <SectionTitle>Upgrading Dior LatAm's file management experience</SectionTitle>
          <SectionDescription>Dior Latin America teams relied on a file repository that was difficult to navigate and inefficient to use. Poor UI decisions and a fragmented information structure made it hard to locate assets quickly. As a result, everyday tasks took longer than necessary, increasing frustration and reducing overall productivity.</SectionDescription>
          <div className="rounded-[24px] overflow-hidden border border-stone-200 shadow-sm">
            <Image src="/case-studies/dior/repository/background-n.png" alt="New Dior LatAm repository interface" width={2200} height={1240} className="w-full h-auto" />
          </div>
        </div>
      </Section>

      {/* UX RESEARCH */}
      <Section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionLabel>UX Research</SectionLabel>
              <SectionTitle>Dior teams need a fast and intuitive way to access shared assets</SectionTitle>
              <SectionDescription>Through user interviews and observed workflows, we identified recurring pain points across roles and countries. Users weren't looking for new features, but for clarity, speed, and confidence when accessing shared assets.</SectionDescription>
            </div>
            <div className="space-y-3 pt-2 lg:pt-8">
              {["Find shared assets quickly and confidently", "Navigate files with clear structure and logic", "Access what they need without extra tools"].map((text, i) => (
                <InsightCard key={i} text={text} index={i} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* APPROACH */}
      <Section className="px-6 py-24 bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Approach</SectionLabel>
          <SectionTitle>We focused on validating usability before scaling the solution</SectionTitle>
          <SectionDescription>Early concepts were rapidly prototyped and validated with users to ensure improvements addressed real needs. Research insights allowed us to reduce risk and deliver a solution that measurably improved everyday efficiency.</SectionDescription>
          <div className="rounded-[24px] overflow-hidden border border-stone-200 shadow-sm">
            <Image src="/case-studies/dior/approach02.png" alt="Early validation sessions and iterative prototyping" width={2200} height={1240} className="w-full h-auto" />
          </div>
        </div>
      </Section>

      {/* SOLUTION 01 */}
      <Section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionLabel>Solution · 01</SectionLabel>
              <SectionTitle>Rebuilding the information architecture for faster discovery</SectionTitle>
              <SectionDescription>We redesigned the repository structure to make assets easier to browse and understand. Content was reorganized based on how users search for and reuse files — not on internal system logic. Clearer hierarchy and familiar navigation patterns reduced cognitive load and helped users locate assets with confidence.</SectionDescription>
              <StatBadge value={20} label="faster asset discovery" />
            </div>
            <BeforeAfter
              src1="/case-studies/dior/solution201.png" alt1="Repository structure — before"
              src2="/case-studies/dior/solution202.png" alt2="Repository structure — after"
            />
          </div>
        </div>
      </Section>

      {/* SOLUTION 02 */}
      <Section className="px-6 py-24 bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionLabel>Solution · 02</SectionLabel>
              <SectionTitle>Designing an intuitive and mobile-ready file experience</SectionTitle>
              <SectionDescription>The interface was redesigned to align with file management tools users were already familiar with, making the experience intuitive from the first interaction. We also introduced a fully responsive mobile version, enabling teams to access and manage assets on the go — addressing a key need expressed during research.</SectionDescription>
            </div>
            <BeforeAfter
              src1="/case-studies/dior/solution301.png" alt1="Mobile repository — before"
              src2="/case-studies/dior/solution302.png" alt2="Mobile repository — after"
            />
          </div>
        </div>
      </Section>

      <CaseStudyFooter title="David Herrera" subtitle="Design Engineer · Dior LatAm Repository Case Study" ctaLabel="Contact me →" ctaHref="mailto:contactochka@gmail.com" />
    </div>
  );
}
