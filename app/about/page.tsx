import { getPageContent } from "@/lib/content";

export const metadata = {
  title: "About",
};

export default async function AboutPage() {
  const page = await getPageContent("about");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">{page.title}</h1>
      {page.intro ? <p className="mt-4 text-lg text-zinc-600">{page.intro}</p> : null}
      <div className="markdown-content mt-10" dangerouslySetInnerHTML={{ __html: page.body }} />
    </div>
  );
}
