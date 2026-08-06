/**
 * Service worker de Prosa.
 *
 * Escrito a mano en vez de con Workbox, por dos razones: son cuarenta líneas, y
 * Workbox habría metido su runtime en un bundle que ya pelea por 150KB.
 *
 * Lo que cachea es SOLO el shell (html, js, css, iconos). Los ensayos NO pasan por
 * acá: viven en IndexedDB, así que la lectura offline está garantizada sin que el
 * service worker sepa nada de ellos.
 *
 * Scope: /prosa/. No puede tocar el resto de davhera.com ni por error.
 */

const CACHE = "prosa-shell-v1";
const SHELL = "/prosa/index.html";

self.addEventListener("install", (event) => {
  // El shell se precachea al instalar; los assets hasheados entran al vuelo.
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll([SHELL, "/prosa/manifest.webmanifest", "/prosa/icon.svg"]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith("/prosa/")) return;

  // Navegaciones: red primero para que un deploy nuevo se vea enseguida, con el
  // shell cacheado como red de contención cuando no hay internet.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          void caches.open(CACHE).then((cache) => cache.put(SHELL, copy));
          return response;
        })
        .catch(() => caches.match(SHELL).then((cached) => cached ?? Response.error())),
    );
    return;
  }

  // Assets: cache primero. Sus nombres llevan hash, así que un cambio trae otro
  // nombre y nunca se sirve una versión vieja.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ??
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            void caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
    ),
  );
});
