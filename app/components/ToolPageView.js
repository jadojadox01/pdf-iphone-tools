import Link from "next/link";
import ToolWorkspace from "./ToolWorkspace";
import JsonLd, { breadcrumbJsonLd, faqJsonLd } from "./JsonLd";
import { getRelatedTools } from "@/lib/tools";

export default function ToolPageView({ tool, relatedGuides = [] }) {
  const related = getRelatedTools(tool.slug);

  return (
    <div className="wrap" style={{ padding: "28px 0 48px" }}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "PDF Tools", path: "/tools" },
          { name: tool.name, path: `/${tool.slug}` },
        ])}
      />
      <JsonLd data={faqJsonLd(tool.faqs, `/${tool.slug}`)} />

      <p className="help">
        <Link href="/">Home</Link> / <Link href="/tools">PDF Tools</Link> / {tool.name}
      </p>
      <h1>{tool.h1}</h1>
      <p className="lede">{tool.intro}</p>
      <p className="help">
        {tool.audience} {tool.afterUpload}
      </p>

      <ToolWorkspace tool={tool} />

      <section className="section">
        <h2>{tool.howToTitle}</h2>
        <div className="steps">
          {tool.howTo.map((step, index) => (
            <div className="step" key={step}>
              <div className="step-num">{index + 1}</div>
              <p style={{ margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Frequently asked questions</h2>
        <div className="faq">
          {tool.faqs.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {relatedGuides.length > 0 && (
        <section className="section">
          <h2>Guides for this tool</h2>
          <div className="grid-tools">
            {relatedGuides.map((guide) => (
              <Link className="tool-card" key={guide.id} href={`/guides/${guide.slug}`}>
                <h3>{guide.title}</h3>
                <p>{guide.excerpt}</p>
                <span className="cta">Read guide</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <h2>Related tools</h2>
        <div className="grid-tools">
          {related.map((item) => (
            <Link className="tool-card" key={item.slug} href={`/${item.slug}`}>
              <span className="icon-badge">{item.shortName.slice(0, 2)}</span>
              <h3>{item.name}</h3>
              <p>{item.intro}</p>
              <span className="cta">{item.cta}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
