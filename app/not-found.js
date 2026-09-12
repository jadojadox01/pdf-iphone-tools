import Link from "next/link";
import { getTools } from "@/lib/tools";
import ToolCard from "./components/ToolCard";

export default function NotFound() {
  const tools = getTools().slice(0, 6);

  return (
    <div className="wrap" style={{ padding: "48px 0 64px" }}>
      <h1>Page not found</h1>
      <p className="lede">
        That address is not a tool or guide on this site. Search, open a PDF tool, or go back to the homepage.
      </p>
      <form action="/search" method="get" className="guide-search">
        <label htmlFor="q">Search tools and guides</label>
        <div className="hero-actions">
          <input id="q" name="q" placeholder="PDF to Word, merge, iPhone…" />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </div>
      </form>
      <p className="hero-actions" style={{ marginTop: 16 }}>
        <Link className="btn btn-secondary" href="/">
          Homepage
        </Link>
        <Link className="btn btn-secondary" href="/guides">
          Guides
        </Link>
        <Link className="btn btn-secondary" href="/tools">
          All tools
        </Link>
      </p>
      <section className="section">
        <h2>PDF tools</h2>
        <div className="grid-tools">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} showCta={false} />
          ))}
        </div>
      </section>
    </div>
  );
}
