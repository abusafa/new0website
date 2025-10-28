import Link from "next/link";
import { getAllBlogPosts, getPageContent } from "@/lib/content";

export default async function HomePage() {
  const home = await getPageContent("home");
  const posts = await getAllBlogPosts();

  return (
    <div className="bg-zinc-50">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-wide text-indigo-600">{home.tagline}</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{home.title}</h1>
            <p className="max-w-2xl text-lg text-zinc-600">
              Manage this hero section straight from Decap CMS. Update the title,
              tagline, and body copy without touching code.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              Open CMS
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-700 transition hover:border-indigo-300 hover:text-indigo-600"
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
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Latest posts
            </h2>
            <p className="text-zinc-600">
              Add new articles from the Blog Posts collection inside Decap CMS.
            </p>
          </div>
          <ul className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <li key={post.slug} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="text-sm uppercase tracking-wide text-indigo-500">
                  {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
                    new Date(post.date),
                  )}
                </div>
                <h3 className="mt-2 text-xl font-semibold text-zinc-900">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                {post.description ? (
                  <p className="mt-2 text-sm text-zinc-600">{post.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
          {posts.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No posts yet. Create your first blog entry from the CMS interface.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
