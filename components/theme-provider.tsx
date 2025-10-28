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

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (value: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "new0:theme";
export const THEME_COOKIE = "new0:theme";

const applyTheme = (value: Theme) => {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.dataset.theme = value;
  root.style.colorScheme = value;
};

export function ThemeProvider({ children, initialTheme }: { children: ReactNode; initialTheme: Theme }) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  useEffect(() => {
    applyTheme(theme);

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // swallow write errors when storage is unavailable
      }
    }

    try {
      document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000`;
    } catch {
      // ignore cookie failures
    }
  }, [theme]);

  const setTheme = useCallback((value: Theme) => {
    setThemeState(value);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === "light" ? "dark" : "light"));
  }, []);

  const contextValue = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
