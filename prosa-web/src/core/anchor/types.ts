/**
 * Una posición de lectura es un ancla semántica, JAMÁS un offset en píxeles.
 * Por eso sobrevive a cambio de tamaño de fuente, serif↔sans, resize, zoom,
 * reimport del documento editado y sync entre plataformas.
 */
export interface Anchor {
  /** Índice del bloque ancla en el documento parseado. */
  blockIndex: number;
  /** SHA-256 de los primeros 200 chars del plainText del bloque. */
  blockHash: string;
  /** Los primeros 200 chars literales del bloque. Imprescindible para el fuzzy. */
  anchorSnippet: string;
  /** 0..1 — fracción vertical ya scrolleada dentro del bloque. */
  offsetInBlock: number;
  /** 0..1 — fracción del documento. Es la clave del merge de sync. */
  progress: number;
}

/**
 * Cómo se resolvió la restauración. Es parte del contrato, no telemetría:
 * la UI muestra el toast "posición aproximada" solo en `fuzzy` y `clamp`, y el
 * test 2 del spec exige poder afirmar que el fuzzy NO se invocó.
 */
export type RestoreMethod = "exact" | "globalHash" | "fuzzy" | "clamp";

export interface RestoreResult {
  blockIndex: number;
  offsetInBlock: number;
  method: RestoreMethod;
  /** true → la UI muestra el toast sutil de 2s. Falso en exact y globalHash. */
  approximate: boolean;
}

/** Un highlight tal como lo necesita el re-anclaje (subconjunto del modelo). */
export interface HighlightAnchor {
  blockIndex: number;
  blockHash: string;
  /** Offsets en CODE POINTS sobre el plainText normalizado; `end` exclusivo. */
  startOffset: number;
  endOffset: number;
  /** El texto resaltado literal. Sagrado: nunca se regenera ni se descarta. */
  snapshotText: string;
  isOrphaned: boolean;
}

export interface HighlightRestoreResult {
  blockIndex: number;
  blockHash: string;
  startOffset: number;
  endOffset: number;
  isOrphaned: boolean;
  method: RestoreMethod | "orphaned";
}
