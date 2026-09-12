import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd, { breadcrumbJsonLd } from "./JsonLd";
import ToolCard from "./ToolCard";
import { getTool } from "@/lib/tools";
import { hasDeviceToolPage, toolPath } from "@/lib/paths";
import { getPublishedDevice, getPublicGuides, serializeGuideCard } from "@/lib/cms/guides";
import GuideCard from "./guides/GuideCard";

export async function DeviceHub({ slug }) {
  const device = await getPublishedDevice(slug).catch(() => null);
  if (!device) notFound();
  const featured = device.tools.find((item) => item.featured);
  const featuredTool = featured ? getTool(featured.tool.slug) : null;
  const { guides } = await getPublicGuides({ take: 6, deviceSlug: slug });
  const paired = device.tools
    .map((item) => ({ ...item, catalog: getTool(item.tool.slug) }))
    .filter((item) => item.catalog);
  const cluster =
    slug === "iphone"
      ? paired.filter((item) => hasDeviceToolPage(slug, item.tool.slug))
      : paired.slice(0, 6);
  const clusterSlugs = new Set(cluster.map((item) => item.tool.slug));
  const more = paired.filter((item) => !clusterSlugs.has(item.tool.slug));

  return (
    <div className="wrap" style={{ padding: "28px 0 64px" }}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: device.name, path: `/${device.slug}` },
        ])}
      />
      <p className="help">
        <Link href="/">Home</Link> → {device.name}
      </p>
      <h1>{device.seoTitle || `PDF tools for ${device.name}`}</h1>
      <p className="lede">{device.intro}</p>

      {featuredTool && (
        <section className="section">
          <h2>Start here</h2>
          <div className="grid-tools">
            <ToolCard
              tool={featuredTool}
              href={toolPath(featured.tool.slug, device.slug)}
              title={featured.headline || featuredTool.name}
              description={featuredTool.definition || featured.intro || featuredTool.intro}
            />
          </div>
        </section>
      )}

      {cluster.length > 0 && (
        <section className="section">
          <h2>Popular PDF tasks on {device.name}</h2>
          <div className="grid-tools">
            {cluster.map((item) => (
              <ToolCard
                key={item.tool.slug}
                tool={item.catalog}
                href={toolPath(item.tool.slug, device.slug)}
                title={item.headline || item.tool.name}
                description={item.catalog.definition || item.intro || item.catalog.intro}
              />
            ))}
          </div>
        </section>
      )}

      {slug === "iphone" && (
        <section className="section">
          <h2>How to work with PDFs on iPhone</h2>
          <p>
            Save the file to Files or iCloud Drive, open this site in Safari, then pick the PDF. Conversion runs on the
            iPhone. You do not need the App Store. In-app browsers in Mail or WhatsApp often block downloads — copy the
            link into Safari if that happens.
          </p>
        </section>
      )}

      {guides.length > 0 && (
        <section className="section">
          <h2>Guides</h2>
          <div className="grid-guides">
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={serializeGuideCard(guide)} />
            ))}
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section className="section">
          <h2>More tools</h2>
          <p className="help">These also work on {device.name}.</p>
          <div className="grid-tools">
            {more.slice(0, 8).map((item) => (
              <ToolCard
                key={item.tool.slug}
                tool={item.catalog}
                href={toolPath(item.tool.slug)}
                description={item.catalog.definition || item.catalog.intro}
                showCta={false}
              />
            ))}
          </div>
        </section>
      )}

      {slug === "iphone" && (
        <section className="section">
          <h2>If something goes wrong</h2>
          <div className="faq">
            <details>
              <summary>Safari will not pick my PDF</summary>
              <p>Save it to Files first: open the other app, tap Share, then Save to Files. Then return here.</p>
            </details>
            <details>
              <summary>The download never appears</summary>
              <p>Open this site in Safari, not inside Mail or WhatsApp. Look in Files → Downloads after it finishes.</p>
            </details>
            <details>
              <summary>Are my files uploaded?</summary>
              <p>No. Processing runs in the browser. We cannot read the PDF.</p>
            </details>
          </div>
        </section>
      )}
    </div>
  );
}
