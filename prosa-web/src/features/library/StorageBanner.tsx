import { useEffect, useState } from "react";

import { db } from "../../core/db/schema";
import { navigate } from "../../app/router";
import { t } from "../../i18n";

const DISMISSED_KEY = "storageBannerDismissed";

/**
 * El banner honesto. Aparece UNA vez, después del primer import, y se puede
 * descartar para siempre.
 *
 * No es un detalle legal ni una cobertura: es la única forma decente de decirle a
 * alguien que su biblioteca vive en un navegador y que un "borrar datos del sitio"
 * se la lleva. Prometer respaldo sin cuenta sería mentir; callarse, peor.
 */
export function StorageBanner({ hasDocuments }: { hasDocuments: boolean }) {
  const strings = t();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasDocuments) return;
    void db.meta.get(DISMISSED_KEY).then((record) => {
      if (!record) setVisible(true);
    });
  }, [hasDocuments]);

  if (!visible) return null;

  return (
    <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-s border border-line px-4 py-3">
      <p className="flex-1 text-secondary text-ink-2">{strings.storageBanner}</p>
      <button
        onClick={() => navigate({ name: "settings" })}
        className="text-secondary text-ink-1 underline underline-offset-4"
      >
        {strings.storageExport}
      </button>
      <button
        onClick={() => {
          void db.meta.put({ key: DISMISSED_KEY, value: true });
          setVisible(false);
        }}
        className="text-secondary text-ink-3 hover:text-ink-1"
      >
        {strings.dismiss}
      </button>
    </div>
  );
}
