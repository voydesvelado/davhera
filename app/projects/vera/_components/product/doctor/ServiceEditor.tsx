"use client";

import { useState, useRef, useEffect } from "react";
import { Trash, GripVertical } from "lucide-react";
import { Input } from "../../ui/Input";
import { Textarea } from "../../ui/Textarea";
import { Switch } from "../../ui/Switch";
import { KebabMenu } from "../../ui/KebabMenu";
import { useEphemeralSave } from "../../ui/EphemeralSaveToast";

export interface EditableService {
  id: string;
  name: string;
  durationMin: number;
  priceMxn: number;
  description: string;
  active: boolean;
}

interface ServiceEditorProps {
  service: EditableService;
  onChange: (next: EditableService) => void;
  onDelete: () => void;
  autoFocusName?: boolean;
}

export function ServiceEditor({ service, onChange, onDelete, autoFocusName }: ServiceEditorProps) {
  const [editingName, setEditingName] = useState(autoFocusName ?? false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const ephemeral = useEphemeralSave();

  useEffect(() => {
    if (editingName) {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    }
  }, [editingName]);

  function update<K extends keyof EditableService>(key: K, value: EditableService[K]) {
    onChange({ ...service, [key]: value });
    ephemeral.notify();
  }

  return (
    <article
      className="vera-svc-editor"
      style={{
        position: "relative",
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-4) var(--space-5)",
        opacity: service.active ? 1 : 0.7,
      }}
    >
      {/* Drag handle (desktop only, on hover) */}
      <span
        aria-hidden
        className="vera-svc-drag"
        style={{
          position: "absolute",
          left: 4,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--ink-faint)",
          opacity: 0,
          transition: "opacity var(--dur-quick) var(--ease-snap)",
          cursor: "grab",
        }}
      >
        <GripVertical size={16} strokeWidth={1.5} />
      </span>

      {/* Kebab (always present, visible on hover) */}
      <span
        className="vera-svc-kebab"
        style={{
          position: "absolute",
          right: 4,
          top: 4,
          opacity: 0,
          transition: "opacity var(--dur-quick) var(--ease-snap)",
        }}
      >
        <KebabMenu
          items={[
            {
              label: "Eliminar servicio",
              destructive: true,
              icon: <Trash size={14} strokeWidth={1.75} />,
              onClick: onDelete,
            },
          ]}
        />
      </span>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {editingName ? (
          <Input
            ref={nameInputRef}
            value={service.name}
            placeholder="Nombre del servicio"
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => setEditingName(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setEditingName(false);
            }}
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 600,
              height: 40,
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditingName(true)}
            style={{
              all: "unset",
              cursor: "text",
              fontSize: "var(--text-xl)",
              fontWeight: 600,
              color: service.name ? "var(--ink)" : "var(--muted)",
              fontFamily: "var(--font-geist), system-ui, sans-serif",
            }}
          >
            {service.name || "Nombre del servicio"}
          </button>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px 160px 1fr",
            gap: "var(--space-3)",
            alignItems: "center",
          }}
          className="vera-svc-meta"
        >
          <DurationField value={service.durationMin} onChange={(v) => update("durationMin", v)} />
          <PriceField value={service.priceMxn} onChange={(v) => update("priceMxn", v)} />
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              fontSize: "var(--text-sm)",
              color: "var(--ink-soft)",
              justifySelf: "end",
            }}
          >
            <Switch
              checked={service.active}
              onCheckedChange={(c) => update("active", c)}
              label="Activo"
            />
            Activo
          </label>
        </div>

        <Textarea
          value={service.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Describe brevemente este servicio…"
          rows={2}
          style={{ minHeight: 60 }}
        />
      </div>

      <style>{`
        .vera-svc-editor:hover .vera-svc-drag,
        .vera-svc-editor:hover .vera-svc-kebab { opacity: 1; }
        @media (max-width: 640px) {
          .vera-svc-meta {
            grid-template-columns: 1fr 1fr !important;
          }
          .vera-svc-meta label { grid-column: 1 / -1; justify-self: start !important; }
          .vera-svc-kebab { opacity: 1 !important; }
        }
      `}</style>
    </article>
  );
}

function DurationField({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        height: "var(--field-height-base)",
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-sm)",
        overflow: "hidden",
      }}
    >
      <input
        type="number"
        min={5}
        step={5}
        value={value || ""}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        style={{
          flex: 1,
          minWidth: 0,
          padding: "0 var(--space-3)",
          background: "transparent",
          border: "none",
          outline: "none",
          fontSize: "var(--text-base)",
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          color: "var(--ink)",
          fontFeatureSettings: '"tnum" 1',
          textAlign: "right",
        }}
      />
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "0 var(--space-2)",
          background: "var(--bg-sunken)",
          color: "var(--muted)",
          fontSize: "var(--text-sm)",
          borderLeft: "1px solid var(--rule-faint)",
        }}
      >
        min
      </span>
    </div>
  );
}

function PriceField({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        height: "var(--field-height-base)",
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-sm)",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "0 var(--space-2)",
          background: "var(--bg-sunken)",
          color: "var(--muted)",
          fontSize: "var(--text-sm)",
          borderRight: "1px solid var(--rule-faint)",
        }}
      >
        $
      </span>
      <input
        type="number"
        min={0}
        step={50}
        value={value || ""}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        style={{
          flex: 1,
          minWidth: 0,
          padding: "0 var(--space-3)",
          background: "transparent",
          border: "none",
          outline: "none",
          fontSize: "var(--text-base)",
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          color: "var(--ink)",
          fontFeatureSettings: '"tnum" 1',
          textAlign: "right",
        }}
      />
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "0 var(--space-2)",
          background: "var(--bg-sunken)",
          color: "var(--muted)",
          fontSize: "var(--text-sm)",
          borderLeft: "1px solid var(--rule-faint)",
        }}
      >
        MXN
      </span>
    </div>
  );
}
