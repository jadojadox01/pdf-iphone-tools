import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getPublicGuide, getPublicGuides, serializeGuideCard } from "@/lib/cms/guides";
import { pageMetadata } from "@/lib/seo";
import GuideCard from "../../components/guides/GuideCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { category } = await params;
  const row = await prisma.category.findUnique({ where: { slug: category } });
  if (!row) return { robots: { index: false, follow: false } };
  const { guides } = await getPublicGuides({ take: 1, categorySlug: category });
  if (!guides.length) return { robots: { index: false, follow: false } };
  return pageMetadata({
    title: `${row.name} guides`,
    description: row.description || `Guides in ${row.name}.`,
    path: `/guides/${row.slug}`,
  });
}

export default async function GuideCategoryPage({ params }) {
  const { category } = await params;
  if (category === "search") redirect("/search");
  const row = await prisma.category.findUnique({ where: { slug: category } });
  if (!row) {
    const guide = await getPublicGuide(category);
    if (guide) redirect(`/guides/${guide.category?.slug || "how-to"}/${guide.slug}`);
    notFound();
  }
  const { guides } = await getPublicGuides({ take: 24, categorySlug: category });
  if (!guides.length) notFound();

  return (
    <div className="wrap" style={{ padding: "32px 0 64px" }}>
      <p className="help">
        <Link href="/guides">Guides</Link> → {row.name}
      </p>
      <h1>{row.name}</h1>
      <p className="lede">{row.description}</p>
      <div className="grid-guides">
        {guides.map((guide) => (
          <GuideCard key={guide.id} guide={serializeGuideCard(guide)} />
        ))}
      </div>
    </div>
  );
}
