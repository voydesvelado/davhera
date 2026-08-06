import { useEffect, useState } from "react";

import { db } from "../../core/db/schema";
import { ApiError, ProsaClient } from "../../core/sync/client";
import { Button } from "../../design/Button";
import { Dialog, DialogActions, DialogTitle } from "../../design/Dialog";
import { t } from "../../i18n";

/**
 * Crear cuenta y entrar desde otro dispositivo.
 *
 * Este es el momento de mayor cuidado de toda la app. Sin email no hay
 * recuperación posible: si alguien pierde la clave, pierde el respaldo, y punto.
 * Por eso la pantalla de la clave tiene la ÚNICA fricción deliberada del producto
 * —cinco segundos y un checkbox— y por eso el texto dice lo que pasa sin
 * eufemismos. Acá se gana o se pierde la confianza.
 */

type Step = "handle" | "key" | "login";

export function AccountFlow({ onDone, onClose }: { onDone: () => void; onClose: () => void }) {
  const strings = t();
  const [step, setStep] = useState<Step>("handle");
  const [handle, setHandle] = useState("");
  const [key, setKey] = useState("");
  const [availability, setAvailability] = useState<{ available: boolean; spots: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Disponibilidad en vivo, con debounce para no castigar al servidor por cada tecla.
  useEffect(() => {
    if (step !== "handle" || !/^[a-z0-9_]{3,20}$/.test(handle)) {
      setAvailability(null);
      return;
    }
    const timer = setTimeout(() => {
      void ProsaClient.available(handle)
        .then((r) => setAvailability({ available: r.available, spots: r.spots_left }))
        .catch(() => setAvailability(null));
    }, 400);
    return () => clearTimeout(timer);
  }, [handle, step]);

  async function create() {
    setBusy(true);
    setError(null);
    try {
      const result = await ProsaClient.createAccount(handle);
      setKey(result.key);
      await db.accountKey.put({ id: "current", handle: result.handle, key: result.key });
      setStep("key");
    } catch (e) {
      setError(
        e instanceof ApiError && e.status === 403
          ? strings.betaFull
          : e instanceof ApiError && e.status === 409
            ? strings.handleTaken
            : strings.accountError,
      );
    } finally {
      setBusy(false);
    }
  }

  async function login() {
    setBusy(true);
    setError(null);
    try {
      const client = new ProsaClient(key.trim());
      const me = await client.me();
      await db.accountKey.put({ id: "current", handle: me.handle, key: key.trim() });
      onDone();
    } catch {
      setError(strings.badKey);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open onClose={onClose} labelledBy="account-title" size="md">
        {step === "handle" && (
          <>
            <DialogTitle id="account-title">{strings.backupMyLibrary}</DialogTitle>
            <p className="mb-6 text-secondary text-ink-2">{strings.handleExplainer}</p>

            <div className="mb-2 flex items-center gap-2 rounded-s border border-line px-3 py-2">
              <span className="text-ink-3">@</span>
              <input
                autoFocus
                value={handle}
                onChange={(event) => setHandle(event.target.value.toLowerCase().replace(/\s/g, ""))}
                placeholder="mariana"
                className="flex-1 bg-transparent text-body outline-none"
              />
            </div>

            <p className="mb-6 min-h-5 text-caption text-ink-3">
              {availability === null
                ? strings.handleRules
                : availability.available
                  ? `${strings.handleFree}${availability.spots <= 20 ? ` · ${strings.spotsLeft(availability.spots)}` : ""}`
                  : strings.handleTaken}
            </p>

            {error && <p className="mb-4 text-secondary text-ink-1">{error}</p>}

            <DialogActions className="justify-between">
              <Button variant="faint" onClick={() => setStep("login")}>
                {strings.haveAccount}
              </Button>
              <Button
                variant="pill"
                size="md"
                disabled={!availability?.available || busy}
                onClick={() => void create()}
              >
                {strings.create}
              </Button>
            </DialogActions>
          </>
        )}

        {step === "key" && <KeyScreen handle={handle} accessKey={key} onDone={onDone} />}

        {step === "login" && (
          <>
            <DialogTitle id="account-title">{strings.haveAccount}</DialogTitle>
            <p className="mb-6 text-secondary text-ink-2">{strings.loginExplainer}</p>
            <input
              autoFocus
              value={key}
              onChange={(event) => setKey(event.target.value.trim())}
              placeholder="prosa-XXXXX-XXXXX-XXXXX-XXXXX"
              className="mb-4 w-full rounded-s border border-line bg-transparent px-3 py-2 font-mono text-secondary outline-none focus:border-ink-3"
            />
            {error && <p className="mb-4 text-secondary text-ink-1">{error}</p>}
            <DialogActions className="justify-between">
              <Button onClick={() => setStep("handle")}>{strings.cancel}</Button>
              <Button
                variant="pill"
                size="md"
                disabled={key.length < 10 || busy}
                onClick={() => void login()}
              >
                {strings.enter}
              </Button>
            </DialogActions>
          </>
        )}
    </Dialog>
  );
}

/**
 * La pantalla de la clave.
 *
 * La fricción es deliberada y es la única de toda la app: el botón está apagado
 * cinco segundos y hace falta marcar el checkbox. No es burocracia — es el único
 * momento en que un descuido de dos segundos le cuesta a alguien su biblioteca.
 */
export function KeyScreen({
  handle,
  accessKey,
  onDone,
}: {
  handle: string;
  accessKey: string;
  onDone: () => void;
}) {
  const strings = t();
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((n) => n - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  function download() {
    const content = [
      `Prosa — clave de acceso de @${handle}`,
      "",
      accessKey,
      "",
      strings.keyFileWarning,
      "",
      "https://davhera.com/prosa",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `prosa-clave-@${handle}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <DialogTitle id="account-title" className="mb-4">{strings.yourKey}</DialogTitle>

      <p className="mb-4 rounded-s border border-line px-4 py-3 text-center font-mono text-body break-all">
        {accessKey}
      </p>

      <div className="mb-6 flex gap-3">
        <Button
          onClick={() => {
            void navigator.clipboard?.writeText(accessKey);
            setCopied(true);
          }}
        >
          {copied ? strings.copied : strings.copy}
        </Button>
        <Button onClick={download}>{strings.downloadKey}</Button>
      </div>

      {/* Sin eufemismos. Si esto no se entiende, alguien va a perder su biblioteca
          y va a ser culpa de este párrafo. */}
      <p className="mb-6 text-secondary text-ink-1">{strings.keyWarning}</p>

      <label className="mb-4 flex items-start gap-3 text-secondary text-ink-2">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => setConfirmed(event.target.checked)}
          className="mt-1"
        />
        <span>{strings.keySaved}</span>
      </label>

      <Button
        variant="pill"
        size="md"
        disabled={!confirmed || secondsLeft > 0}
        onClick={onDone}
        className="w-full"
      >
        {secondsLeft > 0 ? `${strings.understood} (${secondsLeft})` : strings.understood}
      </Button>
    </>
  );
}
