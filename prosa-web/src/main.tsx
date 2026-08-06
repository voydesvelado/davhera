import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./design/tokens.css";
import { App } from "./App";

// M0: el tema sigue al sistema. En M4 esto pasa al sheet Aa (claro/sepia/gris/negro),
// que solo cambia CSS variables — por eso el crossfade sale gratis.
const dark = window.matchMedia("(prefers-color-scheme: dark)");
const applyTheme = () =>
  document.documentElement.setAttribute("data-theme", dark.matches ? "dark" : "light");
applyTheme();
dark.addEventListener("change", applyTheme);

const root = document.getElementById("root");
if (!root) throw new Error("#root no existe en index.html");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
