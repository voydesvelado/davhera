// @vitest-environment jsdom
import "fake-indexeddb/auto";
import { LazyMotion, domAnimation } from "framer-motion";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { db } from "../src/core/db/schema";
import { listLibrary } from "../src/core/db/queries";
import { LibraryScreen } from "../src/features/library/LibraryScreen";
import { BASE } from "./fixtures/variants";

/**
 * El criterio de aceptación de M2, verificado de punta a punta:
 * pego un ensayo → aparece en la biblioteca → nunca aterrizo en el lector →
 * recargo y sigue ahí.
 *
 * Corre sobre jsdom con fake-indexeddb, así que la persistencia es la de verdad
 * (mismas transacciones de Dexie), no un stub.
 */

afterEach(async () => {
  cleanup();
  // Borrar y reabrir, no vaciar tabla por tabla: `clear()` deja vivas las
  // suscripciones de liveQuery de la prueba anterior, y la siguiente hereda un
  // observador que ya no se entera de nada. Con un módulo `db` global compartido
  // entre tests, recrear la base es la única limpieza de verdad.
  await db.delete();
  await db.open();
});

function renderLibrary() {
  return render(
    <LazyMotion features={domAnimation}>
      <LibraryScreen theme="light" />
    </LazyMotion>,
  );
}

describe("biblioteca · flujo de import", () => {
  it("pego un ensayo, aparece en la biblioteca, y no me lleva al lector", async () => {
    const user = userEvent.setup();
    // El botón de importar de la biblioteca vacía.
    renderLibrary();

    await user.click(await screen.findByRole("button", { name: /pegar un ensayo|paste an essay/i }));

    // Por placeholder y no por rol: el buscador del header también es un textbox.
    const textarea = await screen.findByPlaceholderText(/pegá el markdown|paste markdown/i);
    // `paste` real, no `type`: es el evento nativo que usa el flujo (sin permisos).
    await user.click(textarea);
    await user.paste(BASE);

    // El título se detecta del H1 del markdown.
    await waitFor(() =>
      expect(screen.getByDisplayValue("El oficio de leer despacio")).toBeDefined(),
    );

    await user.click(screen.getByRole("button", { name: /agregar a la biblioteca|add to library/i }));

    // Aparece en la biblioteca...
    await waitFor(async () => {
      const entries = await listLibrary(db);
      expect(entries).toHaveLength(1);
      expect(entries[0]?.document.title).toBe("El oficio de leer despacio");
    });

    // ...y se ve en pantalla sin recargar (no alcanza con que esté en la base).
    expect(await screen.findAllByText("El oficio de leer despacio")).not.toHaveLength(0);

    // ...y la card nunca aterriza en el lector: la ruta sigue siendo la biblioteca.
    expect(window.location.pathname).not.toContain("/d/");
  });

  it("lo importado sobrevive a recargar la página", async () => {
    const user = userEvent.setup();
    renderLibrary();

    await user.click(await screen.findByRole("button", { name: /pegar un ensayo|paste an essay/i }));
    await user.click(await screen.findByPlaceholderText(/pegá el markdown|paste markdown/i));
    await user.paste(BASE);
    await waitFor(() =>
      expect(screen.getByDisplayValue("El oficio de leer despacio")).toBeDefined(),
    );
    await user.click(screen.getByRole("button", { name: /agregar a la biblioteca|add to library/i }));
    await waitFor(async () => expect(await db.documents.count()).toBe(1));

    // "Recargar": se desmonta todo y se vuelve a montar contra la MISMA IndexedDB.
    cleanup();
    renderLibrary();

    // findAllByText: el título aparece dos veces, en la portada y en el pie de la card.
    expect(await screen.findAllByText("El oficio de leer despacio")).not.toHaveLength(0);
  });

});

// jsdom no implementa estas dos y la biblioteca las usa al importar.
vi.stubGlobal("confirm", () => true);
Object.defineProperty(navigator, "storage", {
  configurable: true,
  value: { persist: async () => false, persisted: async () => false, estimate: async () => ({}) },
});
