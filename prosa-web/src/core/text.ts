/**
 * Primitivas de texto compartidas por parser, anclas y highlights.
 *
 * Todo lo de acá es determinístico y sin dependencias: el mismo input produce
 * siempre el mismo output, sin importar el orden de iteración ni la plataforma.
 * El AnchorEngine depende de eso (test 11 del spec).
 */

/** Los primeros N chars del plainText que se hashean y se guardan como snippet. */
export const SNIPPET_LENGTH = 200;

/**
 * Normalización canónica del texto de un bloque: NFC, trim, y whitespace interno
 * colapsado a un espacio simple.
 *
 * El NFC es deliberado y no está en el spec nativo: en Swift los offsets cuentan
 * grapheme clusters y en JavaScript cuentan unidades UTF-16, así que "é" precompuesta
 * y "é" descompuesta darían hashes y offsets distintos entre plataformas. Normalizar
 * en la entrada elimina esa clase entera de divergencia. (Ver PLAN.md §0.2.13.)
 */
export function normalizePlainText(raw: string): string {
  return raw.normalize("NFC").replace(/\s+/g, " ").trim();
}

/** Los chars que se hashean y se guardan como ancla. Contados en code points. */
export function snippetOf(plainText: string): string {
  return sliceByCodePoints(plainText, 0, SNIPPET_LENGTH);
}

/**
 * Slice por code points, no por unidades UTF-16.
 *
 * `"👨".slice(0, 1)` parte el surrogate pair y devuelve basura; esto no. Todos los
 * offsets del modelo (startOffset/endOffset de highlights, longitud del snippet)
 * se cuentan en code points para acercarse a la semántica de Character de Swift.
 */
export function sliceByCodePoints(text: string, start: number, end: number): string {
  return Array.from(text).slice(start, end).join("");
}

/** Longitud en code points. */
export function codePointLength(text: string): number {
  return Array.from(text).length;
}

/**
 * Índice en code points de la primera aparición de `needle`, o -1.
 *
 * `String.indexOf` devuelve un índice UTF-16, que no sirve para reajustar los
 * offsets de un highlight sin corromperlos ante cualquier emoji.
 */
export function codePointIndexOf(haystack: string, needle: string, fromIndex = 0): number {
  const utf16 = haystack.indexOf(needle, utf16IndexFromCodePoint(haystack, fromIndex));
  if (utf16 === -1) return -1;
  return codePointLength(haystack.slice(0, utf16));
}

function utf16IndexFromCodePoint(text: string, codePointIndex: number): number {
  if (codePointIndex <= 0) return 0;
  return Array.from(text).slice(0, codePointIndex).join("").length;
}

/**
 * Similitud de trigramas (Jaccard) entre dos textos: |intersección| / |unión|.
 *
 * Determinística y barata, como pide el spec. Trigramas de caracteres sobre el
 * texto normalizado en minúsculas. Devuelve 0..1.
 */
export function trigramSimilarity(a: string, b: string): number {
  const setA = trigrams(a);
  const setB = trigrams(b);
  if (setA.size === 0 && setB.size === 0) return a === b ? 1 : 0;
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  for (const t of setA) if (setB.has(t)) intersection++;

  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function trigrams(text: string): Set<string> {
  const chars = Array.from(text.toLowerCase());
  const out = new Set<string>();
  // Con menos de 3 chars no hay trigramas; el texto entero pasa a ser el único token
  // para que dos bloques cortos e idénticos den similitud 1 y no 0.
  if (chars.length < 3) {
    if (chars.length > 0) out.add(chars.join(""));
    return out;
  }
  for (let i = 0; i <= chars.length - 3; i++) {
    out.add(chars.slice(i, i + 3).join(""));
  }
  return out;
}
