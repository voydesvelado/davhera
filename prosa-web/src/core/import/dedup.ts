import type { DocumentRecord } from "../db/types";

/**
 * Qué hacer con un markdown que se está importando y ya podría estar en la
 * biblioteca. La regla de oro del proyecto manda: ante la duda, NUNCA perder
 * contenido del usuario — así que la salida más destructiva (reemplazar) solo se
 * ofrece, nunca se decide sola.
 */
export type DedupVerdict =
  /** Mismo contentHash: es literalmente el mismo texto. Se abre el que ya está. */
  | { kind: "identical"; existing: DocumentRecord }
  /** Mismo título, contenido distinto: probablemente una versión nueva. */
  | { kind: "sameTitle"; existing: DocumentRecord }
  /** El texto nuevo contiene ≥90% del viejo (o al revés): versión ampliada. */
  | { kind: "contains"; existing: DocumentRecord; ratio: number }
  /** Nada parecido: importar sin preguntar. */
  | { kind: "new" };

/** Umbral de contención a partir del cual se ofrece reemplazar (PROSA_WEB_SPEC §6). */
export const CONTAINMENT_THRESHOLD = 0.9;

export function classifyImport(
  incoming: { title: string; contentHash: string; plainTextIndex: string },
  library: DocumentRecord[],
): DedupVerdict {
  const alive = library.filter((d) => d.deletedAt === null);

  const identical = alive.find((d) => d.contentHash === incoming.contentHash);
  if (identical) return { kind: "identical", existing: identical };

  const sameTitle = alive.find(
    (d) => normalizeTitle(d.title) === normalizeTitle(incoming.title) && d.title !== "",
  );
  if (sameTitle) return { kind: "sameTitle", existing: sameTitle };

  // Contención: se busca el mejor candidato, no el primero, porque una biblioteca
  // con varios borradores del mismo ensayo debe ofrecer el más parecido.
  let best: { existing: DocumentRecord; ratio: number } | null = null;
  for (const doc of alive) {
    const ratio = containmentRatio(doc.plainTextIndex, incoming.plainTextIndex);
    if (ratio >= CONTAINMENT_THRESHOLD && (!best || ratio > best.ratio)) {
      best = { existing: doc, ratio };
    }
  }
  if (best) return { kind: "contains", existing: best.existing, ratio: best.ratio };

  return { kind: "new" };
}

/**
 * Cuánto del texto más corto aparece en el más largo, por palabras.
 *
 * Se compara por palabras y no por substring porque un ensayo revisado casi nunca
 * contiene al anterior literal: cambia una coma en el medio y el substring cae a 0
 * mientras que el documento sigue siendo el mismo al 99%.
 */
export function containmentRatio(a: string, b: string): number {
  const wordsA = wordSet(a);
  const wordsB = wordSet(b);
  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  const [small, large] = wordsA.size <= wordsB.size ? [wordsA, wordsB] : [wordsB, wordsA];
  let shared = 0;
  for (const word of small) if (large.has(word)) shared++;
  return shared / small.size;
}

function wordSet(text: string): Set<string> {
  const out = new Set<string>();
  for (const raw of text.toLowerCase().split(/\s+/)) {
    // Sin limpiar puntuación, "deprisa," y "deprisa" serían palabras distintas y
    // agregar una coma en una revisión bastaría para que el ensayo dejara de
    // parecerse a sí mismo.
    const word = raw.replace(/[^\p{L}\p{N}]+/gu, "");
    if (word.length > 2) out.add(word);
  }
  return out;
}

function normalizeTitle(title: string): string {
  return title.normalize("NFC").toLowerCase().trim();
}
