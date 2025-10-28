import Link from "next/link";
import { getAllBlogPosts, getPageContent } from "@/lib/content";

export default async function HomePage() {
  const home = await getPageContent("home");
  const posts = await getAllBlogPosts();

  return (
    <div>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)] transition-colors">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-wide text-[var(--color-accent)]">{home.tagline}</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{home.title}</h1>
            <p className="max-w-2xl text-lg text-[var(--color-text-secondary)]">
              Manage this hero section straight from Decap CMS. Update the title,
              tagline, and body copy without touching code.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-accent-hover)]"
            >
              Open CMS
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Read the blog
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16">
        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: home.body }} />

        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
              Latest posts
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              Add new articles from the Blog Posts collection inside Decap CMS.
            </p>
          </div>
          <ul className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm transition-colors"
              >
                <div className="text-sm uppercase tracking-wide text-[var(--color-accent-soft)]">
                  {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
                    new Date(post.date),
                  )}
                </div>
                <h3 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                {post.description ? (
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{post.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
          {posts.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              No posts yet. Create your first blog entry from the CMS interface.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
