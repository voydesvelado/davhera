import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { AnimatePresence, m } from "framer-motion";
import type { RootContent } from "mdast";

import { db } from "../../core/db/schema";
import type { Block, ParsedDocument } from "../../core/markdown/blocks";
import { SHORT_DOCUMENT_WORDS, totalMinutes } from "../../core/db/queries";
import { scrollTopForAnchor } from "../../core/anchor/viewport";
import { getStore } from "../../app/store";
import { navigate } from "../../app/router";
import { motionSafe, gentle, snappy } from "../../design/springs";
import { t } from "../../i18n";
import { BlockView } from "./BlockView";
import { headingsOf, ProgressScrubber, ReaderCapsule, useChromeVisibility } from "./ReaderChrome";
import { TocPanel, TypographySheet } from "./ReaderPanels";
import { resolveTheme, useReadingSettings } from "./useReadingSettings";
import { useAnchoring } from "./useAnchoring";
import { useSelectionHighlights } from "./useSelectionHighlights";
import { HighlightPopover } from "./HighlightPopover";
import type { HighlightRange } from "./inline";

/**
 * El lector. Scroll continuo, chrome invisible, y una sola cosa en pantalla: el texto.
 *
 * El inset superior de 64px no es decorativo — es la lección aprendida del spec: la
 * cápsula no puede tapar jamás la primera línea del documento.
 */
