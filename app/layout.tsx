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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-zinc-50 antialiased text-zinc-900`}>
        <div className="min-h-screen">
          <header className="border-b border-zinc-200 bg-white">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
              <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
                new0
              </Link>
              <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600">
                <Link href="/about" className="transition hover:text-indigo-600">
                  About
                </Link>
                <Link href="/blog" className="transition hover:text-indigo-600">
                  Blog
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex items-center rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-semibold text-indigo-600 transition hover:border-indigo-300 hover:text-indigo-500"
                >
                  CMS
                </Link>
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="border-t border-zinc-200 bg-white">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 text-sm text-zinc-500">
              <span>© {new Date().getFullYear()} new0</span>
              <span>Built with Next.js + Decap CMS</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
