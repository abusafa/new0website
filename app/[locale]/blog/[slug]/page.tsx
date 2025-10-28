import { getBlogPost, getBlogPostSlugs } from "@/lib/content";
import { locales, resolveLocale } from "@/lib/i18n";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: { locale: string; slug: string };
}

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const locale = resolveLocale(params?.locale);
  const post = await getBlogPost(params.slug, locale).catch(() => null);

  if (!post) {
    return {
      title: "Post not found",
    } satisfies Metadata;
  }

  return {
    title: post.title,
    description: post.description,
  } satisfies Metadata;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const locale = resolveLocale(params?.locale);
  const post = await getBlogPost(params.slug, locale).catch(() => null);

  if (!post) {
    notFound();
  }

  const formatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    dateStyle: "medium",
  });

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <time className="text-xs uppercase tracking-wide text-[var(--color-accent-soft)]">
        {formatter.format(new Date(post.date))}
      </time>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--color-text-primary)]">{post.title}</h1>
      {post.description ? (
        <p className="mt-3 text-lg text-[var(--color-text-secondary)]">{post.description}</p>
      ) : null}
      <div className="markdown-content mt-10" dangerouslySetInnerHTML={{ __html: post.body }} />
    </article>
  );
}
