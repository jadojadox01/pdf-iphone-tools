import { notFound } from "next/navigation";
import GuideArticle from "../../components/guides/GuideArticle";
import { getPublicGuide, serializeGuide } from "@/lib/cms/guides";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = await getPublicGuide(slug);
  if (!guide) return {};
  const noIndex = guide.robots?.includes("noindex");
  const imageId = guide.ogImageId || guide.featuredImageId;
  return pageMetadata({
    title: guide.seoTitle || guide.title,
    description: guide.seoDescription || guide.excerpt,
    path: guide.canonicalUrl || `/guides/${guide.slug}`,
    ogTitle: guide.seoTitle || guide.title,
    ogDescription: guide.seoDescription || guide.excerpt,
    noIndex,
    image: imageId ? `/api/media/${imageId}` : undefined,
  });
}

export default async function GuidePage({ params }) {
  const { slug } = await params;
  const guide = await getPublicGuide(slug);
  if (!guide) notFound();
  return <GuideArticle guide={serializeGuide(guide)} />;
}
