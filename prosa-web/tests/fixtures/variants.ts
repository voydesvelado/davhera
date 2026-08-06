// `?raw` en vez de readFileSync: los tests de UI corren en jsdom, donde
// `import.meta.url` es una URL http y `fileURLToPath` falla.
import ensayo from "./ensayo.md?raw";

/**
 * El ensayo base (~60 bloques) y sus variantes. Vive como archivo .md y no como
 * string en el test a propósito: el MISMO archivo tiene que poder pasarse al parser
 * Swift para verificar la paridad de plainText (PLAN.md §8.2).
 */
export const BASE: string = ensayo;

/**
 * El párrafo que usan los tests como bloque ancla. Elegido por ser distintivo: no se
 * parece a ningún otro del ensayo, así que el fuzzy no puede confundirlo por azar.
 */
export const ANCHOR_PARAGRAPH =
  "La atención no es un músculo, aunque nos guste la metáfora. Es más parecida a una habitación: se ordena, se ilumina, se cierra la puerta.";

/** Mismo párrafo con ~10% de sus caracteres cambiados: el hash cae, el fuzzy no. */
export const ANCHOR_PARAGRAPH_EDITED =
  "La atención no es un músculo, aunque nos guste esa metáfora. Es más parecida a un cuarto: se ordena, se ilumina, se cierra la puerta.";

/** Un párrafo insertado aguas arriba del ancla: desplaza todos los índices siguientes. */
export function withInsertionUpstream(): string {
  return BASE.replace(
    "## Primera parte: la atención",
    "Un párrafo agregado en la revisión de marzo, que antes no existía.\n\n## Primera parte: la atención",
  );
}

/** El bloque ancla editado levemente. */
export function withEditedAnchor(): string {
  return BASE.replace(ANCHOR_PARAGRAPH, ANCHOR_PARAGRAPH_EDITED);
}

/** El bloque ancla borrado por completo. */
export function withDeletedAnchor(): string {
  return BASE.replace(`${ANCHOR_PARAGRAPH}\n\n`, "");
}

/** El documento cortado antes del ancla: la posición guardada queda más allá del final. */
export function truncated(): string {
  const cut = BASE.indexOf("## Primera parte: la atención");
  return BASE.slice(0, cut).trimEnd();
}
