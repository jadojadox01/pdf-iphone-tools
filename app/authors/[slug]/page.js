import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import { getPublicAuthor, guidePath } from "@/lib/cms/guides";
import { SITE_AUTHOR, authorBioParagraphs } from "@/lib/cms/site-author";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function resolveAuthor(slug) {
  const author = await getPublicAuthor(slug);
  if (author) return author;
  if (slug === "editorial" || slug === "pdfflow") {
    permanentRedirect(`/authors/${SITE_AUTHOR.slug}`);
  }
  const stored = await prisma.redirect.findUnique({ where: { fromPath: `/authors/${slug}` } }).catch(() => null);
  if (stored?.toPath) permanentRedirect(stored.toPath);
  return null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const author = await resolveAuthor(slug);
  if (!author) return {};
  return pageMetadata({
    title: `${author.name} — Guides`,
    description: authorBioParagraphs(author.bio)[0] || `Guides by ${author.name}.`,
    path: `/authors/${author.slug}`,
    noIndex: !author.guides.length,
  });
}

export default async function AuthorPage({ params }) {
  const { slug } = await params;
  const author = await resolveAuthor(slug);
  if (!author) notFound();
  const paragraphs = authorBioParagraphs(author.bio);

  return (
    <div className="wrap author-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: author.name,
          jobTitle: author.role || undefined,
          description: paragraphs.join(" "),
          url: absoluteUrl(`/authors/${author.slug}`),
          worksFor: { "@type": "Organization", name: "PDFFlow", url: absoluteUrl("/") },
        }}
      />
      <header className="author-header">
        <p className="guide-kicker">Author</p>
        <h1>{author.name}</h1>
        {author.role ? <p className="author-role">{author.role}</p> : null}
      </header>
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
      ))}
      {author.website ? (
        <p>
          <a href={author.website} rel="noopener noreferrer">
            {author.website}
          </a>
        </p>
      ) : null}
      <h2>Guides</h2>
      <div className="grid-tools">
        {author.guides.map((guide) => (
          <Link className="tool-card" key={guide.id} href={guidePath(guide)}>
            <h3>{guide.title}</h3>
            <p>{guide.excerpt}</p>
          </Link>
        ))}
        {!author.guides.length ? <p className="help">No published guides yet.</p> : null}
      </div>
    </div>
  );
}
