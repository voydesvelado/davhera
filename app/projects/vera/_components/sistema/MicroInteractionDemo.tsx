import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

const TILE_STYLE = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "var(--space-3)",
  padding: "var(--space-5)",
  background: "var(--bg-raised)",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-md)",
};

const TILE_LABEL = {
  fontSize: "var(--text-xs)",
  fontWeight: 500,
  letterSpacing: "var(--tracking-widest)",
  textTransform: "uppercase" as const,
  color: "var(--muted)",
};

export function MicroInteractionDemo() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "var(--space-4)",
      }}
    >
      {/* Focus rings */}
      <div style={TILE_STYLE}>
        <span style={TILE_LABEL}>Focus ring</span>
        <Label htmlFor="vera-demo-focus">Pulsa Tab para mostrar el foco</Label>
        <Input id="vera-demo-focus" type="text" placeholder="Enfoca con teclado" />
      </div>

      {/* Selection */}
      <div style={TILE_STYLE}>
        <span style={TILE_LABEL}>Selección</span>
        <p style={{ fontSize: "var(--text-md)", color: "var(--ink)", lineHeight: 1.5, margin: 0 }}>
          Selecciona este texto. El color del fondo usa <code style={{ fontFamily: "var(--font-geist-mono), monospace" }}>--accent-pale</code> y el ink usa <code style={{ fontFamily: "var(--font-geist-mono), monospace" }}>--accent</code>.
        </p>
      </div>

      {/* Scrollbar */}
      <div style={TILE_STYLE}>
        <span style={TILE_LABEL}>Scrollbar</span>
        <div
          style={{
            maxHeight: "120px",
            overflowY: "auto",
            background: "var(--bg-sunken)",
            padding: "var(--space-3)",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--text-sm)",
            color: "var(--ink-soft)",
            lineHeight: 1.5,
          }}
        >
          <p>Scroll dentro de esta caja para ver el scrollbar custom — fino, color --rule, redondeado.</p>
          <p>Línea de relleno · 1</p>
          <p>Línea de relleno · 2</p>
          <p>Línea de relleno · 3</p>
          <p>Línea de relleno · 4</p>
          <p>Línea de relleno · 5</p>
          <p>Línea de relleno · 6</p>
          <p>Final de la caja.</p>
        </div>
      </div>

      {/* Skeleton */}
      <div style={TILE_STYLE}>
        <span style={TILE_LABEL}>Skeleton</span>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <div className="vera-skeleton" style={{ height: 14, width: "70%" }} />
          <div className="vera-skeleton" style={{ height: 14, width: "85%" }} />
          <div className="vera-skeleton" style={{ height: 14, width: "60%" }} />
        </div>
      </div>
    </div>
  );
}
