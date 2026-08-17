import Link from "next/link";
import { searchGuides, serializeGuide, getCategoriesWithCounts } from "@/lib/cms/guides";
import { getTools } from "@/lib/tools";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Search guides",
  description: "Search published PDF guides.",
  path: "/guides/search",
});

export default async function GuideSearchPage({ searchParams }) {
  const q = String((await searchParams).q || "").trim();
  const { guides } = q ? await searchGuides(q, { take: 24 }) : { guides: [] };
  const categories = await getCategoriesWithCounts();
  const tools = getTools().slice(0, 4);

  return (
    <div className="wrap" style={{ padding: "32px 0 64px" }}>
      <h1>Search guides</h1>
      <form action="/guides/search" method="get" className="guide-search">
        <label htmlFor="q">Search</label>
        <div className="hero-actions">
          <input id="q" name="q" defaultValue={q} />
          <button className="btn btn-primary" type="submit">Search</button>
        </div>
      </form>
      {q && !guides.length && (
        <p>No Guides found for “{q}”.</p>
      )}
      <div className="grid-tools">
        {guides.map((guide) => {
          const item = serializeGuide(guide);
          return (
            <Link className="tool-card" key={item.id} href={`/guides/${item.slug}`}>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
            </Link>
          );
        })}
      </div>
      {q && !guides.length && (
        <section className="section">
          <h2>Browse categories</h2>
          <div className="grid-tools">
            {categories.map((category) => (
              <Link className="tool-card" key={category.id} href={`/guides/category/${category.slug}`}>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          </div>
          <h2>Tools</h2>
          <div className="grid-tools">
            {tools.map((tool) => (
              <Link className="tool-card" key={tool.slug} href={`/${tool.slug}`}>
                <h3>{tool.name}</h3>
                <p>{tool.intro}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
