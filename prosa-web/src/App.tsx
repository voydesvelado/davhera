import { useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { db } from "./core/db/schema";
import { navigate, useRoute } from "./app/router";
import { getStore } from "./app/store";
import { useTheme } from "./app/useTheme";
import { LibraryScreen } from "./features/library/LibraryScreen";
import { GhostButton } from "./design/components";
import { t } from "./i18n";

export function App() {
  const route = useRoute();
  const theme = useTheme();

  switch (route.name) {
    case "reader":
      return <ReaderPlaceholder documentId={route.documentId} />;
    case "settings":
      return <SettingsPlaceholder />;
    default:
      return <LibraryScreen theme={theme} />;
  }
}

/**
 * M3 reemplaza esto por el lector de verdad. Por ahora abre el documento, marca
 * `lastOpenedAt` y muestra el texto crudo — suficiente para verificar que la
 * biblioteca guarda y recupera bien lo que importa.
 */
function ReaderPlaceholder({ documentId }: { documentId: string }) {
  const strings = t();
  const doc = useLiveQuery(() => db.documents.get(documentId), [documentId]);
  const content = useLiveQuery(() => db.contents.get(documentId), [documentId]);

  useEffect(() => {
    void getStore().then((store) => store.markOpened(documentId));
  }, [documentId]);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[68ch] px-6 py-10">
      <GhostButton onClick={() => navigate({ name: "library" })}>{strings.library}</GhostButton>
      <h1 className="mt-8 font-serif text-display">{doc?.title}</h1>
      <pre className="mt-6 whitespace-pre-wrap font-serif text-[18px] leading-[1.55] text-ink-1">
        {content?.markdown}
      </pre>
    </main>
  );
}

function SettingsPlaceholder() {
  const strings = t();
  return (
    <main className="mx-auto min-h-dvh w-full max-w-[68ch] px-6 py-10">
      <GhostButton onClick={() => navigate({ name: "library" })}>{strings.library}</GhostButton>
    </main>
  );
}
