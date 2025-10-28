import Link from "next/link";
import { getAllBlogPosts } from "@/lib/content";

export const metadata = {
  title: "Blog",
  description: "Stories and updates managed through Decap CMS.",
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-text-primary)]">Blog</h1>
      <p className="mt-3 max-w-2xl text-lg text-[var(--color-text-secondary)]">
        Everything published from the CMS appears here automatically.
      </p>
      <div className="mt-10 space-y-8">
        {posts.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">
            No posts yet. Create your first entry from the Decap CMS dashboard.
          </p>
        ) : (
          posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm transition-colors"
            >
              <time className="text-xs uppercase tracking-wide text-[var(--color-accent-soft)]">
                {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
                  new Date(post.date),
                )}
              </time>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--color-text-primary)]">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              {post.description ? (
                <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{post.description}</p>
              ) : null}
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-flex text-sm font-semibold text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
              >
                Read article →
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
