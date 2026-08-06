import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

/**
 * El tema del sistema. En M4 esto pasa a ser una preferencia con cuatro opciones
 * de lectura (claro, sepia, gris oscuro, negro) — pero el mecanismo es el mismo:
 * cambiar `data-theme` en el root y dejar que las CSS variables hagan el resto.
 */
export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setTheme(query.matches ? "dark" : "light");
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return theme;
}
