/**
 * La traducción entre geometría de pantalla y ancla semántica.
 *
 * Vive en `core/` y NO toca el DOM: recibe rectángulos ya medidos y devuelve
 * números. Así se puede testear sin navegador, que es justo lo que hace falta
 * porque este es el código que decide si alguien vuelve a donde estaba leyendo.
 */

/** Rectángulo de un bloque, relativo al tope del documento. */
export interface BlockRect {
  index: number;
  /** Distancia desde el tope del contenedor scrolleable. */
  top: number;
  height: number;
}

/**
 * La línea de referencia: el tercio superior del viewport.
 *
 * No es el borde de arriba porque el bloque que cruza el borde suele estar casi
 * terminado; el tercio superior es donde está mirando el ojo.
 */
export function referenceLine(viewportHeight: number): number {
  return viewportHeight / 3;
}

export interface AnchorGeometry {
  blockIndex: number;
  offsetInBlock: number;
  progress: number;
}

/**
 * Qué bloque y qué fracción de él están bajo la línea de referencia.
 *
 * Se elige el ÚLTIMO bloque que empieza en o antes de la línea, no el primero que
 * la intersecta: si un párrafo largo ocupa toda la pantalla, el ancla debe quedar
 * en él y no en el título que quedó arriba.
 */
export function anchorFromViewport(
  rects: BlockRect[],
  scrollTop: number,
  viewportHeight: number,
  scrollHeight: number,
): AnchorGeometry {
  const line = scrollTop + referenceLine(viewportHeight);

  let chosen: BlockRect | undefined;
  for (const rect of rects) {
    if (rect.top <= line) chosen = rect;
    else break;
  }
  // Antes del primer bloque (el usuario está arriba de todo): ancla al primero.
  chosen ??= rects[0];
  if (!chosen) return { blockIndex: 0, offsetInBlock: 0, progress: 0 };

  const offsetInBlock = chosen.height > 0 ? clamp01((line - chosen.top) / chosen.height) : 0;

  // El progreso se mide sobre el scroll REAL disponible. Si el documento entra
  // entero en la pantalla no hay scroll que medir: está leído del todo o nada,
  // y devolver 0 es lo honesto — el lector decide cuándo marcarlo terminado.
  const scrollable = scrollHeight - viewportHeight;
  const progress = scrollable > 0 ? clamp01(scrollTop / scrollable) : 0;

  return { blockIndex: chosen.index, offsetInBlock, progress };
}

/**
 * A qué scrollTop hay que ir para que el ancla vuelva a quedar en la línea de
 * referencia. Es la inversa exacta de `anchorFromViewport`.
 */
export function scrollTopForAnchor(
  rect: BlockRect | undefined,
  offsetInBlock: number,
  viewportHeight: number,
  scrollHeight: number,
): number {
  if (!rect) return 0;
  const target = rect.top + clamp01(offsetInBlock) * rect.height - referenceLine(viewportHeight);
  const max = Math.max(0, scrollHeight - viewportHeight);
  return Math.max(0, Math.min(target, max));
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}
