import { useMemo, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { AnimatePresence, m } from "framer-motion";

import { db } from "../../core/db/schema";
import {
  continueReading,
  listLibrary,
  minutesRemaining,
  search,
  totalMinutes,
  type LibraryEntry,
} from "../../core/db/queries";
import type { BatchResult } from "../../core/import/importer";
import { requestPersistence } from "../../app/store";
import { navigate } from "../../app/router";
import type { Theme } from "../../app/useTheme";
import { Cover, GhostButton, Pill, ProgressThread } from "../../design/components";
import { motionSafe, gentle, snappy } from "../../design/springs";
import { t } from "../../i18n";
import { ImportSheet } from "../import/ImportSheet";
import { useDropImport } from "../import/useDropImport";
import { DocumentMenu } from "./DocumentMenu";
import { StorageBanner } from "./StorageBanner";

export function LibraryScreen({ theme }: { theme: Theme }) {
  const strings = t();
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [summary, setSummary] = useState<BatchResult | null>(null);
  const [menuFor, setMenuFor] = useState<LibraryEntry | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // `useLiveQuery` devuelve undefined mientras (re)calcula. Pasarle un valor por
  // defecto de `[]` haría que la biblioteca PARPADEE al empty state en cada
  // recálculo —incluido el primer render de cada carga de página—: se vería
  // "tu biblioteca está vacía" un instante antes de aparecer los ensayos.
  // Se conserva el último resultado conocido y se distingue "cargando" (undefined)
  // de "vacía" (length 0), que no son lo mismo.
  const live = useLiveQuery(() => listLibrary(db), []);
  const lastKnown = useRef<LibraryEntry[]>([]);
  if (live) lastKnown.current = live;
  const entries = live ?? lastKnown.current;
  const loading = live === undefined && lastKnown.current.length === 0;
  const { dragging, runImport } = useDropImport(setSummary);

  const reading = useMemo(() => continueReading(entries), [entries]);
  const hits = useMemo(() => search(entries, query), [entries, query]);

  // El primer import es el momento de pedir persistencia: hay algo que perder y el
  // usuario acaba de demostrar intención. Pedirlo al cargar sería pedir por nada.
  async function afterImport() {
    await requestPersistence();
  }

  const titleHits = hits.filter((h) => h.where === "title");
  const textHits = hits.filter((h) => h.where === "text");

  return (
    <div className="mx-auto min-h-dvh w-full max-w-5xl px-6 pb-32 pt-10">
      <header className="mb-8 flex items-baseline justify-between gap-4">
        <h1 className="text-display font-medium">{strings.library}</h1>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={strings.search}
          aria-label={strings.search}
          className="w-40 rounded-s border border-line bg-transparent px-3 py-1.5 text-secondary outline-none transition-[width] focus:w-56 focus:border-ink-3"
        />
      </header>

      <StorageBanner hasDocuments={entries.length > 0} />

      {loading ? null : query !== "" ? (
        <SearchResults titleHits={titleHits} textHits={textHits} theme={theme} />
      ) : entries.length === 0 ? (
        <EmptyState onPaste={() => setSheetOpen(true)} onFiles={() => fileInput.current?.click()} />
      ) : (
        <>
          {reading && <ContinueCard entry={reading} theme={theme} />}
          <Grid entries={entries} theme={theme} onMenu={setMenuFor} />
        </>
      )}

      {/* CTA único de la pantalla, flotante. */}
      {entries.length > 0 && (
        <div className="fixed inset-x-0 bottom-6 flex justify-center gap-3">
          <Pill onClick={() => setSheetOpen(true)}>{strings.import}</Pill>
          <GhostButton onClick={() => fileInput.current?.click()}>{strings.importFiles}</GhostButton>
        </div>
      )}

      <input
        ref={fileInput}
        type="file"
        multiple
        accept=".md,.markdown,.txt,text/markdown,text/plain"
        className="hidden"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          event.target.value = "";
          void runImport(files).then(afterImport);
        }}
      />

      <AnimatePresence>
        {dragging && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={motionSafe(snappy)}
            className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-[var(--glass-bg)] backdrop-blur-[20px]"
          >
            <p className="text-display font-medium text-ink-2">{strings.dropHere}</p>
          </m.div>
        )}
      </AnimatePresence>

      {sheetOpen && (
        <ImportSheet
          onClose={() => setSheetOpen(false)}
          onImported={() => void afterImport()}
        />
      )}

      {menuFor && <DocumentMenu entry={menuFor} onClose={() => setMenuFor(null)} />}

      {summary && (
        <ImportSummary result={summary} onDismiss={() => setSummary(null)} />
      )}
    </div>
  );
}

