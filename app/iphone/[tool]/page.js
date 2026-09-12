import Link from "next/link";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import ToolWorkspace from "../../components/ToolWorkspace";
import ToolExplain from "../../components/ToolExplain";
import JsonLd, { breadcrumbJsonLd, definedTermJsonLd, faqJsonLd } from "../../components/JsonLd";
import { getRelatedTools, getTool } from "@/lib/tools";
import { toolMetadata } from "@/lib/seo";
import { getPublishedDevice } from "@/lib/cms/guides";
import { hasDeviceToolPage, IPHONE_TOOL_PAGES, toolPath } from "@/lib/paths";
import { getIphoneToolCopy } from "@/lib/devices";
import { loadRelatedGuides, loadToolExplain } from "@/lib/explain-load";
import AdRegion from "../../components/AdRegion";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { tool: toolSlug } = await params;
  const tool = getTool(toolSlug);
  if (!tool || !hasDeviceToolPage("iphone", tool.slug)) {
    return { robots: { index: false, follow: true } };
  }
  const device = await getPublishedDevice("iphone").catch(() => null);
  if (!device) {
    return { robots: { index: false, follow: true } };
  }
  const copy = getIphoneToolCopy(tool.slug);
  return toolMetadata(
    {
      ...tool,
      seoTitle: copy?.headline || tool.seoTitle,
      seoDescription: copy?.intro || tool.seoDescription,
    },
    `/iphone/${tool.slug}`,
  );
}

export default async function IphoneToolPage({ params }) {
  const { tool: toolSlug } = await params;
  const device = await getPublishedDevice("iphone").catch(() => null);
  const tool = getTool(toolSlug);
  if (!tool) notFound();
  if (!device) redirect(toolPath(tool.slug));
  const pairing = device.tools.find((item) => item.tool.slug === tool.slug);
  if (!pairing) redirect(toolPath(tool.slug));
  if (!hasDeviceToolPage("iphone", tool.slug)) permanentRedirect(toolPath(tool.slug));
  const copy = getIphoneToolCopy(tool.slug);
  const explain = await loadToolExplain(tool, { device: "iphone" });
  const linked = await loadRelatedGuides(tool, explain);
  const relatedTools = [
    ...IPHONE_TOOL_PAGES.filter((slug) => slug !== tool.slug).map(getTool),
    ...getRelatedTools(tool.slug).filter((item) => !IPHONE_TOOL_PAGES.includes(item.slug)),
  ]
    .filter(Boolean)
    .filter((item, index, list) => list.findIndex((row) => row.slug === item.slug) === index)
    .slice(0, 4);
  const headline = pairing.headline || copy?.headline || `${tool.name} on iPhone`;
  const intro = pairing.intro || copy?.intro || tool.intro;

  return (
    <div className="wrap" style={{ padding: "28px 0 48px" }}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "iPhone", path: "/iphone" },
          { name: tool.name, path: `/iphone/${tool.slug}` },
        ])}
      />
      {explain?.faqs?.length ? <JsonLd data={faqJsonLd(explain.faqs, `/iphone/${tool.slug}`)} /> : null}
      {definedTermJsonLd(tool, `/iphone/${tool.slug}`) ? (
        <JsonLd data={definedTermJsonLd(tool, `/iphone/${tool.slug}`)} />
      ) : null}
      <p className="help">
        <Link href="/">Home</Link> → <Link href="/iphone">iPhone</Link> → {tool.name}
      </p>
      <h1>{headline}</h1>
      {tool.definition ? (
        <p className="tool-definition">
          <strong>What is {tool.name}?</strong> {tool.definition}
        </p>
      ) : null}
      <p className="lede">{intro}</p>
      <ToolWorkspace tool={tool} />
      <p className="help">Your file is processed locally in this browser and is not uploaded to PDFFlow&apos;s servers for normal tool processing.</p>
      <ToolExplain
        explain={explain}
        related={relatedTools}
        relatedGuides={linked}
        device="iphone"
      />
      <AdRegion pageType="tool" slot="after-tool-explain" />
      <p className="help">
        On a computer, use the <Link href={toolPath(tool.slug)}>{tool.name}</Link> page.
      </p>
    </div>
  );
}
