import { clsx, type ClassValue } from "clsx";

/**
 * Componer clases. Solo `clsx`, sin `tailwind-merge`.
 *
 * shadcn usa `twMerge` para que un `className` de afuera le gane a las clases del
 * componente. Medido acá, cuesta **8.8KB gzip**: el 6% del presupuesto de 150KB
 * que fija el spec, para resolver conflictos que en su mayoría no deberían
 * existir. Si un componente necesita que le pisen `max-w-xl` o `text-ink-3`, lo
 * que falta es una variante, no un resolvedor de conflictos en runtime.
 *
 * Así que las variantes cubren los casos reales (ver Button.tsx y el `size` de
 * Dialog) y `className` queda para lo que NO colisiona: márgenes, ancho, alineación.
 * La firma es la misma, así que si algún día hace falta, se reinstala en un renglón.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
