import { notFound } from "next/navigation";
import ToolPageView from "../../components/ToolPageView";
import { getTool } from "@/lib/tools";
import { toolMetadata } from "@/lib/seo";
import { serializeGuideCard } from "@/lib/cms/guides";
import { loadRelatedGuides, loadToolExplain } from "@/lib/explain-load";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return toolMetadata(tool, `/tools/${tool.slug}`);
}

export default async function GenericToolPage({ params }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();
  const explain = await loadToolExplain(tool);
  const linked = await loadRelatedGuides(tool, explain);
  return <ToolPageView tool={tool} explain={explain} relatedGuides={linked.map(serializeGuideCard)} />;
}
