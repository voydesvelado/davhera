"use client";

import { useTheme } from "./theme";

/**
 * Returns the className that portaled UI (Dialog.Popup, Dialog.Backdrop,
 * Menu.Popup, …) must wear so the Vera design tokens resolve correctly.
 *
 * Base UI's `*.Portal` renders into `document.body`, escaping the
 * `.proj-vera` root that scopes our CSS variables. Re-applying the scope
 * class (plus the `theme-dark` modifier when active) on the portaled
 * element makes `var(--…)` references resolve and keeps dark mode in sync.
 */
export function usePortalRootClass(): string {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "dark" ? "proj-vera theme-dark" : "proj-vera";
}
