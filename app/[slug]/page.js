import { notFound, permanentRedirect, redirect } from "next/navigation";
import { getTool } from "@/lib/tools";
import { prisma } from "@/lib/db";
import { toolPath } from "@/lib/paths";

export default async function LegacyToolPage({ params }) {
  const { slug } = await params;
  const stored = await prisma.redirect.findUnique({ where: { fromPath: `/${slug}` } }).catch(() => null);
  if (stored?.toPath) permanentRedirect(stored.toPath);
  const tool = getTool(slug);
  if (!tool) notFound();
  redirect(toolPath(tool.slug));
}
