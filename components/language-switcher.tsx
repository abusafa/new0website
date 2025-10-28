"use client";

import { localeLabels, type Locale, isLocale } from "@/lib/i18n";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LanguageSwitcherProps {
  locale: Locale;
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname() ?? "/";
  const otherLocale: Locale = locale === "en" ? "ar" : "en";

  const segments = pathname.split("/");
  const currentSegment = segments[1];

  const rest = isLocale(currentSegment) ? segments.slice(2) : [];

  const sanitized = rest.filter((segment) => segment.length > 0);
  const targetPath = ["", otherLocale, ...sanitized].join("/");

  return (
    <Link
      href={targetPath}
      className="inline-flex items-center rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
    >
      {localeLabels[otherLocale].native}
    </Link>
  );
}
