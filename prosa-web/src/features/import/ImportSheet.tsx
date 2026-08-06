import { useEffect, useState } from "react";

import { db } from "../../core/db/schema";
import { inspect, type ImportCandidate } from "../../core/import/importer";
import { getStore } from "../../app/store";
import { Button } from "../../design/Button";
import { Dialog, DialogActions, DialogTitle } from "../../design/Dialog";
import { t } from "../../i18n";

/**
 * Sheet de pegado.
 *
 * NO hay lectura proactiva del portapapeles: en web eso exige permiso y un prompt
 * invasivo, y el costo UX no lo vale. El campo es un textarea y el usuario pega con
 * ⌘V como en cualquier otro lado — el evento `paste` nativo no pide permiso alguno.
 */
export function ImportSheet({
  onClose,
  onImported,
  onPickFiles,
}: {
  onClose: () => void;
  onImported: () => void;
  onPickFiles?: () => void;
}) {
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("");
  const [titleTouched, setTitleTouched] = useState(false);
  const [candidate, setCandidate] = useState<ImportCandidate | null>(null);
  const [busy, setBusy] = useState(false);
  const strings = t();

  // El título detectado se propone, pero el usuario manda: si lo editó, no se pisa.
  useEffect(() => {
    if (markdown.trim() === "") {
      setCandidate(null);
      return;
    }
    let cancelled = false;
    void inspect(db, markdown).then((result) => {
      if (cancelled) return;
      setCandidate(result);
      if (!titleTouched) setTitle(result.title);
    });
    return () => {
      cancelled = true;
    };
  }, [markdown, titleTouched]);

  const verdict = candidate?.verdict;

  async function add(mode: "new" | "replace") {
    if (!candidate || busy) return;
    setBusy(true);
    try {
      const store = await getStore();
      if (mode === "replace" && verdict && "existing" in verdict) {
        // Reemplazar es un delete + import: el documento viejo queda como tombstone
        // y su contenido sigue en disco hasta que el sync confirme. Nada se pierde.
        await store.deleteDocument(verdict.existing.id);
      }
      await store.importDocument(candidate.markdown, title);
      onImported();
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open onClose={onClose} labelledBy="import-title">
      <DialogTitle id="import-title">{strings.importPaste}</DialogTitle>

      <textarea
          autoFocus
          value={markdown}
          onChange={(event) => setMarkdown(event.target.value)}
          placeholder={strings.pasteHere}
          className="min-h-40 flex-1 resize-none rounded-s border border-line bg-transparent p-3 font-mono text-secondary text-ink-1 outline-none focus:border-ink-3"
        />

        {candidate && (
          <>
            <label className="flex flex-col gap-1">
              <span className="text-caption text-ink-3">{strings.titleLabel}</span>
              <input
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setTitleTouched(true);
                }}
                className="rounded-s border border-line bg-transparent px-3 py-2 text-body outline-none focus:border-ink-3"
              />
            </label>
            <p className="text-caption text-ink-3">{strings.words(candidate.wordCount)}</p>
          </>
        )}

        {verdict?.kind === "identical" && (
          <p className="text-secondary text-ink-2">{strings.alreadyInLibrary}</p>
        )}
        {verdict?.kind === "sameTitle" && (
          <p className="text-secondary text-ink-2">{strings.sameTitle}</p>
        )}
        {verdict?.kind === "contains" && (
          <p className="text-secondary text-ink-2">{strings.looksLikeNewVersion}</p>
        )}

        <DialogActions>
          {/* Las dos formas de importar, juntas donde alguien ya decidió importar. */}
          {onPickFiles && !candidate && (
            <Button onClick={onPickFiles} className="mr-auto">
              {strings.importFiles}
            </Button>
          )}
          <Button onClick={onClose}>{strings.cancel}</Button>
          {(verdict?.kind === "sameTitle" || verdict?.kind === "contains") && (
            <Button disabled={busy} onClick={() => void add("replace")}>
              {strings.replace}
            </Button>
          )}
          <Button
            variant="pill"
            size="md"
            disabled={!candidate || verdict?.kind === "identical" || busy}
            onClick={() => void add("new")}
          >
            {verdict?.kind === "sameTitle" || verdict?.kind === "contains"
              ? strings.keepBoth
              : strings.add}
          </Button>
        </DialogActions>
    </Dialog>
  );
}
