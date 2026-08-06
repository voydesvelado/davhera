import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { db } from "../../core/db/schema";
import { navigate } from "../../app/router";
import { Button } from "../../design/Button";
import { t } from "../../i18n";

const DISMISSED_KEY = "storageBannerDismissed";

/**
 * El banner honesto. Aparece UNA vez, después del primer import, y se puede
 * descartar para siempre.
 *
 * No es un detalle legal ni una cobertura: es la única forma decente de decirle a
 * alguien que su biblioteca vive en un navegador y que un "borrar datos del sitio"
 * se la lleva. Prometer respaldo sin cuenta sería mentir; callarse, peor.
 *
 * Y por eso mismo NO se le muestra a quien ya tiene cuenta: para esa persona la
 * frase es lisa y llanamente falsa —su biblioteca ya está respaldada y se
 * sincroniza sola— y le pide hacer justo lo que acaba de hacer. Un aviso que no
 * aplica enseña a ignorar todos los demás.
 */
export function StorageBanner({ hasDocuments }: { hasDocuments: boolean }) {
  const strings = t();
  const [dismissed, setDismissed] = useState<boolean | null>(null);
  // `toArray()` y no `get("current")`: `get` devuelve undefined tanto mientras
  // carga como cuando NO hay cuenta, así que no se pueden distinguir y el banner
  // no aparecería nunca. Una lista sí: undefined mientras carga, [] si no hay.
  const accounts = useLiveQuery(() => db.accountKey.toArray(), []);

  useEffect(() => {
    void db.meta.get(DISMISSED_KEY).then((record) => setDismissed(Boolean(record)));
  }, []);

  // Mientras la consulta no resuelve no se muestra nada: aparecer y desaparecer
  // sería peor que tardar un instante.
  if (!hasDocuments || dismissed !== false || accounts === undefined || accounts.length > 0) {
    return null;
  }

  return (
    <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-s border border-line px-4 py-3">
      <p className="flex-1 text-secondary text-ink-2">{strings.storageBanner}</p>
      <Button
        variant="quiet"
        size="none"
        onClick={() => navigate({ name: "settings" })}
        className="text-secondary underline underline-offset-4"
      >
        {strings.storageBackup}
      </Button>
      <Button
        variant="faint"
        size="none"
        className="text-secondary"
        onClick={() => {
          void db.meta.put({ key: DISMISSED_KEY, value: true });
          setDismissed(true);
        }}
      >
        {strings.dismiss}
      </Button>
    </div>
  );
}
