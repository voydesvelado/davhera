// Saira · domain types
// Sin `any`. Todos los strings de UI viven en messages/*.json y se referencian
// por slug (ej. `tours.${slug}.shortDescription`).

export type TourCategory = "ecotour" | "aventura";

export type TourDifficulty =
  | "facil"
  | "facil-moderada"
  | "moderada"
  | "moderada-dificil"
  | "dificil"
  | "variable";

export type Tour = {
  /** kebab-case · identifica al tour en rutas, messages y carpetas de imágenes */
  slug: string;
  /** nombre propio brasileño — NO se traduce */
  name: string;
  category: TourCategory;
  difficulty: TourDifficulty;
  /** null cuando el catálogo lo marca como variable o "------" */
  durationMinutes: number | null;
  /** precio en BRL. 0 cuando es "Consultar" (ver `priceOnRequest`) */
  priceBRL: number;
  /** true cuando el precio depende del paquete (Pão de Açúcar) */
  priceOnRequest?: boolean;
  /** precio aproximado en plataformas tipo Viator/GetYourGuide
   *  para el bloque comparativo (estimado ~1.42× del directo) */
  comparablePlatformPriceBRL?: number;
  /** prefijo "a partir de" — para los tours de aventura con paquetes */
  priceFromOnly?: boolean;

  /** opción de salida al amanecer con precio distinto (Dois Irmãos) */
  hasSunriseOption?: boolean;
  /** precio de la variante sunrise, si aplica */
  priceSunriseBRL?: number;

  /** carpeta donde viven las imágenes: /public/saira/tours/{slug}/ */
  images: string[];
  /** imagen principal usada en card y hero del detalle */
  heroImage: string;
  /** url opcional a un drone reel del tour */
  videoUrl?: string;

  /** punto de encuentro · texto en `messages.tours.{slug}.meetingPoint` */
  meetingPointMapsUrl?: string;

  minPeople?: number;
  maxPeople?: number;
};
