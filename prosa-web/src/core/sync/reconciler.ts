import type { ProsaDB } from "../db/schema";
import type { DocumentStore } from "../db/store";
import type { DocumentRecord, HighlightRecord, PositionRecord } from "../db/types";
import { codePointLength, sliceByCodePoints } from "../text";

/**
 * DuplicateReconciler.
 *
 * El edge case central de conectar bibliotecas preexistentes: el mismo ensayo
 * importado por separado en dos dispositivos tiene el mismo `contentHash` y
 * distinto `id`. Sin esto, el primer sync duplica media biblioteca.
 *
 * La regla es 100% determinística a propósito: los dos lados la ejecutan por
 * separado, sin coordinarse, y tienen que llegar al mismo resultado. Cualquier
 * dependencia del orden de iteración o de la hora local rompería eso.
 *
 * Corre DESPUÉS de aplicar los cambios remotos, con el flag `isApplyingRemote`
 * apagado: sus escrituras SÍ tienen que registrarse en el ChangeLog.
 */

export interface ReconcileResult {
  /** Pares fusionados: [canónico, absorbido]. */
  merged: [string, string][];
  highlightsMoved: number;
}

export async function reconcileDuplicates(
  db: ProsaDB,
  store: DocumentStore,
): Promise<ReconcileResult> {
  const result: ReconcileResult = { merged: [], highlightsMoved: 0 };

  const alive = (await db.documents.toArray()).filter((d) => d.deletedAt === null);
  const groups = new Map<string, DocumentRecord[]>();
  for (const doc of alive) {
    if (!doc.contentHash) continue;
    const list = groups.get(doc.contentHash) ?? [];
    list.push(doc);
    groups.set(doc.contentHash, list);
  }

  for (const [, docs] of groups) {
    if (docs.length < 2) continue;

    const [canonical, ...absorbed] = [...docs].sort(compareCanonical);
    if (!canonical) continue;

    for (const other of absorbed) {
      await mergeInto(db, store, canonical, other, result);
      result.merged.push([canonical.id, other.id]);
    }
  }

  return result;
}

/**
 * Canónico = el `importedAt` más antiguo. Empate exacto → menor UUID
 * lexicográfico. Ese desempate no es capricho: sin él, dos dispositivos que
 * importaron el mismo ensayo en el mismo milisegundo elegirían canónicos
 * distintos y se borrarían el documento el uno al otro.
 */
function compareCanonical(a: DocumentRecord, b: DocumentRecord): number {
  const byDate = a.importedAt.localeCompare(b.importedAt);
  return byDate !== 0 ? byDate : a.id.localeCompare(b.id);
}

const STATUS_RANK = { unread: 0, reading: 1, finished: 2 } as const;

