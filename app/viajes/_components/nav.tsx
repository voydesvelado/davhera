"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Catálogo", href: "/viajes#catalogo" },
  { label: "Sobre nosotros", href: "#" },
  { label: "Contacto", href: "#" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-40 transition-colors duration-300",
          scrolled
            ? "bg-bg/80 backdrop-blur border-b border-border-token"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-12 h-20 flex items-center justify-between">
          {/* TODO: replace with real agency wordmark */}
          <Link
            href="/viajes"
            className="text-display-md font-display tracking-tight text-fg"
          >
            VIAJES
          </Link>
          <nav className="hidden md:flex items-center gap-10">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-body text-fg hover:text-accent transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={open}
            className="md:hidden inline-flex items-center justify-center h-11 w-11 rounded-md text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 32 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-50 bg-bg md:hidden"
          >
            <div className="h-20 px-6 flex items-center justify-between border-b border-border-token">
              <span className="text-display-md font-display text-fg">VIAJES</span>
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center h-11 w-11 rounded-md text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="px-6 py-12 flex flex-col gap-6">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.1 + i * 0.06 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block text-display-md font-display text-fg"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
