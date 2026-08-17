import Link from "next/link";
import { GuideBody, faqsFromDoc } from "@/lib/cms/render";
import { extractToc } from "@/lib/cms/tiptap";
import { getTool } from "@/lib/tools";
import { formatDate } from "@/lib/slug";
import JsonLd, { breadcrumbJsonLd } from "../JsonLd";
import { absoluteUrl } from "@/lib/site";

export default function GuideArticle({ guide, preview = false }) {
  const toc = extractToc(guide.contentJson);
  const faqs = faqsFromDoc(guide.contentJson);
  const tools = (guide.relatedTools || []).map(getTool).filter(Boolean);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
  ];
  if (guide.category) crumbs.push({ name: guide.category.name, path: `/guides/category/${guide.category.slug}` });
  crumbs.push({ name: guide.title, path: `/guides/${guide.slug}` });

  return (
    <article className="guide-article wrap">
      {!preview && <JsonLd data={breadcrumbJsonLd(crumbs)} />}
      {!preview && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guide.title,
            description: guide.excerpt,
            datePublished: guide.publishedAt,
            dateModified: guide.updatedAt,
            author: guide.author ? { "@type": "Organization", name: guide.author.name } : undefined,
            mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`),
          }}
        />
      )}
      {!preview && faqs.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }}
        />
      )}

      <p className="help">
        <Link href="/">Home</Link> → <Link href="/guides">Guides</Link>
        {guide.category && (
          <>
            {" "}
            → <Link href={`/guides/category/${guide.category.slug}`}>{guide.category.name}</Link>
          </>
        )}
      </p>
      <h1>{guide.title}</h1>
      <p className="lede">{guide.excerpt}</p>
      <p className="help">
        {guide.author && (
          <>
            Written by <Link href={`/authors/${guide.author.slug}`}>{guide.author.name}</Link>
            {" · "}
          </>
        )}
        {guide.publishedAt && <>Published {formatDate(guide.publishedAt)} · </>}
        Last updated {formatDate(guide.updatedAt)} · {guide.readingTime} min read
      </p>
      {guide.featuredImage && (
        <figure className="article-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/api/media/${guide.featuredImage.id}`} alt={guide.featuredImage.alt || guide.title} />
          {guide.featuredImage.caption && <figcaption>{guide.featuredImage.caption}</figcaption>}
        </figure>
      )}
      {toc.length >= 3 && (
        <nav className="toc" aria-label="On this page">
          <h2>On this page</h2>
          <ol>
            {toc.map((item) => (
              <li key={item.id} style={{ marginLeft: item.level === 3 ? 16 : 0 }}>
                <a href={`#${item.id}`}>{item.text}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <GuideBody doc={guide.contentJson} />
      {tools.length > 0 && (
        <section className="section">
          <h2>Try the tool</h2>
          <div className="grid-tools">
            {tools.map((tool) => (
              <Link className="tool-card" key={tool.slug} href={`/${tool.slug}`}>
                <h3>{tool.name}</h3>
                <p>{tool.intro}</p>
                <span className="cta">{tool.cta}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
      {guide.relatedGuides?.length > 0 && (
        <section className="section">
          <h2>Related guides</h2>
          <div className="grid-tools">
            {guide.relatedGuides.map((item) => (
              <Link className="tool-card" key={item.id} href={`/guides/${item.slug}`}>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
