"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { SearchInput } from "./SearchInput";
import { Kbd } from "./Kbd";

export interface CommandAction {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Visible keyboard hint (e.g. "G H"). Decorative — actual binding is handled by callers. */
  shortcut?: string;
  onSelect: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actions: CommandAction[];
}

function fold(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function CommandPalette({ open, onOpenChange, actions }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return actions;
    const needle = fold(query.trim());
    return actions.filter((a) => fold(a.label).includes(needle));
  }, [query, actions]);

  // Reset selection when filter changes; clamp into bounds.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIdx(0);
  }, [query, open]);

  // Focus input on open, clear query on close.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery("");
  }, [open]);

  function handleKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (filtered.length === 0 ? 0 : (i + 1) % filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (filtered.length === 0 ? 0 : (i - 1 + filtered.length) % filtered.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const action = filtered[activeIdx];
      if (action) {
        onOpenChange(false);
        action.onSelect();
      }
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="vera-cp-backdrop" />
        <Dialog.Popup className="vera-cp-popup">
          <div onKeyDown={handleKey}>
            <SearchInput
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar acciones…"
              style={{
                fontSize: "var(--text-md)",
              }}
            />
            <ul
              ref={listRef}
              role="listbox"
              aria-label="Acciones"
              style={{
                listStyle: "none",
                padding: 0,
                margin: "var(--space-3) 0 0",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxHeight: 360,
                overflowY: "auto",
              }}
            >
              {filtered.length === 0 ? (
                <li
                  style={{
                    padding: "var(--space-6)",
                    textAlign: "center",
                    fontSize: "var(--text-sm)",
                    color: "var(--muted)",
                  }}
                >
                  Sin coincidencias.
                </li>
              ) : (
                filtered.map((action, idx) => {
                  const active = idx === activeIdx;
                  return (
                    <li
                      key={action.id}
                      role="option"
                      aria-selected={active}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => {
                        onOpenChange(false);
                        action.onSelect();
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-3)",
                        padding: "var(--space-2) var(--space-3)",
                        background: active ? "var(--accent-pale)" : "transparent",
                        borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                        borderRadius: "var(--radius-sm)",
                        color: active ? "var(--accent)" : "var(--ink)",
                        fontSize: "var(--text-sm)",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          display: "inline-flex",
                          width: 18,
                          color: active ? "var(--accent)" : "var(--muted)",
                        }}
                      >
                        {action.icon}
                      </span>
                      <span style={{ flex: 1 }}>{action.label}</span>
                      {action.shortcut ? <Kbd>{action.shortcut}</Kbd> : null}
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          <style>{`
            .vera-cp-backdrop {
              position: fixed; inset: 0; z-index: 80;
              background: oklch(0.15 0.005 250 / 0.5);
              backdrop-filter: blur(8px);
              -webkit-backdrop-filter: blur(8px);
              opacity: 0;
              transition: opacity var(--dur-base) var(--ease-snap);
            }
            .vera-cp-backdrop[data-open] { opacity: 1; }
            .vera-cp-backdrop[data-starting-style], .vera-cp-backdrop[data-ending-style] { opacity: 0; }

            .vera-cp-popup {
              position: fixed; z-index: 81;
              top: 18%; left: 50%;
              transform: translate(-50%, calc(-10px));
              width: calc(100vw - 32px);
              max-width: 480px;
              background: var(--bg-overlay);
              border: 1px solid var(--rule);
              border-radius: var(--radius-lg);
              box-shadow: var(--shadow-xl);
              padding: var(--space-3);
              opacity: 0;
              transition: opacity var(--dur-snap) var(--ease-snap),
                          transform var(--dur-snap) var(--ease-snap);
            }
            .vera-cp-popup[data-open] { opacity: 1; transform: translate(-50%, 0); }
            .vera-cp-popup[data-starting-style],
            .vera-cp-popup[data-ending-style] { opacity: 0; transform: translate(-50%, calc(-10px)); }
          `}</style>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
