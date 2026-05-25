// Helpers de navegación scoped al subsitio Saira.
// No usamos `createNavigation` de next-intl porque su middleware asume rutas
// en la raíz (/{locale}/...) y nuestras rutas viven bajo /proyectos/saira/.
// El control manual mantiene el modelo simple y consistente con el
// middleware custom que vive en /middleware.ts.

import NextLink from "next/link";
import { useRouter as useNextRouter, usePathname as useNextPathname } from "next/navigation";
import { useLocale } from "next-intl";
import { type ComponentProps, type ReactNode } from "react";
import {
  type Locale,
  SAIRA_BASE,
  isLocale,
  sairaPath,
} from "./config";

type LinkBaseProps = Omit<ComponentProps<typeof NextLink>, "href">;

export type SairaLinkProps = LinkBaseProps & {
  /** Path relativo dentro del subsitio (ej. "/tours" o "/tours/pedra-da-gavea") */
  href: string;
  /** Override del locale; por defecto usa el actual */
  locale?: Locale;
  children: ReactNode;
};

/** <Link> que automáticamente añade /proyectos/saira/{locale} al inicio.
 *  Acepta paths como "/tours" o "/tours/pedra-da-gavea". */
export function Link({ href, locale, children, ...rest }: SairaLinkProps) {
  const currentLocale = useLocale() as Locale;
  const target = locale ?? currentLocale;
  const segments = href.split("/").filter(Boolean);
  const fullHref = sairaPath(target, ...segments);
  return (
    <NextLink href={fullHref} {...rest}>
      {children}
    </NextLink>
  );
}

/** Devuelve el path actual SIN el prefijo /proyectos/saira/{locale}.
 *  Útil para el LanguageSwitcher (preservar la ruta al cambiar idioma). */
export function useSairaPathname(): string {
  const pathname = useNextPathname();
  if (!pathname?.startsWith(SAIRA_BASE)) return "/";
  const rest = pathname.slice(SAIRA_BASE.length); // "/{locale}/..." o ""
  const segments = rest.split("/").filter(Boolean);
  if (segments.length === 0) return "/";
  const [maybeLocale, ...tail] = segments;
  if (isLocale(maybeLocale)) {
    return tail.length ? `/${tail.join("/")}` : "/";
  }
  return rest || "/";
}

/** Router scopeado: navega preservando el prefijo /proyectos/saira/{locale}. */
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
