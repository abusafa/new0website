import { LanguageSwitcher } from "@/components/language-switcher";
import { NetlifyIdentity } from "@/components/netlify-identity";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { defaultLocale, dictionaries, localeDirections, LOCALE_COOKIE, resolveLocale } from "@/lib/i18n";
import { THEME_COOKIE, type Theme } from "@/components/theme-provider";
import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const themeInitScript = `
(function () {
  const storageKey = "new0:theme";
  const root = document.documentElement;
  const currentTheme = root.dataset.theme || "light";

  try {
    window.localStorage.setItem(storageKey, currentTheme);
  } catch (_) {}
})();
`;

export const metadata: Metadata = {
  title: {
    template: "%s | New0 Website",
    default: "New0 Website",
  },
  description: "Starter website powered by Next.js and Decap CMS.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value ?? defaultLocale;
  const locale = resolveLocale(cookieLocale);
  const cookieTheme = cookieStore.get(THEME_COOKIE)?.value as Theme | undefined;
  const initialTheme: Theme = cookieTheme === "dark" ? "dark" : "light";
  const dir = localeDirections[locale];
  const t = dictionaries[locale];

  return (
    <html lang={locale} dir={dir} data-theme={initialTheme} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[var(--color-page)] text-[var(--color-text-primary)] antialiased transition-colors`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider initialTheme={initialTheme}>
          <Script src="https://identity.netlify.com/v1/netlify-identity-widget.js" strategy="afterInteractive" />
          <NetlifyIdentity />
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] transition-colors">
              <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
                <Link
                  href={`/${locale}`}
                  className="text-lg font-semibold tracking-tight text-[var(--color-text-primary)] transition-colors"
                >
                  new0
                </Link>
                <nav className="flex items-center gap-3 text-sm font-medium text-[var(--color-text-secondary)]">
                  <Link
                    href={`/${locale}/about`}
                    className="transition-colors hover:text-[var(--color-accent)]"
                  >
                    {t.nav.about}
                  </Link>
                  <Link
                    href={`/${locale}/blog`}
                    className="transition-colors hover:text-[var(--color-accent)]"
                  >
                    {t.nav.blog}
                  </Link>
                  <Link
                    href="/admin"
                    className="inline-flex items-center rounded-full border border-[var(--color-border)] px-4 py-1.5 text-sm font-semibold text-[var(--color-accent)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                  >
                    {t.nav.cms}
                  </Link>
                  <LanguageSwitcher locale={locale} />
                  <ThemeToggle locale={locale} />
                </nav>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] transition-colors">
              <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-[var(--color-text-muted)]">
                <span>© {new Date().getFullYear()} new0</span>
                <span>{t.footer.builtWith}</span>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
