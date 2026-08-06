import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import type { Root, RootContent } from "mdast";

import { sha256 } from "../hash";
import { normalizePlainText, snippetOf } from "../text";
import type { Block, BlockKind, ParsedDocument } from "./blocks";

/**
 * Este módulo es el pesado del bundle (unified + remark + micromark). Se carga por
 * `import()` dinámico desde donde se necesita — importar y abrir un documento — para
 * que el shell inicial siga por debajo del presupuesto de 150KB gzip.
 */
const processor = unified().use(remarkParse).use(remarkGfm).use(remarkFrontmatter, ["yaml"]);

/**
 * Tipos de mdast que son contenedores de bloques. Sus hijos se unen con espacio;
 * los inline se unen sin separador, para que "**negrita**palabra" sea "negritapalabra"
 * y una lista de "uno"/"dos" sea "uno dos" y no "unodos".
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

/**
 * Nodos que no producen bloque: el frontmatter (metadata, no contenido) y las
 * definiciones de links de referencia (invisibles al lector).
 *
 * Todo lo demás SÍ produce bloque, incluso si su texto queda vacío: los índices de
 * bloque son parte del ancla y saltearse nodos los desplazaría.
 */
const SKIPPED = new Set(["yaml", "toml", "definition"]);

export async function parseDocument(markdown: string): Promise<ParsedDocument> {
  const tree = processor.parse(markdown) as Root;

  const nodes = tree.children.filter((n) => !SKIPPED.has(n.type));
  const blocks: Block[] = await Promise.all(
    nodes.map(async (node, index): Promise<Block> => {
      const plainText = normalizePlainText(extractText(node));
      const kind = kindOf(node);
      const level = node.type === "heading" ? node.depth : undefined;
      return {
        index,
        kind,
        // exactOptionalPropertyTypes: `level` solo existe si es heading.
        ...(level === undefined ? {} : { level }),
        plainText,
        hash: await sha256(snippetOf(plainText)),
      };
    }),
  );

  const plainTextIndex = blocks
    .map((b) => b.plainText)
    .filter(Boolean)
    .join(" ");

  return {
    blocks,
    nodes,
    plainTextIndex,
    wordCount: countWords(plainTextIndex),
    title: detectTitle(tree, blocks, plainTextIndex),
  };
}

function kindOf(node: RootContent): BlockKind {
  switch (node.type) {
    case "heading":
      return "heading";
    case "list":
      return "list";
    case "blockquote":
      return "blockquote";
    case "code":
      return "codeBlock";
    case "table":
      return "table";
    case "thematicBreak":
      return "thematicBreak";
    case "footnoteDefinition":
      return "footnote";
    case "paragraph":
      // Un párrafo cuyo único contenido es una imagen ES una imagen: se renderiza
      // como bloque y el lector la percibe así.
      return node.children.length === 1 && node.children[0]?.type === "image"
        ? "image"
        : "paragraph";
    default:
      return "paragraph";
  }
}

function extractText(node: RootContent | Root): string {
  if (node.type === "image") return node.alt ?? "";
  if (node.type === "break") return " ";
  // text, inlineCode, code, html: el valor crudo.
  if ("value" in node && typeof node.value === "string") return node.value;
  if (!("children" in node) || !Array.isArray(node.children)) return "";

  const parts = node.children.map((child) => extractText(child as RootContent));
  const separator = node.children.some((c) => BLOCK_LEVEL.has((c as RootContent).type)) ? " " : "";
  return parts.join(separator);
}

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

/** H1 → frontmatter `title` → primeras 6 palabras. En ese orden, como el spec. */
function detectTitle(tree: Root, blocks: Block[], plainTextIndex: string): string {
  const h1 = blocks.find((b) => b.kind === "heading" && b.level === 1 && b.plainText !== "");
  if (h1) return h1.plainText;

  const frontmatter = tree.children.find((n) => n.type === "yaml");
  if (frontmatter && "value" in frontmatter) {
    // Parser mínimo a propósito: solo `title:` de primer nivel. Meter un YAML
    // completo por un campo no vale el bundle.
    const match = /^title:\s*(.+)$/m.exec(frontmatter.value);
    const raw = match?.[1]?.trim().replace(/^["']|["']$/g, "");
    if (raw) return normalizePlainText(raw);
  }

  const firstWords = plainTextIndex.trim().split(/\s+/).slice(0, 6).join(" ");
  return firstWords || "Sin título";
}
