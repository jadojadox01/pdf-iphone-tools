import { getPublicGuide, getPublicGuidesForTool, serializeGuide } from "@/lib/cms/guides";
import { getExplainOverride } from "@/lib/explain-store";
import { getToolExplain } from "@/lib/explain";

export async function loadToolExplain(tool, { device } = {}) {
  const cmsExplain = await getExplainOverride(tool.slug).catch(() => null);
  return getToolExplain(tool, { device, cmsExplain });
}

function isPrimaryForTool(guide, toolSlug) {
  const item = serializeGuide(guide);
  return item.primaryToolSlug === toolSlug || item.planning?.toolDependency === toolSlug;
}

export async function loadRelatedGuides(tool, explain) {
  const linked = await getPublicGuidesForTool(tool.slug, { take: 6 }).catch(() => []);
  const seen = new Set(linked.map((guide) => guide.slug));
  for (const slug of explain?.relatedGuideSlugs || []) {
    if (seen.has(slug)) continue;
    const guide = await getPublicGuide(slug).catch(() => null);
    if (guide) {
      linked.push(guide);
      seen.add(guide.slug);
    }
  }
  return linked.sort((a, b) => Number(isPrimaryForTool(b, tool.slug)) - Number(isPrimaryForTool(a, tool.slug)));
}
