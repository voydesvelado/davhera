"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "auto";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (next: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "vera_theme";
const ROOT_SELECTOR = ".proj-vera";
const DARK_CLASS = "theme-dark";

/**
 * Inline script that runs before hydration to apply the resolved theme
 * class to the .proj-vera root. Prevents the FOUC of a dark-mode user
 * seeing light styles flash before React boots.
 *
 * Inserted via dangerouslySetInnerHTML in the layout, before children.
 */
export const themeInitScript = `(() => {
  try {
    var saved = localStorage.getItem('${STORAGE_KEY}');
    var theme = saved === 'light' || saved === 'dark' || saved === 'auto' ? saved : 'auto';
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var resolved = theme === 'dark' || (theme === 'auto' && prefersDark) ? 'dark' : 'light';
    var root = document.querySelector('${ROOT_SELECTOR}');
    if (root) {
      if (resolved === 'dark') root.classList.add('${DARK_CLASS}');
      else root.classList.remove('${DARK_CLASS}');
    }
  } catch (e) {}
})();`;

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === "light" || theme === "dark") return theme;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Default to 'auto' on the server; refine on hydration from localStorage.
  const [theme, setThemeState] = useState<Theme>("auto");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  // Hydrate from localStorage and listen for system theme changes
  useEffect(() => {
    let initial: Theme = "auto";
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark" || stored === "auto") {
        initial = stored;
      }
    } catch {
      // localStorage unavailable — keep default
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(initial);
    setResolvedTheme(resolveTheme(initial));

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      setThemeState((current) => {
        if (current === "auto") {
          setResolvedTheme(mq.matches ? "dark" : "light");
        }
        return current;
      });
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Apply / remove the dark class on the .proj-vera root
  useEffect(() => {
    const root = document.querySelector(ROOT_SELECTOR);
    if (!root) return;
    if (resolvedTheme === "dark") {
      root.classList.add(DARK_CLASS);
    } else {
      root.classList.remove(DARK_CLASS);
    }
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    setResolvedTheme(resolveTheme(next));
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore — value just doesn't persist
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Outside the provider (e.g., during initial server render); fall back
    // to safe defaults so the component still renders.
    return {
      theme: "auto",
      resolvedTheme: "light",
      setTheme: () => {},
    };
  }
  return ctx;
}
