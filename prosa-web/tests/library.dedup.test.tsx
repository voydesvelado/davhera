// @vitest-environment jsdom
import "fake-indexeddb/auto";
import { LazyMotion, domAnimation } from "framer-motion";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { db } from "../src/core/db/schema";
import { DocumentStore } from "../src/core/db/store";
import { LibraryScreen } from "../src/features/library/LibraryScreen";
import { BASE } from "./fixtures/variants";

/**
 * El dedup del import, contra la UI real.
 *
 * Vive en su propio archivo y no junto al resto del flujo de biblioteca por una
 * razón concreta: `db` es un singleton de módulo y las live queries de Dexie
 * sobreviven al `cleanup()` de React, así que dos tests de biblioteca en el mismo
 * archivo comparten observadores. Vitest aísla módulos por ARCHIVO, así que
 * separarlos es la limpieza posible mientras la base sea global. (Si en algún
 * momento se inyecta la base por contexto, esto se puede volver a juntar.)
 *
 * La biblioteca se siembra por el store en vez de por la UI: abrir el sheet dos
 * veces en el mismo árbol montado es exactamente el gesto frágil, y lo que hay que
 * verificar acá es el veredicto de dedup, no la coreografía del sheet.
 */

afterEach(async () => {
  cleanup();
  await db.delete();
  await db.open();
});

describe("biblioteca · dedup", () => {
  it("pegar un ensayo que ya está avisa y no deja duplicarlo", async () => {
    const user = userEvent.setup();
    const store = new DocumentStore(db, "web-test");
    await store.importDocument(BASE);

    render(
      <LazyMotion features={domAnimation}>
        <LibraryScreen theme="light" />
      </LazyMotion>,
    );

    await user.click(
      await screen.findByRole("button", { name: /^(importar|import)$/i }),
    );
    await user.click(await screen.findByPlaceholderText(/pegá el markdown|paste markdown/i));
    await user.paste(BASE);

    // Mismo contentHash → "ya está en tu biblioteca", y no se puede agregar.
    expect(
      await screen.findByText(/ya está en tu biblioteca|already in your library/i),
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: /agregar a la biblioteca|add to library/i }),
    ).toHaveProperty("disabled", true);

    // Y la biblioteca sigue con un solo documento.
    await waitFor(async () => expect(await db.documents.count()).toBe(1));
  });
});

// jsdom no implementa estas dos y la biblioteca las usa al importar.
vi.stubGlobal("confirm", () => true);
Object.defineProperty(navigator, "storage", {
  configurable: true,
  value: { persist: async () => false, persisted: async () => false, estimate: async () => ({}) },
});