export function ReaderScreen({ documentId }: { documentId: string }) {
  const strings = t();
  const [parsed, setParsed] = useState<ParsedDocument | null>(null);
  const [settings, updateSettings] = useReadingSettings();
  const [chromeVisible, showChrome] = useChromeVisibility();
  const [toc, setToc] = useState<"contents" | "notes" | null>(null);
  const [typography, setTypography] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const article = useRef<HTMLElement>(null);

  const doc = useLiveQuery(() => db.documents.get(documentId), [documentId]);
  const content = useLiveQuery(() => db.contents.get(documentId), [documentId]);
  const position = useLiveQuery(() => db.positions.get(documentId), [documentId]);
  const highlights = useLiveQuery(
    () => db.highlights.where("documentId").equals(documentId).toArray(),
    [documentId],
    [],
  );

  const blocks: Block[] = useMemo(() => parsed?.blocks ?? [], [parsed]);
  const headings = useMemo(() => headingsOf(blocks), [blocks]);
  const short = (doc?.wordCount ?? 0) < SHORT_DOCUMENT_WORDS;

  // El parser llega por import() dinámico; en documentos largos esto es lo que
  // justifica el shimmer.
  useEffect(() => {
    if (!content) return;
    let cancelled = false;
    void import("../../core/markdown/parse").then(async ({ parseDocument }) => {
      const result = await parseDocument(content.markdown);
      if (!cancelled) setParsed(result);
    });
    return () => {
      cancelled = true;
    };
  }, [content]);

  useEffect(() => {
    void getStore().then((store) => store.markOpened(documentId));
  }, [documentId]);

  // Título en la pestaña. Se restaura al salir.
  useEffect(() => {
    if (!doc) return;
    const previous = document.title;
    document.title = `${doc.title} · Prosa`;
    return () => {
      document.title = previous;
    };
  }, [doc]);

  const onApproximate = useCallback(() => {
    setToast(strings.approximatePosition);
    setTimeout(() => setToast(null), 2000);
  }, [strings]);

  const { reanchorAfterLayout } = useAnchoring({
    documentId,
    blocks,
    status: doc?.status ?? "unread",
    saved: position,
    ready: parsed !== null && doc !== undefined,
    onApproximate,
  });

  // Cambiar la tipografía re-layoutea todo el documento: se captura el ancla antes
  // y se vuelve a ella después. Sin esto, cambiar el tamaño de letra te manda a
  // otra parte del ensayo, que es el momento exacto en que un lector abandona.
  const firstLayout = useRef(true);
  useLayoutEffect(() => {
    if (firstLayout.current) {
      firstLayout.current = false;
      return;
    }
    reanchorAfterLayout();
  }, [settings.size, settings.lineHeight, settings.family, reanchorAfterLayout]);

  // El tema de lectura pisa al del sistema mientras el lector está abierto.
  useEffect(() => {
    const previous = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", resolveTheme(settings.theme));
    return () => {
      if (previous) document.documentElement.setAttribute("data-theme", previous);
    };
  }, [settings.theme]);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [parsed]);

  const { toolbar, createHighlight, highlightParagraph, removeHighlight, setNote } =
    useSelectionHighlights({ documentId, blocks, nodes: parsed?.nodes ?? [] });

  // Click en un subrayado: popover con nota, copiar y quitar. NO lo elimina de una,
  // que sería destruir la nota de alguien con un click accidental.
  const [openHighlight, setOpenHighlight] = useState<{ id: string; x: number; y: number } | null>(
    null,
  );
  const openHighlightRecord = highlights.find((h) => h.id === openHighlight?.id);

  const ranges: Map<number, HighlightRange[]> = useMemo(() => {
    const map = new Map<number, HighlightRange[]>();
    for (const highlight of highlights) {
      if (highlight.deletedAt !== null || highlight.isOrphaned) continue;
      const list = map.get(highlight.blockIndex) ?? [];
      list.push({
        id: highlight.id,
        start: highlight.startOffset,
        end: highlight.endOffset,
        hasNote: highlight.note !== null && highlight.note !== "",
      });
      map.set(highlight.blockIndex, list);
    }
    return map;
  }, [highlights]);

  const goToBlock = useCallback((blockIndex: number) => {
    const node = document.querySelector<HTMLElement>(`[data-block="${blockIndex}"]`);
    if (!node) return;
    window.scrollTo({
      top: scrollTopForAnchor(
        { index: blockIndex, top: node.offsetTop, height: node.offsetHeight },
        0,
        window.innerHeight,
        document.documentElement.scrollHeight,
      ),
      behavior: "smooth",
    });
    setToc(null);
  }, []);

  // Doble click (o doble tap) en un párrafo lo subraya entero. `touch-manipulation`
  // evita que en móvil el doble tap se confunda con un zoom.
  const onDoubleClick = (event: React.MouseEvent) => {
    const block = (event.target as HTMLElement).closest<HTMLElement>("[data-block]");
    if (!block) return;
    const index = Number(block.dataset["block"]);
    if (!Number.isNaN(index)) void highlightParagraph(index);
  };

  if (!doc) return <div className="min-h-dvh bg-bg" />;

  return (
    <div
      className="min-h-dvh touch-manipulation bg-bg"
      onClick={showChrome}
      onDoubleClick={onDoubleClick}
    >
      <ReaderCapsule
        title={doc.title}
        visible={chromeVisible}
        onBack={() => navigate({ name: "library" })}
        onToc={() => setToc("contents")}
        onSettings={() => setTypography(true)}
      />

      <article
        ref={article}
        // 64px de inset: la cápsula jamás tapa la primera línea.
        className="mx-auto w-full max-w-[68ch] px-6 pb-32 pt-16"
        style={{
          fontFamily: settings.family === "serif" ? "var(--font-serif)" : "var(--font-ui)",
          fontSize: `${settings.size}px`,
          lineHeight: settings.lineHeight,
          letterSpacing: settings.family === "sans" ? "0" : undefined,
        }}
      >
        {parsed ? (
          parsed.blocks.map((block, index) => (
            <BlockView
              key={block.index}
              block={block}
              node={parsed.nodes[index] as RootContent}
              highlights={ranges.get(block.index) ?? []}
              onHighlightClick={(id, rect) => setOpenHighlight({ id, x: rect.x, y: rect.y })}
            />
          ))
        ) : (
          <Shimmer />
        )}

        {doc.status === "finished" && (
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={motionSafe(gentle)}
            className="mt-16 text-center text-secondary text-ink-3"
          >
            {strings.finishedAt(totalMinutes(doc))}
          </m.p>
        )}
      </article>

      {!short && (
        <ProgressScrubber
          progress={progress}
          headings={headings}
          onSeek={(ratio) => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            window.scrollTo({ top: scrollable * ratio, behavior: "smooth" });
          }}
        />
      )}

      {toolbar && (
        <div
          className="fixed z-40 flex -translate-x-1/2 -translate-y-full gap-1 rounded-pill border border-line bg-[var(--glass-bg)] px-2 py-1 backdrop-blur-[20px]"
          style={{ left: toolbar.x, top: toolbar.y - 8 }}
        >
          <button
            onMouseDown={(event) => {
              event.preventDefault();
              void createHighlight();
            }}
            className="px-3 py-1 text-secondary text-ink-1"
          >
            {strings.highlight}
          </button>
          <button
            onMouseDown={(event) => {
              event.preventDefault();
              void navigator.clipboard?.writeText(toolbar.text);
            }}
            className="px-3 py-1 text-secondary text-ink-2"
          >
            {strings.copy}
          </button>
        </div>
      )}

      {openHighlight && openHighlightRecord && (
        <HighlightPopover
          highlight={openHighlightRecord}
          anchorRect={{ x: openHighlight.x, y: openHighlight.y }}
          onNote={(note) => void setNote(openHighlight.id, note)}
          onRemove={() => {
            void removeHighlight(openHighlight.id);
            setOpenHighlight(null);
          }}
          onClose={() => setOpenHighlight(null)}
        />
      )}

      {toc && !short && (
        <TocPanel
          headings={headings}
          highlights={highlights}
          tab={toc}
          onTab={setToc}
          onGo={goToBlock}
          onClose={() => setToc(null)}
        />
      )}

      {typography && (
        <TypographySheet
          settings={settings}
          onChange={updateSettings}
          onClose={() => setTypography(false)}
        />
      )}

      <AnimatePresence>
        {toast && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={motionSafe(snappy)}
            className="fixed inset-x-0 bottom-10 z-40 flex justify-center"
          >
            <span className="rounded-pill border border-line bg-[var(--glass-bg)] px-4 py-2 text-caption text-ink-2 backdrop-blur-[20px]">
              {toast}
            </span>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Shimmer() {
  return (
    <div className="flex flex-col gap-4" aria-hidden>
      {[0, 1, 2, 3, 4].map((row) => (
        <div key={row} className="h-4 animate-pulse rounded-s bg-line" style={{ width: `${90 - row * 7}%` }} />
      ))}
    </div>
  );
}
