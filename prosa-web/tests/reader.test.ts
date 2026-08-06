import { describe, expect, it } from "vitest";

import {
  anchorFromViewport,
  referenceLine,
  scrollTopForAnchor,
  type BlockRect,
} from "../src/core/anchor/viewport";
import { normalizePlainText, codePointLength } from "../src/core/text";
import { buildOffsetMap, normalizedLengthOf, splitByHighlights } from "../src/features/reader/inline";

const VIEWPORT = 800;

/** Bloques de alto fijo, como un documento renderizado. */
function layout(heights: number[]): { rects: BlockRect[]; scrollHeight: number } {
  let top = 0;
  const rects = heights.map((height, index) => {
    const rect: BlockRect = { index, top, height };
    top += height;
    return rect;
  });
  return { rects, scrollHeight: top };
}

describe("geometría del ancla", () => {
  it("ancla al último bloque que empieza en o antes de la línea de referencia", () => {
    const { rects, scrollHeight } = layout([100, 100, 900, 100]);
    // Línea de referencia en scrollTop + 800/3 ≈ 266.
    const anchor = anchorFromViewport(rects, 0, VIEWPORT, scrollHeight);

    // El bloque 2 empieza en 200 y ocupa toda la pantalla: el ancla va ahí, no en
    // el bloque 1 que quedó arriba.
    expect(anchor.blockIndex).toBe(2);
    expect(anchor.offsetInBlock).toBeCloseTo((referenceLine(VIEWPORT) - 200) / 900, 6);
  });

  it("round-trip: del scroll al ancla y de vuelta al mismo scroll", () => {
    const { rects, scrollHeight } = layout([200, 300, 400, 500, 600]);
    const scrollTop = 700;

    const anchor = anchorFromViewport(rects, scrollTop, VIEWPORT, scrollHeight);
    const back = scrollTopForAnchor(
      rects.find((r) => r.index === anchor.blockIndex),
      anchor.offsetInBlock,
      VIEWPORT,
      scrollHeight,
    );

    expect(back).toBeCloseTo(scrollTop, 6);
  });

  it("EL CRITERIO DE M3: cambiar el tamaño de fuente deja al lector en el mismo texto", () => {
    // Layout original y el mismo documento con la letra más grande: todos los
    // bloques crecen, así que el píxel donde estaba el lector ya no significa nada.
    const original = layout([200, 300, 400, 500, 600]);
    const bigger = layout([200, 300, 400, 500, 600].map((h) => Math.round(h * 1.3)));

    const scrollTop = 900;
    const anchor = anchorFromViewport(original.rects, scrollTop, VIEWPORT, original.scrollHeight);

    // Se re-ancla contra el layout NUEVO.
    const restoredScroll = scrollTopForAnchor(
      bigger.rects.find((r) => r.index === anchor.blockIndex),
      anchor.offsetInBlock,
      VIEWPORT,
      bigger.scrollHeight,
    );
    const after = anchorFromViewport(bigger.rects, restoredScroll, VIEWPORT, bigger.scrollHeight);

    // Mismo bloque y misma fracción dentro de él: el lector ve la misma frase,
    // aunque el scrollTop en píxeles sea otro.
    expect(after.blockIndex).toBe(anchor.blockIndex);
    expect(after.offsetInBlock).toBeCloseTo(anchor.offsetInBlock, 6);
    expect(restoredScroll).not.toBeCloseTo(scrollTop, 0);
  });

  it("un documento que entra entero en pantalla no reporta progreso falso", () => {
    const { rects } = layout([100, 100]);
    // scrollHeight <= viewport: no hay scroll que medir.
    const anchor = anchorFromViewport(rects, 0, VIEWPORT, 200);
    expect(anchor.progress).toBe(0);
  });

  it("el scroll restaurado nunca se pasa del final del documento", () => {
    const { rects, scrollHeight } = layout([200, 200]);
    const target = scrollTopForAnchor(rects[1], 1, VIEWPORT, scrollHeight);
    expect(target).toBeLessThanOrEqual(Math.max(0, scrollHeight - VIEWPORT));
    expect(target).toBeGreaterThanOrEqual(0);
  });
});

describe("offsets entre el markdown y lo que se ve", () => {
  const samples = [
    "Un párrafo simple.",
    "  espacios    de    sobra   ",
    "con\nsalto de línea\nen el fuente",
    "café y café conviven",
    "emoji 👨‍👩‍👧 en el medio",
    "",
  ];

  it("el mapa de offsets coincide con la normalización real", () => {
    // Si estas dos se separan, TODOS los subrayados del documento se corren.
    for (const sample of samples) {
      const map = buildOffsetMap(sample);
      expect(map.normalizedLength, `muestra: ${JSON.stringify(sample)}`).toBe(
        normalizedLengthOf(sample),
      );
    }
  });

  it("cada carácter conservado apunta a su lugar en el texto normalizado", () => {
    const raw = "  hola   mundo  ";
    const normalized = normalizePlainText(raw);
    const map = buildOffsetMap(raw);
    const chars = Array.from(raw.normalize("NFC"));
    const normalizedChars = Array.from(normalized);

    for (let i = 0; i < chars.length; i++) {
      const target = map.rawToNormalized[i]!;
      if (target === -1) continue;
      expect(normalizedChars[target]).toBe(chars[i]);
    }
  });

  it("partir por highlights conserva el texto completo", () => {
    const raw = "La atención no es un músculo, aunque nos guste la metáfora.";
    const map = buildOffsetMap(raw);
    const pieces = splitByHighlights(raw, 0, map, [
      { id: "h1", start: 3, end: 11, hasNote: false },
    ]);

    expect(pieces.map((p) => p.text).join("")).toBe(raw);
    const marked = pieces.filter((p) => p.highlight).map((p) => p.text).join("");
    expect(marked).toBe("atención");
  });

  it("un subrayado que cruza un espacio no se parte en dos", () => {
    const raw = "uno dos tres";
    const map = buildOffsetMap(raw);
    const pieces = splitByHighlights(raw, 0, map, [
      { id: "h1", start: 0, end: 7, hasNote: false },
    ]);
    expect(pieces.filter((p) => p.highlight)).toHaveLength(1);
    expect(pieces.find((p) => p.highlight)?.text).toBe("uno dos");
  });

  it("sin highlights devuelve el texto intacto en una sola pieza", () => {
    const raw = "nada marcado acá";
    const pieces = splitByHighlights(raw, 0, buildOffsetMap(raw), []);
    expect(pieces).toHaveLength(1);
    expect(pieces[0]?.text).toBe(raw);
    expect(codePointLength(pieces[0]!.text)).toBe(codePointLength(raw));
  });
});
