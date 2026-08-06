import type { Block } from "../markdown/blocks";
import {
  codePointIndexOf,
  codePointLength,
  sliceByCodePoints,
  snippetOf,
  trigramSimilarity,
} from "../text";
import type {
  Anchor,
  HighlightAnchor,
  HighlightRestoreResult,
  RestoreResult,
} from "./types";

/** Ventana de búsqueda fuzzy alrededor del índice guardado: ±10 bloques. */
export const FUZZY_WINDOW = 10;
/** Score mínimo de trigramas para aceptar un candidato. */
export const FUZZY_THRESHOLD = 0.6;

/**
 * Construye el ancla a guardar. La parte que mira el viewport (qué bloque cruza el
 * tercio superior de la pantalla) vive en el lector: `core/` no toca el DOM.
 */
export function createAnchor(
  blocks: Block[],
  blockIndex: number,
  offsetInBlock: number,
  progress: number,
): Anchor {
  const block = blocks[blockIndex];
  return {
    blockIndex,
    blockHash: block?.hash ?? "",
    anchorSnippet: block ? snippetOf(block.plainText) : "",
    offsetInBlock: clamp01(offsetInBlock),
    progress: clamp01(progress),
  };
}

/**
 * Restauración de la posición al abrir un documento (PROSA_SPEC §4).
 *
 *   1. EXACTO: mismo índice, mismo hash → listo, y en silencio.
 *   2a. BÚSQUEDA GLOBAL por hash: si hay exactamente UN match, el bloque se movió →
 *       re-anclar ahí conservando offsetInBlock. También en silencio: el match por
 *       hash es confiable.
 *   2b. FUZZY por snippet en ventana ±10, trigramas ≥ 0.6 → toast de aproximado.
 *   2c. CLAMP al índice válido más cercano, offset 0 → toast de aproximado.
 */
export function restorePosition(saved: Anchor, blocks: Block[]): RestoreResult {
  if (blocks.length === 0) {
    return { blockIndex: 0, offsetInBlock: 0, method: "clamp", approximate: true };
  }

  // 1. Exacto.
  const atIndex = blocks[saved.blockIndex];
  if (atIndex && atIndex.hash === saved.blockHash) {
    return {
      blockIndex: saved.blockIndex,
      offsetInBlock: clamp01(saved.offsetInBlock),
      method: "exact",
      approximate: false,
    };
  }

  // 2a. Búsqueda global por hash — solo vale si el match es ÚNICO. Con dos bloques
  // idénticos (un separador repetido, un "***") no hay forma de saber cuál era.
  if (saved.blockHash) {
    const matches = blocks.filter((b) => b.hash === saved.blockHash);
    if (matches.length === 1) {
      return {
        blockIndex: matches[0]!.index,
        offsetInBlock: clamp01(saved.offsetInBlock),
        method: "globalHash",
        approximate: false,
      };
    }
  }

  // 2b. Fuzzy por snippet dentro de la ventana.
  if (saved.anchorSnippet) {
    const best = bestFuzzyMatch(saved.anchorSnippet, blocks, saved.blockIndex);
    if (best) {
      return {
        blockIndex: best.index,
        offsetInBlock: clamp01(saved.offsetInBlock),
        method: "fuzzy",
        approximate: true,
      };
    }
  }

  // 2c. Clamp.
  return {
    blockIndex: Math.max(0, Math.min(saved.blockIndex, blocks.length - 1)),
    offsetInBlock: 0,
    method: "clamp",
    approximate: true,
  };
}

/**
 * Restauración al ABRIR un documento, que es distinta de restaurar sin más:
 * un documento terminado se abre al principio, y `finished` se conserva
 * (PROSA_SPEC §4, paso 3). Releer no es "des-terminar".
 */
export function restoreOnOpen(
  status: "unread" | "reading" | "finished",
  saved: Anchor | null,
  blocks: Block[],
): RestoreResult {
  if (status === "finished" || !saved) {
    return { blockIndex: 0, offsetInBlock: 0, method: "exact", approximate: false };
  }
  return restorePosition(saved, blocks);
}

/**
 * Re-anclaje de un highlight tras un reimport o reemplazo de contenido.
 *
 * El `snapshotText` manda: los offsets son una pista y se reajustan buscándolo como
 * substring. Si todo falla, el highlight queda huérfano — pero NUNCA se borra: la
 * nota del usuario no se pierde en silencio, jamás.
 */
