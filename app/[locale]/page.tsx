import { getAllBlogPosts, getAllNewsItems, getPageContent } from "@/lib/content";
import { dictionaries, resolveLocale } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";

interface HomePageProps {
  params: { locale: string } | Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const resolvedParams = await Promise.resolve(params);
  const locale = resolveLocale(resolvedParams?.locale);
  const t = dictionaries[locale];

  const home = await getPageContent("home", locale);
  const posts = await getAllBlogPosts(locale);
  const newsItems = (await getAllNewsItems(locale)).slice(0, 3);

  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    dateStyle: "medium",
  });

  return (
    <div>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)] transition-colors">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-wide text-[var(--color-accent)]">{home.tagline}</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{home.title}</h1>
            <p className="max-w-2xl text-lg text-[var(--color-text-secondary)]">{t.home.heroBody}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-accent-hover)]"
            >
              {t.home.openCms}
            </Link>
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              {t.home.readBlog}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16">
        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: home.body }} />

        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
              {t.news.sectionTitle}
            </h2>
            <p className="text-[var(--color-text-secondary)]">{t.news.sectionDescription}</p>
          </div>
          {newsItems.length > 0 ? (
            <ul className="grid gap-6 md:grid-cols-3">
              {newsItems.map((item) => (
                <li
                  key={`${item.locale}-${item.slug}`}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm transition-colors"
                >
                  {item.image ? (
                    <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg bg-[var(--color-page)]">
                      <Image
                        src={item.image}
                        alt={item.imageAlt ?? item.title}
                        fill
                        sizes="(min-width: 1024px) 320px, (min-width: 768px) 45vw, 100vw"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="text-xs uppercase tracking-wide text-[var(--color-accent-soft)]">
                    {dateFormatter.format(new Date(item.date))}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
                  {item.summary ? (
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{item.summary}</p>
                  ) : null}
                  {item.link ? (
                    <Link
                      href={item.link}
                      className="mt-4 inline-flex text-sm font-semibold text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
                      target={item.link.startsWith("http") ? "_blank" : undefined}
                      rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {t.news.readMore}
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)]">{t.news.empty}</p>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
              {t.home.latestPosts}
            </h2>
            <p className="text-[var(--color-text-secondary)]">{t.home.latestPostsDescription}</p>
          </div>
          <ul className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition-colors"
              >
                {post.image ? (
                  <div className="relative aspect-[16/9] bg-[var(--color-page)]">
                    <Image
                      src={post.image}
                      alt={post.imageAlt ?? post.title}
                      fill
                      sizes="(min-width: 1024px) 280px, (min-width: 768px) 45vw, 100vw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
                <div className="p-6">
                  <div className="text-sm uppercase tracking-wide text-[var(--color-accent-soft)]">
                    {dateFormatter.format(new Date(post.date))}
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
                    <Link href={`/${locale}/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  {post.description ? (
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{post.description}</p>
                  ) : null}
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="mt-4 inline-flex text-sm font-semibold text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
                  >
                    {t.blog.readArticle}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          {posts.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">{t.home.emptyPosts}</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
