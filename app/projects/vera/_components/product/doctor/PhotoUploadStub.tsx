"use client";

import { useState } from "react";
import { Sheet } from "../../ui/Sheet";
import { Button } from "../../ui/Button";
import { useToast } from "../../ui/Toast";

interface PhotoUploadStubProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PhotoUploadStub({ open, onOpenChange }: PhotoUploadStubProps) {
  const toast = useToast();
  const [dragOver, setDragOver] = useState(false);

  function fakeUpload() {
    toast.show({
      tone: "default",
      message: "Subida simulada. En el demo no se guardan archivos.",
    });
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange} size="sm" title="Cambiar foto">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          fakeUpload();
        }}
        style={{
          padding: "var(--space-12) var(--space-4)",
          background: dragOver ? "var(--accent-pale)" : "var(--bg-sunken)",
          border: `1px dashed ${dragOver ? "var(--accent)" : "var(--rule-strong)"}`,
          borderRadius: "var(--radius-md)",
          textAlign: "center",
          color: "var(--muted)",
          fontSize: "var(--text-sm)",
          transition:
            "background var(--dur-quick) var(--ease-snap), border-color var(--dur-quick) var(--ease-snap)",
        }}
      >
        <p style={{ margin: 0 }}>Arrastra una imagen aquí, o</p>
        <Button
          size="sm"
          variant="secondary"
          onClick={fakeUpload}
          style={{ marginTop: "var(--space-3)" }}
        >
          Seleccionar archivo
        </Button>
      </div>
      <p
        style={{
          margin: "var(--space-4) 0 0",
          fontSize: "var(--text-xs)",
          color: "var(--ink-faint)",
          textAlign: "center",
        }}
      >
        En el demo no se guardan imágenes. La foto pública sigue siendo la actual.
      </p>
    </Sheet>
  );
}
