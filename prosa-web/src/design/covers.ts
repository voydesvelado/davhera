/**
 * Portadas: fondo gris determinístico por `coverSeed` + título en serif. Sin
 * gradientes, sin color, sin imágenes. Un documento se ve igual en web, Mac y iOS.
 *
 * PROVISIONAL — pendiente de input (PLAN.md §8.1): el spec da el RANGO
 * (#E8E8E8 → #4A4A4A) pero no los cinco valores ni la función de mapeo. Estos son
 * cinco pasos interpolados en ese rango. Cuando lleguen los valores exactos de las
 * apps nativas, se reemplazan acá y en ningún otro lado.
 */

export const COVER_GREYS_LIGHT = ["#E8E8E8", "#C1C1C1", "#999999", "#727272", "#4A4A4A"] as const;

/** Equivalentes invertidos para tema oscuro. También provisionales. */
export const COVER_GREYS_DARK = ["#1C1C1C", "#2A2A2A", "#383838", "#484848", "#5A5A5A"] as const;

export function coverGrey(seed: number, theme: "light" | "dark"): string {
  const palette = theme === "dark" ? COVER_GREYS_DARK : COVER_GREYS_LIGHT;
  // `>>> 0` para que una semilla negativa no produzca un índice negativo.
  const index = (seed >>> 0) % palette.length;
  return palette[index]!;
}

/**
 * Color del título sobre la portada. Se decide por luminancia y no por tema: en
 * claro, los dos grises más oscuros necesitan texto claro igual.
 */
export function coverInk(background: string): string {
  const r = parseInt(background.slice(1, 3), 16);
  const g = parseInt(background.slice(3, 5), 16);
  const b = parseInt(background.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#292929" : "#EDEDED";
}

/** El título de la portada va sin sintaxis inline de markdown. */
export function strippedTitle(title: string): string {
  return title
    .replace(/[*_`~]/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .trim();
}
