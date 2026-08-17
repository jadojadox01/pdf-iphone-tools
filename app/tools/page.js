import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { TOOL_CATEGORIES, getToolsByCategory } from "@/lib/tools";

export const metadata = pageMetadata({
  title: "All PDF Tools — Convert, Merge, Compress, Sign",
  description:
    "Browse free PDF tools for iPhone and every other device: convert to Word or JPG, merge, split, compress, rotate, sign, protect, and unlock PDFs.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="wrap" style={{ padding: "32px 0 64px" }}>
      <h1>All PDF tools</h1>
      <p className="lede">
        Every tool on this list performs a real operation in your browser. If a file cannot be processed, you will see an error instead of a fake download.
      </p>
      {TOOL_CATEGORIES.map((category) => (
        <section key={category.id} className="section">
          <h2>{category.title}</h2>
          <p className="help">{category.description}</p>
          <div className="grid-tools">
            {getToolsByCategory(category.id).map((tool) => (
              <Link className="tool-card" key={tool.slug} href={`/${tool.slug}`}>
                <span className="icon-badge">{tool.shortName.slice(0, 2)}</span>
                <h3>{tool.name}</h3>
                <p>{tool.intro}</p>
                <span className="cta">{tool.cta}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
