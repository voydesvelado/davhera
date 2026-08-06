import type { Transition } from "framer-motion";

/**
 * Los DOS únicos springs de la app (PROSA_SPEC §8). No hay un tercero.
 *
 * Los números son la traducción a Framer de los nativos (snappy: response 0.35 /
 * damping 0.85; gentle: 0.55 / 0.9). El criterio de aceptación NO son los números:
 * es que puestos al lado de la app de Mac se sientan iguales. Ajustar a ojo hasta
 * que pase, y recién ahí dar por buenos estos valores.
 */
export const snappy: Transition = { type: "spring", stiffness: 420, damping: 34 };
export const gentle: Transition = { type: "spring", stiffness: 200, damping: 28 };

/** Fade puro, el degradado universal cuando el sistema pide menos movimiento. */
export const fadeOnly: Transition = { duration: 0.15, ease: "easeOut" };

/**
 * `prefers-reduced-motion` no es una preferencia estética: para algunas personas
 * el movimiento produce náusea. Todo componente animado consulta esto y degrada
 * a fade, sin excepciones.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function motionSafe(transition: Transition): Transition {
  return prefersReducedMotion() ? fadeOnly : transition;
}

/**
 * Las features de animación se cargan aparte del shell.
 *
 * Framer Motion completo cuesta 42KB gzip —medidos, no estimados: 144.7KB con él,
 * 102.7KB sin él— o sea el 28% del presupuesto de 150KB por dos springs y una
 * transición héroe. Con `LazyMotion` + los componentes `m`, el shell solo carga el
 * runtime mínimo y `domMax` (que trae las animaciones de layout que necesita el
 * `layoutId` portada→lector) llega por separado, después del primer render.
 *
 * `strict` en el provider hace que usar `motion.div` en vez de `m.div` tire error:
 * es la única forma de que la optimización no se deshaga sola en tres meses.
 */
export const loadMotionFeatures = () =>
  import("framer-motion").then((mod) => mod.domMax);
