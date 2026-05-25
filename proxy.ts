import { NextResponse, type NextRequest } from "next/server";

// Proxy (Next 16; era "middleware" en versiones previas) SCOPEADO al
// subsitio /proyectos/saira/*. Cualquier otra ruta de Davhera pasa intacta
// gracias al matcher.
//
// Responsabilidades:
// 1. Si la ruta es /proyectos/saira o /proyectos/saira/<algo-no-locale>,
//    detectar locale (cookie → Accept-Language → default) y redirigir
//    a /proyectos/saira/{locale}/<resto>.
// 2. Si ya viene con locale válido, sincronizar la cookie y dejar pasar.
//
// NO usamos `createMiddleware` de next-intl porque asume que las rutas viven
// en la raíz del dominio; nuestras viven anidadas bajo /proyectos/saira/.

const LOCALES = ["pt", "es", "en"] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = "pt";
const BASE = "/proyectos/saira";
const COOKIE = "NEXT_LOCALE";
const ONE_YEAR = 60 * 60 * 24 * 365;

function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

function pickLocale(req: NextRequest): Locale {
  const cookie = req.cookies.get(COOKIE)?.value;
  if (isLocale(cookie)) return cookie;

  const header = req.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const tag = part
      .trim()
      .split(";")[0]
      .split("-")[0]
      .toLowerCase();
    if (isLocale(tag)) return tag;
  }
  return DEFAULT_LOCALE;
}

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Defensive: matcher ya filtra, pero por si acaso.
  if (!pathname.startsWith(BASE)) return NextResponse.next();

  // Rest = "" para /proyectos/saira, "/" para /proyectos/saira/, "/pt/..." etc.
  const rest = pathname.slice(BASE.length);
  const segments = rest.split("/").filter(Boolean);
  const first = segments[0];

  if (isLocale(first)) {
    const res = NextResponse.next();
    if (req.cookies.get(COOKIE)?.value !== first) {
      res.cookies.set(COOKIE, first, { path: "/", maxAge: ONE_YEAR });
    }
    return res;
  }

  // Sin locale en la URL → detectar y redirigir.
  const locale = pickLocale(req);
  const tail = segments.length ? `/${segments.join("/")}` : "";
  const url = req.nextUrl.clone();
  url.pathname = `${BASE}/${locale}${tail}`;
  url.search = search;

  const res = NextResponse.redirect(url);
  res.cookies.set(COOKIE, locale, { path: "/", maxAge: ONE_YEAR });
  return res;
}

export const config = {
  matcher: ["/proyectos/saira", "/proyectos/saira/:path*"],
};
