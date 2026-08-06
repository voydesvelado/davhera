import type { HighlightRecord } from "../../core/db/types";
import { Chip } from "../../design/components";
import { t } from "../../i18n";
import type { ReadingSettings } from "./useReadingSettings";

/** Panel del índice, con las dos pestañas del spec: Contenido y Notas. */
export function TocPanel({
  headings,
  highlights,
  tab,
  onTab,
  onGo,
  onClose,
}: {
  headings: { index: number; text: string }[];
  highlights: HighlightRecord[];
  tab: "contents" | "notes";
  onTab: (tab: "contents" | "notes") => void;
  onGo: (blockIndex: number) => void;
  onClose: () => void;
}) {
  const strings = t();
  const live = highlights.filter((h) => h.deletedAt === null);
  const orphans = live.filter((h) => h.isOrphaned);
  const anchored = live.filter((h) => !h.isOrphaned);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button className="absolute inset-0 bg-black/20" onMouseDown={onClose} aria-label="cerrar" />
      <aside className="relative z-10 flex h-full w-full max-w-sm flex-col border-l border-line bg-bg">
        <div className="flex gap-2 border-b border-line p-4">
          <Chip selected={tab === "contents"} onClick={() => onTab("contents")}>
            {strings.contents}
          </Chip>
          <Chip selected={tab === "notes"} onClick={() => onTab("notes")}>
            {strings.notes}
          </Chip>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tab === "contents" ? (
            <ul className="flex flex-col gap-1">
              {headings.map((heading) => (
                <li key={heading.index}>
                  <button
                    onClick={() => onGo(heading.index)}
                    className="w-full py-1.5 text-left text-secondary text-ink-2 hover:text-ink-1"
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          ) : live.length === 0 ? (
            <p className="text-secondary text-ink-3">{strings.noNotes}</p>
          ) : (
            <div className="flex flex-col gap-6">
              <ul className="flex flex-col gap-4">
                {anchored.map((highlight) => (
                  <li key={highlight.id}>
                    <button
                      onClick={() => onGo(highlight.blockIndex)}
                      className="w-full text-left"
                    >
                      <p className="border-l-2 border-accent-solid pl-3 text-secondary text-ink-1">
                        {highlight.snapshotText}
                      </p>
                      {highlight.note && (
                        <p className="mt-1 pl-3 text-caption text-ink-3">{highlight.note}</p>
                      )}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Los huérfanos no se borran nunca: el texto que alguien marcó sigue
                  acá aunque el documento haya cambiado debajo. */}
              {orphans.length > 0 && (
                <section>
                  <h3 className="mb-2 text-caption text-ink-3">{strings.orphans}</h3>
                  <ul className="flex flex-col gap-3">
                    {orphans.map((highlight) => (
                      <li key={highlight.id} className="border-l-2 border-line pl-3">
                        <p className="text-secondary text-ink-2">{highlight.snapshotText}</p>
                        {highlight.note && (
                          <p className="mt-1 text-caption text-ink-3">{highlight.note}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

/** El sheet Aa: familia, tamaño, interlineado y tema. Todo se aplica en vivo. */
export function TypographySheet({
  settings,
  onChange,
  onClose,
}: {
  settings: ReadingSettings;
  onChange: (next: Partial<ReadingSettings>) => void;
  onClose: () => void;
}) {
  const strings = t();
  const themes: { value: ReadingSettings["theme"]; label: string }[] = [
    { value: "system", label: strings.themeSystem },
    { value: "light", label: strings.themeLight },
    { value: "sepia", label: strings.themeSepia },
    { value: "dark", label: strings.themeDark },
    { value: "black", label: strings.themeBlack },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button className="absolute inset-0 bg-black/20" onMouseDown={onClose} aria-label="cerrar" />
      <div className="relative z-10 flex w-full max-w-md flex-col gap-6 rounded-t-m border border-line bg-bg p-6 sm:rounded-m">
        <div className="flex gap-2">
          <Chip selected={settings.family === "serif"} onClick={() => onChange({ family: "serif" })}>
            {strings.serif}
          </Chip>
          <Chip selected={settings.family === "sans"} onClick={() => onChange({ family: "sans" })}>
            {strings.sans}
          </Chip>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-caption text-ink-3">{strings.size}</span>
          <input
            type="range"
            min={16}
            max={22}
            step={1}
            value={settings.size}
            onChange={(event) => onChange({ size: Number(event.target.value) })}
            className="accent-[var(--ink-1)]"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-caption text-ink-3">{strings.spacing}</span>
          <input
            type="range"
            min={1.4}
            max={1.7}
            step={0.05}
            value={settings.lineHeight}
            onChange={(event) => onChange({ lineHeight: Number(event.target.value) })}
            className="accent-[var(--ink-1)]"
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-caption text-ink-3">{strings.theme}</span>
          <div className="flex flex-wrap gap-2">
            {themes.map((theme) => (
              <Chip
                key={theme.value}
                selected={settings.theme === theme.value}
                onClick={() => onChange({ theme: theme.value })}
              >
                {theme.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
