"use client";

import { useTheme } from "@/components/theme-provider";
import type { Locale } from "@/lib/i18n";

const labels: Record<Locale, { light: string; dark: string }> = {
  en: {
    light: "Switch to light theme",
    dark: "Switch to dark theme",
  },
  ar: {
    light: "التبديل إلى الوضع الفاتح",
    dark: "التبديل إلى الوضع الداكن",
  },
};

interface ThemeToggleProps {
  locale: Locale;
}

export function ThemeToggle({ locale }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const label = theme === "dark" ? labels[locale].light : labels[locale].dark;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
      aria-label={label}
      title={label}
    >
      <span aria-hidden>{theme === "dark" ? "☾" : "☀"}</span>
    </button>
  );
}