function ContinueCard({ entry, theme }: { entry: LibraryEntry; theme: Theme }) {
  const strings = t();
  return (
    <m.button
      layoutId={`cover-${entry.document.id}`}
      transition={motionSafe(gentle)}
      onClick={() => navigate({ name: "reader", documentId: entry.document.id })}
      className="mb-10 flex w-full items-center gap-5 rounded-m border border-line p-4 text-left"
    >
      <Cover
        title={entry.document.title}
        seed={entry.document.coverSeed}
        theme={theme}
        className="w-24 shrink-0"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="text-caption text-ink-3">{strings.continueReading}</span>
        <span className="truncate text-body font-medium">{entry.document.title}</span>
        <span className="text-secondary text-ink-2">
          {strings.minutesLeft(minutesRemaining(entry))}
        </span>
        <ProgressThread progress={entry.position?.progress ?? 0} />
      </div>
    </m.button>
  );
}

function Grid({
  entries,
  theme,
  onMenu,
}: {
  entries: LibraryEntry[];
  theme: Theme;
  onMenu: (entry: LibraryEntry) => void;
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {entries.map((entry) => (
        <li key={entry.document.id}>
          <DocumentCard entry={entry} theme={theme} onMenu={onMenu} />
        </li>
      ))}
    </ul>
  );
}

export function DocumentCard({
  entry,
  theme,
  onMenu,
}: {
  entry: LibraryEntry;
  theme: Theme;
  onMenu?: (entry: LibraryEntry) => void;
}) {
  const strings = t();
  const { document } = entry;

  return (
    <button
      className="group w-full text-left"
      onClick={() => navigate({ name: "reader", documentId: document.id })}
      onContextMenu={(event) => {
        if (!onMenu) return;
        event.preventDefault();
        onMenu(entry);
      }}
    >
      <m.div layoutId={`cover-${document.id}`} transition={motionSafe(gentle)}>
        <Cover title={document.title} seed={document.coverSeed} theme={theme} />
      </m.div>
      <p className="mt-2 line-clamp-2 text-body">{document.title}</p>
      <p className="mt-0.5 text-caption text-ink-3">
        {document.status === "finished"
          ? `${strings.finished} · ${strings.minutesTotal(totalMinutes(document))}`
          : entry.position
            ? strings.minutesLeft(minutesRemaining(entry))
            : strings.minutesTotal(totalMinutes(document))}
      </p>
    </button>
  );
}

function SearchResults({
  titleHits,
  textHits,
  theme,
}: {
  titleHits: ReturnType<typeof search>;
  textHits: ReturnType<typeof search>;
  theme: Theme;
}) {
  const strings = t();
  if (titleHits.length === 0 && textHits.length === 0) {
    return <p className="text-secondary text-ink-3">{strings.noResults}</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {titleHits.length > 0 && (
        <section>
          <h2 className="mb-3 text-caption text-ink-3">{strings.searchTitles}</h2>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {titleHits.map((hit) => (
              <li key={hit.entry.document.id}>
                <DocumentCard entry={hit.entry} theme={theme} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {textHits.length > 0 && (
        <section>
          <h2 className="mb-3 text-caption text-ink-3">{strings.searchText}</h2>
          <ul className="flex flex-col divide-y divide-line">
            {textHits.map((hit) => (
              <li key={hit.entry.document.id}>
                <button
                  className="w-full py-3 text-left"
                  onClick={() =>
                    navigate({ name: "reader", documentId: hit.entry.document.id })
                  }
                >
                  <p className="text-body">{hit.entry.document.title}</p>
                  <p className="mt-1 line-clamp-2 text-secondary text-ink-2">{hit.excerpt}</p>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function EmptyState({ onPaste, onFiles }: { onPaste: () => void; onFiles: () => void }) {
  const strings = t();
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-body text-ink-2">{strings.emptyTitle}</p>
      {/* La única animación ambiental de la app: la respiración de este botón. */}
      <m.div
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Pill onClick={onPaste}>{strings.importPaste}</Pill>
      </m.div>
      <button onClick={onFiles} className="text-secondary text-ink-3 underline-offset-4 hover:underline">
        {strings.emptyHint}
      </button>
    </div>
  );
}

function ImportSummary({ result, onDismiss }: { result: BatchResult; onDismiss: () => void }) {
  const strings = t();
  const parts = [strings.imported(result.imported.length)];
  if (result.skipped.length > 0) parts.push(strings.skipped(result.skipped.length));
  if (result.failed.length > 0) parts.push(`${result.failed.length} con error`);

  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionSafe(snappy)}
      className="fixed inset-x-0 bottom-24 z-40 flex justify-center"
    >
      <button
        onClick={onDismiss}
        className="rounded-pill border border-line bg-[var(--glass-bg)] px-4 py-2 text-secondary text-ink-2 backdrop-blur-[20px]"
      >
        {parts.join(" · ")}
      </button>
    </m.div>
  );
}
