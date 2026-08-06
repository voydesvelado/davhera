import { describe, expect, it } from "vitest";

import { classifyImport, containmentRatio } from "../src/core/import/dedup";
import type { DocumentRecord } from "../src/core/db/types";

function doc(overrides: Partial<DocumentRecord>): DocumentRecord {
  return {
    id: "d1",
    title: "El oficio de leer despacio",
    contentHash: "hash-a",
    wordCount: 100,
    plainTextIndex: "hay una diferencia entre pasar los ojos por un texto y leerlo",
    status: "unread",
    importedAt: "2026-08-01T00:00:00.000Z",
    lastOpenedAt: null,
    coverSeed: 1,
    updatedAt: "2026-08-01T00:00:00.000Z",
    deviceId: "web-test",
    deletedAt: null,
    ...overrides,
  };
}

describe("dedup del import", () => {
  it("mismo contentHash es el mismo ensayo: se abre el que ya está", () => {
    const verdict = classifyImport(
      { title: "Otro título", contentHash: "hash-a", plainTextIndex: "cualquier cosa" },
      [doc({})],
    );
    expect(verdict.kind).toBe("identical");
  });

  it("mismo título con contenido distinto ofrece decidir, no decide solo", () => {
    const verdict = classifyImport(
      {
        title: "el oficio de leer DESPACIO",
        contentHash: "hash-b",
        plainTextIndex: "un texto completamente distinto sobre otra cosa cualquiera",
      },
      [doc({})],
    );
    expect(verdict.kind).toBe("sameTitle");
  });

  it("una versión ampliada del mismo ensayo se detecta por contención", () => {
    const verdict = classifyImport(
      {
        title: "Título nuevo",
        contentHash: "hash-c",
        plainTextIndex:
          "hay una diferencia entre pasar los ojos por un texto y leerlo " +
          "la primera es una operación óptica la segunda una forma de hospitalidad",
      },
      [doc({})],
    );
    expect(verdict.kind).toBe("contains");
    if (verdict.kind === "contains") expect(verdict.ratio).toBeGreaterThanOrEqual(0.9);
  });

  it("un documento borrado no bloquea reimportar el mismo ensayo", () => {
    const verdict = classifyImport(
      { title: "El oficio de leer despacio", contentHash: "hash-a", plainTextIndex: "x" },
      [doc({ deletedAt: "2026-08-02T00:00:00.000Z" })],
    );
    expect(verdict.kind).toBe("new");
  });

  it("dos ensayos distintos con el mismo tema NO se confunden", () => {
    const verdict = classifyImport(
      {
        title: "Sobre la atención",
        contentHash: "hash-d",
        plainTextIndex: "la atención no es un músculo aunque nos guste esa metáfora",
      },
      [doc({})],
    );
    expect(verdict.kind).toBe("new");
  });

  it("la contención se mide por palabras, no por substring", () => {
    // Un ensayo revisado casi nunca contiene al anterior literal: alcanza con que
    // cambie una coma en el medio para que el substring caiga a cero.
    const original = "el que lee deprisa no llega antes a ninguna parte llega a otro lugar";
    const revisado = "el que lee deprisa, no llega antes a ninguna parte: llega a otro lugar";
    expect(containmentRatio(original, revisado)).toBeGreaterThanOrEqual(0.9);
  });
});
