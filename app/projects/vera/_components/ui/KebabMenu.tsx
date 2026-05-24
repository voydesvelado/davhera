"use client";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import { EllipsisVertical } from "lucide-react";
import type { ReactNode } from "react";
import { IconButton } from "./IconButton";
import { usePortalRootClass } from "../../_lib/portal-class";

export interface KebabItem {
  label: ReactNode;
  onClick: () => void;
  /** Renders the label in --danger color. */
  destructive?: boolean;
  icon?: ReactNode;
}

interface KebabMenuProps {
  items: KebabItem[];
  ariaLabel?: string;
}

export function KebabMenu({ items, ariaLabel = "Más acciones" }: KebabMenuProps) {
  const rootClass = usePortalRootClass();
  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger
        render={
          <IconButton size="sm" aria-label={ariaLabel}>
            <EllipsisVertical size={16} strokeWidth={1.75} />
          </IconButton>
        }
      />
      <BaseMenu.Portal>
        <BaseMenu.Positioner sideOffset={4} align="end">
          <BaseMenu.Popup
            className={rootClass}
            style={{
              minWidth: 180,
              background: "var(--bg-overlay)",
              border: "1px solid var(--rule)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-lg)",
              padding: 4,
              outline: "none",
            }}
          >
            {items.map((item, idx) => (
              <BaseMenu.Item
                key={idx}
                onClick={item.onClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "var(--space-2) var(--space-3)",
                  background: "transparent",
                  color: item.destructive ? "var(--danger)" : "var(--ink)",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "var(--text-sm)",
                  fontFamily: "var(--font-geist), system-ui, sans-serif",
                  cursor: "pointer",
                  outline: "none",
                  width: "100%",
                  textAlign: "left",
                }}
                className="vera-kebab-item"
              >
                {item.icon}
                {item.label}
              </BaseMenu.Item>
            ))}
            <style>{`
              .vera-kebab-item[data-highlighted] { background: var(--bg-sunken); }
            `}</style>
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}
