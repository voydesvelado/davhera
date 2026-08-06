// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HighlightPopover } from "../src/features/reader/HighlightPopover";
import type { HighlightRecord } from "../src/core/db/types";

/**
 * La nota se guarda al cerrar, no con un botón "Guardar": pedirle a alguien que
 * confirme dos veces que quiere escribir una nota es pedirle que no la escriba.
 *
 * Eso pone toda la responsabilidad en el cleanup del efecto, así que va cubierto:
 * una nota escrita y perdida al cerrar el popover sería exactamente el tipo de
 * pérdida silenciosa que el proyecto no se permite.
 */

afterEach(cleanup);

const highlight: HighlightRecord = {
  id: "h1",
  documentId: "d1",
  groupId: null,
  blockIndex: 3,
  blockHash: "hash",
  startOffset: 0,
  endOffset: 8,
  snapshotText: "atención",
  note: null,
  isOrphaned: false,
  createdAt: "2026-08-06T00:00:00.000Z",
  updatedAt: "2026-08-06T00:00:00.000Z",
  deviceId: "web-test",
  deletedAt: null,
};

function setup(overrides: Partial<HighlightRecord> = {}) {
  const onNote = vi.fn();
  const onRemove = vi.fn();
  const onClose = vi.fn();
  const view = render(
    <HighlightPopover
      highlight={{ ...highlight, ...overrides }}
      anchorRect={{ x: 100, y: 100 }}
      onNote={onNote}
      onRemove={onRemove}
      onClose={onClose}
    />,
  );
  return { onNote, onRemove, onClose, view };
}

describe("HighlightPopover", () => {
  it("guarda la nota al cerrarse, sin botón de guardar", async () => {
    const user = userEvent.setup();
    const { onNote, view } = setup();

    await user.type(screen.getByRole("textbox"), "volver a esto");
    view.unmount();

    expect(onNote).toHaveBeenCalledWith("volver a esto");
  });

  it("no escribe nada si la nota no cambió", () => {
    const { onNote, view } = setup({ note: "ya estaba" });
    view.unmount();
    expect(onNote).not.toHaveBeenCalled();
  });

  it("vaciar la nota la borra en vez de guardar una cadena vacía", async () => {
    const user = userEvent.setup();
    const { onNote, view } = setup({ note: "algo" });

    await user.clear(screen.getByRole("textbox"));
    view.unmount();

    expect(onNote).toHaveBeenCalledWith(null);
  });

  it("un re-render del padre NO dispara el guardado a mitad de escribir", async () => {
    const user = userEvent.setup();
    const onNote = vi.fn();

    const view = render(
      <HighlightPopover
        highlight={highlight}
        anchorRect={{ x: 100, y: 100 }}
        onNote={onNote}
        onRemove={() => {}}
        onClose={() => {}}
      />,
    );

    await user.type(screen.getByRole("textbox"), "a medio escr");
    // El padre re-renderiza con un `onNote` nuevo, como pasa en el lector real.
    view.rerender(
      <HighlightPopover
        highlight={highlight}
        anchorRect={{ x: 101, y: 100 }}
        onNote={onNote}
        onRemove={() => {}}
        onClose={() => {}}
      />,
    );

    expect(onNote).not.toHaveBeenCalled();

    await user.type(screen.getByRole("textbox"), "ibir");
    view.unmount();
    expect(onNote).toHaveBeenCalledTimes(1);
    expect(onNote).toHaveBeenCalledWith("a medio escribir");
  });

  it("el texto subrayado se muestra para saber qué se está anotando", () => {
    setup();
    expect(screen.getByText("atención")).toBeDefined();
  });
});
