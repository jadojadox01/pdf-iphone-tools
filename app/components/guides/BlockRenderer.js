import Link from "next/link";
import { extractFaqs, extractHeadings, parseBlocks, slugFromHeading, textToParagraphs } from "@/lib/cms/blocks";
import { buildGuideLinks } from "@/lib/cms/linkify";
import { getTool } from "@/lib/tools";
import { toolPath } from "@/lib/paths";
import GuideToc from "./GuideToc";
import LinkedText from "./LinkedText";

export default function BlockRenderer({ blocks, guide }) {
  const list = parseBlocks(blocks);
  const headings = extractHeadings(list);
  const links = buildGuideLinks(guide);
  const tocIndex = list.findIndex((block) => block.type === "toc");
  const tocBlock = tocIndex >= 0 ? list[tocIndex] : null;
  const intro = tocIndex >= 0 ? list.slice(0, tocIndex) : [];
  const body = tocIndex >= 0 ? list.slice(tocIndex + 1) : list;
  const tocHeadings = headings.filter((item) => item.level === 2);
  const tocItems = tocHeadings.length >= 3 ? tocHeadings : headings;
  const showToc = Boolean(tocBlock) && tocItems.length >= 3;

  return (
    <>
      {intro.length > 0 ? (
        <div className="article-body">
          {intro.map((block, index) => (
            <Block key={block.id || `intro-${index}`} block={block} guide={guide} headings={headings} links={links} />
          ))}
        </div>
      ) : null}
      {showToc ? (
        <div className="guide-layout">
          <GuideToc title={tocBlock.data?.title} items={tocItems} />
          <div className="article-body">
            {body.map((block, index) => (
              <Block key={block.id || `body-${index}`} block={block} guide={guide} headings={headings} links={links} />
            ))}
          </div>
        </div>
      ) : (
        <div className="article-body">
          {body.map((block, index) => (
            <Block key={block.id || `body-${index}`} block={block} guide={guide} headings={headings} links={links} />
          ))}
        </div>
      )}
    </>
  );
}

export { extractFaqs, extractHeadings };

