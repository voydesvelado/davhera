import { useSyncExternalStore } from "react";

/**
 * Router mínimo. La app tiene tres rutas y un presupuesto de 150KB de JS: meter
 * react-router para esto costaría ~15KB gzip a cambio de nada que se note.
 *
 * Todas las rutas cuelgan de BASE porque Prosa vive en davhera.com/prosa, no en la
 * raíz de un dominio.
 */
export const BASE = "/prosa";

export type Route =
  | { name: "library" }
  | { name: "reader"; documentId: string }
  | { name: "settings" };

function parse(pathname: string): Route {
  const rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  const segments = rest.split("/").filter(Boolean);

  if (segments[0] === "d" && segments[1]) return { name: "reader", documentId: segments[1] };
  if (segments[0] === "settings") return { name: "settings" };
  return { name: "library" };
}

export function hrefFor(route: Route): string {
  switch (route.name) {
    case "reader":
      return `${BASE}/d/${route.documentId}`;
    case "settings":
      return `${BASE}/settings`;
    default:
      return `${BASE}/`;
  }
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("popstate", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}

function notify(): void {
  for (const listener of listeners) listener();
}

export function navigate(route: Route, options: { replace?: boolean } = {}): void {
  const href = hrefFor(route);
  if (options.replace) window.history.replaceState({}, "", href);
  else window.history.pushState({}, "", href);
  notify();
}

export function useRoute(): Route {
  // El snapshot tiene que ser un valor estable o React entra en loop: se cachea la
  // ruta parseada y solo se recalcula cuando cambia el pathname.
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

let cachedPathname = "";
let cachedRoute: Route = { name: "library" };

function getSnapshot(): Route {
  const pathname = window.location.pathname;
  if (pathname !== cachedPathname) {
    cachedPathname = pathname;
    cachedRoute = parse(pathname);
  }
  return cachedRoute;
}

function getServerSnapshot(): Route {
  return { name: "library" };
}
