"use client";

import { Input } from "../../ui/Input";
import { Textarea } from "../../ui/Textarea";
import { SegmentedControl } from "../../ui/SegmentedControl";
import { Label } from "../../ui/Label";
import type { Location } from "../../../_lib/types";

export type EditableLocation =
  | {
      type: "in_person";
      street: string;
      number: string;
      neighborhood: string;
      city: string;
      postalCode: string;
    }
  | {
      type: "online";
      platform: "Zoom" | "Google Meet" | "Te aviso al confirmar";
      instructions: string;
    };

interface LocationEditorProps {
  value: EditableLocation;
  onChange: (next: EditableLocation) => void;
}

export function LocationEditor({ value, onChange }: LocationEditorProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <SegmentedControl
        ariaLabel="Modalidad"
        segments={[
          { value: "in_person", label: "Consulta presencial" },
          { value: "online", label: "Consulta online" },
        ]}
        value={value.type}
        onChange={(t) =>
          onChange(
            t === "online"
              ? {
                  type: "online",
                  platform: "Te aviso al confirmar",
                  instructions: "",
                }
              : {
                  type: "in_person",
                  street: "",
                  number: "",
                  neighborhood: "",
                  city: "",
                  postalCode: "",
                },
          )
        }
      />

      {value.type === "in_person" ? (
        <div
          className="vera-loc-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 120px",
            gap: "var(--space-3)",
          }}
        >
          <Field label="Calle">
            <Input value={value.street} onChange={(e) => onChange({ ...value, street: e.target.value })} />
          </Field>
          <Field label="Número">
            <Input value={value.number} onChange={(e) => onChange({ ...value, number: e.target.value })} />
          </Field>
          <Field label="Colonia">
            <Input
              value={value.neighborhood}
              onChange={(e) => onChange({ ...value, neighborhood: e.target.value })}
            />
          </Field>
          <Field label="Código postal">
            <Input
              value={value.postalCode}
              inputMode="numeric"
              onChange={(e) => onChange({ ...value, postalCode: e.target.value })}
            />
          </Field>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Ciudad">
              <Input value={value.city} onChange={(e) => onChange({ ...value, city: e.target.value })} />
            </Field>
          </div>

          <style>{`
            @media (max-width: 640px) {
              .vera-loc-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <Field label="Plataforma">
            <select
              value={value.platform}
              onChange={(e) =>
                onChange({
                  ...value,
                  platform: e.target.value as "Zoom" | "Google Meet" | "Te aviso al confirmar",
                })
              }
              style={{
                height: "var(--field-height-base)",
                padding: "0 var(--space-3)",
                background: "var(--bg-raised)",
                border: "1px solid var(--rule)",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-geist), system-ui, sans-serif",
                fontSize: "var(--text-base)",
                color: "var(--ink)",
                width: "100%",
              }}
            >
              <option>Zoom</option>
              <option>Google Meet</option>
              <option>Te aviso al confirmar</option>
            </select>
          </Field>
          <Field label="Instrucciones (opcional)">
            <Textarea
              value={value.instructions}
              onChange={(e) => onChange({ ...value, instructions: e.target.value })}
              placeholder="Por ejemplo: te enviaré el enlace 1 hora antes."
              rows={2}
            />
          </Field>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1_5)" }}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function locationToEditable(loc: Location): EditableLocation {
  if (loc.type === "online") {
    return {
      type: "online",
      platform: "Te aviso al confirmar",
      instructions: "",
    };
  }
  // Best-effort split of the seed address (multi-line)
  const lines = loc.address.split("\n");
  const first = lines[0] ?? "";
  const second = lines[1] ?? "";
  const third = lines[2] ?? "";
  // first looks like: "Av. Álvaro Obregón 145, interior 304"
  const streetMatch = first.match(/^(.*?)\s+(\d+\w*)/);
  const street = streetMatch?.[1] ?? first;
  const number = streetMatch?.[2] ?? "";
  // second looks like: "Colonia Roma Norte"
  const neighborhood = second.replace(/^Colonia\s+/i, "");
  // third looks like: "06700, Cuauhtémoc, CDMX"
  const postalMatch = third.match(/(\d{5})/);
  const postalCode = postalMatch?.[1] ?? "";
  const cityParts = third.split(",").map((s) => s.trim()).filter((s) => !/^\d/.test(s));
  const city = cityParts.join(", ") || loc.city;

  return {
    type: "in_person",
    street: street.trim(),
    number: number.trim(),
    neighborhood: neighborhood.trim(),
    city,
    postalCode,
  };
}
