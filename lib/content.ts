import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const PAGE_DIR = path.join(CONTENT_ROOT, "pages");
const BLOG_DIR = path.join(CONTENT_ROOT, "blog");

async function markdownToHtml(markdown: string): Promise<string> {
  const processed = await remark().use(html).process(markdown);
  return processed.toString();
}

export interface PageContent {
  title: string;
  tagline?: string;
  intro?: string;
  body: string;
}

export async function getPageContent(slug: string): Promise<PageContent> {
  const filepath = path.join(PAGE_DIR, `${slug}.md`);
  const file = await fs.readFile(filepath, "utf8").catch((error) => {
    error.message = `Unable to read page content for "${slug}": ${error.message}`;
    throw error;
  });

  const { data, content } = matter(file);
  const htmlBody = await markdownToHtml(content);

  return {
    title: data.title ?? "Untitled page",
    tagline: data.tagline,
    intro: data.intro,
    body: htmlBody,
  } satisfies PageContent;
}

export interface BlogSummary {
  slug: string;
  title: string;
  description?: string;
  date: string;
}

export interface BlogPost extends BlogSummary {
  body: string;
}

export async function getBlogPostSlugs(): Promise<string[]> {
  const entries = await fs.readdir(BLOG_DIR, { withFileTypes: true }).catch((error) => {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name.replace(/\.md$/, ""));
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  const filepath = path.join(BLOG_DIR, `${slug}.md`);
  const file = await fs.readFile(filepath, "utf8").catch((error) => {
    error.message = `Unable to read blog post for "${slug}": ${error.message}`;
    throw error;
  });

  const { data, content } = matter(file);
  const htmlBody = await markdownToHtml(content);

  return {
    slug,
    title: data.title ?? slug,
    description: data.description,
    date: data.date ?? new Date().toISOString(),
    body: htmlBody,
  } satisfies BlogPost;
}

export async function getAllBlogPosts(): Promise<BlogSummary[]> {
  const slugs = await getBlogPostSlugs();
  const posts = await Promise.all(slugs.map((slug) => getBlogPost(slug)));

  return posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(({ slug, title, description, date }) => ({ slug, title, description, date }));
}
