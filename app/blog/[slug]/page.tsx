import { getBlogPost, getBlogPostSlugs } from "@/lib/content";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug).catch(() => null);

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
  const post = await getBlogPost(params.slug).catch(() => null);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <time className="text-xs uppercase tracking-wide text-indigo-500">
        {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(post.date))}
      </time>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">{post.title}</h1>
      {post.description ? (
        <p className="mt-3 text-lg text-zinc-600">{post.description}</p>
      ) : null}
      <div className="markdown-content mt-10" dangerouslySetInnerHTML={{ __html: post.body }} />
    </article>
  );
}
