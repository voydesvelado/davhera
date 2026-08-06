import { useCallback, useEffect, useRef } from "react";

import { createAnchor, restoreOnOpen } from "../../core/anchor/engine";
import type { Anchor, RestoreMethod } from "../../core/anchor/types";
import {
  anchorFromViewport,
  scrollTopForAnchor,
  type BlockRect,
} from "../../core/anchor/viewport";
import type { Block } from "../../core/markdown/blocks";
import type { PositionRecord, ReadingStatus } from "../../core/db/types";
import { getStore } from "../../app/store";

const SAVE_DEBOUNCE_MS = 500;

/**
 * El guardado y la restauración de la posición, atados al scroll real.
 *
 * Las tres reglas que importan:
 *  - Se guarda con debounce de 500ms, y se FUERZA el guardado en `visibilitychange`
 *    y `pagehide`. Son los "willResignActive" de la web: cerrar la pestaña, cambiar
 *    de app en el celular, bloquear la pantalla. Sin ese flush, el último tramo de
 *    lectura se pierde siempre.
 *  - No se usa `beforeunload` con diálogo: es hostil y el ancla ya protege.
 *  - Tras un resize o un cambio de tipografía se re-ancla, porque el layout entero
 *    cambió y el píxel donde estabas ya no significa nada.
 */
export function useAnchoring({
  documentId,
  blocks,
  status,
  saved,
  ready,
  onApproximate,
}: {
  documentId: string;
  blocks: Block[];
  status: ReadingStatus;
  saved: PositionRecord | undefined;
  /** El contenido ya está en el DOM y se puede medir. */
  ready: boolean;
  onApproximate: (method: RestoreMethod) => void;
}) {
  const restored = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef<Anchor | null>(null);

  const measure = useCallback((): BlockRect[] => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-block]");
    const rects: BlockRect[] = [];
    for (const node of nodes) {
      const index = Number(node.dataset["block"]);
      if (Number.isNaN(index)) continue;
      rects.push({ index, top: node.offsetTop, height: node.offsetHeight });
    }
    rects.sort((a, b) => a.top - b.top);
    return rects;
  }, []);

  const currentAnchor = useCallback((): Anchor | null => {
    if (blocks.length === 0) return null;
    const geometry = anchorFromViewport(
      measure(),
      window.scrollY,
      window.innerHeight,
      document.documentElement.scrollHeight,
    );
    return createAnchor(blocks, geometry.blockIndex, geometry.offsetInBlock, geometry.progress);
  }, [blocks, measure]);

  const flush = useCallback(() => {
    const anchor = latest.current;
    if (!anchor || !restored.current) return;
    void getStore().then((store) => store.savePosition(documentId, anchor));
  }, [documentId]);

  // Guardado con debounce mientras se scrollea.
  useEffect(() => {
    if (!ready) return;

    const onScroll = () => {
      latest.current = currentAnchor();
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(flush, SAVE_DEBOUNCE_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [ready, currentAnchor, flush]);

  // Flush inmediato al irse. `visibilitychange` cubre cambiar de app en móvil, que
  // es donde más progreso se pierde; `pagehide`, cerrar la pestaña.
  useEffect(() => {
    const onHide = () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      latest.current = currentAnchor() ?? latest.current;
      flush();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") onHide();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onHide);
    };
  }, [currentAnchor, flush]);

  // Restauración, una sola vez, cuando el contenido ya se puede medir.
  useEffect(() => {
    if (!ready || restored.current || blocks.length === 0) return;

    const anchor: Anchor | null = saved
      ? {
          blockIndex: saved.blockIndex,
          blockHash: saved.blockHash,
          anchorSnippet: saved.anchorSnippet,
          offsetInBlock: saved.offsetInBlock,
          progress: saved.progress,
        }
      : null;

    const result = restoreOnOpen(status, anchor, blocks);
    const rects = measure();
    const target = rects.find((r) => r.index === result.blockIndex);

    window.scrollTo({
      top: scrollTopForAnchor(
        target,
        result.offsetInBlock,
        window.innerHeight,
        document.documentElement.scrollHeight,
      ),
      behavior: "instant" as ScrollBehavior,
    });

    restored.current = true;
    if (result.approximate) onApproximate(result.method);
  }, [ready, blocks, saved, status, measure, onApproximate]);

  /**
   * Re-anclaje tras un cambio de layout: se captura el ancla ANTES y se vuelve a
   * ella DESPUÉS. Sin fuzzy — el documento no cambió, solo su forma.
   */
  const reanchorAfterLayout = useCallback(() => {
    const anchor = currentAnchor();
    if (!anchor) return;
    requestAnimationFrame(() => {
      const rects = measure();
      const target = rects.find((r) => r.index === anchor.blockIndex);
      window.scrollTo({
        top: scrollTopForAnchor(
          target,
          anchor.offsetInBlock,
          window.innerHeight,
          document.documentElement.scrollHeight,
        ),
        behavior: "instant" as ScrollBehavior,
      });
    });
  }, [currentAnchor, measure]);

  // Resize y rotación: mismo tratamiento que el cambio de fuente.
  useEffect(() => {
    if (!ready) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(reanchorAfterLayout, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (timer) clearTimeout(timer);
    };
  }, [ready, reanchorAfterLayout]);

  return { reanchorAfterLayout, currentAnchor, flush };
}
