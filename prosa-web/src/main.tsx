import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LazyMotion } from "framer-motion";
import "./design/tokens.css";
import { App } from "./App";
import { loadMotionFeatures } from "./design/springs";
import { registerServiceWorker, seedSampleDocument } from "./app/bootstrap";
import { startSyncRuntime } from "./app/syncRuntime";

// M0: el tema sigue al sistema. En M4 esto pasa al sheet Aa (claro/sepia/gris/negro),
// que solo cambia CSS variables — por eso el crossfade sale gratis.
const dark = window.matchMedia("(prefers-color-scheme: dark)");
const applyTheme = () =>
  document.documentElement.setAttribute("data-theme", dark.matches ? "dark" : "light");
applyTheme();
dark.addEventListener("change", applyTheme);

void seedSampleDocument();
registerServiceWorker();
// El sync arranca con la app, no con la pantalla de Ajustes: tener cuenta tiene
// que significar que el respaldo ocurre solo, se esté donde se esté.
startSyncRuntime();

const root = document.getElementById("root");
if (!root) throw new Error("#root no existe en index.html");

createRoot(root).render(
  <StrictMode>
    {/* strict: usar `motion.div` en vez de `m.div` tira error en desarrollo, que es
        lo único que evita que la optimización del bundle se deshaga sola. */}
    <LazyMotion strict features={loadMotionFeatures}>
      <App />
    </LazyMotion>
  </StrictMode>,
);
