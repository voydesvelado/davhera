import { useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { db } from "../../core/db/schema";
import { exportLibrary, importLibrary } from "../../core/export/zip";
import { getStore, storageEstimate } from "../../app/store";
import { navigate } from "../../app/router";
import { Chip, GhostButton, Pill } from "../../design/components";
import { detectLocale, setLocale, t, type Locale } from "../../i18n";
import { syncAvailable } from "../../core/sync/client";
import { AccountFlow, KeyScreen } from "../account/AccountFlow";
import { relativeTime, useAccount } from "../account/useAccount";

export function SettingsScreen() {
  const strings = t();
  const [busy, setBusy] = useState<"export" | "import" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [storage, setStorage] = useState<{ used: number; quota: number; persisted: boolean } | null>(
    null,
  );
  const fileInput = useRef<HTMLInputElement>(null);

  const count = useLiveQuery(() => db.documents.filter((d) => d.deletedAt === null).count(), [], 0);
  const [locale, setLocaleState] = useState<Locale>(detectLocale());
  const { account, state, syncNow, signOut, deleteAccount } = useAccount();
  const [accountFlow, setAccountFlow] = useState(false);
  const [showingKey, setShowingKey] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    void db.meta.get("locale").then((record) => {
      if (record?.value === "es" || record?.value === "en") {
        setLocaleState(record.value);
        setLocale(record.value);
      }
    });
    void (async () => {
      const estimate = await storageEstimate();
      const persisted = (await navigator.storage?.persisted?.()) ?? false;
      if (estimate) setStorage({ ...estimate, persisted });
    })();
  }, []);

  async function doExport() {
    setBusy("export");
    try {
      const blob = await exportLibrary(db);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `prosa-${new Date().toISOString().slice(0, 10)}.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(null);
    }
  }

  async function doImport(file: File) {
    setBusy("import");
    try {
      const result = await importLibrary(db, await getStore(), file);
      setMessage(
        `${strings.imported(result.documents)}${
          result.skipped > 0 ? ` · ${strings.skipped(result.skipped)}` : ""
        }`,
      );
    } catch (error) {
      setMessage(String(error instanceof Error ? error.message : error));
    } finally {
      setBusy(null);
    }
  }

  const usedPercent =
    storage && storage.quota > 0 ? Math.round((storage.used / storage.quota) * 100) : 0;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[68ch] px-6 py-10">
      <header className="mb-10 flex items-baseline justify-between">
        <h1 className="text-display font-medium">{strings.settings}</h1>
        <GhostButton onClick={() => navigate({ name: "library" })}>{strings.library}</GhostButton>
      </header>

      <Section title={strings.backupTitle}>
        <p className="mb-4 text-secondary text-ink-2">{strings.backupBody}</p>
        <div className="flex flex-wrap items-center gap-3">
          <Pill disabled={busy !== null || count === 0} onClick={() => void doExport()}>
            {busy === "export" ? "…" : strings.exportZip}
          </Pill>
          <GhostButton disabled={busy !== null} onClick={() => fileInput.current?.click()}>
            {busy === "import" ? "…" : strings.importZip}
          </GhostButton>
        </div>
        {message && <p className="mt-3 text-caption text-ink-3">{message}</p>}
        <input
          ref={fileInput}
          type="file"
          accept=".zip,application/zip"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void doImport(file);
          }}
        />
      </Section>

      <Section title={strings.storage}>
        {storage ? (
          <>
            <div className="mb-2 h-[2px] w-full bg-line">
              <div className="h-full bg-ink-2" style={{ width: `${Math.min(100, usedPercent)}%` }} />
            </div>
            <p className="text-caption text-ink-3">
              {formatBytes(storage.used)} / {formatBytes(storage.quota)}
            </p>
            {/* Si el navegador no concedió persistencia, el aviso sube de tono: en
                Safari la biblioteca se puede evaporar a los ~7 días sin visita. */}
            {!storage.persisted && (
              <p className="mt-2 text-secondary text-ink-2">{strings.notPersisted}</p>
            )}
            {usedPercent > 80 && (
              <p className="mt-2 text-secondary text-ink-2">{strings.storageAlmostFull}</p>
            )}
          </>
        ) : (
          <p className="text-caption text-ink-3">{strings.storageUnknown}</p>
        )}
      </Section>

      <Section title={strings.language}>
        <div className="flex gap-2">
          {(["es", "en"] as const).map((value) => (
            <Chip
              key={value}
              selected={locale === value}
              onClick={() => {
                setLocale(value);
                setLocaleState(value);
                void db.meta.put({ key: "locale", value });
              }}
            >
              {value === "es" ? "Español" : "English"}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title={strings.account}>
        {/* Sin API configurada no se ofrece el respaldo: un botón que siempre
            falla es peor que decir que todavía no está. */}
        {!syncAvailable() ? (
          <p className="text-secondary text-ink-2">{strings.accountSoon}</p>
        ) : account ? (
          <div className="flex flex-col gap-4">
            {/* La ÚNICA UI del sync: una fila. Sin spinners, sin badges, sin toasts.
                El respaldo es automático, así que acá se informa — no se pide nada. */}
            <p className="text-secondary text-ink-2">
              @{account.handle} ·{" "}
              {state.status === "syncing"
                ? strings.syncing
                : state.status === "error"
                  ? state.error === "quota_exceeded"
                    ? strings.quotaExceeded
                    : strings.syncErrorGeneric
                  : (relativeTime(state.lastSyncedAt, locale) ?? strings.neverSynced)}
            </p>
            <p className="text-caption text-ink-3">{strings.backupAutomatic}</p>

            <div className="flex flex-wrap gap-3">
              {/* Solo aparece si algo falló: en el camino normal no hay nada que tocar. */}
              {state.status === "error" && (
                <GhostButton onClick={() => syncNow()}>{strings.syncNow}</GhostButton>
              )}
              <GhostButton onClick={() => setShowingKey(true)}>{strings.showKey}</GhostButton>
              <GhostButton onClick={() => void signOut()}>{strings.signOut}</GhostButton>
              <GhostButton onClick={() => setDeleteConfirm("")}>
                {strings.deleteAccount}
              </GhostButton>
            </div>
            <p className="text-caption text-ink-3">{strings.signOutExplainer}</p>

            {deleteConfirm !== null && (
              <div className="flex flex-col gap-2 rounded-s border border-line p-3">
                <p className="text-secondary text-ink-2">
                  {strings.deleteAccountConfirm(`@${account.handle}`)}
                </p>
                <input
                  value={deleteConfirm}
                  onChange={(event) => setDeleteConfirm(event.target.value)}
                  className="rounded-s border border-line bg-transparent px-3 py-2 text-secondary outline-none"
                />
                <div className="flex justify-end gap-3">
                  <GhostButton onClick={() => setDeleteConfirm(null)}>{strings.cancel}</GhostButton>
                  <Pill
                    disabled={deleteConfirm !== `@${account.handle}`}
                    onClick={() => {
                      void deleteAccount();
                      setDeleteConfirm(null);
                    }}
                  >
                    {strings.delete}
                  </Pill>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Pill onClick={() => setAccountFlow(true)}>{strings.backupMyLibrary}</Pill>
        )}
      </Section>

      {accountFlow && (
        <AccountFlow onDone={() => setAccountFlow(false)} onClose={() => setAccountFlow(false)} />
      )}

      {showingKey && account && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            className="absolute inset-0 bg-black/20"
            onMouseDown={() => setShowingKey(false)}
            aria-label={strings.cancel}
          />
          <div className="relative z-10 w-full max-w-md rounded-m border border-line bg-bg p-6">
            {/* Se re-muestra con las MISMAS advertencias: sirve para sumar un
                dispositivo, y el trato no cambia porque sea la segunda vez. */}
            <KeyScreen
              handle={account.handle}
              accessKey={account.key}
              onDone={() => setShowingKey(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10 border-t border-line pt-6">
      <h2 className="mb-3 text-body font-medium">{title}</h2>
      {children}
    </section>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
