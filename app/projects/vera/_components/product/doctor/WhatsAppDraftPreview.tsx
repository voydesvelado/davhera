"use client";

import { useState } from "react";
import { ChevronLeft, Video, Phone, Send, Copy, ExternalLink } from "lucide-react";
import { Button } from "../../ui/Button";
import { useToast } from "../../ui/Toast";
import type { Booking } from "../../../_lib/types";

const WHATSAPP_GREEN_LIGHT = "#075E54";

interface WhatsAppDraftPreviewProps {
  booking: Booking;
  message: string;
}

function initialsFromName(name: string): string {
  return name
    .split(" ")
    .filter((p) => p && p[0])
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function WhatsAppDraftPreview({ booking, message }: WhatsAppDraftPreviewProps) {
  const toast = useToast();
  const [draft, setDraft] = useState(message);
  const phoneDigits = booking.patientPhone.replace(/\D/g, "");
  const waUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(draft)}`;

  function copy() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(draft).then(
        () => toast.show({ tone: "success", message: "Mensaje copiado" }),
        () => toast.show({ tone: "warning", message: "No se pudo copiar el mensaje." }),
      );
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          width: "min(80vw, 320px)",
          background: "var(--bg-raised)",
          border: "1px solid var(--rule)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          padding: 8,
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 90,
            height: 22,
            background: "#000",
            borderRadius: 12,
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "relative",
            background: "#ECE5DD",
            borderRadius: "calc(var(--radius-xl) - 4px)",
            overflow: "hidden",
            aspectRatio: "9 / 16",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Status bar (static, white text) */}
          <div
            style={{
              padding: "10px 18px 6px",
              background: WHATSAPP_GREEN_LIGHT,
              minHeight: 28,
            }}
            aria-hidden
          />
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              background: WHATSAPP_GREEN_LIGHT,
              color: "#fff",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            <ChevronLeft size={18} strokeWidth={2.25} color="#fff" />
            <div
              aria-hidden
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {initialsFromName(booking.patientName)}
            </div>
            <div style={{ flex: 1, lineHeight: 1.1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{booking.patientName}</div>
              <div style={{ fontSize: 10, opacity: 0.85 }}>en línea</div>
            </div>
            <Video size={16} strokeWidth={2} color="#fff" />
            <Phone size={16} strokeWidth={2} color="#fff" />
          </div>
          {/* Empty chat body */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#ECE5DD",
              backgroundImage:
                "repeating-linear-gradient(135deg, rgba(0,0,0,0.025) 0 2px, transparent 2px 12px)",
            }}
          />
          {/* Composer */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 6,
              padding: 6,
              background: "#F0F0F0",
            }}
          >
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              style={{
                flex: 1,
                minHeight: 48,
                padding: "8px 10px",
                background: "#fff",
                border: "none",
                borderRadius: 18,
                color: "#111B21",
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: 12.5,
                lineHeight: 1.35,
                resize: "none",
                outline: "none",
              }}
            />
            <div
              aria-hidden
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: WHATSAPP_GREEN_LIGHT,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Send size={14} strokeWidth={2.25} />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "var(--space-2)",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Button size="sm" variant="secondary" onClick={copy}>
          <Copy size={14} strokeWidth={1.75} />
          Copiar mensaje
        </Button>
        <a href={waUrl} target="_blank" rel="noopener noreferrer">
          <Button size="sm">
            <ExternalLink size={14} strokeWidth={1.75} />
            Abrir en WhatsApp
          </Button>
        </a>
      </div>
    </div>
  );
}
