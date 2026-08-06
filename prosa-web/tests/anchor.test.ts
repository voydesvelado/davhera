import { describe, expect, it } from "vitest";

import { parseDocument } from "../src/core/markdown/parse";
import type { Block } from "../src/core/markdown/blocks";
import {
  createAnchor,
  reanchorHighlight,
  restoreOnOpen,
  restorePosition,
} from "../src/core/anchor/engine";
import { codePointLength, normalizePlainText } from "../src/core/text";
import type { HighlightAnchor } from "../src/core/anchor/types";
import {
  ANCHOR_PARAGRAPH,
  BASE,
  truncated,
  withDeletedAnchor,
  withEditedAnchor,
  withInsertionUpstream,
} from "./fixtures/variants";

/**
 * Los 11 tests obligatorios del AnchorEngine (PROSA_SPEC §4), portados tal cual.
 * Si uno de estos se relaja, el que pierde la posición o el subrayado es el usuario.
 */

const anchorText = normalizePlainText(ANCHOR_PARAGRAPH);

async function blocksOf(markdown: string): Promise<Block[]> {
  return (await parseDocument(markdown)).blocks;
}

function indexOfAnchor(blocks: Block[]): number {
  const found = blocks.findIndex((b) => b.plainText === anchorText);
  expect(found, "el fixture debe contener el párrafo ancla").toBeGreaterThan(-1);
  return found;
}

describe("AnchorEngine · posición", () => {
  it("1. round-trip básico: guardar y restaurar sobre el mismo documento", async () => {
    const blocks = await blocksOf(BASE);
    const index = indexOfAnchor(blocks);

    const saved = createAnchor(blocks, index, 0.42, 0.31);
    const restored = restorePosition(saved, blocks);

    expect(restored.blockIndex).toBe(index);
    expect(restored.offsetInBlock).toBeCloseTo(0.42, 10);
    expect(restored.method).toBe("exact");
    expect(restored.approximate).toBe(false);
  });

  it("2. cambio de layout: re-render del mismo documento acierta por hash, sin fuzzy", async () => {
    const blocks = await blocksOf(BASE);
    const index = indexOfAnchor(blocks);
    const saved = createAnchor(blocks, index, 0.5, 0.4);

    // "Re-render": el documento se vuelve a parsear entero (cambio de fuente,
    // resize, zoom). El paso 1 tiene que acertar y el fuzzy NO debe invocarse.
    const reparsed = await blocksOf(BASE);
    const restored = restorePosition(saved, reparsed);

    expect(restored.method).toBe("exact");
    expect(restored.blockIndex).toBe(index);
    expect(restored.offsetInBlock).toBeCloseTo(0.5, 10);
  });

  it("3. párrafo insertado aguas arriba: la búsqueda global por hash encuentra el bloque desplazado", async () => {
    const original = await blocksOf(BASE);
    const index = indexOfAnchor(original);
    const saved = createAnchor(original, index, 0.25, 0.3);

    const edited = await blocksOf(withInsertionUpstream());
    const restored = restorePosition(saved, edited);

    expect(restored.method).toBe("globalHash");
    expect(restored.blockIndex).toBe(index + 1);
    expect(edited[restored.blockIndex]?.plainText).toBe(anchorText);
    // El offset dentro del bloque se conserva: el bloque es el mismo.
    expect(restored.offsetInBlock).toBeCloseTo(0.25, 10);
    expect(restored.approximate).toBe(false);
  });

  it("4. bloque ancla editado levemente: el hash falla y el fuzzy lo encuentra", async () => {
    const original = await blocksOf(BASE);
    const index = indexOfAnchor(original);
    const saved = createAnchor(original, index, 0.6, 0.35);

    const edited = await blocksOf(withEditedAnchor());
    const restored = restorePosition(saved, edited);

    expect(restored.method).toBe("fuzzy");
    expect(restored.blockIndex).toBe(index);
    expect(restored.approximate).toBe(true);
  });

  it("5. bloque ancla borrado: clamp al índice válido más cercano", async () => {
    const original = await blocksOf(BASE);
    const index = indexOfAnchor(original);
    const saved = createAnchor(original, index, 0.8, 0.4);

    const edited = await blocksOf(withDeletedAnchor());
    const restored = restorePosition(saved, edited);

    expect(restored.method).toBe("clamp");
    expect(restored.offsetInBlock).toBe(0);
    expect(restored.approximate).toBe(true);
    expect(restored.blockIndex).toBeLessThan(edited.length);
  });

  it("6. documento truncado: el ancla más allá del final cae al último bloque", async () => {
    const original = await blocksOf(BASE);
    const index = indexOfAnchor(original);
    const saved = createAnchor(original, index, 0.5, 0.4);

    const short = await blocksOf(truncated());
    expect(short.length).toBeLessThan(index + 1);

    const restored = restorePosition(saved, short);

    expect(restored.method).toBe("clamp");
    expect(restored.blockIndex).toBe(short.length - 1);
    expect(restored.offsetInBlock).toBe(0);
  });

  it("7. documento terminado: se reabre al inicio y conserva el status", async () => {
    const blocks = await blocksOf(BASE);
    const index = indexOfAnchor(blocks);
    const saved = createAnchor(blocks, index, 0.9, 0.98);

    const restored = restoreOnOpen("finished", saved, blocks);

    expect(restored.blockIndex).toBe(0);
    expect(restored.offsetInBlock).toBe(0);
    expect(restored.approximate).toBe(false);
    // El ancla guardada queda intacta: reabrir no la pisa.
    expect(saved.blockIndex).toBe(index);
    expect(saved.progress).toBeCloseTo(0.98, 10);

    // En cambio 'reading' sí restaura donde iba.
    expect(restoreOnOpen("reading", saved, blocks).blockIndex).toBe(index);
  });

  it("11. determinismo del fuzzy: mismo input, mismo bloque elegido, siempre", async () => {
    const original = await blocksOf(BASE);
    const index = indexOfAnchor(original);
    const saved = createAnchor(original, index, 0.5, 0.4);
    const edited = await blocksOf(withEditedAnchor());

    const results = Array.from({ length: 50 }, () => restorePosition(saved, edited));
    const first = JSON.stringify(results[0]);
    for (const r of results) expect(JSON.stringify(r)).toBe(first);

    // Y con dos candidatos de score idéntico, gana el índice MENOR — sin esta
    // regla el resultado dependería del orden de iteración.
    const twin: Block = { ...edited[index]!, index: index + 1 };
    const withTwin = [...edited.slice(0, index + 1), twin, ...edited.slice(index + 1)].map(
      (b, i) => ({ ...b, index: i }),
    );
    const tie = restorePosition(saved, withTwin);
    expect(tie.blockIndex).toBe(index);
  });
});

