import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

  const setTheme = (value) => {
    root.dataset.theme = value;
    root.style.colorScheme = value;
  };

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      return;
    }
  } catch (_) {}

  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
})();
`;

export const metadata: Metadata = {
  title: {
    template: "%s | New0 Website",
    default: "New0 Website",
  },
  description: "Starter website powered by Next.js and Decap CMS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[var(--color-page)] text-[var(--color-text-primary)] antialiased transition-colors`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] transition-colors">
              <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
                <Link
                  href="/"
                  className="text-lg font-semibold tracking-tight text-[var(--color-text-primary)] transition-colors"
                >
                  new0
                </Link>
                <nav className="flex items-center gap-4 text-sm font-medium text-[var(--color-text-secondary)]">
                  <Link href="/about" className="transition-colors hover:text-[var(--color-accent)]">
                    About
                  </Link>
                  <Link href="/blog" className="transition-colors hover:text-[var(--color-accent)]">
                    Blog
                  </Link>
                  <Link
                    href="/admin"
                    className="inline-flex items-center rounded-full border border-[var(--color-border)] px-4 py-1.5 text-sm font-semibold text-[var(--color-accent)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                  >
                    CMS
                  </Link>
                  <ThemeToggle />
                </nav>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] transition-colors">
              <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-[var(--color-text-muted)]">
                <span>© {new Date().getFullYear()} new0</span>
                <span>Built with Next.js + Decap CMS</span>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
