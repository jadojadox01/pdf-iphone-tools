import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { getCategoriesWithCounts, getPublicGuides, serializeGuide } from "@/lib/cms/guides";
import { getTools } from "@/lib/tools";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "PDF Guides & Resources",
  description:
    "Practical guides for converting, organizing, signing, protecting, and managing PDF files — including workflows for iPhone and other devices.",
  path: "/guides",
});

export default async function GuidesPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const take = 9;
  const [{ guides, total }, categories] = await Promise.all([
    getPublicGuides({ take, skip: (page - 1) * take }),
    getCategoriesWithCounts(),
  ]);
  const featured = (await getPublicGuides({ take: 3, featured: true })).guides.map(serializeGuide);
  const latest = guides.map(serializeGuide);
  const pages = Math.max(1, Math.ceil(total / take));
  const tools = getTools().slice(0, 6);

  return (
    <div className="wrap" style={{ padding: "32px 0 64px" }}>
      <h1>PDF Guides & Resources</h1>
      <p className="lede">
        Practical guides for converting, organizing, signing, protecting, and managing PDF files — including workflows for iPhone and other devices.
      </p>
      <form action="/guides/search" method="get" className="guide-search">
        <label htmlFor="q">Search guides</label>
        <div className="hero-actions">
          <input id="q" name="q" placeholder="Search guides" />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </div>
      </form>
      <p className="help">
        <a href="/guides/rss.xml">RSS feed of published guides</a>
      </p>

      {featured.length > 0 && (
        <section className="section">
          <h2>Featured guides</h2>
          <div className="grid-tools">
            {featured.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="section">
          <h2>Categories</h2>
          <div className="grid-tools">
            {categories.map((category) => (
              <Link className="tool-card" key={category.id} href={`/guides/category/${category.slug}`}>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span className="help">{category.publicCount} {category.publicCount === 1 ? "guide" : "guides"}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <h2>Latest guides</h2>
        <div className="grid-tools">
          {latest.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
        {pages > 1 && (
          <p className="hero-actions" style={{ marginTop: 24 }}>
            {page > 1 && (
              <Link className="btn btn-secondary" href={`/guides?page=${page - 1}`}>
                Previous
              </Link>
            )}
            {page < pages && (
              <Link className="btn btn-secondary" href={`/guides?page=${page + 1}`}>
                Next
              </Link>
            )}
          </p>
        )}
        {!latest.length && <p>No published guides yet.</p>}
      </section>

      <section className="section">
        <h2>Useful tools</h2>
        <div className="grid-tools">
          {tools.map((tool) => (
            <Link className="tool-card" key={tool.slug} href={`/${tool.slug}`}>
              <h3>{tool.name}</h3>
              <p>{tool.intro}</p>
              <span className="cta">{tool.cta}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function GuideCard({ guide }) {
  return (
    <Link className="tool-card" href={`/guides/${guide.slug}`}>
      {guide.category && <span className="help">{guide.category.name}</span>}
      <h3>{guide.title}</h3>
      <p>{guide.excerpt}</p>
      <span className="cta">Read guide</span>
    </Link>
  );
}
