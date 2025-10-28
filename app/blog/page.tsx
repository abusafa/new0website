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
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">Blog</h1>
      <p className="mt-3 max-w-2xl text-lg text-zinc-600">
        Everything published from the CMS appears here automatically.
      </p>
      <div className="mt-10 space-y-8">
        {posts.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No posts yet. Create your first entry from the Decap CMS dashboard.
          </p>
        ) : (
          posts.map((post) => (
            <article key={post.slug} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <time className="text-xs uppercase tracking-wide text-indigo-500">
                {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
                  new Date(post.date),
                )}
              </time>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-900">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              {post.description ? (
                <p className="mt-3 text-sm text-zinc-600">{post.description}</p>
              ) : null}
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-500"
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
