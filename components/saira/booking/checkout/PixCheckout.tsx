"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import {
  useBooking,
  snapshotBooking,
  CONFIRMED_BOOKING_KEY,
} from "@/lib/saira/booking/context";
import { useSairaRouter } from "@/app/proyectos/saira/lib/i18n/client-nav";

// "Código Pix" decorativo: parece un BR Code real pero NO procesa nada.
// El usuario puede copiarlo; nada pasa con él.
const PIX_CODE =
  "00020126360014BR.GOV.BCB.PIX0114+5521977086637520400005303986540510.005802BR5913SAIRA ECOTOUR6009SAO PAULO62070503***6304";

const COUNTDOWN_MINUTES = 15;
const PROCESSING_MS = 2500;

export function PixCheckout() {
  const t = useTranslations("checkout.pix");
  const { state, dispatch } = useBooking();
  const router = useSairaRouter();
  const [copied, setCopied] = useState(false);
  const [seconds, setSeconds] = useState(COUNTDOWN_MINUTES * 60);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(PIX_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // En contextos no-secure (http) clipboard puede fallar; ignorar silenciosamente.
    }
  };

  const handleConfirm = () => {
    if (state.phase === "processing") return;
    dispatch({ type: "START_PROCESSING" });
    setTimeout(() => {
      sessionStorage.setItem(
        CONFIRMED_BOOKING_KEY,
        JSON.stringify(snapshotBooking(state, "pix")),
      );
      router.push("/reserva/confirmada");
    }, PROCESSING_MS);
  };

  const expired = seconds <= 0;
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toString().padStart(2, "0");

  return (
    <motion.div
      className="saira-pix"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="saira-pix-qr">
        <PixQRMock />
      </div>

      <div className="saira-pix-info">
        <p className="saira-pix-instruction">{t("instruction")}</p>

        <div className="saira-pix-code">
          <code className="saira-pix-code-text">
            {PIX_CODE.slice(0, 56)}…
          </code>
          <button
            type="button"
            className="saira-pix-copy-btn"
            onClick={copyCode}
            aria-label={t("copy")}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? t("copied") : t("copy")}</span>
          </button>
        </div>

        <div className="saira-pix-countdown">
          <span className="saira-pix-countdown-label">
            {expired ? t("expired") : t("expiresIn")}
          </span>
          <span
            className={
              "saira-pix-countdown-value" + (expired ? " is-expired" : "")
            }
          >
            {expired
              ? "00:00"
              : `${mins.toString().padStart(2, "0")}:${secs}`}
          </span>
        </div>

        <button
          type="button"
          className="saira-btn saira-btn-primary saira-btn-lg saira-pix-confirm"
          onClick={handleConfirm}
          disabled={state.phase === "processing"}
        >
          {state.phase === "processing" ? (
            <>
              <span className="saira-spinner" aria-hidden="true" />
              <span>{t("processing")}</span>
            </>
          ) : (
            t("confirmManually")
          )}
        </button>

        <p className="saira-pix-note">{t("note")}</p>
      </div>
    </motion.div>
  );
}

// QR decorativo. NO es escaneable. Tres marcadores en las esquinas + pattern
// determinista (semilla simple) para que se vea como un QR genuino.
function PixQRMock() {
  const cells: Array<{ row: number; col: number }> = [];
  for (let row = 0; row < 25; row++) {
    for (let col = 0; col < 25; col++) {
      // Saltar las áreas donde van los markers grandes
      const inMarker =
        (row < 7 && col < 7) ||
        (row < 7 && col > 17) ||
        (row > 17 && col < 7);
      if (inMarker) continue;
      const seed = (row * 17 + col * 31 + row * col) % 7;
      if (seed >= 4) cells.push({ row, col });
    }
  }

  return (
    <svg
      viewBox="0 0 200 200"
      className="saira-pix-qr-svg"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="QR code Pix (demo)"
    >
      <rect width="200" height="200" fill="#FFFFFF" />
      {cells.map(({ row, col }) => (
        <rect
          key={`${row}-${col}`}
          x={col * 8}
          y={row * 8}
          width="8"
          height="8"
          fill="#1F2A24"
        />
      ))}
      {[
        { x: 0, y: 0 },
        { x: 144, y: 0 },
        { x: 0, y: 144 },
      ].map((pos, i) => (
        <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
          <rect width="56" height="56" fill="#FFFFFF" />
          <rect
            x="4"
            y="4"
            width="48"
            height="48"
            fill="none"
            stroke="#1F2A24"
            strokeWidth="8"
          />
          <rect x="16" y="16" width="24" height="24" fill="#1F2A24" />
        </g>
      ))}
    </svg>
  );
}
