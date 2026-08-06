import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";

import { motionSafe, snappy } from "../../design/springs";
import { Button } from "../../design/Button";
import { t } from "../../i18n";
import type { Block } from "../../core/markdown/blocks";

/**
 * La cápsula superior. Invisible por defecto: el texto es lo único en pantalla.
 *
 * En desktop aparece con el mouse en la franja de 56px de arriba, con 300ms de
 * gracia para que no parpadee al pasar de largo. En móvil, con un tap en el centro.
 * Se auto-oculta a los 4 segundos o al scrollear.
 */
export function ReaderCapsule({
  title,
  visible,
  onBack,
  onToc,
  onSettings,
}: {
  title: string;
  visible: boolean;
  onBack: () => void;
  onToc: () => void;
  onSettings: () => void;
}) {
  const strings = t();
  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={motionSafe(snappy)}
          className="fixed inset-x-0 top-0 z-30 flex justify-center px-4 pt-3"
        >
          <div className="flex w-full max-w-2xl items-center gap-3 rounded-pill border border-line bg-[var(--glass-bg)] px-4 py-2 backdrop-blur-[20px] backdrop-saturate-150">
            <Button variant="quiet" onClick={onBack} aria-label={strings.library}>
              ←
            </Button>
            <span className="flex-1 truncate text-center text-secondary text-ink-2">{title}</span>
            <Button variant="quiet" onClick={onToc}>
              {strings.toc}
            </Button>
            <Button variant="quiet" onClick={onSettings} aria-label={strings.typography}>
              Aa
            </Button>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

/**
 * El hilo de progreso, siempre visible abajo. Al pasar el mouse (o tocarlo) crece a
 * un track de 24px con el heading actual: es el scrubber.
 */
export function ProgressScrubber({
  progress,
  headings,
  onSeek,
}: {
  progress: number;
  headings: { index: number; text: string; ratio: number }[];
  onSeek: (ratio: number) => void;
}) {
  const [active, setActive] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [preview, setPreview] = useState<number | null>(null);
  const track = useRef<HTMLDivElement>(null);

  const ratioAt = (clientX: number): number => {
    const rect = track.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const shown = preview ?? progress;
  const heading = [...headings].reverse().find((h) => h.ratio <= shown);

  return (
    // Eventos de puntero y no de mouse: así el scrubber funciona con el dedo. Antes
    // era `onMouseMove`, o sea que en un celular el hilo de 2px no se podía usar de
    // ninguna forma. La zona sensible mide 24px siempre (el track del spec) aunque
    // solo se vean 2: un objetivo táctil de 2px no existe.
    <div
      ref={track}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        setScrubbing(true);
        setActive(true);
        setPreview(ratioAt(event.clientX));
      }}
      onPointerMove={(event) => {
        if (scrubbing) setPreview(ratioAt(event.clientX));
        else if (event.pointerType === "mouse") setActive(true);
      }}
      onPointerUp={(event) => {
        event.currentTarget.releasePointerCapture(event.pointerId);
        onSeek(ratioAt(event.clientX));
        setScrubbing(false);
        setPreview(null);
        // Con el dedo no hay "salir del área": se repliega al soltar.
        if (event.pointerType !== "mouse") setActive(false);
      }}
      onPointerLeave={() => {
        if (scrubbing) return;
        setActive(false);
        setPreview(null);
      }}
      // `touch-none`: sin esto, arrastrar sobre el hilo scrollea la página en vez
      // de mover el scrubber.
      className="fixed inset-x-0 bottom-0 z-30 flex h-6 cursor-pointer touch-none items-end"
      role="slider"
      aria-label={t().progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(shown * 100)}
      tabIndex={0}
      onKeyDown={(event) => {
        // El progreso también se maneja con el teclado: sin esto, alguien que
        // navega tabulando puede enfocar el hilo y no puede hacer nada con él.
        if (event.key === "ArrowRight") onSeek(Math.min(1, progress + 0.05));
        else if (event.key === "ArrowLeft") onSeek(Math.max(0, progress - 0.05));
        else if (event.key === "Home") onSeek(0);
        else if (event.key === "End") onSeek(1);
      }}
    >
      {active && heading && (
        <span className="pointer-events-none absolute bottom-4 left-1/2 max-w-[80vw] -translate-x-1/2 truncate rounded-pill border border-line bg-[var(--glass-bg)] px-3 py-1 text-caption text-ink-2 backdrop-blur-[20px]">
          {heading.text}
        </span>
      )}
      <div className={`w-full bg-line transition-[height] duration-200 ${active ? "h-1" : "h-[2px]"}`}>
        <div className="h-full bg-ink-2" style={{ width: `${Math.round(shown * 100)}%` }} />
      </div>
    </div>
  );
}

/**
 * Detecta si hay que mostrar el chrome. Desktop: franja superior de 56px con 300ms
 * de gracia. Móvil: tap en el centro. En ambos casos se esconde solo a los 4s.
 */
export function useChromeVisibility(): [boolean, () => void] {
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    setVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), 4000);
  };

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      if (event.clientY <= 56) {
        // 300ms de gracia: pasar el mouse de largo camino al scrollbar no cuenta.
        if (!enterTimer.current) enterTimer.current = setTimeout(show, 300);
      } else if (enterTimer.current) {
        clearTimeout(enterTimer.current);
        enterTimer.current = null;
      }
    };
    const onScroll = () => setVisible(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (enterTimer.current) clearTimeout(enterTimer.current);
    };
  }, []);

  return [visible, show];
}

/** Los headings del documento con su posición relativa, para TOC y scrubber. */
export function headingsOf(blocks: Block[]): { index: number; text: string; ratio: number }[] {
  const total = Math.max(1, blocks.length - 1);
  return blocks
    .filter((b) => b.kind === "heading" && b.plainText !== "")
    .map((b) => ({ index: b.index, text: b.plainText, ratio: b.index / total }));
}
