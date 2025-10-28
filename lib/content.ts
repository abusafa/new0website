import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { defaultLocale, locales, type Locale, resolveLocale } from "@/lib/i18n";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const PAGE_DIR = path.join(CONTENT_ROOT, "pages");
const BLOG_DIR = path.join(CONTENT_ROOT, "blog");
const NEWS_DIR = path.join(CONTENT_ROOT, "news");

async function markdownToHtml(markdown: string): Promise<string> {
  const processed = await remark().use(html).process(markdown);
  return processed.toString();
}

async function readMarkdownFile(
  baseDir: string,
  slug: string,
  locale: Locale,
  { fallbackToDefault = true }: { fallbackToDefault?: boolean } = {},
): Promise<{ file: string; filepath: string; locale: Locale } | null> {
  const attempts: Locale[] = [locale];
  if (fallbackToDefault && locale !== defaultLocale) {
    attempts.push(defaultLocale);
  }

  for (const attempt of attempts) {
    const filepath = path.join(baseDir, attempt, `${slug}.md`);
    try {
      const file = await fs.readFile(filepath, "utf8");
      return { file, filepath, locale: attempt } as const;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        continue;
      }
      throw error;
    }
  }

  return null;
}

async function listMarkdownSlugs(dir: string, locale: Locale): Promise<string[]> {
  const localeDir = path.join(dir, locale);
  const entries = await fs.readdir(localeDir, { withFileTypes: true }).catch((error) => {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name.replace(/\.md$/, ""));
}

export interface PageContent {
  title: string;
  tagline?: string;
  intro?: string;
  body: string;
  locale: Locale;
}

export async function getPageContent(slug: string, localeInput?: string): Promise<PageContent> {
  const locale = resolveLocale(localeInput);
  const result = await readMarkdownFile(PAGE_DIR, slug, locale);
  if (!result) {
    throw new Error(`Page content for "${slug}" not found for locale ${locale}`);
  }

  const { file, locale: resolvedLocale } = result;

  const { data, content } = matter(file);
  const htmlBody = await markdownToHtml(content);

  return {
    title: data.title ?? "Untitled page",
    tagline: data.tagline,
    intro: data.intro,
    body: htmlBody,
    locale: resolvedLocale,
  } satisfies PageContent;
}

export interface BlogSummary {
  slug: string;
  title: string;
  description?: string;
  date: string;
  locale: Locale;
  image?: string;
  imageAlt?: string;
}

export interface BlogPost extends BlogSummary {
  body: string;
}

export interface NewsItem {
  slug: string;
  title: string;
  summary?: string;
  date: string;
  locale: Locale;
  image?: string;
  imageAlt?: string;
  link?: string;
}

export async function getBlogPostSlugs(localeInput?: string): Promise<string[]> {
  if (localeInput) {
    const locale = resolveLocale(localeInput);
    return listMarkdownSlugs(BLOG_DIR, locale);
  }

  const slugs = new Set<string>();
  for (const locale of locales) {
    for (const slug of await listMarkdownSlugs(BLOG_DIR, locale)) {
      slugs.add(slug);
    }
  }
  return Array.from(slugs);
}

export async function getBlogPost(slug: string, localeInput?: string): Promise<BlogPost | null> {
  const locale = resolveLocale(localeInput);
  const result = await readMarkdownFile(BLOG_DIR, slug, locale, { fallbackToDefault: true });

  if (!result) {
    return null;
  }

  const { file, locale: resolvedLocale } = result;

  const { data, content } = matter(file);
  const htmlBody = await markdownToHtml(content);

  return {
    slug,
    title: data.title ?? slug,
    description: data.description,
    date: data.date ?? new Date().toISOString(),
    image: data.image,
    imageAlt: data.imageAlt,
    body: htmlBody,
    locale: resolvedLocale,
  } satisfies BlogPost;
}

export async function getAllBlogPosts(localeInput?: string): Promise<BlogSummary[]> {
  const locale = resolveLocale(localeInput);
  const slugs = await getBlogPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const post = await getBlogPost(slug, locale);
      return post;
    }),
  );

  return posts
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(({ slug, title, description, date, locale: postLocale, image, imageAlt }) => ({
      slug,
      title,
      description,
      date,
      locale: postLocale,
      image,
      imageAlt,
    }));
}

async function getSlugsForDir(dir: string): Promise<string[]> {
  const slugs = new Set<string>();
  for (const locale of locales) {
    for (const slug of await listMarkdownSlugs(dir, locale)) {
      slugs.add(slug);
    }
  }
  return Array.from(slugs);
}

export async function getNewsItem(slug: string, localeInput?: string): Promise<NewsItem | null> {
  const locale = resolveLocale(localeInput);
  const result = await readMarkdownFile(NEWS_DIR, slug, locale, { fallbackToDefault: true });

  if (!result) {
    return null;
  }

  const { file, locale: resolvedLocale } = result;
  const { data } = matter(file);

  return {
    slug,
    title: data.title ?? slug,
    summary: data.summary,
    date: data.date ?? new Date().toISOString(),
    image: data.image,
    imageAlt: data.imageAlt,
    link: data.link,
    locale: resolvedLocale,
  } satisfies NewsItem;
}

export async function getAllNewsItems(localeInput?: string): Promise<NewsItem[]> {
  const locale = resolveLocale(localeInput);
  const slugs = await getSlugsForDir(NEWS_DIR);
  const items = await Promise.all(slugs.map((slug) => getNewsItem(slug, locale)));

  return items
    .filter((item): item is NewsItem => item !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
