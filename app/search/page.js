import Link from "next/link";
import { searchGuides, serializeGuideCard, getCategoriesWithCounts } from "@/lib/cms/guides";
import { getTools } from "@/lib/tools";
import { pageMetadata } from "@/lib/seo";
import GuideCard from "../components/guides/GuideCard";
import ToolCard from "../components/ToolCard";
import { Icon } from "../components/Icons";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Search",
  description: "Search PDF tools and guides.",
  path: "/search",
  noIndex: true,
});

function matchesQuery(text, query) {
  return String(text || "").toLowerCase().includes(query);
}

export default async function SearchPage({ searchParams }) {
  const q = String((await searchParams).q || "").trim();
  const query = q.toLowerCase();
  const { guides } = query ? await searchGuides(query, { take: 24 }).catch(() => ({ guides: [] })) : { guides: [] };
  const tools = query
    ? getTools().filter((tool) =>
        [tool.name, tool.definition, tool.intro, tool.description, tool.slug].some((value) => matchesQuery(value, query)),
      )
    : [];
  const categories = await getCategoriesWithCounts().catch(() => []);

  return (
    <div className="wrap" style={{ padding: "32px 0 64px" }}>
      <p className="help">
        <Link href="/">Home</Link> → Search
      </p>
      <h1>Search</h1>
      <p className="lede">Find a tool or a guide.</p>
      <form action="/search" method="get" className="guide-search">
        <label htmlFor="q">Search tools and guides</label>
        <div className="hero-actions">
          <input id="q" name="q" defaultValue={q} placeholder="PDF to Word, merge, iPhone…" />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </div>
      </form>

      {!q && (
        <section className="section">
          <h2>Browse</h2>
          <div className="grid-tools">
            <Link className="tool-card" href="/tools">
              <span className="tool-card-top">
                <span className="tool-icon" aria-hidden="true">
                  <Icon name="file" />
                </span>
                <h3>Tools</h3>
              </span>
              <p>Convert, merge, split, compress, sign, and protect PDFs.</p>
            </Link>
            <Link className="tool-card" href="/iphone">
              <span className="tool-card-top">
                <span className="tool-icon" aria-hidden="true">
                  <Icon name="iphone" />
                </span>
                <h3>iPhone / iPad</h3>
              </span>
              <p>Safari, Files, and iCloud Drive.</p>
            </Link>
            <Link className="tool-card" href="/guides">
              <span className="tool-card-top">
                <span className="tool-icon" aria-hidden="true">
                  <Icon name="guide" />
                </span>
                <h3>Guides</h3>
              </span>
              <p>Step-by-step instructions.</p>
            </Link>
          </div>
        </section>
      )}

      {q && (
        <>
          <section className="section">
            <h2>Tools</h2>
            {tools.length ? (
              <div className="grid-tools">
                {tools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            ) : (
              <p>No tools matched “{q}”.</p>
            )}
          </section>
          <section className="section">
            <h2>Guides</h2>
            {guides.length ? (
              <div className="grid-guides">
                {guides.map((guide) => (
                  <GuideCard key={guide.id} guide={serializeGuideCard(guide)} />
                ))}
              </div>
            ) : (
              <p>No guides matched “{q}”.</p>
            )}
          </section>
        </>
      )}

      {q && !tools.length && !guides.length && categories.length > 0 && (
        <section className="section">
          <h2>Browse guides</h2>
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
    </div>
  );
}
