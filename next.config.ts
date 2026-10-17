import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// next-intl: apunta al request config del subsitio Saira.
// El plugin no afecta otras rutas; sólo expone el resolver de messages.
const withNextIntl = createNextIntlPlugin(
  "./app/proyectos/saira/lib/i18n/request.ts",
);

// Prosa Web (davhera.com/prosa) es un SPA de Vite que se buildea a public/prosa/.
// No pasa por app/layout.tsx: sin Analytics, sin fuentes de Google, sin terceros.
const PROSA_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  // Los temas de lectura cambian CSS variables en vivo; es la única concesión
  // y no hay HTML de terceros en la página.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://public.46.225.147.90.sslip.io https://api.prosa.davhera.com",
  "worker-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join("; ");

const nextConfig: NextConfig = {
  // El portafolio del VPS usa URLs con barra final (/finerio/); sin esto Next la quita y el VPS la repone: bucle 308.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    // 'afterFiles' es la clave: se evalúa DESPUÉS de servir los archivos reales de
    // public/, así que /prosa/assets/*.js sale como asset y solo las rutas del
    // router del SPA caen al index.html. Con 'beforeFiles' se romperían los assets.
    return {
      beforeFiles: [
        // davhera.com/games = la guía "Rehaz tus juegos con IA" (landing + Stripe + guía),
        // que vive en el VPS (repo ~/dev/guia-juegos). Proxy transparente: el server sabe
        // que está montado en /games (BASE_URL) y genera todos sus links con ese prefijo.
        { source: "/games", destination: "https://guia.46.225.147.90.sslip.io/games" },
        { source: "/games/:path*", destination: "https://guia.46.225.147.90.sslip.io/games/:path*" },
        // Prosa Cloud por davhera.com. Algunos ISP (visto en Vivo, oct 2026) no enrutan el
        // bloque 46.225.x.x de Hetzner: desde esas redes el VPS no existe, pero Vercel sí
        // llega. La app de iPhone usa /personal siempre; la web va directa a /public y
        // solo cae a este proxy si la directa no contesta (src/core/sync/client.ts).
        { source: "/prosa-api/personal/:path*", destination: "https://46.225.147.90.sslip.io/:path*" },
        { source: "/prosa-api/public/:path*", destination: "https://public.46.225.147.90.sslip.io/:path*" },
        // 2026-10-17: davhera.com ahora es el portafolio estático en el VPS (Caddy, /srv/portfolio).
        // Quien todavía resuelva davhera.com a Vercel (DNS en caché) recibe el portafolio nuevo
        // por este proxy, en vez del sitio viejo.
        { source: "/", destination: "https://davhera.46.225.147.90.sslip.io/" },
        { source: "/:path*", destination: "https://davhera.46.225.147.90.sslip.io/:path*" },
      ],
      afterFiles: [
        { source: "/prosa", destination: "/prosa/index.html" },
        { source: "/prosa/:path*", destination: "/prosa/index.html" },
        // El wireflow de ClearPath es un canvas estático que fija
        // html,body{height:100%;overflow:hidden} y maneja su propio pan/zoom.
        // Va como archivo suelto de public/, no como ruta de React, porque el
        // root layout le rompería el <body>.
        { source: "/clearpath-flow", destination: "/clearpath-flow.html" },
        // /handlhealth sirve el deck estático de public/. Va como archivo suelto
        // y no como ruta de React porque el deck controla <body> (overflow,
        // data-mode) y eso choca con el root layout.
        { source: "/handlhealth", destination: "/handlhealth.html" },
      ],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: "/prosa/:path*",
        headers: [
          { key: "Content-Security-Policy", value: PROSA_CSP },
          // Permite que el service worker de /prosa/sw.js controle todo /prosa/.
          { key: "Service-Worker-Allowed", value: "/prosa/" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "same-origin" },
        ],
      },
      // Assets hasheados por Vite: cachean para siempre, cambian de nombre al cambiar.
      {
        source: "/prosa/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // El shell y el SW se revalidan SIEMPRE. Un index.html pegado en el CDN
      // apuntaría a hashes de assets que ya no existen: pantalla en blanco.
      // Los headers se evalúan contra la ruta PEDIDA, no contra el destino del
      // rewrite — por eso el match es sobre /prosa/* excluyendo assets/, y no
      // sobre /prosa/index.html (que nunca se pide directo).
      //
      // `Cache-Control: no-cache` a secas NO alcanza: le habla al navegador, pero
      // el edge de Vercel igual cachea y devuelve HIT. Medido en producción, el
      // shell se sirvió 5 horas después de un deploy, así que los cambios no
      // llegaban a nadie que ya hubiera entrado. `CDN-Cache-Control` es lo que
      // mira el edge; el `Vercel-` es el que gana en Vercel específicamente.
      ...[{ path: "/prosa" }, { path: "/prosa/:path((?!assets/).*)" }].map(({ path }) => ({
        source: path,
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "CDN-Cache-Control", value: "no-store" },
          { key: "Vercel-CDN-Cache-Control", value: "no-store" },
        ],
      })),
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "rvivezcozdjpgkwqgroq.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
