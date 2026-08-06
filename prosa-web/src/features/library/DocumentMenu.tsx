import { useState } from "react";

import { db } from "../../core/db/schema";
import type { LibraryEntry } from "../../core/db/queries";
import { getStore } from "../../app/store";
import { navigate } from "../../app/router";
import { Button } from "../../design/Button";
import { Dialog, DialogActions } from "../../design/Dialog";
import { t } from "../../i18n";

/**
 * Menú contextual del documento: click derecho en desktop, long-press en móvil.
 * Las acciones destructivas confirman; las demás son inmediatas.
 */
export function DocumentMenu({ entry, onClose }: { entry: LibraryEntry; onClose: () => void }) {
  const strings = t();
  const { document: doc } = entry;
  // Confirmación dentro de la app, no un window.confirm: el diálogo del navegador
  // rompe el tono de todo lo demás y no se puede leer con la tipografía de Prosa.
  const [confirming, setConfirming] = useState(false);

  async function setStatus(status: "unread" | "finished") {
    (await getStore()).setStatus(doc.id, status);
    onClose();
  }

  async function exportMarkdown() {
    const content = await db.contents.get(doc.id);
    if (!content) return;
    // Blob + object URL: el archivo nunca sale del navegador.
    const url = URL.createObjectURL(new Blob([content.markdown], { type: "text/markdown" }));
    const link = window.document.createElement("a");
    link.href = url;
    link.download = `${doc.title.replace(/[/\\?%*:|"<>]/g, "-")}.md`;
    link.click();
    URL.revokeObjectURL(url);
    onClose();
  }

  async function remove() {
    (await getStore()).deleteDocument(doc.id);
    onClose();
  }

  return (
    <Dialog open onClose={onClose} labelledBy="menu-title" bare size="xs">
        <p id="menu-title" className="truncate border-b border-line px-4 py-3 text-caption text-ink-3">
          {doc.title}
        </p>
        <MenuItem
          label={strings.open}
          onClick={() => {
            navigate({ name: "reader", documentId: doc.id });
            onClose();
          }}
        />
        <MenuItem
          label={doc.status === "finished" ? strings.markUnread : strings.markFinished}
          onClick={() => void setStatus(doc.status === "finished" ? "unread" : "finished")}
        />
        <MenuItem label={strings.exportMd} onClick={() => void exportMarkdown()} />
        {confirming ? (
          <div className="border-t border-line p-4">
            <p className="mb-3 text-secondary text-ink-2">{strings.deleteConfirm(doc.title)}</p>
            <DialogActions className="mt-0">
              <Button onClick={() => setConfirming(false)}>{strings.cancel}</Button>
              <Button variant="pill" size="md" onClick={() => void remove()}>
                {strings.confirmDelete}
              </Button>
            </DialogActions>
          </div>
        ) : (
          <MenuItem label={strings.delete} onClick={() => setConfirming(true)} destructive />
        )}
    </Dialog>
  );
}

function MenuItem({
  label,
  onClick,
  destructive = false,
}: {
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <Button variant={destructive ? "menuFaint" : "menu"} size="sm" onClick={onClick}>
      {label}
    </Button>
  );
}
