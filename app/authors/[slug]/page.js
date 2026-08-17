import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicAuthor } from "@/lib/cms/guides";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const author = await getPublicAuthor(slug);
  if (!author) return {};
  return pageMetadata({
    title: `${author.name} — Guides`,
    description: author.bio || `Guides by ${author.name}.`,
    path: `/authors/${author.slug}`,
  });
}

export default async function AuthorPage({ params }) {
  const { slug } = await params;
  const author = await getPublicAuthor(slug);
  if (!author) notFound();

  return (
    <div className="wrap prose" style={{ padding: "32px 0 64px" }}>
      <h1>{author.name}</h1>
      {author.role && <p className="help">{author.role}</p>}
      {author.bio && <p>{author.bio}</p>}
      {author.website && (
        <p>
          <a href={author.website} rel="noopener noreferrer">
            {author.website}
          </a>
        </p>
      )}
      <h2>Guides</h2>
      <div className="grid-tools">
        {author.guides.map((guide) => (
          <Link className="tool-card" key={guide.id} href={`/guides/${guide.slug}`}>
            <h3>{guide.title}</h3>
            <p>{guide.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
