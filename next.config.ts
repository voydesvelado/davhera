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
  async rewrites() {
    // 'afterFiles' es la clave: se evalúa DESPUÉS de servir los archivos reales de
    // public/, así que /prosa/assets/*.js sale como asset y solo las rutas del
    // router del SPA caen al index.html. Con 'beforeFiles' se romperían los assets.
    return {
      beforeFiles: [],
      afterFiles: [
        { source: "/prosa", destination: "/prosa/index.html" },
        { source: "/prosa/:path*", destination: "/prosa/index.html" },
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
      {
        source: "/prosa",
        headers: [{ key: "Cache-Control", value: "no-cache" }],
      },
      {
        source: "/prosa/:path((?!assets/).*)",
        headers: [{ key: "Cache-Control", value: "no-cache" }],
      },
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
