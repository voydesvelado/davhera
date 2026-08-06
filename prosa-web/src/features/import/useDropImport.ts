import { useCallback, useEffect, useState } from "react";

import { db } from "../../core/db/schema";
import { importFiles, isAcceptedFile, type BatchResult } from "../../core/import/importer";
import { getStore } from "../../app/store";

/**
 * Drag & drop sobre la ventana entera, no sobre una zona chiquita: si estás
 * arrastrando un ensayo, la app entera es el destino.
 *
 * El contador de `dragenter`/`dragleave` existe porque el navegador dispara
 * `dragleave` cada vez que el puntero cruza un hijo del documento; sin llevar la
 * cuenta, el overlay parpadearía al mover el mouse.
 */
export function useDropImport(onDone: (result: BatchResult) => void) {
  const [dragging, setDragging] = useState(false);

  const runImport = useCallback(
    async (files: File[]) => {
      const accepted = files.filter(isAcceptedFile);
      if (accepted.length === 0) return;
      const store = await getStore();
      onDone(await importFiles(db, store, accepted));
    },
    [onDone],
  );

  useEffect(() => {
    let depth = 0;

    const onDragEnter = (event: DragEvent) => {
      if (!event.dataTransfer?.types.includes("Files")) return;
      depth++;
      setDragging(true);
    };
    const onDragOver = (event: DragEvent) => {
      if (event.dataTransfer?.types.includes("Files")) event.preventDefault();
    };
    const onDragLeave = () => {
      depth = Math.max(0, depth - 1);
      if (depth === 0) setDragging(false);
    };
    const onDrop = (event: DragEvent) => {
      if (!event.dataTransfer?.files.length) return;
      event.preventDefault();
      depth = 0;
      setDragging(false);
      void runImport(Array.from(event.dataTransfer.files));
    };

    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, [runImport]);

  return { dragging, runImport };
}
