import { getAllBlogPosts } from "@/lib/content";
import { dictionaries, resolveLocale } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

interface BlogPageProps {
  params: { locale: string } | Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const locale = resolveLocale(resolvedParams?.locale);
  const t = dictionaries[locale];
  return {
    title: t.nav.blog,
    description: t.blog.metaDescription,
  } satisfies Metadata;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const locale = resolveLocale(resolvedParams?.locale);
  const t = dictionaries[locale];
  const posts = await getAllBlogPosts(locale);

  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    dateStyle: "medium",
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-text-primary)]">
        {t.nav.blog}
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-[var(--color-text-secondary)]">{t.blog.intro}</p>
      <div className="mt-10 space-y-8">
        {posts.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">{t.blog.noPosts}</p>
        ) : (
          posts.map((post) => (
            <article
              key={post.slug}
              className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition-colors"
            >
              {post.image ? (
                <div className="relative aspect-[16/9] bg-[var(--color-page)]">
                  <Image
                    src={post.image}
                    alt={post.imageAlt ?? post.title}
                    fill
                    sizes="(min-width: 1024px) 640px, 100vw"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="p-6">
                <time className="text-xs uppercase tracking-wide text-[var(--color-accent-soft)]">
                  {dateFormatter.format(new Date(post.date))}
                </time>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--color-text-primary)]">
                  <Link href={`/${locale}/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                {post.description ? (
                  <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{post.description}</p>
                ) : null}
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="mt-4 inline-flex text-sm font-semibold text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
                >
                  {t.blog.readArticle}
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
