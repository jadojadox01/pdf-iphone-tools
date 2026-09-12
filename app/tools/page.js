import Link from "next/link";
import JsonLd, { toolListJsonLd } from "../components/JsonLd";
import ToolCard from "../components/ToolCard";
import { TOOL_CATEGORIES, getTools, getToolsByCategory } from "@/lib/tools";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "PDF tools",
  description: "Convert, merge, split, compress, sign, protect, and unlock PDFs in your browser.",
  path: "/tools",
});

export default function ToolsPage() {
  const tools = getTools();
  return (
    <div className="wrap" style={{ padding: "32px 0 64px" }}>
      <JsonLd data={toolListJsonLd(tools)} />
      <p className="help">
        <Link href="/">Home</Link> → Tools
      </p>
      <h1>PDF tools</h1>
      <p className="lede">
        Convert, merge, split, compress, sign, and protect PDFs in your browser. Turn Word files and
        photos into PDFs. On iPhone, see the{" "}
        <Link href="/iphone">iPhone page</Link> for Safari notes.
      </p>
      {TOOL_CATEGORIES.map((category) => (
        <section className="section" key={category.id}>
          <h2>{category.title}</h2>
          <div className="grid-tools">
            {getToolsByCategory(category.id).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
