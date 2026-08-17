import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import GuideArticle from "../../../../components/guides/GuideArticle";
import { parseDoc, withHeadingIds } from "@/lib/cms/tiptap";
import { serializeGuide } from "@/lib/cms/guides";

export const metadata = { title: "Guide preview", robots: { index: false, follow: false } };

export default async function GuidePreviewPage({ params }) {
  const { id } = await params;
  const guide = await prisma.guide.findUnique({
    where: { id },
    include: {
      author: true,
      category: true,
      featuredImage: { select: { id: true, alt: true, caption: true } },
      tags: { include: { tag: true } },
      relatedTools: true,
      relatedFrom: { include: { to: { include: { category: true, author: true } } } },
    },
  });
  if (!guide || guide.deletedAt) notFound();
  const serialized = serializeGuide({ ...guide, contentJson: withHeadingIds(parseDoc(guide.contentJson)) });
  return (
    <div className="admin-preview">
      <p className="alert alert-warn">Preview only. This draft is not indexed and is not a public URL.</p>
      <GuideArticle guide={serialized} preview />
    </div>
  );
}
