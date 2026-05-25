// <Link> scoped al subsitio Saira.
// Server-safe: solo usa `useLocale` de next-intl (compatible con SSR
// cuando el layout llama a setRequestLocale).
//
// Para hooks de cliente (useSairaPathname/useSairaRouter) ver `client-nav.ts`.

import NextLink from "next/link";
import { useLocale } from "next-intl";
import type { ComponentProps, ReactNode } from "react";
import { type Locale, sairaPath } from "./config";

type LinkBaseProps = Omit<ComponentProps<typeof NextLink>, "href">;

export type SairaLinkProps = LinkBaseProps & {
  /** Path relativo dentro del subsitio (ej. "/tours" o "/tours/pedra-da-gavea") */
  href: string;
  /** Override del locale; por defecto usa el actual */
  locale?: Locale;
  children: ReactNode;
};

/** <Link> que automáticamente añade /proyectos/saira/{locale} al inicio. */
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
