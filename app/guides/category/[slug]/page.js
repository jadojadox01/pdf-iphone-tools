import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getPublicGuides, serializeGuide } from "@/lib/cms/guides";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  return pageMetadata({
    title: `${category.name} guides`,
    description: category.description || `Guides in ${category.name}.`,
    path: `/guides/category/${category.slug}`,
  });
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();
  const take = 9;
  const { guides, total } = await getPublicGuides({ take, skip: (page - 1) * take, categorySlug: slug });
  const pages = Math.max(1, Math.ceil(total / take));
  if (!guides.length && page === 1) notFound();

  return (
    <div className="wrap" style={{ padding: "32px 0 64px" }}>
      <p className="help">
        <Link href="/guides">Guides</Link> / {category.name}
      </p>
      <h1>{category.name}</h1>
      <p className="lede">{category.description}</p>
      <div className="grid-tools">
        {guides.map((guide) => {
          const item = serializeGuide(guide);
          return (
            <Link className="tool-card" key={item.id} href={`/guides/${item.slug}`}>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
            </Link>
          );
        })}
      </div>
      {pages > 1 && (
        <p className="hero-actions" style={{ marginTop: 24 }}>
          {page > 1 && <Link className="btn btn-secondary" href={`/guides/category/${slug}?page=${page - 1}`}>Previous</Link>}
          {page < pages && <Link className="btn btn-secondary" href={`/guides/category/${slug}?page=${page + 1}`}>Next</Link>}
        </p>
      )}
    </div>
  );
}
