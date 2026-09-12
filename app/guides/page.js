import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { getCategoriesWithCounts, getPublicGuides, serializeGuideCard } from "@/lib/cms/guides";
import { getTools } from "@/lib/tools";
import GuideCard from "../components/guides/GuideCard";
import ToolCard from "../components/ToolCard";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "PDF guides",
  description: "Guides for converting and managing PDF files, including on iPhone.",
  path: "/guides",
});

export default async function GuidesPage() {
  const [{ guides }, categories] = await Promise.all([
    getPublicGuides({ take: 9 }),
    getCategoriesWithCounts(),
  ]);
  const featured = (await getPublicGuides({ take: 3, featured: true })).guides.map(serializeGuideCard);
  const latest = guides.map(serializeGuideCard);
  const tools = getTools().slice(0, 4);

  return (
    <div className="wrap" style={{ padding: "32px 0 64px" }}>
      <h1>PDF guides</h1>
      <p className="lede">How to convert, merge, split, and compress PDFs, including on iPhone.</p>
      <form action="/search" method="get" className="guide-search">
        <label htmlFor="q">Search tools and guides</label>
        <div className="hero-actions">
          <input id="q" name="q" placeholder="PDF to Word, merge, iPhone…" />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </div>
      </form>
      {featured.length > 0 && (
        <section className="section">
          <h2>Featured</h2>
          <div className="grid-guides featured">
            {featured.map((guide) => (
              <GuideCard key={guide.id} guide={guide} featured />
            ))}
          </div>
        </section>
      )}
      {categories.length > 0 && (
        <section className="section">
          <h2>Topics</h2>
          <div className="grid-tools">
            {categories.map((category) => (
              <Link className="tool-card" key={category.id} href={`/guides/${category.slug}`}>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="section">
        <h2>Latest</h2>
        <div className="grid-guides">
          {latest.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
        {!latest.length && <p>No published guides yet.</p>}
      </section>
      <section className="section">
        <h2>Tools</h2>
        <div className="grid-tools">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} showCta={false} />
          ))}
        </div>
      </section>
    </div>
  );
}
