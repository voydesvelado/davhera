"use client";

import { motion, useReducedMotion } from "framer-motion";

interface LandingFooterProps {
  onLogin: () => void;
}

export function LandingFooter({ onLogin }: LandingFooterProps) {
  const reduced = useReducedMotion();
  return (
    <motion.footer
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: reduced ? 0 : 1.15, ease: "easeOut" }}
      className="mt-8 px-6 pb-8"
    >
      <button
        type="button"
        onClick={onLogin}
        className="group flex w-full items-center justify-center gap-1.5 rounded-[10px] py-3 text-[14px] font-medium text-stadium-text-secondary transition-colors hover:text-stadium-text-primary cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadium-pitch focus-visible:ring-offset-2 focus-visible:ring-offset-stadium-midnight"
        style={{ minHeight: 48 }}
      >
        <span>Ya tengo cuenta</span>
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
        <span className="font-semibold">Iniciar sesión</span>
      </button>

      <hr className="my-4 border-stadium-border-subtle" />

      <p className="text-center text-[11px] leading-[1.5] text-stadium-text-muted">
        Al participar, aceptas los{" "}
        <span className="cursor-pointer text-stadium-electric hover:underline">Términos y Condiciones</span>
        {" "}y la{" "}
        <span className="cursor-pointer text-stadium-electric hover:underline">Política de Privacidad</span>.
      </p>

      <p className="mt-3 text-center text-[11px] text-stadium-text-muted">
        Powered by{" "}
        <a
          href="https://davhera.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-stadium-electric hover:underline"
        >
          davhera.com
        </a>
      </p>
    </motion.footer>
  );
}
