import Link from "next/link";
import { notFound } from "next/navigation";
import BlockRenderer, { extractFaqs } from "../../../components/guides/BlockRenderer";
import GuideToolbar from "../../../components/guides/GuideToolbar";
import JsonLd, { breadcrumbJsonLd } from "../../../components/JsonLd";
import { getPublicGuide, serializeGuide, guidePath, isPublishedDeviceRecord } from "@/lib/cms/guides";
import { extractHowToSteps, extractSearchText } from "@/lib/cms/blocks";
import { pageMetadata } from "@/lib/seo";
import { estimateReadTime, formatDate } from "@/lib/slug";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { guideCover } from "@/lib/guides/cover";
import { getGuideViews } from "@/lib/guide-views";
import AdRegion from "../../../components/AdRegion";
import GuideFeaturedImage from "../../../components/guides/GuideFeaturedImage";
import { distinctDescription, isSameGuideText } from "@/lib/cms/article-display";
import { mediaSrcFromGuide } from "@/lib/media";

export const dynamic = "force-dynamic";

function deviceIsPublic(device) {
  return isPublishedDeviceRecord(device);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = await getPublicGuide(slug);
  if (!guide) {
    return { robots: { index: false, follow: false }, title: "Guide not found" };
  }
  const item = serializeGuide(guide);
  const ogImage = guide.ogImage?.url || mediaSrcFromGuide(guide) || (guide.ogImageId ? `/media/${guide.ogImageId}` : guideCover(guide));
  const robotsNoIndex = String(guide.robots || "").includes("noindex");
  return pageMetadata({
    title: guide.seoTitle || guide.title,
    description: distinctDescription(guide.seoDescription, guide.excerpt, guide.title),
    path: guide.canonicalUrl || `/guides/${guide.category?.slug || "how-to"}/${guide.slug}`,
    noIndex: robotsNoIndex,
    image: ogImage,
    type: "article",
    keywords: [item.planning?.primaryKeyword, ...(item.planning?.supportingKeywords || [])].filter(Boolean),
  });
}

export default async function GuideArticlePage({ params }) {
  const { category, slug } = await params;
  const guide = await getPublicGuide(slug);
  if (!guide) notFound();
  if (guide.category && guide.category.slug !== category) notFound();
  const item = serializeGuide(guide);
  const faqs = extractFaqs(item.blocks);
  const steps = extractHowToSteps(item.blocks);
  const readMinutes = estimateReadTime(extractSearchText(item.blocks)) || item.readingTime || 1;
  const views = await getGuideViews(guide.slug);
  const path = guide.canonicalUrl || guidePath(guide);
  const cover = guideCover(guide);
  const crumbs = [{ name: "Home", path: "/" }];
  if (deviceIsPublic(guide.device)) crumbs.push({ name: guide.device.name, path: `/${guide.device.slug}` });
  crumbs.push({ name: "Guides", path: "/guides" });
  if (guide.category) crumbs.push({ name: guide.category.name, path: `/guides/${guide.category.slug}` });
  crumbs.push({ name: guide.title, path });

  return (
    <article className="guide-page">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: distinctDescription(guide.seoDescription, guide.excerpt, guide.title),
          datePublished: guide.publishedAt,
          dateModified: guide.updatedAt,
          image: absoluteUrl(cover),
          author: guide.author
            ? { "@type": "Person", name: guide.author.name, url: absoluteUrl(`/authors/${guide.author.slug}`) }
            : undefined,
          publisher: { "@type": "Organization", name: SITE_NAME },
          mainEntityOfPage: absoluteUrl(path),
        }}
      />
      {steps.length > 0 && item.template === "HOW_TO" && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: guide.title,
            description: distinctDescription(guide.seoDescription, guide.excerpt, guide.title),
            step: steps.map((step, index) => ({
              "@type": "HowToStep",
              position: index + 1,
              name: step.name,
              text: step.text,
            })),
          }}
        />
      )}
      {faqs.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }}
        />
      )}

      <div className="guide-page-inner">
        <nav className="guide-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {deviceIsPublic(guide.device) && (
            <>
              <span>/</span>
              <Link href={`/${guide.device.slug}`}>{guide.device.name}</Link>
            </>
          )}
          <span>/</span>
          <Link href="/guides">Guides</Link>
          {guide.category && (
            <>
              <span>/</span>
              <Link href={`/guides/${guide.category.slug}`}>{guide.category.name}</Link>
            </>
          )}
        </nav>

        <GuideFeaturedImage guide={guide} title={guide.title} />

        <header className="guide-header">
          {guide.category && <p className="guide-kicker">{guide.category.name}</p>}
          <h1>{guide.title}</h1>
          {guide.excerpt && !isSameGuideText(guide.excerpt, guide.title) ? <p className="lede">{guide.excerpt}</p> : null}
          <div className="guide-meta">
            <div className="guide-meta-copy">
              {guide.author ? (
                <p className="guide-byline">
                  By{" "}
                  <Link href={`/authors/${guide.author.slug}`}>{guide.author.name}</Link>
                  {guide.author.role ? ` · ${guide.author.role}` : ""}
                </p>
              ) : null}
            </div>
            <div className="guide-meta-tools">
              <GuideToolbar
                slug={guide.slug}
                title={guide.title}
                url={absoluteUrl(path)}
                readMinutes={readMinutes}
                initialViews={views}
              />
            </div>
          </div>
        </header>

        <BlockRenderer blocks={item.blocks} guide={item} />
        {item.planning?.sources?.length && !item.blocks.some((block) => block.type === "sources") ? (
          <section className="guide-sources">
            <h2>Sources</h2>
            <ul>
              {item.planning.sources.map((source, index) => (
                <li key={source.url || source.title || index}>
                  {source.url ? (
                    <a href={source.url} rel="noopener noreferrer">
                      {source.title || source.url}
                    </a>
                  ) : (
                    source.title
                  )}
                  {source.note ? <p className="help">{source.note}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <AdRegion pageType="guide" slot="after-article" />

        <p className="guide-footer-meta">
          {guide.publishedAt && <>Published {formatDate(guide.publishedAt)}</>}
          {guide.author && <> · {guide.author.name}</>}
        </p>
      </div>
    </article>
  );
}
