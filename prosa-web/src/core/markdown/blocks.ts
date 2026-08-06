/**
 * El contrato de bloques. Es la base de anclas, highlights y búsqueda, y tiene que
 * ser idéntico al de swift-markdown en las apps nativas: mismo md → mismo plainText
 * → mismo hash. Si diverge, las anclas sincronizadas desde Mac/iOS fallan todas.
 *
 * PENDIENTE de verificación real: hace falta el dump de Block[] del parser Swift
 * sobre el ensayo fixture para probar la paridad (PLAN.md §8.2). Hasta tenerlo, los
 * tests comparan el parser web consigo mismo y la paridad NO está demostrada.
 */

export type BlockKind =
  | "heading"
  | "paragraph"
  | "list"
  | "blockquote"
  | "codeBlock"
  | "table"
  | "thematicBreak"
  | "image"
  | "footnote";

export interface Block {
  /** Posición en el documento parseado, 0-based. */
  index: number;
  kind: BlockKind;
  /** Solo headings: 1–6. */
  level?: number;
  /** Texto plano normalizado (NFC, whitespace colapsado, trim). */
  plainText: string;
  /** SHA-256 de los primeros 200 chars de plainText. */
  hash: string;
}

export interface ParsedDocument {
  blocks: Block[];
  /**
   * Los nodos mdast de cada bloque, mismos índices que `blocks`. El lector los
   * necesita para renderizar el formato inline (negritas, links, código) que el
   * `plainText` deliberadamente descarta.
   */
  nodes: unknown[];
  /** Todo el texto plano concatenado, para búsqueda full-text en la biblioteca. */
  plainTextIndex: string;
  wordCount: number;
  /** H1 → frontmatter `title` → primeras 6 palabras. */
  title: string;
}
