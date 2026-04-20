"use client";

import { useState, useEffect, useRef } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import VideoWithSkeleton from "@/components/VideoWithSkeleton";

// ─── Constants ─────────────────────────────────────────────────────

const PROJECTS = [
  {
    title: "Menura App",
    description: "Mobile-first digital menu platform for restaurants in Mexico. Research, design system, and full-stack implementation.",
    tags: ["Product Design", "Next.js", "Supabase", "Design System"],
    color: "#F97316",
    year: "2026",
    href: "/projects/menura-app",
    image: "/case-studies/dior/hero301.png",
    video: "/videos/menura-app/thumbnail.mp4",
  },
  {
    title: "Menura Design System",
    description: "End-to-end design system for Menura — tokens, components, patterns, and documentation built for a solo team.",
    tags: ["Design System", "Figma", "Tokens", "Components"],
    color: "#F97316",
    year: "2026",
    href: "/projects/menura-design-system",
    image: "/videos/menura-design-system/thumbnail.png",
  },
  {
    title: "Dior · Repository",
    description: "Redesigning Dior Latin America's file repository to help teams access, manage, and reuse files faster.",
    tags: ["UX Research", "UX/UI Design", "Intranet"],
    color: "#1C1917",
    year: "2024",
    href: "/projects/dior-repository",
    image: "/case-studies/dior/repository/thumbnalil.png",
  },
  {
    title: "Dior · Calendar",
    description: "Redesigning Dior's intranet launch calendar for Latin America to support faster, more reliable day-to-day work.",
    tags: ["UX Research", "UX/UI Design", "Intranet"],
    color: "#1C1917",
    year: "2024",
    href: "/projects/dior-calendar",
    image: "/case-studies/dior/calendar/dior-calendar.png",
  },
];

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

// ─── Animated Background Grain ─────────────────────────────────────

function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
    />
  );
}

// ─── Availability Badge ────────────────────────────────────────────

function StatusBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-200 bg-white/80 backdrop-blur-sm"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="text-xs font-medium text-stone-600">Available for work</span>
    </motion.div>
  );
}

