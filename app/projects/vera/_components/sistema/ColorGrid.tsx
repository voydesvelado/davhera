import { ColorSwatch } from "./ColorSwatch";
import { Eyebrow } from "../marketing/Eyebrow";

export interface ColorGroup {
  label: string;
  swatches: Array<{ token: string; oklch: string; hex: string }>;
}

interface ColorGridProps {
  groups: ColorGroup[];
}

export function ColorGrid({ groups }: ColorGridProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      {groups.map((group) => (
        <div key={group.label} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <Eyebrow>{group.label}</Eyebrow>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "var(--space-3)",
            }}
          >
            {group.swatches.map((s) => (
              <ColorSwatch key={s.token} token={s.token} oklch={s.oklch} hex={s.hex} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
