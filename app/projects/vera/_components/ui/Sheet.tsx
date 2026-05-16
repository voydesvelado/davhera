"use client";

import { Dialog } from "@base-ui/react/dialog";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "./IconButton";

type SheetSize = "sm" | "md" | "lg";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  size?: SheetSize;
  children: ReactNode;
  /** When true (default), renders a close icon in the top-right. */
  showClose?: boolean;
}

export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  size = "md",
  children,
  showClose = true,
}: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="vera-sheet-backdrop" />
        <Dialog.Popup className="vera-sheet-popup" data-size={size}>
          <div className="vera-sheet-handle" aria-hidden />
          {showClose ? (
            <div
              style={{
                position: "absolute",
                top: "var(--space-3)",
                right: "var(--space-3)",
                zIndex: 1,
              }}
            >
              <Dialog.Close render={<IconButton aria-label="Cerrar"><X size={16} strokeWidth={1.75} /></IconButton>} />
            </div>
          ) : null}
          <div className="vera-sheet-body">
            {title ? (
              <Dialog.Title
                className="vera-sheet-title"
                style={{
                  fontSize: "var(--text-2xl)",
                  fontWeight: 600,
                  letterSpacing: "var(--tracking-snug)",
                  margin: 0,
                  color: "var(--ink)",
                }}
              >
                {title}
              </Dialog.Title>
            ) : null}
            {description ? (
              <Dialog.Description
                className="vera-sheet-description"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--muted)",
                  marginTop: "var(--space-2)",
                  marginBottom: 0,
                }}
              >
                {description}
              </Dialog.Description>
            ) : null}
            <div style={{ marginTop: title || description ? "var(--space-5)" : 0 }}>{children}</div>
          </div>

          <style>{`
            .vera-sheet-backdrop {
              position: fixed;
              inset: 0;
              background: oklch(0.15 0.005 250 / 0.5);
              backdrop-filter: blur(8px);
              -webkit-backdrop-filter: blur(8px);
              opacity: 0;
              transition: opacity var(--dur-base) var(--ease-snap);
              z-index: 50;
            }
            .vera-sheet-backdrop[data-open] { opacity: 1; }
            .vera-sheet-backdrop[data-starting-style] { opacity: 0; }
            .vera-sheet-backdrop[data-ending-style] { opacity: 0; }

            .vera-sheet-popup {
              position: fixed;
              left: 0;
              right: 0;
              bottom: 0;
              background: var(--bg-raised);
              border-top: 1px solid var(--rule);
              border-radius: var(--radius-lg) var(--radius-lg) 0 0;
              box-shadow: var(--shadow-xl);
              max-height: 90vh;
              overflow-y: auto;
              z-index: 51;
              opacity: 0;
              transform: translateY(20px);
              transition: opacity var(--dur-snap) var(--ease-snap),
                          transform var(--dur-snap) var(--ease-snap);
            }
            .vera-sheet-popup[data-open] { opacity: 1; transform: translateY(0); }
            .vera-sheet-popup[data-starting-style] { opacity: 0; transform: translateY(20px); }
            .vera-sheet-popup[data-ending-style] { opacity: 0; transform: translateY(20px); }

            .vera-sheet-handle {
              width: 36px;
              height: 4px;
              background: var(--rule-strong);
              border-radius: var(--radius-pill);
              margin: var(--space-3) auto var(--space-2);
            }

            .vera-sheet-body {
              padding: var(--space-4) var(--space-5) var(--space-8);
            }

            @media (min-width: 768px) {
              .vera-sheet-popup {
                top: 50%;
                left: 50%;
                right: auto;
                bottom: auto;
                width: calc(100vw - 48px);
                max-width: 560px;
                border: 1px solid var(--rule);
                border-radius: var(--radius-lg);
                transform: translate(-50%, calc(-50% + 12px));
              }
              .vera-sheet-popup[data-size="sm"] { max-width: 400px; }
              .vera-sheet-popup[data-size="lg"] { max-width: 720px; }
              .vera-sheet-popup[data-open] {
                transform: translate(-50%, -50%);
              }
              .vera-sheet-popup[data-starting-style],
              .vera-sheet-popup[data-ending-style] {
                transform: translate(-50%, calc(-50% + 12px));
              }
              .vera-sheet-handle { display: none; }
              .vera-sheet-body {
                padding: var(--space-6) var(--space-6) var(--space-6);
              }
            }
          `}</style>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