describe("AnchorEngine · highlights", () => {
  function highlightOn(blocks: Block[], blockIndex: number, text: string): HighlightAnchor {
    const block = blocks[blockIndex]!;
    const start = Array.from(block.plainText).join("").indexOf(text);
    expect(start, "el texto a subrayar debe existir en el bloque").toBeGreaterThan(-1);
    const startOffset = codePointLength(block.plainText.slice(0, start));
    return {
      blockIndex,
      blockHash: block.hash,
      startOffset,
      endOffset: startOffset + codePointLength(text),
      snapshotText: text,
      isOrphaned: false,
    };
  }

  it("8. el highlight sobrevive a que cambien los párrafos vecinos", async () => {
    const original = await blocksOf(BASE);
    const index = indexOfAnchor(original);
    const highlight = highlightOn(original, index, "no es un músculo");

    // Se inserta un párrafo aguas arriba: el bloque del highlight no cambia.
    const edited = await blocksOf(withInsertionUpstream());
    const result = reanchorHighlight(highlight, edited);

    expect(result.isOrphaned).toBe(false);
    expect(result.method).toBe("globalHash");
    expect(result.blockIndex).toBe(index + 1);
    expect(result.startOffset).toBe(highlight.startOffset);
    expect(result.endOffset).toBe(highlight.endOffset);
  });

  it("9. texto movido dentro del bloque: los offsets se reajustan por substring", async () => {
    const original = await blocksOf(BASE);
    const index = indexOfAnchor(original);
    const highlight = highlightOn(original, index, "se cierra la puerta");

    // Se agrega un prefijo al bloque: el texto subrayado sigue ahí, corrido.
    const prefixed = `Conviene decirlo de entrada: ${ANCHOR_PARAGRAPH}`;
    const edited = await blocksOf(BASE.replace(ANCHOR_PARAGRAPH, prefixed));
    const result = reanchorHighlight(highlight, edited);

    expect(result.isOrphaned).toBe(false);
    expect(result.startOffset).toBeGreaterThan(highlight.startOffset);

    const block = edited[result.blockIndex]!;
    const reanchored = Array.from(block.plainText)
      .slice(result.startOffset, result.endOffset)
      .join("");
    expect(reanchored).toBe(highlight.snapshotText);
  });

  it("10. el bloque desapareció: queda huérfano, con su snapshotText intacto, sin borrarse", async () => {
    const original = await blocksOf(BASE);
    const index = indexOfAnchor(original);
    const highlight = highlightOn(original, index, "se cierra la puerta");

    const edited = await blocksOf(withDeletedAnchor());
    const result = reanchorHighlight(highlight, edited);

    expect(result.isOrphaned).toBe(true);
    expect(result.method).toBe("orphaned");
    // Nada se borra y el texto del usuario se conserva tal cual.
    expect(highlight.snapshotText).toBe("se cierra la puerta");
    expect(result.startOffset).toBe(highlight.startOffset);
    expect(result.endOffset).toBe(highlight.endOffset);
  });
});
