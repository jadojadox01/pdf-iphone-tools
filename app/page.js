import Link from "next/link";
import JsonLd, { toolListJsonLd, webAppJsonLd, websiteJsonLd } from "./components/JsonLd";
import ToolCard from "./components/ToolCard";
import { Icon } from "./components/Icons";
import { pageMetadata } from "@/lib/seo";
import { BRAND } from "@/config/brand";
import { getTools } from "@/lib/tools";
import { DEVICE_CHOICES, deviceChoiceHref } from "@/lib/devices";
import { getPublicGuides, getPublishedDevices, serializeGuideCard } from "@/lib/cms/guides";
import GuideCard from "./components/guides/GuideCard";
import AdRegion from "./components/AdRegion";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description: BRAND.definition,
  path: "/",
});

export default async function HomePage() {
  const tools = getTools();
  const tasks = ["pdf-to-word", "pdf-to-jpg", "merge-pdf", "split-pdf", "compress-pdf"]
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter(Boolean);
  let publishedDevices = [];
  let guides = [];
  try {
    publishedDevices = await getPublishedDevices();
    const featured = await getPublicGuides({ take: 3, featured: true });
    guides = featured.guides.map(serializeGuideCard);
    if (!guides.length) {
      const latest = await getPublicGuides({ take: 3 });
      guides = latest.guides.map(serializeGuideCard);
    }
  } catch {
    publishedDevices = [];
    guides = [];
  }
  const publishedSlugs = new Set(publishedDevices.map((device) => device.slug));

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={webAppJsonLd()} />
      <JsonLd data={toolListJsonLd(tools)} />
      <section className="hero-product">
        <div className="wrap">
          <div className="hero-card">
            <h1>Simple PDF tools for every device</h1>
            <p className="lede">
              Convert, merge, split, compress, and manage PDFs directly from your browser. Use the tools on iPhone,
              Android, Windows, or Mac — no software to install.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/tools/pdf-to-word">
                PDF to Word
              </Link>
              <Link className="btn btn-secondary" href="/tools">
                Explore all tools
              </Link>
            </div>
            <p className="hero-proof">
              <strong>No installation</strong>
              <span aria-hidden="true">·</span>
              <strong>Browser-based</strong>
              <span aria-hidden="true">·</span>
              <strong>Works across devices</strong>
            </p>
          </div>

          <div className="device-cta">
            <h2>Which device are you using?</h2>
            <p className="help">Pick your device and we will show the tools that fit it.</p>
            <div className="device-cta-grid">
              {DEVICE_CHOICES.map((device) => (
                <Link
                  key={device.slug}
                  className="device-choice"
                  href={deviceChoiceHref(device.slug, publishedSlugs)}
                >
                  <span className="tool-icon" aria-hidden="true">
                    <Icon name={device.icon} />
                  </span>
                  {device.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section site-definition-section">
        <div className="wrap">
          <h2>What is {BRAND.name}?</h2>
          <div className="site-definition">
            <p>{BRAND.definition}</p>
            <p>
              Open a tool, choose a PDF, and download the result. iPhone has Safari-specific pages. On other devices, use
              the same tools in the browser.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="tools">
        <div className="wrap">
          <div className="section-head">
            <h2>Popular tools</h2>
            <Link href="/tools">All tools</Link>
          </div>
          <div className="grid-tools">
            {tasks.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {guides.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <h2>Featured guides</h2>
              <Link href="/guides">All guides</Link>
            </div>
            <div className="grid-guides featured">
              {guides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap">
          <h2>How it works</h2>
          <div className="steps">
            <div className="step">
              <span className="tool-icon" aria-hidden="true">
                <Icon name="open" />
              </span>
              <h3>Open a tool</h3>
              <p>Pick the job: convert, merge, split, compress, sign, or protect.</p>
            </div>
            <div className="step">
              <span className="tool-icon" aria-hidden="true">
                <Icon name="file" />
              </span>
              <h3>Choose your PDF</h3>
              <p>Your file is processed locally in your browser and is not uploaded to PDFFlow&apos;s servers for normal tool processing.</p>
            </div>
            <div className="step">
              <span className="tool-icon" aria-hidden="true">
                <Icon name="download" />
              </span>
              <h3>Download the result</h3>
              <p>Check the file before you delete the original. Scanned pages may need a second look.</p>
            </div>
          </div>
        </div>
      </section>
      <div className="wrap">
        <AdRegion pageType="home" slot="home-below-content" />
      </div>
    </>
  );
}
