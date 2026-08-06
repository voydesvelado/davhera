// @vitest-environment jsdom
import "fake-indexeddb/auto";
import { LazyMotion, domAnimation } from "framer-motion";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { waitFor } from "@testing-library/react";

import { db } from "../src/core/db/schema";
import { DocumentStore } from "../src/core/db/store";
import { DocumentMenu } from "../src/features/library/DocumentMenu";
import { ProgressScrubber } from "../src/features/reader/ReaderChrome";
import { BASE } from "./fixtures/variants";

/**
 * Detalles de UX que se rompen en silencio: nadie escribe un test para "el foco se
 * ve" o "el hilo se puede tocar con el dedo", y por eso se pierden en el primer
 * refactor.
 */

afterEach(async () => {
  cleanup();
  await db.documents.clear();
  await db.contents.clear();
  await db.changeLog.clear();
});

describe("eliminar un documento", () => {
  it("confirma DENTRO de la app y no con un diálogo del navegador", async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, "confirm");

    const store = new DocumentStore(db, "web-test");
    const doc = await store.importDocument(BASE);

    render(
      <LazyMotion features={domAnimation}>
        <DocumentMenu entry={{ document: doc, position: undefined }} onClose={() => {}} />
      </LazyMotion>,
    );

    await user.click(screen.getByRole("button", { name: /^(eliminar|delete)$/i }));

    // El texto de confirmación aparece en pantalla...
    expect(await screen.findByText(/no se puede deshacer|can't be undone/i)).toBeDefined();
    // ...y nunca se llamó al diálogo del navegador.
    expect(confirmSpy).not.toHaveBeenCalled();

    // Hasta confirmar, el documento sigue vivo.
    expect((await db.documents.get(doc.id))?.deletedAt).toBeNull();

    await user.click(screen.getByRole("button", { name: /sí, eliminar|yes, delete/i }));
    await waitFor(async () => expect((await db.documents.get(doc.id))?.deletedAt).not.toBeNull());
  });

  it("se puede cancelar y no borra nada", async () => {
    const user = userEvent.setup();
    const store = new DocumentStore(db, "web-test");
    const doc = await store.importDocument(BASE);

    render(
      <LazyMotion features={domAnimation}>
        <DocumentMenu entry={{ document: doc, position: undefined }} onClose={() => {}} />
      </LazyMotion>,
    );

    await user.click(screen.getByRole("button", { name: /^(eliminar|delete)$/i }));
    await user.click(screen.getByRole("button", { name: /^(cancelar|cancel)$/i }));

    expect((await db.documents.get(doc.id))?.deletedAt).toBeNull();
  });
});

describe("el hilo de progreso", () => {
  const headings = [
    { index: 0, text: "Primera parte", ratio: 0 },
    { index: 10, text: "Segunda parte", ratio: 0.5 },
  ];

  it("es un slider accesible, con teclado", async () => {
    const user = userEvent.setup();
    const onSeek = vi.fn();
    render(<ProgressScrubber progress={0.5} headings={headings} onSeek={onSeek} />);

    const slider = screen.getByRole("slider");
    expect(slider.getAttribute("aria-valuenow")).toBe("50");

    // Alguien que navega tabulando tiene que poder moverlo, no solo enfocarlo.
    slider.focus();
    await user.keyboard("{ArrowRight}");
    expect(onSeek).toHaveBeenCalledWith(0.55);

    await user.keyboard("{Home}");
    expect(onSeek).toHaveBeenCalledWith(0);
    await user.keyboard("{End}");
    expect(onSeek).toHaveBeenCalledWith(1);
  });

  it("responde a eventos de puntero, no solo de mouse", () => {
    const onSeek = vi.fn();
    render(<ProgressScrubber progress={0.2} headings={headings} onSeek={onSeek} />);
    const slider = screen.getByRole("slider");

    // jsdom no implementa la captura de puntero; se stubea para poder ejercitar
    // el gesto, que es lo que se quiere probar.
    slider.setPointerCapture = vi.fn();
    slider.releasePointerCapture = vi.fn();
    slider.getBoundingClientRect = () =>
      ({ left: 0, width: 1000, top: 0, height: 24, right: 1000, bottom: 24, x: 0, y: 0, toJSON: () => {} }) as DOMRect;

    // Un dedo, no un mouse: antes esto no hacía absolutamente nada.
    slider.dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 300, pointerType: "touch", bubbles: true }),
    );
    slider.dispatchEvent(
      new PointerEvent("pointerup", { clientX: 300, pointerType: "touch", bubbles: true }),
    );

    expect(onSeek).toHaveBeenCalledWith(0.3);
  });

  it("la zona sensible mide 24px aunque el hilo se vea de 2", () => {
    render(<ProgressScrubber progress={0} headings={headings} onSeek={() => {}} />);
    // Un objetivo táctil de 2px no existe: el spec pide un track de 24.
    expect(screen.getByRole("slider").className).toContain("h-6");
  });
});