async function mergeInto(
  db: ProsaDB,
  store: DocumentStore,
  canonical: DocumentRecord,
  other: DocumentRecord,
  result: ReconcileResult,
): Promise<void> {
  // 1. Documento: el status más avanzado y el lastOpenedAt más reciente.
  const status =
    STATUS_RANK[other.status] > STATUS_RANK[canonical.status] ? other.status : canonical.status;
  const lastOpenedAt = mostRecent(canonical.lastOpenedAt, other.lastOpenedAt);

  if (status !== canonical.status) await store.setStatus(canonical.id, status);
  if (lastOpenedAt !== canonical.lastOpenedAt) {
    await db.documents.update(canonical.id, { lastOpenedAt });
  }

  // 2. Posición: gana el progreso mayor. Nunca se manda a nadie hacia atrás.
  const [positionA, positionB] = await Promise.all([
    db.positions.get(canonical.id),
    db.positions.get(other.id),
  ]);
  const winner = bestPosition(positionA, positionB);
  if (winner && winner !== positionA) {
    await store.savePosition(canonical.id, {
      blockIndex: winner.blockIndex,
      blockHash: winner.blockHash,
      anchorSnippet: winner.anchorSnippet,
      offsetInBlock: winner.offsetInBlock,
      progress: winner.progress,
    });
  }

  // 3. Highlights: UNIÓN. El contenido es idéntico —mismo contentHash—, así que
  // los anclajes valen tal cual y solo hay que reasignar el documentId.
  const incoming = (await db.highlights.where("documentId").equals(other.id).toArray()).filter(
    (h) => h.deletedAt === null,
  );
  const existing = (await db.highlights.where("documentId").equals(canonical.id).toArray()).filter(
    (h) => h.deletedAt === null,
  );

  for (const highlight of incoming) {
    const overlapping = existing.find((h) => overlaps(h, highlight));

    if (overlapping) {
      // Solapados → uno solo, con el rango unión. Las notas se CONCATENAN: perder
      // la nota de alguien porque subrayó dos veces lo mismo sería imperdonable.
      const merged = mergeOverlapping(overlapping, highlight);
      await db.highlights.put({ ...merged, documentId: canonical.id });
      await store.setHighlightNote(overlapping.id, merged.note);
      await store.deleteHighlight(highlight.id);
    } else {
      await db.highlights.put({ ...highlight, documentId: canonical.id });
      await store.addHighlight({
        id: highlight.id,
        documentId: canonical.id,
        groupId: highlight.groupId,
        blockIndex: highlight.blockIndex,
        blockHash: highlight.blockHash,
        startOffset: highlight.startOffset,
        endOffset: highlight.endOffset,
        snapshotText: highlight.snapshotText,
        note: highlight.note,
        isOrphaned: highlight.isOrphaned,
      });
      existing.push(highlight);
    }
    result.highlightsMoved++;
  }

  // 4. Tags: unión.
  const links = await db.documentTags.where("documentId").equals(other.id).toArray();
  for (const link of links) {
    await db.documentTags.put({ ...link, documentId: canonical.id });
  }

  // 5. El no-canónico se borra AL FINAL, después de que todos los upserts de la
  // fusión ya están encolados. Un crash entre medio deja un duplicado temporal,
  // que se arregla en la próxima pasada; el orden inverso perdería datos.
  await store.deleteDocument(other.id);
}

function bestPosition(
  a: PositionRecord | undefined,
  b: PositionRecord | undefined,
): PositionRecord | undefined {
  if (!a) return b;
  if (!b) return a;
  if (b.progress > a.progress) return b;
  if (a.progress > b.progress) return a;
  return b.updatedAt > a.updatedAt ? b : a;
}

function mostRecent(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}

/** Se tocan o se pisan, en el mismo bloque. Contiguos cuentan: son un subrayado. */
function overlaps(a: HighlightRecord, b: HighlightRecord): boolean {
  return a.blockIndex === b.blockIndex && a.startOffset <= b.endOffset && b.startOffset <= a.endOffset;
}

/**
 * Fusiona dos highlights solapados en el rango unión.
 *
 * El `snapshotText` de la unión se reconstruye a partir de los dos snapshots sin
 * necesidad del documento: se conoce el offset de cada uno, así que el pedazo que
 * le falta a uno está en el otro.
 */
export function mergeOverlapping(a: HighlightRecord, b: HighlightRecord): HighlightRecord {
  const [first, second] = a.startOffset <= b.startOffset ? [a, b] : [b, a];
  const start = first.startOffset;
  const end = Math.max(first.endOffset, second.endOffset);

  let snapshotText = first.snapshotText;
  if (second.endOffset > first.endOffset) {
    // El tramo de `second` que sobresale, contado desde donde termina `first`.
    const from = Math.max(0, first.endOffset - second.startOffset);
    snapshotText += sliceByCodePoints(second.snapshotText, from, codePointLength(second.snapshotText));
  }

  const notes = [a.note, b.note].filter((note): note is string => !!note && note.trim() !== "");
  // El separador del spec. Dos notas distintas sobre el mismo pasaje son dos
  // pensamientos, no uno que reemplaza al otro.
  const note = notes.length > 0 ? [...new Set(notes)].join("\n—\n") : null;

  return {
    ...a,
    startOffset: start,
    endOffset: end,
    snapshotText,
    note,
    updatedAt: a.updatedAt > b.updatedAt ? a.updatedAt : b.updatedAt,
  };
}
