import { useCallback, useEffect, useState } from "react";
import type { RootContent } from "mdast";

import type { Block } from "../../core/markdown/blocks";
import { codePointLength, sliceByCodePoints } from "../../core/text";
import { getStore } from "../../app/store";
import { db } from "../../core/db/schema";
import { blockIndexOfDom, buildOffsetMap, rawOffsetFromDom, rawTextOf } from "./inline";

export interface SelectionToolbar {
  x: number;
  y: number;
  text: string;
}

/**
 * Subrayado a partir de la selección del usuario.
 *
 * El camino completo es: selección del DOM → offset crudo (por el `data-off` que
 * dejó el renderer) → offset normalizado (por el mapa) → highlight guardado con su
 * `snapshotText`. El snapshotText es el que después permite re-anclar el subrayado
 * aunque el documento se reimporte editado.
 */
export function useSelectionHighlights({
  documentId,
  blocks,
  nodes,
}: {
  documentId: string;
  blocks: Block[];
  nodes: unknown[];
}) {
  const [toolbar, setToolbar] = useState<SelectionToolbar | null>(null);

  useEffect(() => {
    const onSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        setToolbar(null);
        return;
      }
      const range = selection.getRangeAt(0);
      const text = selection.toString().trim();
      if (text === "") {
        setToolbar(null);
        return;
      }
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        setToolbar(null);
        return;
      }
      // La barra va sobre la selección; en móvil eso la deja encima de los handles
      // nativos, que es donde no estorba.
      setToolbar({ x: rect.left + rect.width / 2, y: rect.top, text });
    };

    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  const createHighlight = useCallback(async () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const blockIndex = blockIndexOfDom(range.startContainer);
    const endBlockIndex = blockIndexOfDom(range.endContainer);
    if (blockIndex === null || endBlockIndex === null) return;

    const store = await getStore();
    // Una selección que cruza bloques se guarda como un highlight POR bloque,
    // unidos por `groupId`: así cada rango se re-ancla por su cuenta y perder un
    // bloque no se lleva puesto el resto del subrayado.
    const groupId = blockIndex === endBlockIndex ? null : crypto.randomUUID();

    for (let index = blockIndex; index <= endBlockIndex; index++) {
      const block = blocks[index];
      const node = nodes[index] as RootContent | undefined;
      if (!block || !node) continue;

      const map = buildOffsetMap(rawTextOf(node));
      const isFirst = index === blockIndex;
      const isLast = index === endBlockIndex;

      const rawStart = isFirst ? rawOffsetFromDom(range.startContainer, range.startOffset) : 0;
      const rawEnd = isLast
        ? rawOffsetFromDom(range.endContainer, range.endOffset)
        : map.rawToNormalized.length;
      if (rawStart === null || rawEnd === null) continue;

      const start = normalizedAt(map, rawStart, "forward");
      const end = normalizedAt(map, rawEnd, "backward");
      if (start === null || end === null || end <= start) continue;

      const snapshotText = sliceByCodePoints(block.plainText, start, end);
      if (snapshotText.trim() === "") continue;

      await store.addHighlight({
        id: crypto.randomUUID(),
        documentId,
        groupId,
        blockIndex: block.index,
        blockHash: block.hash,
        startOffset: start,
        endOffset: end,
        snapshotText,
        note: null,
        isOrphaned: false,
      });
    }

    selection.removeAllRanges();
    setToolbar(null);
    // El "haptic" honesto de la web. En iOS Safari no existe y no pasa nada.
    navigator.vibrate?.(10);
  }, [blocks, nodes, documentId]);

  /** Doble click / doble tap: el párrafo entero, de una. */
  const highlightParagraph = useCallback(
    async (blockIndex: number) => {
      const block = blocks[blockIndex];
      if (!block || block.plainText.trim() === "") return;

      // Si el párrafo ya está subrayado entero, no se duplica.
      const existing = await db.highlights
        .where("documentId")
        .equals(documentId)
        .filter(
          (h) =>
            h.deletedAt === null &&
            h.blockIndex === blockIndex &&
            h.startOffset === 0 &&
            h.endOffset === codePointLength(block.plainText),
        )
        .count();
      if (existing > 0) return;

      const store = await getStore();
      await store.addHighlight({
        id: crypto.randomUUID(),
        documentId,
        groupId: null,
        blockIndex,
        blockHash: block.hash,
        startOffset: 0,
        endOffset: codePointLength(block.plainText),
        snapshotText: block.plainText,
        note: null,
        isOrphaned: false,
      });
      window.getSelection()?.removeAllRanges();
      navigator.vibrate?.(10);
    },
    [blocks, documentId],
  );

  const removeHighlight = useCallback(async (highlightId: string) => {
    const store = await getStore();
    await store.deleteHighlight(highlightId);
  }, []);

  const setNote = useCallback(async (highlightId: string, note: string | null) => {
    const store = await getStore();
    await store.setHighlightNote(highlightId, note);
  }, []);

  const highlightById = useCallback(
    (highlightId: string) => db.highlights.get(highlightId),
    [],
  );

  return { toolbar, createHighlight, highlightParagraph, removeHighlight, setNote, highlightById };
}

/**
 * Del offset crudo al normalizado. Si el crudo cae en whitespace descartado, se
 * busca el vecino: hacia adelante para un inicio, hacia atrás para un final, de
 * modo que la selección nunca incluya el espacio de los bordes.
 */
function normalizedAt(
  map: { rawToNormalized: number[]; normalizedLength: number },
  rawIndex: number,
  direction: "forward" | "backward",
): number | null {
  if (rawIndex >= map.rawToNormalized.length) return map.normalizedLength;

  if (direction === "forward") {
    for (let i = rawIndex; i < map.rawToNormalized.length; i++) {
      const value = map.rawToNormalized[i];
      if (value !== undefined && value !== -1) return value;
    }
    return map.normalizedLength;
  }

  for (let i = rawIndex - 1; i >= 0; i--) {
    const value = map.rawToNormalized[i];
    if (value !== undefined && value !== -1) return value + 1;
  }
  return null;
}
