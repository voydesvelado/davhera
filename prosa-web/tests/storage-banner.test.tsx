// @vitest-environment jsdom
import "fake-indexeddb/auto";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { db } from "../src/core/db/schema";
import { StorageBanner } from "../src/features/library/StorageBanner";

/**
 * El banner honesto tiene que ser honesto también en cuándo NO aparece.
 *
 * A quien ya tiene cuenta, "tu biblioteca vive en este navegador" le es
 * literalmente falso —está respaldada y se sincroniza sola— y encima le pide
 * hacer lo que acaba de hacer. Un aviso que no aplica enseña a ignorar todos los
 * demás, así que esto va cubierto.
 */

afterEach(async () => {
  cleanup();
  await db.meta.clear();
  await db.accountKey.clear();
});

describe("banner de almacenamiento", () => {
  it("se le muestra a quien NO tiene cuenta", async () => {
    render(<StorageBanner hasDocuments />);
    expect(
      await screen.findByText(/vive en este navegador|lives in this browser/i),
    ).toBeDefined();
  });

  it("NO se le muestra a quien ya tiene cuenta", async () => {
    await db.accountKey.put({ id: "current", handle: "mariana", key: "prosa-AAAAA-BBBBB-CCCCC-DDDDD" });

    render(<StorageBanner hasDocuments />);

    // Se espera un poco: el fallo que importa es que aparezca tarde, cuando la
    // consulta de la cuenta resuelve después del primer render.
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(screen.queryByText(/vive en este navegador|lives in this browser/i)).toBeNull();
  });

  it("no aparece con la biblioteca vacía: no hay nada que perder todavía", async () => {
    render(<StorageBanner hasDocuments={false} />);
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(screen.queryByText(/vive en este navegador|lives in this browser/i)).toBeNull();
  });

  it("descartarlo lo calla para siempre", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<StorageBanner hasDocuments />);

    await user.click(await screen.findByRole("button", { name: /entendido|got it/i }));
    expect(screen.queryByText(/vive en este navegador|lives in this browser/i)).toBeNull();

    // Y sigue callado al volver a montar: la decisión se guardó.
    unmount();
    render(<StorageBanner hasDocuments />);
    await waitFor(() =>
      expect(screen.queryByText(/vive en este navegador|lives in this browser/i)).toBeNull(),
    );
  });
});
