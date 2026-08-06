import type { ProsaDB } from "./schema";
import type { DocumentRecord, PositionRecord } from "./types";

/** Velocidad de lectura para estimar el tiempo restante (PROSA_SPEC). */
export const WORDS_PER_MINUTE = 220;

/** Documentos con menos de esto no muestran tiempo ni TOC: sería ruido. */
export const SHORT_DOCUMENT_WORDS = 300;

export interface LibraryEntry {
  document: DocumentRecord;
  position: PositionRecord | undefined;
}

/** Todo lo vivo, lo más reciente primero. Los tombstones no se muestran jamás. */
export async function listLibrary(db: ProsaDB): Promise<LibraryEntry[]> {
  const documents = await db.documents.filter((d) => d.deletedAt === null).toArray();
  documents.sort((a, b) => b.importedAt.localeCompare(a.importedAt));

  const positions = await db.positions.toArray();
  const byDocument = new Map(positions.map((p) => [p.documentId, p]));

  return documents.map((document) => ({ document, position: byDocument.get(document.id) }));
}

/**
 * El documento de "Continuar leyendo": el último abierto que está empezado y sin
 * terminar. Si nunca se abrió ninguno, no hay card — y el empty state se encarga.
 */
export function continueReading(entries: LibraryEntry[]): LibraryEntry | undefined {
  return entries
    .filter((e) => e.document.status === "reading" && e.document.lastOpenedAt !== null)
    .sort((a, b) => (b.document.lastOpenedAt ?? "").localeCompare(a.document.lastOpenedAt ?? ""))[0];
}

export function minutesRemaining(entry: LibraryEntry): number {
  const progress = entry.position?.progress ?? 0;
  const wordsLeft = entry.document.wordCount * (1 - progress);
  return Math.max(1, Math.round(wordsLeft / WORDS_PER_MINUTE));
}

export function totalMinutes(document: DocumentRecord): number {
  return Math.max(1, Math.round(document.wordCount / WORDS_PER_MINUTE));
}

export interface SearchHit {
  entry: LibraryEntry;
  /** Dónde apareció: el título pesa más que el cuerpo y se agrupa aparte. */
  where: "title" | "text";
  /** Fragmento con la palabra buscada en contexto, para los hits de cuerpo. */
  excerpt?: string;
}

/**
 * Búsqueda por título y texto completo. Los resultados vienen agrupados: primero
 * los títulos, después el cuerpo, como en las apps nativas.
 */
export function search(entries: LibraryEntry[], rawQuery: string): SearchHit[] {
  const query = rawQuery.trim().toLowerCase();
  if (query === "") return [];

  const titleHits: SearchHit[] = [];
  const textHits: SearchHit[] = [];

  for (const entry of entries) {
    if (entry.document.title.toLowerCase().includes(query)) {
      titleHits.push({ entry, where: "title" });
      continue;
    }
    const index = entry.document.plainTextIndex.toLowerCase().indexOf(query);
    if (index !== -1) {
      textHits.push({ entry, where: "text", excerpt: excerptAround(entry.document.plainTextIndex, index, query.length) });
    }
  }

  return [...titleHits, ...textHits];
}

function excerptAround(text: string, index: number, length: number): string {
  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, index + length + 40);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}
