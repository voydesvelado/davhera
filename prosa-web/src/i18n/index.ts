/**
 * i18n mínima: en base / es, elegido por `navigator.language`, con override en
 * Settings (M4). Sin librería — son dos diccionarios planos y una función.
 *
 * El tono es el de las apps nativas: directo, sin signos de exclamación, sin
 * "¡Ups!". Cuando algo sale mal se dice qué pasó, no se pide perdón.
 */

// Sin `as const`: el diccionario base define la FORMA (qué claves existen y con qué
// firma), no los valores exactos. Con `as const`, "Open" no sería asignable a
// "Abrir" y cada traducción rompería el typecheck.
const es = {
  library: "Biblioteca",
  continueReading: "Continuar leyendo",
  minutesLeft: (n: number) => `~${n} min restantes`,
  minutesTotal: (n: number) => `${n} min de lectura`,
  finished: "Terminado",
  emptyTitle: "Tu biblioteca está vacía",
  emptyHint: "o arrastrá archivos acá",
  import: "Importar",
  importPaste: "Pegar un ensayo",
  importFiles: "Abrir archivos",
  pasteHere: "Pegá el markdown acá",
  titleLabel: "Título",
  add: "Agregar a la biblioteca",
  cancel: "Cancelar",
  dropHere: "Soltá tus ensayos",
  search: "Buscar",
  searchTitles: "Títulos",
  searchText: "En el texto",
  noResults: "Sin resultados",
  open: "Abrir",
  markFinished: "Marcar terminado",
  markUnread: "Marcar sin leer",
  exportMd: "Exportar .md",
  delete: "Eliminar",
  deleteConfirm: (title: string) => `¿Eliminar "${title}"? No se puede deshacer.`,
  alreadyInLibrary: "Ya está en tu biblioteca",
  sameTitle: "Ya tenés un ensayo con este título",
  looksLikeNewVersion: "Se parece a un ensayo que ya tenés",
  replace: "Reemplazar",
  keepBoth: "Guardar como copia",
  imported: (n: number) => `${n} importados`,
  skipped: (n: number) => `${n} omitidos`,
  storageBanner:
    "Tu biblioteca vive en este navegador. Activale respaldo con un @ o exportá copias.",
  storageBackup: "Respaldar",
  storageExport: "Exportar",
  dismiss: "Entendido",
  words: (n: number) => `${n.toLocaleString("es")} palabras`,
  toc: "Índice",
  contents: "Contenido",
  notes: "Notas",
  noNotes: "Todavía no subrayaste nada",
  orphans: "Huérfanos",
  approximatePosition: "El documento cambió — posición aproximada",
  typography: "Tipografía",
  serif: "Serif",
  sans: "Sans",
  size: "Tamaño",
  spacing: "Interlineado",
  theme: "Tema",
  themeSystem: "Sistema",
  themeLight: "Claro",
  themeSepia: "Sepia",
  themeDark: "Gris oscuro",
  themeBlack: "Negro",
  highlight: "Subrayar",
  copy: "Copiar",
  addNote: "Nota",
  removeHighlight: "Quitar",
  finishedAt: (n: number) => `Terminado · ${n} min de lectura`,
  settings: "Ajustes",
  backupTitle: "Respaldo",
  backupBody:
    "Exportá un zip con todos tus ensayos, tus posiciones y tus subrayados. Es también la forma de mudarte de navegador.",
  exportZip: "Exportar biblioteca",
  importZip: "Importar zip",
  storage: "Almacenamiento",
  storageUnknown: "Este navegador no informa cuánto espacio usa.",
  storageAlmostFull: "Estás cerca del límite de este navegador. Exportá una copia.",
  notPersisted:
    "Este navegador no garantizó guardar tu biblioteca: puede borrarla si necesita espacio. Exportá copias.",
  language: "Idioma",
  account: "Cuenta",
  accountSoon: "El respaldo con @ todavía no está disponible. Por ahora, el zip.",
};

type Strings = typeof es;

const en: Strings = {
  library: "Library",
  continueReading: "Continue reading",
  minutesLeft: (n) => `~${n} min left`,
  minutesTotal: (n) => `${n} min read`,
  finished: "Finished",
  emptyTitle: "Your library is empty",
  emptyHint: "or drag files here",
  import: "Import",
  importPaste: "Paste an essay",
  importFiles: "Open files",
  pasteHere: "Paste markdown here",
  titleLabel: "Title",
  add: "Add to library",
  cancel: "Cancel",
  dropHere: "Drop your essays",
  search: "Search",
  searchTitles: "Titles",
  searchText: "In the text",
  noResults: "No results",
  open: "Open",
  markFinished: "Mark finished",
  markUnread: "Mark unread",
  exportMd: "Export .md",
  delete: "Delete",
  deleteConfirm: (title) => `Delete "${title}"? This can't be undone.`,
  alreadyInLibrary: "Already in your library",
  sameTitle: "You already have an essay with this title",
  looksLikeNewVersion: "This looks like an essay you already have",
  replace: "Replace",
  keepBoth: "Keep as a copy",
  imported: (n) => `${n} imported`,
  skipped: (n) => `${n} skipped`,
  storageBanner:
    "Your library lives in this browser. Back it up with an @ or export copies.",
  storageBackup: "Back up",
  storageExport: "Export",
  dismiss: "Got it",
  words: (n) => `${n.toLocaleString("en")} words`,
  toc: "Contents",
  contents: "Contents",
  notes: "Notes",
  noNotes: "You haven't highlighted anything yet",
  orphans: "Orphaned",
  approximatePosition: "The document changed — approximate position",
  typography: "Typography",
  serif: "Serif",
  sans: "Sans",
  size: "Size",
  spacing: "Line height",
  theme: "Theme",
  themeSystem: "System",
  themeLight: "Light",
  themeSepia: "Sepia",
  themeDark: "Dark grey",
  themeBlack: "Black",
  highlight: "Highlight",
  copy: "Copy",
  addNote: "Note",
  removeHighlight: "Remove",
  finishedAt: (n) => `Finished · ${n} min read`,
  settings: "Settings",
  backupTitle: "Backup",
  backupBody:
    "Export a zip with all your essays, positions and highlights. It's also how you move to another browser.",
  exportZip: "Export library",
  importZip: "Import zip",
  storage: "Storage",
  storageUnknown: "This browser doesn't report how much space it uses.",
  storageAlmostFull: "You're close to this browser's limit. Export a copy.",
  notPersisted:
    "This browser didn't guarantee it will keep your library: it may delete it if it needs space. Export copies.",
  language: "Language",
  account: "Account",
  accountSoon: "Backup with an @ isn't available yet. For now, the zip.",
};

const dictionaries = { es, en };
export type Locale = keyof typeof dictionaries;

export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

let current: Locale = detectLocale();

export function setLocale(locale: Locale): void {
  current = locale;
}

export function t(): Strings {
  return dictionaries[current];
}
