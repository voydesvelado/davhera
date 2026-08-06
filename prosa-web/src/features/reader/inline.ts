import type { RootContent } from "mdast";

import { codePointLength, normalizePlainText } from "../../core/text";

/**
 * El puente entre los offsets del modelo y el texto que se ve en pantalla.
 *
 * Un highlight guarda offsets sobre el `plainText` NORMALIZADO del bloque (NFC,
 * whitespace colapsado, trim). El markdown renderizado tiene ese texto repartido en
 * nodos con su whitespace original. Sin una traducción explícita, un salto de línea
 * en el markdown fuente correría todos los subrayados de ese párrafo.
 *
 * La traducción es en dos pasos: DOM → offset crudo (por el `data-off` que el
 * renderer deja en cada pedazo de texto) y crudo → normalizado (por este mapa).
 */

export interface OffsetMap {
  /** rawToNormalized[i] = índice normalizado del char crudo i, o -1 si se descartó. */
  rawToNormalized: number[];
  normalizedLength: number;
}

/**
 * Replica la normalización de `normalizePlainText` registrando a dónde fue a parar
 * cada carácter. Si las dos se separan, los subrayados se corren: por eso hay un
 * test que compara este mapa contra la función real.
 */
export function buildOffsetMap(raw: string): OffsetMap {
  const chars = Array.from(raw.normalize("NFC"));
  const rawToNormalized: number[] = new Array<number>(chars.length).fill(-1);

  let normalized = 0;
  let pendingSpace = false;
  let started = false;

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]!;
    if (/\s/.test(char)) {
      // Una corrida de whitespace vale un espacio, y solo si ya empezó el texto
      // (el trim de la izquierda). El de la derecha nunca llega a emitirse.
      if (started) pendingSpace = true;
      continue;
    }
    if (pendingSpace) {
      normalized += 1;
      pendingSpace = false;
    }
    rawToNormalized[i] = normalized;
    normalized += 1;
    started = true;
  }

  return { rawToNormalized, normalizedLength: normalized };
}

/** El primer índice crudo que mapea a `normalizedIndex`, o -1. */
export function rawIndexOf(map: OffsetMap, normalizedIndex: number): number {
  return map.rawToNormalized.indexOf(normalizedIndex);
}

/** Longitud normalizada según la función real. Los tests comparan contra esto. */
export function normalizedLengthOf(raw: string): number {
  return codePointLength(normalizePlainText(raw));
}

/**
 * Los nodos de mdast cuyos hijos son bloques. Sus hijos se unen con un espacio,
 * igual que en el parser — si las dos reglas se separan, los offsets se corren.
 */
const BLOCK_LEVEL = new Set([
  "paragraph",
  "heading",
  "blockquote",
  "list",
  "listItem",
  "table",
  "tableRow",
  "tableCell",
  "code",
  "thematicBreak",
  "footnoteDefinition",
  "html",
]);

export function joinsWithSpace(node: RootContent): boolean {
  return (
    "children" in node &&
    Array.isArray(node.children) &&
    node.children.some((child) => BLOCK_LEVEL.has((child as RootContent).type))
  );
}

/**
 * El texto crudo concatenado de un bloque, en el MISMO orden y con las MISMAS
 * uniones que usa el parser para calcular el plainText.
 */
export function rawTextOf(node: RootContent): string {
  if (node.type === "image") return node.alt ?? "";
  if (node.type === "break") return " ";
  if ("value" in node && typeof node.value === "string") return node.value;
  if (!("children" in node) || !Array.isArray(node.children)) return "";

  const parts = node.children.map((child) => rawTextOf(child as RootContent));
  return parts.join(joinsWithSpace(node) ? " " : "");
}

export interface HighlightRange {
  id: string;
  start: number;
  end: number;
  hasNote: boolean;
}

export interface TextPiece {
  text: string;
  /** Offset crudo donde empieza este pedazo, para el `data-off` del renderer. */
  rawStart: number;
  highlight?: HighlightRange;
}

