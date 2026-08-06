import "fake-indexeddb/auto";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { sha256 } from "../src/core/hash";
import { ProsaDB } from "../src/core/db/schema";
import { DocumentStore } from "../src/core/db/store";
import { documentTagToWire, tagToWire } from "../src/core/sync/wire";
import { BASE } from "./fixtures/variants";

/**
 * Test de CONTRATO contra el servidor real, no contra un mock.
 *
 * Es el que atrapa el fallo más caro del proyecto: si el cliente mandara camelCase,
 * el servidor no daría error — cada `p.get("content_hash")` devolvería su default y
 * guardaría el documento con título vacío y progress 0, respondiendo HTTP 200. El
 * usuario lo descubriría meses después, al abrir su biblioteca en otro dispositivo
 * y encontrarla vacía. Un mock escrito por el mismo que escribió el cliente
 * reproduciría el error en vez de detectarlo.
 *
 * Se saltea si no hay checkout de prosa-cloud o no hay python3 (p.ej. en el build
 * de Vercel). Cuando se saltea lo dice: un test que no corre no es un test que pasa.
 */

const CLOUD = process.env["PROSA_CLOUD"] ?? "/home/david/prosa-cloud";
const HARNESS = fileURLToPath(new URL("./contract/apply_batch.py", import.meta.url));
const available = existsSync(`${CLOUD}/app/sync.py`) && hasPython();

