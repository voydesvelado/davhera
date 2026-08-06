// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { RootContent } from "mdast";

import { parseDocument } from "../src/core/markdown/parse";
import { sliceByCodePoints } from "../src/core/text";
import { BlockView } from "../src/features/reader/BlockView";

/**
 * La prueba de que los offsets del modelo caen donde tienen que caer EN PANTALLA.
 *
 * Es el punto más frágil de todo el lector: un highlight guarda offsets sobre el
 * plainText normalizado, pero lo que se ve es markdown renderizado con su whitespace
 * original, negritas, links y separadores entre bloques. Si la traducción se corre
 * un carácter, los subrayados aparecen desplazados y nadie sabe por qué.
 *
 * Cada caso subraya un tramo por offsets y verifica que el <mark> del DOM contenga
 * exactamente el texto que esos offsets designan en el plainText.
 */

afterEach(cleanup);

async function renderBlockWithHighlight(markdown: string, start: number, end: number) {
  const parsed = await parseDocument(markdown);
  const block = parsed.blocks[0]!;
  const node = parsed.nodes[0] as RootContent;

  render(
    <BlockView
      block={block}
      node={node}
      highlights={[{ id: "h1", start, end, hasNote: false }]}
    />,
  );

  return { block, expected: sliceByCodePoints(block.plainText, start, end) };
}

describe("BlockView · los offsets caen en el texto correcto", () => {
  it("párrafo simple", async () => {
    const { expected } = await renderBlockWithHighlight("La atención no es un músculo.", 3, 11);
    expect(expected).toBe("atención");
    expect(document.querySelector("mark")?.textContent).toBe(expected);
  });

  it("párrafo con negritas y cursivas en el medio", async () => {
    // El texto va partido en varios nodos mdast; el offset tiene que atravesarlos.
    const markdown = "El **papel** tiene una *ventaja* que rara vez se nombra.";
    const { expected } = await renderBlockWithHighlight(markdown, 13, 29);

    const marks = [...document.querySelectorAll("mark")].map((m) => m.textContent).join("");
    expect(marks).toBe(expected);
    expect(expected).toBe("e una ventaja qu");
  });

  it("párrafo con salto de línea en el markdown fuente", async () => {
    // El fuente tiene un \n donde el plainText tiene un espacio: sin el mapa de
    // offsets, todo lo que sigue al salto quedaría corrido.
    const markdown = "Leer despacio no significa\nleer lento.";
    const { block, expected } = await renderBlockWithHighlight(markdown, 27, 37);

    expect(block.plainText).toBe("Leer despacio no significa leer lento.");
    expect(expected).toBe("leer lento");
    const marks = [...document.querySelectorAll("mark")].map((m) => m.textContent).join("");
    expect(marks).toBe(expected);
  });

  it("lista: los ítems se unen con un espacio que no existe en el DOM", async () => {
    // El parser inserta un separador entre ítems para calcular el plainText. Ese
    // separador no se renderiza, así que el renderer tiene que contarlo igual.
    const markdown = "- sobrevivir al cambio\n- llevar una nota\n- desaparecer sin ceremonia";
    const parsed = await parseDocument(markdown);
    const block = parsed.blocks[0]!;

    expect(block.plainText).toBe(
      "sobrevivir al cambio llevar una nota desaparecer sin ceremonia",
    );

    const start = block.plainText.indexOf("llevar una nota");
    const { expected } = await renderBlockWithHighlight(markdown, start, start + 15);
    expect(expected).toBe("llevar una nota");

    const marks = [...document.querySelectorAll("mark")].map((m) => m.textContent).join("");
    expect(marks).toBe(expected);
  });

  it("los headings salen como elementos semánticos reales", async () => {
    const parsed = await parseDocument("## Primera parte: la atención");
    render(
      <BlockView
        block={parsed.blocks[0]!}
        node={parsed.nodes[0] as RootContent}
        highlights={[]}
      />,
    );
    // Un lector de pantalla necesita <h2>, no un div con clase.
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
      "Primera parte: la atención",
    );
  });

  it("sin highlights no se renderiza ni una marca", async () => {
    const parsed = await parseDocument("Un párrafo cualquiera.");
    render(
      <BlockView block={parsed.blocks[0]!} node={parsed.nodes[0] as RootContent} highlights={[]} />,
    );
    expect(document.querySelectorAll("mark")).toHaveLength(0);
  });
});
