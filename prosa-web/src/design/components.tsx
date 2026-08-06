import type { ButtonHTMLAttributes, ReactNode } from "react";

import { coverGrey, coverInk, strippedTitle } from "./covers";

/**
 * Los primitivos del design system. Cuatro tamaños de texto, tres inks, dos radios,
 * un acento. Todo lo demás se compone con estos.
 */

/** El único CTA por pantalla: fondo ink-1, texto bg, 14/500. */
export function Pill({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-pill bg-ink-1 px-5 py-2.5 text-body font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

/** Acción secundaria: borde antes que sombra, siempre. */
export function GhostButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-s border border-line px-3 py-1.5 text-secondary text-ink-2 transition-colors hover:text-ink-1 disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

export function Chip({
  children,
  selected = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return (
    <button
      {...props}
      className={`rounded-s border px-3 py-1 text-secondary transition-colors ${
        selected ? "border-ink-1 text-ink-1" : "border-line text-ink-3 hover:text-ink-2"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Superficie glass. El fallback sin backdrop-filter (fondo opaco al 96%) vive en
 * tokens.css con @supports: acá no hay que saber nada de eso.
 */
export function GlassBar({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`border-line border bg-[var(--glass-bg)] backdrop-blur-[20px] backdrop-saturate-150 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Portada: gris determinístico + título en serif, máximo dos líneas. Único elemento.
 * Sin gradiente, sin color, sin imagen.
 */
export function Cover({
  title,
  seed,
  theme,
  className = "",
}: {
  title: string;
  seed: number;
  theme: "light" | "dark";
  className?: string;
}) {
  const background = coverGrey(seed, theme);
  return (
    <div
      className={`flex aspect-[3/4] items-end rounded-m p-4 ${className}`}
      style={{ background }}
      aria-hidden="true"
    >
      <span
        className="line-clamp-2 font-serif text-[15px] leading-tight"
        style={{ color: coverInk(background) }}
      >
        {strippedTitle(title)}
      </span>
    </div>
  );
}

/** El hilo de progreso de 2pt. El mismo objeto en la biblioteca y en el lector. */
export function ProgressThread({ progress }: { progress: number }) {
  return (
    <div className="h-[2px] w-full bg-line" role="presentation">
      <div
        className="h-full bg-ink-2 transition-[width] duration-300"
        style={{ width: `${Math.round(Math.max(0, Math.min(1, progress)) * 100)}%` }}
      />
    </div>
  );
}
