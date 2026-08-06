import { useRoute } from "./app/router";
import { useTheme } from "./app/useTheme";
import { LibraryScreen } from "./features/library/LibraryScreen";
import { ReaderScreen } from "./features/reader/ReaderScreen";
import { SettingsScreen } from "./features/settings/SettingsScreen";

export function App() {
  const route = useRoute();
  const theme = useTheme();

  switch (route.name) {
    case "reader":
      return <ReaderScreen documentId={route.documentId} />;
    case "settings":
      return <SettingsScreen />;
    default:
      return <LibraryScreen theme={theme} />;
  }
}

