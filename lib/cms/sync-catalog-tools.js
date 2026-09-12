import { prisma } from "@/lib/db";
import { getTools } from "@/lib/tools";

function inputFormatFor(tool) {
  const accept = String(tool.accept || "").toLowerCase();
  if (accept.includes(".docx")) return "docx";
  if (accept.includes("image/") || accept.includes(".heic") || accept.includes(".png")) return "image";
  return "pdf";
}

export async function ensureCatalogToolsInCms() {
  const catalog = getTools();
  let created = 0;
  for (const [index, tool] of catalog.entries()) {
    const existing = await prisma.tool.findUnique({ where: { slug: tool.slug } });
    if (existing) continue;
    await prisma.tool.create({
      data: {
        name: tool.name,
        slug: tool.slug,
        processorKey: tool.slug,
        description: tool.description,
        intro: tool.intro,
        category: tool.category,
        inputFormat: inputFormatFor(tool),
        outputFormat: tool.outputExt || "",
        status: "live",
        cta: tool.cta,
        seoTitle: tool.title,
        seoDescription: tool.description,
        sortOrder: index + 1,
      },
    });
    created += 1;
  }
  return created;
}
