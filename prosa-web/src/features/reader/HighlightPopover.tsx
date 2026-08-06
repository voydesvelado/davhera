import { useEffect, useRef, useState } from "react";

import type { HighlightRecord } from "../../core/db/types";
import { t } from "../../i18n";

/**
 * Popover de un subrayado existente: nota, copiar, quitar.
 *
 * La nota se guarda al cerrar y no con un botón "Guardar": pedirle a alguien que
 * confirme dos veces que quiere escribir una nota es pedirle que no la escriba.
 */
export function HighlightPopover({
  highlight,
  anchorRect,
  onNote,
  onRemove,
  onClose,
}: {
  highlight: HighlightRecord;
  anchorRect: { x: number; y: number };
  onNote: (note: string | null) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const strings = t();
  const [note, setNote] = useState(highlight.note ?? "");
  const noteRef = useRef(note);
  noteRef.current = note;

  // Se guarda al desmontar, pase lo que pase: cerrar con Escape, tocar afuera o
  // navegar. Una nota escrita y perdida es peor que no tener notas.
  useEffect(() => {
    return () => {
      const trimmed = noteRef.current.trim();
      const previous = highlight.note ?? "";
      if (trimmed !== previous) onNote(trimmed === "" ? null : trimmed);
    };
  }, [highlight.note, onNote]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <button className="fixed inset-0 z-40" onMouseDown={onClose} aria-label={strings.cancel} />
      <div
        className="fixed z-50 w-72 -translate-x-1/2 rounded-m border border-line bg-bg p-3 shadow-lg"
        style={{ left: anchorRect.x, top: anchorRect.y + 8 }}
      >
        <p className="mb-2 line-clamp-3 border-l-2 border-[#F5C84C] pl-2 text-caption text-ink-2">
          {highlight.snapshotText}
        </p>
        <textarea
          autoFocus
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={strings.addNote}
          className="mb-2 min-h-16 w-full resize-none rounded-s border border-line bg-transparent p-2 text-secondary outline-none focus:border-ink-3"
        />
        <div className="flex justify-end gap-3 text-secondary">
          <button
            onClick={() => {
              void navigator.clipboard?.writeText(highlight.snapshotText);
              onClose();
            }}
            className="text-ink-2 hover:text-ink-1"
          >
            {strings.copy}
          </button>
          <button onClick={onRemove} className="text-ink-3 hover:text-ink-1">
            {strings.removeHighlight}
          </button>
        </div>
      </div>
    </>
  );
}
