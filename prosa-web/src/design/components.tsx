import { coverGrey, coverInk, strippedTitle } from "./covers";

/**
 * Portada: gris determinístico + título en serif, máximo dos líneas. Único elemento.
 * Sin gradiente, sin color, sin imagen.
 */
export function Cover({
  title,
  seed,
  theme,
  className = "",
}: {
  title: string;
  seed: number;
  theme: "light" | "dark";
  className?: string;
}) {
  const background = coverGrey(seed, theme);
  return (
    <div
      className={`flex aspect-[3/4] items-end rounded-m p-4 ${className}`}
      style={{ background }}
      aria-hidden="true"
    >
      <span
        className="line-clamp-2 font-serif text-[15px] leading-tight"
        style={{ color: coverInk(background) }}
      >
        {strippedTitle(title)}
      </span>
    </div>
  );
}

/** El hilo de progreso de 2pt. El mismo objeto en la biblioteca y en el lector. */
export function ProgressThread({ progress }: { progress: number }) {
  return (
    <div className="h-[2px] w-full bg-line" role="presentation">
      <div
        className="h-full bg-ink-2 transition-[width] duration-300"
        style={{ width: `${Math.round(Math.max(0, Math.min(1, progress)) * 100)}%` }}
      />
    </div>
  );
}
