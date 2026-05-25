import "./styles/tokens.css";
import "./styles/base.css";
import { fraunces, geist, geistMono } from "./lib/fonts";

// Script inline que aplica `saira-dark` antes del primer paint para evitar FOUC.
// Lee `prefers-color-scheme`. El toggle manual viene en una wave posterior.
const darkModeInitScript = `
(function() {
  try {
    var root = document.currentScript && document.currentScript.parentElement;
    if (!root) return;
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) root.classList.add('saira-dark');
  } catch (e) {}
})();
`;

export default function SairaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`saira ${fraunces.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <script dangerouslySetInnerHTML={{ __html: darkModeInitScript }} />
      {children}
    </div>
  );
}
