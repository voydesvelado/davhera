import { db } from "../../core/db/schema";
import type { LibraryEntry } from "../../core/db/queries";
import { getStore } from "../../app/store";
import { navigate } from "../../app/router";
import { t } from "../../i18n";

/**
 * Menú contextual del documento: click derecho en desktop, long-press en móvil.
 * Las acciones destructivas confirman; las demás son inmediatas.
 */
export function DocumentMenu({ entry, onClose }: { entry: LibraryEntry; onClose: () => void }) {
  const strings = t();
  const { document: doc } = entry;

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
    if (!window.confirm(strings.deleteConfirm(doc.title))) return;
    (await getStore()).deleteDocument(doc.id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* mousedown y no click: ver la nota del backdrop en ImportSheet. */}
      <button
        className="absolute inset-0 bg-black/20"
        onMouseDown={onClose}
        aria-label={strings.cancel}
      />
      <div className="relative z-10 w-full max-w-xs overflow-hidden rounded-m border border-line bg-bg">
        <p className="truncate border-b border-line px-4 py-3 text-caption text-ink-3">{doc.title}</p>
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
        <MenuItem label={strings.delete} onClick={() => void remove()} destructive />
      </div>
    </div>
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
    <button
      onClick={onClick}
      className={`block w-full border-b border-line px-4 py-3 text-left text-body last:border-b-0 hover:bg-line/40 ${
        destructive ? "text-ink-2" : "text-ink-1"
      }`}
    >
      {label}
    </button>
  );
}
