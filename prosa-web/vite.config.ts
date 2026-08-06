import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Prosa Web vive en davhera.com/prosa, no en la raíz ni en un subdominio.
// Todo lo que sigue existe por esa decisión (ver PROSA_WEB_PLAN.md §1):
//
// - base: '/prosa/'         → los assets se referencian con el prefijo correcto.
// - outDir: ../public/prosa → Vercel sirve el dist como estáticos de Next, y el
//                             SPA queda FUERA de app/layout.tsx (sin Analytics,
//                             sin fuentes de Google, sin nada de terceros: la CSP
//                             estricta del spec se cumple por construcción).
// - modulePreload.polyfill  → apagado. El polyfill se inyecta como <script> inline
//                             en el index.html y obligaría a 'unsafe-inline' en
//                             script-src. Los browsers del spec (evergreen, últimos
//                             2 años) no lo necesitan.
export default defineConfig({
  base: "/prosa/",
  plugins: [react()],
  build: {
    outDir: "../public/prosa",
    emptyOutDir: true,
    modulePreload: { polyfill: false },
  },
});
