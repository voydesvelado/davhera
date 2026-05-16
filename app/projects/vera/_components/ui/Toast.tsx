"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CircleCheck, TriangleAlert, CircleAlert, Info, X } from "lucide-react";

export type ToastTone = "default" | "success" | "warning" | "danger";

export interface Toast {
  id: string;
  tone: ToastTone;
  message: string;
  durationMs?: number;
}

interface ToastContextValue {
  show: (toast: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 4000;

function nextId(): string {
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

const TONE_COLORS: Record<ToastTone, { fg: string; border: string; icon: ReactNode }> = {
  default: {
    fg: "var(--ink)",
    border: "var(--rule)",
    icon: <Info size={16} strokeWidth={1.75} />,
  },
  success: {
    fg: "var(--success)",
    border: "var(--success)",
    icon: <CircleCheck size={16} strokeWidth={1.75} />,
  },
  warning: {
    fg: "var(--warning)",
    border: "var(--warning)",
    icon: <TriangleAlert size={16} strokeWidth={1.75} />,
  },
  danger: {
    fg: "var(--danger)",
    border: "var(--danger)",
    icon: <CircleAlert size={16} strokeWidth={1.75} />,
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((cur) => cur.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = nextId();
      const full: Toast = { id, ...toast };
      setToasts((cur) => [...cur, full]);
      const duration = toast.durationMs ?? DEFAULT_DURATION;
      const timer = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
      return id;
    },
    [dismiss],
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="vera-toast-region"
        style={{
          position: "fixed",
          top: "var(--space-4)",
          right: "var(--space-4)",
          left: "var(--space-4)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
          alignItems: "center",
          pointerEvents: "none",
          zIndex: 100,
        }}
      >
        {toasts.map((t) => {
          const color = TONE_COLORS[t.tone];
          return (
            <div
              key={t.id}
              role="status"
              className="vera-toast"
              style={{
                pointerEvents: "auto",
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-3)",
                background: "var(--bg-raised)",
                color: "var(--ink)",
                border: `1px solid ${color.border}`,
                borderLeftWidth: "3px",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-md)",
                padding: "var(--space-3) var(--space-4)",
                fontSize: "var(--text-sm)",
                maxWidth: "440px",
              }}
            >
              <span style={{ color: color.fg, display: "inline-flex" }}>{color.icon}</span>
              <span style={{ flex: 1 }}>{t.message}</span>
              <button
                aria-label="Cerrar notificación"
                onClick={() => dismiss(t.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 22,
                  height: 22,
                  background: "transparent",
                  color: "var(--muted)",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                }}
              >
                <X size={14} strokeWidth={1.75} />
              </button>
            </div>
          );
        })}
        <style>{`
          @media (min-width: 640px) {
            .vera-toast-region {
              left: auto !important;
              align-items: flex-end !important;
            }
          }
          .vera-toast {
            animation: vera-toast-in var(--dur-base) var(--ease-snap);
          }
          @keyframes vera-toast-in {
            from { opacity: 0; transform: translateY(-12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @media (prefers-reduced-motion: reduce) {
            .vera-toast { animation: none; }
          }
        `}</style>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      show: () => "",
      dismiss: () => {},
    };
  }
  return ctx;
}