function hasPython(): boolean {
  try {
    execFileSync("python3", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

interface ServerRow {
  [column: string]: unknown;
}

function applyOnServer(input: unknown): {
  result: { accepted: number; conflicts: unknown[]; superseded: string[] };
  documents: ServerRow[];
  positions: ServerRow[];
  highlights: ServerRow[];
  tags: ServerRow[];
  document_tags: ServerRow[];
} {
  const out = execFileSync("python3", [HARNESS], {
    input: JSON.stringify(input),
    env: { ...process.env, PROSA_CLOUD: CLOUD },
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  return JSON.parse(out);
}

describe.skipIf(!available)("contrato del wire format contra prosa-cloud", () => {
  it("los payloads del ChangeLog se aplican correctos en el servidor real", async () => {
    const db = new ProsaDB(`prosa-contract-${Date.now()}`);
    let tick = 0;
    const store = new DocumentStore(
      db,
      "web-contract",
      () => new Date(Date.UTC(2026, 7, 6, 0, 0, tick++)).toISOString(),
      (() => {
        let n = 0;
        return () => `00000000-0000-4000-8000-${String(n++).padStart(12, "0")}`;
      })(),
    );

    const doc = await store.importDocument(BASE);
    await store.savePosition(doc.id, {
      blockIndex: 12,
      blockHash: "hash-del-bloque",
      anchorSnippet: "La atención no es un músculo",
      offsetInBlock: 0.25,
      progress: 0.42,
    });
    await store.addHighlight({
      id: "highlight-1",
      documentId: doc.id,
      groupId: "grupo-1",
      blockIndex: 12,
      blockHash: "hash-del-bloque",
      startOffset: 3,
      endOffset: 19,
      snapshotText: "no es un músculo",
      note: "volver a esto",
      isOrphaned: false,
    });

    const changes = (await db.changeLog.toArray()).map((c) => ({
      change_id: c.changeId,
      entity_type: c.entityType,
      entity_id: c.entityId,
      change_type: c.changeType,
      client_timestamp: c.clientTimestamp,
      payload: c.payload,
    }));

    // Tags: todavía no hay métodos de store para ellos (llegan en M2), pero su
    // traducción al wire sí existe y tiene que verificarse ahora, no cuando la UI
    // los use y el bug se lea como "los tags no sincronizan".
    const tagTimestamp = "2026-08-06T00:00:10.000Z";
    changes.push(
      {
        change_id: "tag-change-1",
        entity_type: "tag",
        entity_id: "tag-1",
        change_type: "upsert",
        client_timestamp: tagTimestamp,
        payload: tagToWire({
          id: "tag-1",
          name: "filosofía",
          updatedAt: tagTimestamp,
          deletedAt: null,
        }),
      },
      {
        change_id: "doctag-change-1",
        entity_type: "document_tag",
        entity_id: `${doc.id}:tag-1`,
        change_type: "upsert",
        client_timestamp: tagTimestamp,
        payload: documentTagToWire({
          documentId: doc.id,
          tagId: "tag-1",
          updatedAt: tagTimestamp,
          deletedAt: null,
        }),
      },
    );

    const server = applyOnServer({
      changes,
      contents: { [doc.id]: BASE },
      device_id: "web-contract",
    });

    // Nada rechazado: si el hash del contenido no coincidiera, esto sería un conflicto.
    expect(server.result.conflicts).toEqual([]);
    expect(server.result.accepted).toBe(changes.length);

    // El documento llegó COMPLETO, no con los defaults de p.get().
    const stored = server.documents[0]!;
    expect(stored["title"]).toBe("El oficio de leer despacio");
    expect(stored["content_hash"]).toBe(doc.contentHash);
    expect(stored["word_count"]).toBe(doc.wordCount);
    expect(stored["word_count"]).toBeGreaterThan(0);
    expect(stored["cover_seed"]).toBe(doc.coverSeed);
    expect(stored["status"]).toBe("unread");

    // La posición, con su progress real y no 0.
    const position = server.positions[0]!;
    expect(position["progress"]).toBeCloseTo(0.42, 10);
    expect(position["block_index"]).toBe(12);
    expect(position["anchor_snippet"]).toBe("La atención no es un músculo");
    expect(position["offset_in_block"]).toBeCloseTo(0.25, 10);

    // El highlight, con su snapshotText intacto — el campo sagrado.
    const highlight = server.highlights[0]!;
    expect(highlight["snapshot_text"]).toBe("no es un músculo");
    expect(highlight["start_offset"]).toBe(3);
    expect(highlight["end_offset"]).toBe(19);
    expect(highlight["note"]).toBe("volver a esto");
    expect(highlight["group_id"]).toBe("grupo-1");
    expect(highlight["is_orphaned"]).toBe(0);

    // El tag y su asociación con el documento.
    expect(server.tags[0]).toMatchObject({ id: "tag-1", name: "filosofía" });
    expect(server.document_tags[0]).toMatchObject({ document_id: doc.id, tag_id: "tag-1" });

    await db.delete();
  });

  it("camelCase destruye el ancla en silencio — el fallo exacto que wire.ts previene", async () => {
    // Este test documenta el daño real, medido contra el servidor. No es hipotético.
    const markdown = "# Hola\n\nUn texto.";
    const contentHash = await sha256(markdown);

    const server = applyOnServer({
      changes: [
        // El documento va bien formado, en snake_case.
        {
          change_id: "c1",
          entity_type: "document",
          entity_id: "d1",
          change_type: "upsert",
          client_timestamp: "2026-08-06T00:00:00.000Z",
          payload: {
            title: "Hola",
            content_hash: contentHash,
            word_count: 3,
            status: "reading",
            imported_at: "2026-08-06T00:00:00.000Z",
            updated_at: "2026-08-06T00:00:00.000Z",
          },
        },
        // La posición va en camelCase, como pedía la Referencia Core.
        {
          change_id: "c2",
          entity_type: "position",
          entity_id: "d1",
          change_type: "upsert",
          client_timestamp: "2026-08-06T00:00:01.000Z",
          payload: {
            blockIndex: 12,
            blockHash: "abc",
            anchorSnippet: "La atención no es un músculo",
            offsetInBlock: 0.25,
            progress: 0.42,
            updatedAt: "2026-08-06T00:00:01.000Z",
          },
        },
      ],
      contents: { d1: markdown },
      device_id: "web-contract",
    });

    // Aceptado. Sin conflictos. HTTP 200 en producción.
    expect(server.result.accepted).toBe(2);
    expect(server.result.conflicts).toEqual([]);

    const position = server.positions[0]!;
    // `progress` sobrevive por casualidad: se escribe igual en las dos convenciones.
    // Así que la biblioteca mostraría "42% leído", todo normal a la vista...
    expect(position["progress"]).toBeCloseTo(0.42, 10);
    // ...pero el ancla quedó destruida, y con ella el único dato que sabe DÓNDE
    // estaba leyendo. El lector abriría el documento arriba de todo.
    expect(position["block_index"]).toBe(0);
    expect(position["block_hash"]).toBe("");
    expect(position["anchor_snippet"]).toBeNull();
    expect(position["offset_in_block"]).toBe(0);
  });
});

if (!available) {
  // Un test salteado en silencio miente. Que quede en la salida.
  console.warn(
    `[contrato] SALTEADO: no se encontró ${CLOUD}/app/sync.py o python3. ` +
      "El wire format NO quedó verificado contra el servidor real en esta corrida.",
  );
}
