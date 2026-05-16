"use client";

import { useId, useMemo, useState } from "react";

const SPECIALTIES = [
  "Psicología clínica",
  "Psicoterapia",
  "Nutrición",
  "Fisioterapia",
  "Dermatología",
  "Odontología",
  "Medicina general",
  "Ginecología",
  "Pediatría",
  "Cardiología",
  "Endocrinología",
  "Oftalmología",
  "Otorrinolaringología",
  "Acupuntura",
  "Quiropráctica",
  "Medicina funcional",
];

interface SpecialtyAutocomboboxProps {
  value: string;
  onChange: (v: string) => void;
}

function fold(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function SpecialtyAutocombobox({ value, onChange }: SpecialtyAutocomboboxProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const suggestions = useMemo(() => {
    if (!value.trim()) return SPECIALTIES.slice(0, 6);
    const q = fold(value);
    return SPECIALTIES.filter((s) => fold(s).includes(q)).slice(0, 6);
  }, [value]);

  const showSuggestions = open && focused && suggestions.length > 0;
  const floated = focused || value.length > 0;

  return (
    <div style={{ position: "relative" }}>
      <div
        className="vera-fli"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "stretch",
          height: 56,
          background: "var(--bg-raised)",
          border: "1px solid var(--rule)",
          borderRadius: "var(--radius-sm)",
          transition: "border-color var(--dur-quick) var(--ease-snap)",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
          <label
            htmlFor={id}
            style={{
              position: "absolute",
              left: "var(--space-3)",
              top: floated ? 7 : "50%",
              transform: floated ? "none" : "translateY(-50%)",
              fontSize: floated ? "var(--text-2xs)" : "var(--text-base)",
              fontWeight: floated ? 500 : 400,
              letterSpacing: floated ? "var(--tracking-wider)" : "var(--tracking-normal)",
              textTransform: floated ? "uppercase" : "none",
              color: focused ? "var(--accent)" : "var(--muted)",
              pointerEvents: "none",
              transition:
                "top var(--dur-quick) var(--ease-snap), font-size var(--dur-quick) var(--ease-snap), color var(--dur-quick) var(--ease-snap)",
              fontFamily: "var(--font-geist), system-ui, sans-serif",
            }}
          >
            Tu especialidad
          </label>
          <input
            id={id}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => {
              setFocused(true);
              setOpen(true);
            }}
            onBlur={() => {
              setFocused(false);
              setTimeout(() => setOpen(false), 120);
            }}
            autoComplete="off"
            style={{
              width: "100%",
              height: "100%",
              padding: floated ? "20px var(--space-3) 8px" : "0 var(--space-3)",
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "var(--font-geist), system-ui, sans-serif",
              fontSize: "var(--text-md)",
              color: "var(--ink)",
            }}
          />
        </div>
        <style>{`.vera-fli:focus-within { border-color: var(--accent); }`}</style>
      </div>

      {showSuggestions ? (
        <ul
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 5,
            listStyle: "none",
            padding: 4,
            margin: 0,
            background: "var(--bg-overlay)",
            border: "1px solid var(--rule)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(s);
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "var(--space-2) var(--space-3)",
                  background: "transparent",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-geist), system-ui, sans-serif",
                  fontSize: "var(--text-sm)",
                  color: "var(--ink)",
                  cursor: "pointer",
                }}
                className="vera-spec-item"
              >
                {s}
              </button>
            </li>
          ))}
          <style>{`.vera-spec-item:hover { background: var(--bg-sunken); }`}</style>
        </ul>
      ) : null}
    </div>
  );
}
