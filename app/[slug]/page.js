import { notFound } from "next/navigation";
import ToolPageView from "../components/ToolPageView";
import { getTool, getTools } from "@/lib/tools";
import { toolMetadata } from "@/lib/seo";
import { getGuidesForTool } from "@/lib/cms/guides";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return getTools().map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return toolMetadata(tool);
}

export default async function ToolRoutePage({ params }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();
  const relatedGuides = await getGuidesForTool(tool.slug);
  return <ToolPageView tool={tool} relatedGuides={relatedGuides} />;
}
