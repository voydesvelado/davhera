import { sha256 } from "../hash";
import type { ProsaDB } from "../db/schema";
import type { DocumentStore } from "../db/store";
import type { DocumentRecord } from "../db/types";
import { classifyImport, type DedupVerdict } from "./dedup";

export interface ImportCandidate {
  markdown: string;
  title: string;
  contentHash: string;
  plainTextIndex: string;
  wordCount: number;
  verdict: DedupVerdict;
}

/** Analiza un markdown SIN escribir nada: la decisión de importar es de quien llama. */
export async function inspect(
  db: ProsaDB,
  markdown: string,
  titleOverride?: string,
): Promise<ImportCandidate> {
  const { parseDocument } = await import("../markdown/parse");
  const parsed = await parseDocument(markdown);
  const contentHash = await sha256(markdown);
  const title = titleOverride?.trim() || parsed.title;
  const library = await db.documents.toArray();

  return {
    markdown,
    title,
    contentHash,
    plainTextIndex: parsed.plainTextIndex,
    wordCount: parsed.wordCount,
    verdict: classifyImport({ title, contentHash, plainTextIndex: parsed.plainTextIndex }, library),
  };
}

export interface BatchResult {
  imported: DocumentRecord[];
  /** Los que ya estaban idénticos. No son un error: se omiten y se dice cuántos. */
  skipped: { title: string; reason: "identical" }[];
  /** Los que fallaron de verdad (encoding roto, cuota, archivo ilegible). */
  failed: { name: string; error: string }[];
}

/**
 * Import de varios archivos. Cada uno se decide solo por su veredicto: idéntico se
 * omite, todo lo demás entra. Los casos que piden decisión humana (mismo título,
 * contención ≥90%) se resuelven en el flujo de a uno, no en el batch — preguntar
 * doce veces seguidas sería peor que importar de más.
 */
export async function importFiles(
  db: ProsaDB,
  store: DocumentStore,
  files: File[],
): Promise<BatchResult> {
  const result: BatchResult = { imported: [], skipped: [], failed: [] };

  for (const file of files) {
    try {
      const markdown = await readAsUtf8(file);
      const candidate = await inspect(db, markdown, titleFromFileName(file.name));

      if (candidate.verdict.kind === "identical") {
        result.skipped.push({ title: candidate.title, reason: "identical" });
        continue;
      }

      result.imported.push(await store.importDocument(markdown, candidate.title));
    } catch (error) {
      result.failed.push({ name: file.name, error: String(error) });
    }
  }

  return result;
}

/**
 * Lee como UTF-8 y, si el archivo trae bytes inválidos, reintenta como latin-1 en
 * vez de fallar. Un ensayo viejo guardado en Windows no debería ser inimportable.
 */
async function readAsUtf8(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    return new TextDecoder("windows-1252").decode(buffer);
  }
}

/** El nombre del archivo es solo una pista: si el md trae H1, ese gana (parse.ts). */
function titleFromFileName(name: string): string | undefined {
  const stripped = name.replace(/\.(md|markdown|txt)$/i, "").trim();
  return stripped === "" ? undefined : stripped;
}

export const ACCEPTED_EXTENSIONS = [".md", ".markdown", ".txt"];

export function isAcceptedFile(file: File): boolean {
  return ACCEPTED_EXTENSIONS.some((extension) => file.name.toLowerCase().endsWith(extension));
}
