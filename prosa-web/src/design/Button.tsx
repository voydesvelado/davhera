import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "./cn";

/**
 * El único botón de la app, con variantes. Antes había tres componentes y, además,
 * `<button>` sueltos con clases a mano en cada pantalla: el menú contextual, la
 * cápsula del lector, los links de Ajustes. Todos parecidos pero ninguno igual.
 *
 * Método shadcn (variantes con cva, el código es nuestro), estética Prosa: los
 * tokens mandan y no entra ni un color nuevo. Un botón destructivo NO es rojo —
 * en esta app el rojo no existe; se distingue por jerarquía de gris, como todo.
 */
const button = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        /** El CTA único de la pantalla. Solo uno por pantalla, por regla. */
        pill: "rounded-pill bg-ink-1 text-bg hover:opacity-90",
        /** Acción secundaria: borde antes que sombra, siempre. */
        ghost: "rounded-s border border-line text-ink-2 hover:text-ink-1",
        /** Sin caja, jerarquía secundaria: la cápsula del lector, el popover. */
        quiet: "text-ink-2 hover:text-ink-1",
        /** Sin caja, terciaria: links de navegación, pistas del empty state. */
        faint: "text-ink-3 hover:text-ink-1",
        /** Destructiva: se apaga, no se pinta. */
        destructive: "rounded-s border border-line text-ink-3 hover:border-ink-3 hover:text-ink-1",
        /** Fila de menú: ocupa todo el ancho y se alinea a la izquierda. */
        menu: "w-full justify-start border-b border-line px-4 py-3 text-left text-ink-1 last:border-b-0 hover:bg-line/40",
        /** Fila de menú atenuada: la acción destructiva no grita, se apaga. */
        menuFaint:
          "w-full justify-start border-b border-line px-4 py-3 text-left text-ink-2 last:border-b-0 hover:bg-line/40",
      },
      size: {
        sm: "px-3 py-1.5 text-secondary",
        md: "px-5 py-2.5 text-body font-medium",
        none: "",
      },
    },
    compoundVariants: [
      // Las filas de menú traen su propio padding; el tamaño no debe pisarlo.
      { variant: "menu", size: "sm", class: "px-4 py-3 text-body" },
      { variant: "menuFaint", size: "sm", class: "px-4 py-3 text-body" },
    ],
    defaultVariants: { variant: "ghost", size: "sm" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button {...props} className={cn(button({ variant, size }), className)} />;
}

/** Chip de filtro o de opción. Seleccionado se marca con el ink, no con relleno. */
export function Chip({
  selected = false,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return (
    <button
      {...props}
      aria-pressed={selected}
      className={cn(
        "rounded-s border px-3 py-1 text-secondary transition-colors",
        selected ? "border-ink-1 text-ink-1" : "border-line text-ink-3 hover:text-ink-2",
        className,
      )}
    />
  );
}
