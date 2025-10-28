export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (locales as readonly string[]).includes(value);
}

export function resolveLocale(value: string | undefined): Locale {
  if (isLocale(value)) {
    return value;
  }
  return defaultLocale;
}

export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};

export const localeLabels: Record<Locale, { native: string; english: string; short: string }> = {
  en: { native: "English", english: "English", short: "EN" },
  ar: { native: "العربية", english: "Arabic", short: "AR" },
};

interface NavDictionary {
  home: string;
  about: string;
  blog: string;
  cms: string;
}

interface HomeDictionary {
  heroBody: string;
  openCms: string;
  readBlog: string;
  latestPosts: string;
  latestPostsDescription: string;
  emptyPosts: string;
}

interface BlogDictionary {
  intro: string;
  noPosts: string;
  readArticle: string;
  metaDescription: string;
}

interface FooterDictionary {
  builtWith: string;
}

interface NewsDictionary {
  sectionTitle: string;
  sectionDescription: string;
  empty: string;
  readMore: string;
}

interface Dictionary {
  nav: NavDictionary;
  home: HomeDictionary;
  blog: BlogDictionary;
  news: NewsDictionary;
  footer: FooterDictionary;
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      blog: "Blog",
      cms: "CMS",
    },
    home: {
      heroBody:
        "Manage this hero section straight from Decap CMS. Update the title, tagline, and body copy without touching code.",
      openCms: "Open CMS",
      readBlog: "Read the blog",
      latestPosts: "Latest posts",
      latestPostsDescription: "Add new articles from the Blog Posts collection inside Decap CMS.",
      emptyPosts: "No posts yet. Create your first blog entry from the CMS interface.",
    },
    blog: {
      intro: "Everything published from the CMS appears here automatically.",
      noPosts: "No posts yet. Create your first entry from the Decap CMS dashboard.",
      readArticle: "Read article →",
      metaDescription: "Stories and updates managed through Decap CMS.",
    },
    news: {
      sectionTitle: "Latest news",
      sectionDescription: "Company announcements, product updates, and upcoming events.",
      empty: "No news items yet. Add one from the CMS to showcase your updates.",
      readMore: "Read more",
    },
    footer: {
      builtWith: "Built with Next.js + Decap CMS",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      about: "نبذة عنا",
      blog: "المدونة",
      cms: "لوحة التحكم",
    },
    home: {
      heroBody:
        "يمكنك إدارة قسم الواجهة مباشرة من Decap CMS. حدّث العنوان والسطر التعريفي والمحتوى دون الحاجة إلى كتابة كود.",
      openCms: "افتح لوحة التحكم",
      readBlog: "اقرأ المدونة",
      latestPosts: "أحدث المقالات",
      latestPostsDescription: "أضِف مقالات جديدة من مجموعة المدونة داخل Decap CMS.",
      emptyPosts: "لا توجد مقالات بعد. أنشئ أول تدوينة من خلال لوحة التحكم.",
    },
    blog: {
      intro: "كل ما يتم نشره عبر لوحة التحكم يظهر هنا تلقائيًا.",
      noPosts: "لا توجد مقالات بعد. أنشئ أول تدوينة من خلال لوحة تحكم Decap CMS.",
      readArticle: "اقرأ المقال →",
      metaDescription: "قصص وتحديثات تُدار عبر Decap CMS.",
    },
    news: {
      sectionTitle: "آخر الأخبار",
      sectionDescription: "إعلانات الشركة وتحديثات المنتجات والفعاليات القادمة.",
      empty: "لا توجد أخبار بعد. أضف خبراً من خلال لوحة التحكم لعرض آخر المستجدات.",
      readMore: "اقرأ المزيد",
    },
    footer: {
      builtWith: "تم بناؤه باستخدام Next.js وDecap CMS",
    },
  },
};
