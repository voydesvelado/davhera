"use client";

import { Sun, Moon, MonitorSmartphone } from "lucide-react";
import { IconButton } from "./IconButton";
import { useTheme, type Theme } from "../../_lib/theme";

const NEXT: Record<Theme, Theme> = {
  light: "dark",
  dark: "auto",
  auto: "light",
};

const LABEL: Record<Theme, string> = {
  light: "Cambiar a tema oscuro",
  dark: "Cambiar a tema automático",
  auto: "Cambiar a tema claro",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon =
    theme === "light" ? Sun : theme === "dark" ? Moon : MonitorSmartphone;

  return (
    <IconButton
      size="sm"
      aria-label={LABEL[theme]}
      title={LABEL[theme]}
      onClick={() => setTheme(NEXT[theme])}
    >
      <Icon size={16} strokeWidth={1.75} />
    </IconButton>
  );
}