// ─── Project Card ──────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: typeof PROJECTS[number]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      ref={ref}
      href={project.href}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group block relative rounded-2xl overflow-hidden bg-white border border-stone-200 transition-all duration-300 hover:border-stone-300 hover:shadow-lg hover:shadow-stone-200/50"
      style={{ cursor: "pointer" }}
    >
      {/* Image placeholder */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {/* Colored gradient that reveals on hover */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${project.color}15, ${project.color}08)`,
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Thumbnail */}
        {project.video ? (
          <motion.div className="absolute inset-0" animate={{ scale: isHovered ? 1.03 : 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <VideoWithSkeleton src={project.video} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
          </motion.div>
        ) : project.image && (
          <motion.div className="absolute inset-0" animate={{ scale: isHovered ? 1.03 : 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <ImageWithSkeleton src={project.image} alt={project.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
          </motion.div>
        )}

        {/* Year badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 text-[10px] font-mono font-medium text-stone-400 bg-white/90 backdrop-blur-sm rounded-md border border-stone-100">
            {project.year}
          </span>
        </div>

        {/* Hover arrow */}
        <motion.div
          className="absolute bottom-3 right-3"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-stone-200 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M4 10L10 4M10 4H5M10 4V9" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3
            className="text-base font-bold text-stone-900 group-hover:text-stone-700 transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {project.title}
          </h3>
          <div
            className="w-2 h-2 rounded-full mt-2 flex-shrink-0 transition-transform duration-300 group-hover:scale-150"
            style={{ backgroundColor: project.color }}
          />
        </div>
        <p className="text-sm text-stone-500 leading-relaxed mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] font-medium text-stone-400 bg-stone-50 rounded-md border border-stone-100"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}

// ─── Scroll Progress Bar ───────────────────────────────────────────

// ─── Main Portfolio Page ───────────────────────────────────────────

export default function Portfolio() {
  const [currentTime, setCurrentTime] = useState("");
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroY = useTransform(heroScroll, [0, 0.8], [0, -60]);
  const photoScale = useTransform(heroScroll, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Mexico_City",
          hour12: false,
        })
      );
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 relative">
      <GrainOverlay />

      {/* ─── Top Bar ─── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200/50"
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-0 h-14 flex items-center justify-between">
          {/* Logo / Name */}
          <a href="/" className="flex items-center gap-2">
<span
              className="text-sm font-bold text-stone-900 hidden sm:block"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              David Herrera
            </span>
          </a>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className="text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-orange-500 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
              <DropdownMenu>
                <DropdownMenuTrigger className="px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 active:scale-95 transition-all outline-none">
                  Get in touch
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px]">
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => window.open("https://wa.me/526641265999", "_blank")}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-green-500"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = "mailto:ework.dave@gmail.com"}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    Email
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => window.open("https://www.linkedin.com/in/herreraux/", "_blank")}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY }}
        className="pt-28 pb-24 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
            {/* Text */}
            <div className="md:col-span-7 order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <StatusBadge />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                I design
                <br />
                <span className="relative">
                  and ship
                  <motion.svg
                    className="absolute -bottom-1 left-0 w-full"
                    viewBox="0 0 200 8"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
                  >
                    <motion.path
                      d="M2 5 Q50 2 100 5 Q150 8 198 4"
                      stroke="#F97316"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
                    />
                  </motion.svg>
                </span>{" "}
                products.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                className="mt-5 text-base sm:text-lg text-stone-500 leading-relaxed max-w-lg"
              >
                Design Engineer building at the intersection of design and code.
                I take products from research to production — no handoffs, no gaps.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                className="mt-6 flex items-center gap-4 text-xs text-stone-400"
              >
                <span className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M6 3v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  {currentTime} Mexico City
                </span>
                <span className="w-px h-3 bg-stone-200" />
                <span>Previously at IBM</span>
              </motion.div>

              {/* Tech ribbon */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="mt-8 flex flex-wrap gap-1.5"
              >
                {["Claude", "Claude Code", "Figma", "Framer Motion", "Gemini", "Illustrator", "Kling", "Next.js", "Photoshop", "React", "Supabase", "Tailwind", "TypeScript"].map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0 + i * 0.05, duration: 0.3 }}
                    className="px-2.5 py-1 text-[10px] font-medium text-stone-400 bg-white rounded-md border border-stone-150"
                  >
                    {tech}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* Photo */}
            <div className="md:col-span-5 order-1 md:order-2 flex justify-center md:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ scale: photoScale }}
                className="relative"
              >
                {/* Photo container */}
                <div
                  className="w-64 sm:w-72 aspect-[4/5] rounded-3xl overflow-hidden bg-stone-200 relative"
                  style={{
                    boxShadow: "0 20px 60px rgba(28,25,23,0.12), 0 4px 16px rgba(28,25,23,0.06)",
                  }}
                >
                  <ImageWithSkeleton src="/profile.jpg" alt="David Herrera" fill className="object-cover" priority />
                </div>

                {/* Decorative accent */}
                <motion.div
                  className="absolute -bottom-3 -right-3 w-20 h-20 rounded-2xl -z-10"
                  style={{ backgroundColor: "#F97316", opacity: 0.08 }}
                  animate={{ rotate: [0, 3, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute -top-2 -left-2 w-8 h-8 rounded-lg -z-10"
                  style={{ backgroundColor: "#F97316", opacity: 0.12 }}
                  animate={{ rotate: [0, -5, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─── Projects Grid ─── */}
      <section id="work" className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: "#F97316" }}>
                Selected Work
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Projects
              </h2>
            </div>
            <span className="text-xs font-mono text-stone-300">
              {PROJECTS.length} projects
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECTS.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── About Strip ─── */}
      <section id="about" className="px-6 py-20 bg-white border-y border-stone-200">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center"
          >
            <div className="md:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#F97316" }}>
                About
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight mb-4"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Design is how
                <br />
                it works.
              </h2>
            </div>
            <div className="md:col-span-7">
              <p className="text-base text-stone-500 leading-relaxed mb-4">
                I'm a Design Engineer — I design interfaces and build them in production code.
                No Figma-to-dev handoffs, no lost-in-translation specs, no "it looked different in the mockup."
                I take products from user research to deployed, monitored, and iterated software.
              </p>
              <p className="text-base text-stone-500 leading-relaxed mb-6">
                Previously UX/UI at IBM. Now building Menura as a solo founder and exploring Design Engineer roles.
                Based in Mexico City, México.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "LinkedIn", href: "https://www.linkedin.com/in/herreraux/" },
                  { label: "GitHub", href: "https://github.com/voydesvelado" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-medium text-stone-500 bg-stone-50 rounded-lg border border-stone-200 hover:border-stone-300 hover:text-stone-700 transition-all active:scale-95"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Contact / Footer ─── */}
      <footer id="contact" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#F97316" }}>
              Contact
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Let's build something.
            </h2>
            <p className="text-base text-stone-500 max-w-md mx-auto mb-8">
              Looking for a Design Engineer who ships? Let's talk.
            </p>
            <motion.a
              href="mailto:ework.dave@gmail.com"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-stone-900 rounded-xl hover:bg-stone-800 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M2 4l6 4.5L14 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              ework.dave@gmail.com
            </motion.a>
          </motion.div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-stone-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: "#F97316" }}>
                <span className="text-[9px] font-bold text-white" style={{ fontFamily: "monospace" }}>D</span>
              </div>
              <span className="text-xs text-stone-400">
                © 2026 David · Design Engineer
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Available
              </span>
              <span className="w-px h-3 bg-stone-200" />
              <span>Mexico City</span>
              <span className="w-px h-3 bg-stone-200" />
              <span className="font-mono">{currentTime}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}