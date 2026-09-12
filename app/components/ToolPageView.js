import Link from "next/link";
import ToolWorkspace from "./ToolWorkspace";
import ToolExplain from "./ToolExplain";
import JsonLd, { breadcrumbJsonLd, definedTermJsonLd, faqJsonLd } from "./JsonLd";
import { getRelatedTools } from "@/lib/tools";
import { hasDeviceToolPage, toolPath } from "@/lib/paths";
import AdRegion from "./AdRegion";

export default function ToolPageView({ tool, explain, relatedGuides = [] }) {
  const related = getRelatedTools(tool.slug);

  return (
    <div className="wrap" style={{ padding: "28px 0 48px" }}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "PDF Tools", path: "/tools" },
          { name: tool.name, path: `/tools/${tool.slug}` },
        ])}
      />
      {explain?.faqs?.length ? <JsonLd data={faqJsonLd(explain.faqs, `/tools/${tool.slug}`)} /> : null}
      {definedTermJsonLd(tool, `/tools/${tool.slug}`) ? (
        <JsonLd data={definedTermJsonLd(tool, `/tools/${tool.slug}`)} />
      ) : null}

      <p className="help">
        <Link href="/">Home</Link> → <Link href="/tools">Tools</Link> → {tool.name}
      </p>
      <h1>{tool.h1}</h1>
      {tool.definition ? (
        <p className="tool-definition">
          <strong>What is {tool.name}?</strong> {tool.definition}
        </p>
      ) : null}
      <p className="lede">{tool.intro}</p>
      {hasDeviceToolPage("iphone", tool.slug) && (
        <p className="help">
          On iPhone or iPad, use the Safari page:{" "}
          <Link href={toolPath(tool.slug, "iphone")}>{tool.name} on iPhone</Link>.
        </p>
      )}

      <ToolWorkspace tool={tool} />
      <p className="help">The file is processed in this browser tab. It is not uploaded for conversion.</p>

      <ToolExplain explain={explain} related={related} relatedGuides={relatedGuides} />
      <AdRegion pageType="tool" slot="after-tool-explain" />
    </div>
  );
}