function Block({ block, guide, headings, links }) {
  const data = block.data || {};
  switch (block.type) {
    case "planning":
      return null;
    case "hero":
      return null;
    case "quickAnswer":
      return (
        <aside className="guide-standfirst">
          <RichText text={data.text} links={links} />
        </aside>
      );
    case "paragraph":
      return <RichText text={data.text} links={links} />;
    case "heading": {
      const level = Math.min(3, Math.max(2, Number(data.level) || 2));
      const Tag = `h${level}`;
      return <Tag id={slugFromHeading(data.text)}>{data.text}</Tag>;
    }
    case "image":
      return data.url ? (
        <figure className={`article-figure article-figure-${data.align || "left"}${data.wrap ? ` article-wrap-${data.wrap}` : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.url}
            alt={data.alt || ""}
            width={data.width || undefined}
            height={data.height || undefined}
            style={data.width ? { width: `${data.width}px`, height: "auto" } : undefined}
          />
          {data.annotation ? <span className="figure-label">{data.annotation}</span> : null}
          {data.caption ? <figcaption>{data.caption}</figcaption> : null}
          {data.credit ? <p className="figure-credit">Source: {data.credit}</p> : null}
        </figure>
      ) : null;
    case "video":
      return data.url && safeVideo(data.url) ? (
        <div className="video-wrap">
          <iframe src={safeVideo(data.url)} title={data.title || "Video"} allowFullScreen />
        </div>
      ) : null;
    case "quote":
      return (
        <blockquote>
          <RichText text={data.text} links={links} />
          {data.cite ? <cite>{data.cite}</cite> : null}
        </blockquote>
      );
    case "list":
      return (
        <ul>
          {(data.items || []).filter(Boolean).map((item) => (
            <li key={item}>
              <LinkedText text={item} links={links} />
            </li>
          ))}
        </ul>
      );
    case "orderedList":
      return (
        <ol>
          {(data.items || []).filter(Boolean).map((item) => (
            <li key={item}>
              <LinkedText text={item} links={links} />
            </li>
          ))}
        </ol>
      );
    case "checklist":
      return (
        <ul className="checklist">
          {(data.items || []).filter(Boolean).map((item) => (
            <li key={item}>
              <LinkedText text={item} links={links} />
            </li>
          ))}
        </ul>
      );
    case "ribbon":
      return (
        <aside className={`ribbon ribbon-${data.variant || "info"}`}>
          <strong>{data.title || data.variant}</strong>
          <RichText text={data.text} links={links} />
          {data.href && data.cta ? (
            <p>
              <Link className="btn btn-secondary" href={data.href}>
                {data.cta}
              </Link>
            </p>
          ) : null}
        </aside>
      );
    case "steps":
      return (
        <div className="steps">
          {(data.items || []).map((item, index) => (
            <div key={item.title || index}>
              <div className="step">
                <div className="step-num">{index + 1}</div>
                <div>
                  {item.title ? <h3>{item.title}</h3> : null}
                  <RichText text={item.text} links={links} />
                  {item.imageUrl ? (
                    <figure className="article-figure">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.imageUrl} alt={item.imageAlt || item.title || "Step illustration"} />
                      {item.caption ? <figcaption>{item.caption}</figcaption> : null}
                    </figure>
                  ) : null}
                </div>
              </div>
              {item.ribbonText ? (
                <aside className={`ribbon ribbon-${item.ribbonVariant || "tip"}`}>
                  <strong>{item.ribbonTitle || item.ribbonVariant || "Tip"}</strong>
                  <RichText text={item.ribbonText} links={links} />
                </aside>
              ) : null}
            </div>
          ))}
        </div>
      );
    case "example":
      if (!data.situation && !data.result && !data.text) return null;
      return (
        <aside className="guide-example">
          {data.title ? <p className="guide-example-label">{data.title}</p> : null}
          {data.situation ? <RichText text={data.situation} links={links} /> : null}
          {data.result ? <RichText text={data.result} links={links} /> : null}
          {data.text ? <RichText text={data.text} links={links} /> : null}
        </aside>
      );
    case "howItWorks":
      return data.text ? (
        <section>
          <h2 id={slugFromHeading(data.title || "How this works")}>{data.title || "How this works"}</h2>
          <RichText text={data.text} links={links} />
        </section>
      ) : null;
    case "options": {
      const items = (data.items || []).filter((item) => item.name || item.text);
      if (!items.length) return null;
      return (
        <section>
          <h2>{data.title || "Options"}</h2>
          <div className="steps">
            {items.map((item) => (
              <div className="step" key={item.name || item.text}>
                <div>
                  {item.name ? <h3>{item.name}</h3> : null}
                  <RichText text={item.text} links={links} />
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }
    case "cta":
      return data.href ? (
        <p className="guide-final">
          {data.text ? (
            <>
              <LinkedText text={data.text} links={links} />{" "}
            </>
          ) : null}
          <Link className="guide-backlink" href={data.href}>
            {data.label || "Continue"}
          </Link>
        </p>
      ) : null;
    case "toolCta": {
      const tool = getTool(data.toolSlug);
      if (!tool) return null;
      return (
        <aside className="guide-cta">
          <div>
            <strong>{data.title || "Open the tool"}</strong>
            <p>
              <LinkedText text={data.text || tool.intro} links={links} />
            </p>
          </div>
          <Link className="btn btn-primary" href={toolPath(tool.slug, guide?.device?.slug)}>
            {tool.cta}
          </Link>
        </aside>
      );
    }
    case "faq":
      return (
        <div className="guide-faq">
          {(data.items || [])
            .filter((item) => item.q)
            .map((item) => (
              <details key={item.q} className="guide-faq-item">
                <summary>
                  <span className="guide-faq-q">{item.q}</span>
                </summary>
                <div className="guide-faq-a">
                  <RichText text={item.a} links={links} />
                </div>
              </details>
            ))}
        </div>
      );
    case "troubleshooting":
      return (
        <div className="guide-issues">
          {(data.items || [])
            .filter((item) => item.problem)
            .map((item) => (
              <div className="guide-issue" key={item.problem}>
                <h3>{item.problem}</h3>
                {item.cause ? <p>{item.cause}</p> : null}
                {item.solution ? <RichText text={item.solution} links={links} /> : null}
              </div>
            ))}
        </div>
      );
    case "comparison":
      return (
        <div className="table-wrap">
          <table>
            {data.colWidths?.some(Boolean) ? (
              <colgroup>
                {data.colWidths.map((width, index) => (
                  <col key={index} style={width ? { width: `${width}px` } : undefined} />
                ))}
              </colgroup>
            ) : null}
            <thead>
              <tr>
                {(data.headers || []).map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data.rows || []).map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "prosCons":
      return (
        <div className="grid-tools">
          <div className="tool-card">
            <h3>Pros</h3>
            <ul>
              {(data.pros || []).filter(Boolean).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="tool-card">
            <h3>Cons</h3>
            <ul>
              {(data.cons || []).filter(Boolean).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "relatedTools": {
      const primary = guide?.primaryToolSlug;
      const tools = (guide?.relatedTools || [])
        .map((item) => item.slug || item)
        .map(getTool)
        .filter(Boolean)
        .filter((tool) => tool.slug !== primary);
      if (!tools.length) return null;
      return (
        <section>
          <h2>Related tools</h2>
          <div className="grid-tools">
            {tools.map((tool) => (
              <Link className="tool-card" key={tool.slug} href={toolPath(tool.slug, guide?.device?.slug)}>
                <h3>{tool.name}</h3>
                <p>{tool.intro}</p>
                <span className="cta">{tool.cta}</span>
              </Link>
            ))}
          </div>
        </section>
      );
    }
    case "relatedGuides": {
      const guides = guide?.relatedGuides || [];
      if (!guides.length) return null;
      return (
        <section>
          <h2>Related guides</h2>
          <div className="grid-tools">
            {guides.map((item) => (
              <Link className="tool-card" key={item.id} href={guideHref(item)}>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      );
    }
    case "diagram": {
      const steps = (data.steps || []).filter(Boolean);
      if (!steps.length) return null;
      return (
        <figure className="guide-diagram" aria-label={data.title || "Process"}>
          {data.title ? <figcaption>{data.title}</figcaption> : null}
          <ol>
            {steps.map((step, index) => (
              <li key={`${step}-${index}`}>
                <span>{step}</span>
                {index < steps.length - 1 ? <span className="diagram-arrow" aria-hidden="true">→</span> : null}
              </li>
            ))}
          </ol>
        </figure>
      );
    }
    case "sources": {
      const items = (data.items || []).filter((item) => item.title || item.url);
      if (!items.length) return null;
      return (
        <section className="guide-sources">
          <h2>Sources</h2>
          <ul>
            {items.map((item, index) => (
              <li key={item.url || item.title || index}>
                {item.url ? (
                  <a href={item.url} rel="noopener noreferrer">
                    {item.title || item.url}
                  </a>
                ) : (
                  <span>{item.title}</span>
                )}
                {item.note ? <p className="help">{item.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      );
    }
    case "toc":
      return null;
    case "divider":
      return <hr />;
    case "code":
      return (
        <pre>
          <code>{data.text}</code>
        </pre>
      );
    default:
      return data.text ? <RichText text={data.text} links={links} /> : null;
  }
}

function RichText({ text, links }) {
  return textToParagraphs(text).map((part, index) => (
    <p key={`${index}-${part.slice(0, 32)}`}>
      <LinkedText text={part} links={links} />
    </p>
  ));
}

function guideHref(guide) {
  const category = guide.category?.slug || "how-to";
  return `/guides/${category}/${guide.slug}`;
}

function safeVideo(src) {
  try {
    const url = new URL(src, "https://www.youtube.com");
    const host = url.hostname.replace(/^www\./, "");
    if (!/^(youtube\.com|youtu\.be|youtube-nocookie\.com)$/.test(host)) return "";
    let id = url.searchParams.get("v");
    if (!id && host === "youtu.be") id = url.pathname.replace(/^\//, "");
    if (!id && url.pathname.includes("/embed/")) id = url.pathname.split("/embed/")[1];
    if (!id) return "";
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id.split("/")[0])}`;
  } catch {
    return "";
  }
}