export function reanchorHighlight(
  highlight: HighlightAnchor,
  blocks: Block[],
): HighlightRestoreResult {
  const { snapshotText } = highlight;

  // 1. Bloque exacto por (blockIndex, blockHash).
  const atIndex = blocks[highlight.blockIndex];
  if (atIndex && atIndex.hash === highlight.blockHash) {
    const fitted = fitOffsets(atIndex, highlight, "exact");
    if (fitted) return fitted;
  }

  // 2. Búsqueda global por hash.
  if (highlight.blockHash) {
    const matches = blocks.filter((b) => b.hash === highlight.blockHash);
    if (matches.length === 1) {
      const fitted = fitOffsets(matches[0]!, highlight, "globalHash");
      if (fitted) return fitted;
    }
  }

  // 3. Búsqueda LITERAL del snapshotText en la ventana ±10.
  //
  // Este paso no está en la escalera del spec, y sin él la escalera no puede cumplir
  // su propio test 9 ("prefijo agregado al bloque → offsets reajustados"): agregar un
  // prefijo cambia el hash, así que los pasos 1 y 2 no aplican, y el fuzzy tampoco
  // porque compara trigramas de la FRASE subrayada contra el BLOQUE entero — un
  // highlight de 19 chars dentro de un párrafo de 160 da Jaccard ~0.1, nunca ≥ 0.6.
  // Sin esto, cualquier edición al principio de un párrafo dejaría huérfanos todos
  // sus subrayados, que es exactamente lo que el spec quiere evitar.
  //
  // Determinístico: gana el bloque más cercano al índice guardado; empate → índice menor.
  const literal = closestBlockContaining(snapshotText, blocks, highlight.blockIndex);
  if (literal) {
    const found = codePointIndexOf(literal.plainText, snapshotText);
    return {
      blockIndex: literal.index,
      blockHash: literal.hash,
      startOffset: found,
      endOffset: found + codePointLength(snapshotText),
      isOrphaned: false,
      method: "fuzzy",
    };
  }

  // 4. Fuzzy por snapshotText en la ventana ±10, para texto que además fue editado.
  const best = bestFuzzyMatch(snapshotText, blocks, highlight.blockIndex);
  if (best) {
    const exact = fitOffsets(best, highlight, "fuzzy");
    if (exact) return exact;

    // Similitud suficiente pero sin substring exacto: el texto fue editado.
    // Se ancla al mejor alineamiento aproximado dentro del bloque.
    const aligned = bestAlignment(best.plainText, snapshotText);
    return {
      blockIndex: best.index,
      blockHash: best.hash,
      startOffset: aligned.start,
      endOffset: aligned.end,
      isOrphaned: false,
      method: "fuzzy",
    };
  }

  // 5. Huérfano. El snapshotText y la nota se conservan intactos.
  return {
    blockIndex: highlight.blockIndex,
    blockHash: highlight.blockHash,
    startOffset: highlight.startOffset,
    endOffset: highlight.endOffset,
    isOrphaned: true,
    method: "orphaned",
  };
}

/**
 * Ajusta los offsets del highlight dentro de un bloque candidato.
 * Devuelve null si el snapshotText no aparece literal en ese bloque.
 */
function fitOffsets(
  block: Block,
  highlight: HighlightAnchor,
  method: "exact" | "globalHash" | "fuzzy",
): HighlightRestoreResult | null {
  const { snapshotText, startOffset, endOffset } = highlight;

  // ¿Los offsets guardados siguen apuntando al texto correcto?
  if (sliceByCodePoints(block.plainText, startOffset, endOffset) === snapshotText) {
    return {
      blockIndex: block.index,
      blockHash: block.hash,
      startOffset,
      endOffset,
      isOrphaned: false,
      method,
    };
  }

  // El texto se movió dentro del bloque: primer match manda (determinístico).
  const found = codePointIndexOf(block.plainText, snapshotText);
  if (found !== -1) {
    return {
      blockIndex: block.index,
      blockHash: block.hash,
      startOffset: found,
      endOffset: found + codePointLength(snapshotText),
      isOrphaned: false,
      method,
    };
  }

  return null;
}

/**
 * Bloque de la ventana ±10 que contiene `needle` literal, más cercano al índice
 * guardado. Empate de distancia → índice menor. La cercanía manda sobre el orden
 * porque el bloque original casi siempre sigue cerca de donde estaba.
 */
function closestBlockContaining(needle: string, blocks: Block[], aroundIndex: number): Block | null {
  if (!needle) return null;

  const from = Math.max(0, aroundIndex - FUZZY_WINDOW);
  const to = Math.min(blocks.length - 1, aroundIndex + FUZZY_WINDOW);

  let best: Block | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let i = from; i <= to; i++) {
    const block = blocks[i];
    if (!block || codePointIndexOf(block.plainText, needle) === -1) continue;
    const distance = Math.abs(i - aroundIndex);
    if (distance < bestDistance) {
      best = block;
      bestDistance = distance;
    }
  }

  return best;
}

/**
 * Mejor candidato por trigramas en la ventana [index-10, index+10] clampeada.
 *
 * Empate de score → gana el blockIndex MENOR. El spec no lo fija; sin una regla
 * explícita el test 11 (determinismo) no sería reproducible, porque el resultado
 * dependería del orden de iteración.
 */
function bestFuzzyMatch(needle: string, blocks: Block[], aroundIndex: number): Block | null {
  if (!needle) return null;

  const from = Math.max(0, aroundIndex - FUZZY_WINDOW);
  const to = Math.min(blocks.length - 1, aroundIndex + FUZZY_WINDOW);

  let best: Block | null = null;
  let bestScore = 0;

  for (let i = from; i <= to; i++) {
    const block = blocks[i];
    if (!block) continue;
    const score = trigramSimilarity(needle, snippetOf(block.plainText));
    // `>` estricto: en empate se queda el primero, que es el de índice menor.
    if (score >= FUZZY_THRESHOLD && score > bestScore) {
      best = block;
      bestScore = score;
    }
  }

  return best;
}

/**
 * Mejor alineamiento aproximado de `needle` dentro de `haystack`: se desliza una
 * ventana del largo del needle y se queda la de mayor similitud. Empate → offset menor.
 */
function bestAlignment(haystack: string, needle: string): { start: number; end: number } {
  const hayLength = codePointLength(haystack);
  const needleLength = codePointLength(needle);
  if (needleLength === 0 || hayLength === 0) return { start: 0, end: Math.min(needleLength, hayLength) };
  if (needleLength >= hayLength) return { start: 0, end: hayLength };

  let bestStart = 0;
  let bestScore = -1;

  for (let start = 0; start + needleLength <= hayLength; start++) {
    const window = sliceByCodePoints(haystack, start, start + needleLength);
    const score = trigramSimilarity(needle, window);
    if (score > bestScore) {
      bestScore = score;
      bestStart = start;
    }
  }

  return { start: bestStart, end: bestStart + needleLength };
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}
