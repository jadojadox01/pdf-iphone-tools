import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import BlockRenderer from "../../../../components/guides/BlockRenderer";
import { serializeGuide } from "@/lib/cms/guides";

export const metadata = {
  title: "Guide preview",
  robots: { index: false, follow: false },
  other: { "X-Robots-Tag": "noindex, nofollow" },
};

export default async function GuidePreviewPage({ params }) {
  const { id } = await params;
  const guide = await prisma.guide.findUnique({
    where: { id },
    include: {
      author: true,
      category: true,
      device: true,
      featuredImage: { select: { id: true, alt: true, caption: true, url: true } },
      tags: { include: { tag: true } },
      relatedTools: { include: { tool: true } },
      relatedFrom: { include: { to: { include: { category: true, author: true } } } },
    },
  });
  if (!guide || guide.deletedAt) notFound();
  const item = serializeGuide(guide, { preview: true });
  return (
    <div className="admin-preview wrap" style={{ padding: "32px 0 64px" }}>
      <p className="alert alert-warn">Preview only. This draft is not indexed and is not a public URL.</p>
      <h1>{guide.title}</h1>
      {guide.excerpt ? <p className="lede">{guide.excerpt}</p> : null}
      {guide.author ? <p className="guide-byline">By {guide.author.name}</p> : null}
      <BlockRenderer blocks={item.blocks} guide={item} />
    </div>
  );
}
