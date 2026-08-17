import Link from "next/link";
import HomeHero from "./components/HomeHero";
import JsonLd, { webAppJsonLd } from "./components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { TOOL_CATEGORIES, getToolsByCategory } from "@/lib/tools";
import { getPublicGuides, serializeGuide } from "@/lib/cms/guides";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Free PDF Tools for iPhone — Convert PDF Online",
  description:
    "Convert PDF files to Word, JPG, Excel and more directly from your iPhone. Free online PDF tools with no app installation required.",
  path: "/",
  ogTitle: "Free PDF Tools for iPhone",
  ogDescription: "Convert, merge, compress, split, and sign PDFs in your browser. No app required.",
});

export default async function HomePage() {
  const { guides } = await getPublicGuides({ take: 3 });
  const latest = guides.map(serializeGuide);

  return (
    <>
      <JsonLd data={webAppJsonLd()} />
      <HomeHero />

      <section className="section" id="tools">
        <div className="wrap">
          {TOOL_CATEGORIES.map((category) => (
            <div key={category.id} style={{ marginBottom: 36 }}>
              <div className="section-head">
                <h2>{category.title}</h2>
                <p className="help">{category.description}</p>
              </div>
              <div className="grid-tools">
                {getToolsByCategory(category.id).map((tool) => (
                  <Link className="tool-card" key={tool.slug} href={`/${tool.slug}`}>
                    <span className="icon-badge">{tool.shortName.slice(0, 2)}</span>
                    <h3>{tool.name}</h3>
                    <p>{tool.intro}</p>
                    <p className="help">After upload: {tool.afterUpload}</p>
                    <span className="cta">{tool.cta}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {latest.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <h2>Latest guides</h2>
              <Link href="/guides">All guides</Link>
            </div>
            <div className="grid-tools">
              {latest.map((guide) => (
                <Link className="tool-card" key={guide.id} href={`/guides/${guide.slug}`}>
                  {guide.category && <span className="help">{guide.category.name}</span>}
                  <h3>{guide.title}</h3>
                  <p>{guide.excerpt}</p>
                  <span className="cta">Read guide</span>
                </Link>
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
              <div className="step-num">1</div>
              <h3>Upload</h3>
              <p>Choose a PDF from Files, iCloud Drive, or your computer.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h3>Configure</h3>
              <p>Pick pages, quality, or other options for that tool.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h3>Convert</h3>
              <p>Processing runs in your browser. Files are not uploaded to our servers.</p>
            </div>
            <div className="step">
              <div className="step-num">4</div>
              <h3>Download</h3>
              <p>Get the real output file, then process another if you need to.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
