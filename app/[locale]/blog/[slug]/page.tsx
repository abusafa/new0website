import { getBlogPost, getBlogPostSlugs } from "@/lib/content";
import { locales, resolveLocale } from "@/lib/i18n";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface BlogPostPageParams {
  locale: string;
  slug: string;
}

interface BlogPostPageProps {
  params: BlogPostPageParams | Promise<BlogPostPageParams>;
}

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const locale = resolveLocale(resolvedParams?.locale);
  const post = await getBlogPost(resolvedParams.slug, locale);

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
  const resolvedParams = await Promise.resolve(params);
  const locale = resolveLocale(resolvedParams?.locale);
  const post = await getBlogPost(resolvedParams.slug, locale);

  if (!post) {
    notFound();
  }

  const article = post;

  const formatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    dateStyle: "medium",
  });

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <time className="text-xs uppercase tracking-wide text-[var(--color-accent-soft)]">
        {formatter.format(new Date(article.date))}
      </time>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--color-text-primary)]">{article.title}</h1>
      {article.description ? (
        <p className="mt-3 text-lg text-[var(--color-text-secondary)]">{article.description}</p>
      ) : null}
      {article.image ? (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-[var(--color-page)]">
          <Image
            src={article.image}
            alt={article.imageAlt ?? article.title}
            fill
            unoptimized
            sizes="(min-width: 1024px) 768px, 100vw"
            className="h-full w-full object-cover"
            priority
          />
        </div>
      ) : null}
      <div className="markdown-content mt-10" dangerouslySetInnerHTML={{ __html: article.body }} />
    </article>
  );
}
