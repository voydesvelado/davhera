import { navigate, useRoute } from "./app/router";
import { useTheme } from "./app/useTheme";
import { LibraryScreen } from "./features/library/LibraryScreen";
import { ReaderScreen } from "./features/reader/ReaderScreen";
import { GhostButton } from "./design/components";
import { t } from "./i18n";

export function App() {
  const route = useRoute();
  const theme = useTheme();

  switch (route.name) {
    case "reader":
      return <ReaderScreen documentId={route.documentId} />;
    case "settings":
      return <SettingsPlaceholder />;
    default:
      return <LibraryScreen theme={theme} />;
  }
}

/** M4 la reemplaza por Settings de verdad (export/import zip, i18n, cuenta). */
function SettingsPlaceholder() {
  const strings = t();
  return (
    <main className="mx-auto min-h-dvh w-full max-w-[68ch] px-6 py-10">
      <GhostButton onClick={() => navigate({ name: "library" })}>{strings.library}</GhostButton>
    </main>
  );
}
