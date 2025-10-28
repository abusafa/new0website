import { getPageContent } from "@/lib/content";
import { dictionaries, resolveLocale } from "@/lib/i18n";
import type { Metadata } from "next";

interface AboutPageProps {
  params: { locale: string } | Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const locale = resolveLocale(resolvedParams?.locale);
  return {
    title: dictionaries[locale].nav.about,
  } satisfies Metadata;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const locale = resolveLocale(resolvedParams?.locale);
  const page = await getPageContent("about", locale);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-text-primary)]">{page.title}</h1>
      {page.intro ? <p className="mt-4 text-lg text-[var(--color-text-secondary)]">{page.intro}</p> : null}
      <div className="markdown-content mt-10" dangerouslySetInnerHTML={{ __html: page.body }} />
    </div>
  );
}
