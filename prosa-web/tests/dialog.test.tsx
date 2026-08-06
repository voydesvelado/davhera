// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Dialog, DialogActions, DialogTitle } from "../src/design/Dialog";
import { Button, Chip } from "../src/design/Button";

/**
 * El diálogo del que ahora dependen los seis overlays de la app.
 *
 * Lo que jsdom NO puede verificar y por eso no está acá: la trampa de foco, el
 * fondo inerte y el Escape nativo. Los aporta el `<dialog>` del navegador —son la
 * razón de haberlo elegido sobre Radix— y solo se comprueban en un navegador real.
 * Lo que sí se prueba es todo lo que escribimos nosotros.
 */

afterEach(cleanup);

function Harness({ onClose }: { onClose?: () => void } = {}) {
  const [open, setOpen] = useState(true);
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        onClose?.();
      }}
      labelledBy="t"
    >
      <DialogTitle id="t">Importar</DialogTitle>
      <p>contenido</p>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("se abre como modal y tiene nombre accesible", () => {
    render(<Harness />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeDefined();
    // `aria-labelledby` apunta al título: sin esto un lector de pantalla anuncia
    // "diálogo" y nada más.
    expect(dialog.getAttribute("aria-labelledby")).toBe("t");
    expect(screen.getByText("Importar")).toBeDefined();
  });

  it("un click en el backdrop lo cierra", async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);

    // El backdrop ES el propio <dialog>: el contenido vive en un hijo, así que un
    // mousedown cuyo target sea el dialog cayó fuera.
    const dialog = screen.getByRole("dialog");
    await userEvent.pointer({ target: dialog, keys: "[MouseLeft>]" });

    expect(onClose).toHaveBeenCalled();
  });

  it("un click DENTRO del contenido no lo cierra", async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);

    await userEvent.click(screen.getByText("contenido"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("Escape lo cierra sin dejar el evento por defecto del navegador", () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);

    // El navegador dispara `cancel` con Escape. Se cancela el default para cerrar
    // por el mismo camino que el resto y no dejar el estado desincronizado.
    const dialog = screen.getByRole("dialog");
    const cancel = new Event("cancel", { cancelable: true, bubbles: true });
    dialog.dispatchEvent(cancel);

    expect(cancel.defaultPrevented).toBe(true);
    expect(onClose).toHaveBeenCalled();
  });

  it("bloquea el scroll del fondo mientras está abierto y lo devuelve al cerrar", async () => {
    const { unmount } = render(<Harness />);
    expect(document.body.style.overflow).toBe("hidden");

    // Cerrarlo devuelve el scroll: si no, la página queda trabada para siempre.
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(document.body.style.overflow).not.toBe("hidden");
    unmount();
  });
});

describe("Button", () => {
  it("las variantes no se pisan entre sí", () => {
    render(
      <>
        <Button variant="pill" size="md">
          CTA
        </Button>
        <Button variant="faint">Terciario</Button>
      </>,
    );
    const cta = screen.getByRole("button", { name: "CTA" });
    const faint = screen.getByRole("button", { name: "Terciario" });

    expect(cta.className).toContain("rounded-pill");
    expect(cta.className).toContain("bg-ink-1");
    // Sin tailwind-merge, dos clases de color en el mismo botón serían ambiguas:
    // el test fija que cada variante trae UNA.
    expect(faint.className).toContain("text-ink-3");
    expect(faint.className).not.toContain("text-ink-2");
  });

  it("deshabilitado no responde", async () => {
    const onClick = vi.fn();
    render(
      <Button variant="pill" size="md" disabled onClick={onClick}>
        Agregar
      </Button>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Agregar" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("el chip informa si está seleccionado", () => {
    render(<Chip selected>Serif</Chip>);
    // `aria-pressed` y no solo un borde distinto: un lector de pantalla no ve bordes.
    expect(screen.getByRole("button", { name: "Serif" }).getAttribute("aria-pressed")).toBe("true");
  });
});
