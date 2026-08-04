import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// next-intl: apunta al request config del subsitio Saira.
// El plugin no afecta otras rutas; sólo expone el resolver de messages.
const withNextIntl = createNextIntlPlugin(
  "./app/proyectos/saira/lib/i18n/request.ts",
);

const nextConfig: NextConfig = {
  // /handlhealth sirve el deck estático de public/. Va como archivo suelto y no
  // como ruta de React porque el deck controla <body> (overflow, data-mode) y
  // eso choca con el root layout.
  async rewrites() {
    return [{ source: "/handlhealth", destination: "/handlhealth.html" }];
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