/**
 * Parte un texto crudo en pedazos según los highlights que lo cruzan.
 * `rawStart` es dónde empieza este texto dentro de la concatenación del bloque.
 */
export function splitByHighlights(
  raw: string,
  rawStart: number,
  map: OffsetMap,
  highlights: HighlightRange[],
): TextPiece[] {
  if (highlights.length === 0) return [{ text: raw, rawStart }];

  const chars = Array.from(raw);
  const pieces: TextPiece[] = [];
  let current = "";
  let currentStart = rawStart;
  let currentHighlight: HighlightRange | undefined;

  const flush = () => {
    if (current === "") return;
    pieces.push(
      currentHighlight
        ? { text: current, rawStart: currentStart, highlight: currentHighlight }
        : { text: current, rawStart: currentStart },
    );
    current = "";
  };

  const covers = (highlight: HighlightRange | undefined, normalizedIndex: number): boolean =>
    highlight !== undefined && normalizedIndex >= highlight.start && normalizedIndex < highlight.end;

  for (let i = 0; i < chars.length; i++) {
    const normalizedIndex = map.rawToNormalized[rawStart + i] ?? -1;

    // El whitespace no tiene índice normalizado propio, pero SÍ ocupa un lugar en
    // el texto normalizado: el que sigue al último carácter conservado. Se resuelve
    // con esa posición implícita y no heredando del estado del bucle, porque el
    // estado se reinicia en cada nodo de texto y un subrayado que cruza una negrita
    // perdía el espacio justo en la costura.
    const effectiveIndex =
      normalizedIndex === -1 ? previousNormalized(map, rawStart + i) + 1 : normalizedIndex;
    const covering =
      effectiveIndex === 0 && normalizedIndex === -1
        ? undefined // whitespace inicial: el trim se lo comió, no pertenece a nada
        : highlights.find((h) => covers(h, effectiveIndex));

    if (covering !== currentHighlight) {
      flush();
      currentStart = rawStart + i;
      currentHighlight = covering;
    }
    current += chars[i]!;
  }
  flush();

  return pieces;
}

/** El índice normalizado del último carácter conservado antes de `rawIndex` (o -1). */
function previousNormalized(map: OffsetMap, rawIndex: number): number {
  for (let i = rawIndex - 1; i >= 0; i--) {
    const value = map.rawToNormalized[i];
    if (value !== undefined && value !== -1) return value;
  }
  return -1;
}

/**
 * De una posición del DOM al offset crudo del bloque.
 *
 * Se apoya en el `data-off` que el renderer deja en cada pedazo de texto: sin él
 * habría que reconstruir el orden del documento a mano y cualquier `<br>`, `<img>`
 * o separador entre bloques desalinearía todo.
 */
export function rawOffsetFromDom(container: Node, offsetInNode: number): number | null {
  const element =
    container.nodeType === Node.TEXT_NODE ? container.parentElement : (container as Element);

  let cursor: Element | null = element;
  while (cursor && !(cursor instanceof HTMLElement && cursor.dataset["off"] !== undefined)) {
    cursor = cursor.parentElement;
  }
  if (!(cursor instanceof HTMLElement)) return null;

  const base = Number(cursor.dataset["off"]);
  if (Number.isNaN(base)) return null;

  // `offsetInNode` viene en unidades UTF-16; los offsets del modelo son code points.
  const text = container.nodeType === Node.TEXT_NODE ? (container as Text).data : "";
  return base + codePointLength(text.slice(0, offsetInNode));
}

/** El índice de bloque que contiene un nodo del DOM, o null si está fuera. */
export function blockIndexOfDom(node: Node): number | null {
  const start = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element);
  const block = start?.closest<HTMLElement>("[data-block]");
  if (!block) return null;
  const index = Number(block.dataset["block"]);
  return Number.isNaN(index) ? null : index;
}
