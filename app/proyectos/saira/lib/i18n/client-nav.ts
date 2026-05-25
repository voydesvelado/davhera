"use client";

// Hooks de navegación scopeados al subsitio Saira.
// Client-only: dependen de useRouter/usePathname de next/navigation.

import {
  useRouter as useNextRouter,
  usePathname as useNextPathname,
} from "next/navigation";
import { useLocale } from "next-intl";
import {
  type Locale,
  SAIRA_BASE,
  isLocale,
  sairaPath,
} from "./config";

/** Devuelve el path actual SIN el prefijo /proyectos/saira/{locale}. */
export function useSairaPathname(): string {
  const pathname = useNextPathname();
  if (!pathname?.startsWith(SAIRA_BASE)) return "/";
  const rest = pathname.slice(SAIRA_BASE.length);
  const segments = rest.split("/").filter(Boolean);
  if (segments.length === 0) return "/";
  const [maybeLocale, ...tail] = segments;
  if (isLocale(maybeLocale)) {
    return tail.length ? `/${tail.join("/")}` : "/";
  }
  return rest || "/";
}

/** Router que preserva el prefijo /proyectos/saira/{locale}. */
export function useSairaRouter() {
  const router = useNextRouter();
  const currentLocale = useLocale() as Locale;

  return {
    push(href: string, opts?: { locale?: Locale }) {
      const target = opts?.locale ?? currentLocale;
      const segments = href.split("/").filter(Boolean);
      router.push(sairaPath(target, ...segments));
    },
    replace(href: string, opts?: { locale?: Locale }) {
      const target = opts?.locale ?? currentLocale;
      const segments = href.split("/").filter(Boolean);
      router.replace(sairaPath(target, ...segments));
    },
  };
}
