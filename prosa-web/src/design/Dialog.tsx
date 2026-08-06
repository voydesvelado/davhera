import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "./cn";

/**
 * El diálogo único de la app. Todo lo que se superpone pasa por acá: el sheet de
 * import, el menú del documento, la tipografía, el índice, el flujo del @.
 *
 * Antes cada uno traía su propio backdrop, su propio z-index y su propia forma de
 * cerrar. Seis overlays parecidos y ninguno igual: distinto padding, distinto
 * radio, algunos sin Escape, ninguno con trampa de foco.
 *
 * POR QUÉ NO shadcn/Radix acá, que es lo que uno esperaría:
 * `@radix-ui/react-dialog` pesa ~97KB sin comprimir y arrastra portal y presence.
 * El shell está en 136KB gzip de un presupuesto de 150 que el spec fija, y este
 * es el único componente que lo rompería. El `<dialog>` nativo da exactamente lo
 * que Radix aporta —trampa de foco, Escape, fondo inerte, top-layer— por cero
 * bytes, y el spec solo soporta navegadores evergreen, donde existe desde 2022.
 *
 * Del método de shadcn se conserva lo que importa: el código es nuestro, las
 * variantes se componen, y la estética es la de Prosa y no la de una librería.
 */

export type DialogPresentation =
  /** Móvil: desde abajo. Desktop: centrado. Es el sheet del spec. */
  | "sheet"
  /** Panel lateral, para el índice en desktop. */
  | "panel";

export function Dialog({
  open,
  onClose,
  presentation = "sheet",
  labelledBy,
  className,
  size = "lg",
  bare = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  presentation?: DialogPresentation;
  /** id del título, para que un lector de pantalla anuncie de qué es el diálogo. */
  labelledBy?: string;
  className?: string;
  /** Ancho máximo. Es una variante y no un `className` para que nada tenga que
   *  pisar `max-w-*`: sin conflictos, alcanza con clsx (ver cn.ts). */
  size?: "xs" | "md" | "lg";
  /** El contenido trae su propio padding (menús, paneles con lista). */
  bare?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    // `showModal` deja el fondo inerte pero no bloquea su scroll.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      // `cancel` es Escape: el navegador ya lo maneja, solo hay que avisar arriba.
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      // Click en el backdrop. El target es el propio <dialog> solo cuando el click
      // cayó fuera del contenido, así que no hace falta comparar coordenadas.
      onMouseDown={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={cn(
        "prosa-dialog bg-transparent p-0 text-ink-1 backdrop:bg-black/20",
        presentation === "sheet"
          ? cn(
              "m-0 w-full self-end sm:m-auto sm:self-auto",
              size === "xs" ? "max-w-xs" : size === "md" ? "max-w-md" : "max-w-xl",
            )
          : "ml-auto mr-0 h-dvh max-h-none w-full max-w-sm",
        className,
      )}
    >
      {/* El contenido en un div aparte: así el click en el <dialog> (el backdrop)
          se distingue del click adentro sin trucos. */}
      <div
        className={cn(
          "flex flex-col border border-line bg-bg",
          presentation === "sheet"
            ? cn("max-h-[85vh] overflow-hidden rounded-t-m sm:rounded-m", !bare && "p-6")
            : "h-full border-y-0 border-r-0",
        )}
      >
        {children}
      </div>
    </dialog>
  );
}

/** Título del diálogo. Va con `labelledBy` para que el diálogo tenga nombre. */
export function DialogTitle({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 id={id} className={cn("mb-2 text-display font-medium", className)}>
      {children}
    </h2>
  );
}

/** Fila de acciones, siempre abajo y a la derecha. */
export function DialogActions({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mt-6 flex flex-wrap items-center justify-end gap-3", className)}>
      {children}
    </div>
  );
}
