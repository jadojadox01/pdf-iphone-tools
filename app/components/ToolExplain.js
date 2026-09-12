import Link from "next/link";
import { guidePath } from "@/lib/cms/guides";
import { toolPath } from "@/lib/paths";
import ToolCard from "./ToolCard";

export default function ToolExplain({ explain, related = [], relatedGuides = [], device }) {
  if (!explain) return null;
  const how = explain.how || [];
  const faqs = explain.faqs || [];
  const problems = explain.problems || [];

  return (
    <div className="tool-explain">
      {explain.deviceNote ? <p className="help">{explain.deviceNote}</p> : null}

      {explain.does?.length ? (
        <section className="section">
          <h2>What this tool does</h2>
          {explain.does.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ) : null}

      {explain.why?.length ? (
        <section className="section">
          <h2>When to use it</h2>
          {explain.why.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {explain.usefulFor?.length ? (
            <ul>
              {explain.usefulFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {explain.files ? (
        <section className="section">
          <h2>Files</h2>
          <p>{explain.files}</p>
        </section>
      ) : null}

      {how.length ? (
        <section className="section">
          <h2>{explain.howTitle || "How to use this tool"}</h2>
          <div className="steps">
            {how.map((step, index) => (
              <div className="step" key={step}>
                <div className="step-num">{index + 1}</div>
                <p style={{ margin: 0 }}>{step}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {explain.options?.length ? (
        <section className="section">
          <h2>Options</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Option</th>
                  <th>What it means</th>
                  <th>When to use it</th>
                </tr>
              </thead>
              <tbody>
                {explain.options.map((option) => (
                  <tr key={option.name}>
                    <td>{option.name}</td>
                    <td>{option.meaning}</td>
                    <td>{option.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {explain.happens?.length ? (
        <section className="section">
          <h2>What happens to the file</h2>
          {explain.happens.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ) : null}

      {explain.example?.steps?.length ? (
        <section className="section">
          <h2>{explain.example.title || "Example"}</h2>
          <ol className="explain-example">
            {explain.example.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      ) : null}

      {explain.tip ? (
        <div className="ribbon ribbon-tip">
          <strong>Tip</strong>
          <p>{explain.tip}</p>
        </div>
      ) : null}

      {explain.important ? (
        <div className="ribbon ribbon-important">
          <strong>Important</strong>
          <p>{explain.important}</p>
        </div>
      ) : null}

      {explain.limits?.length ? (
        <section className="section">
          <h2>Limits</h2>
          <ul>
            {explain.limits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {problems.length ? (
        <section className="section">
          <h2>If something goes wrong</h2>
          <div className="trouble-list">
            {problems.map((item) => (
              <div className="trouble-item" key={item.problem}>
                <h3>{item.problem}</h3>
                {item.cause ? <p>{item.cause}</p> : null}
                {item.solution ? <p>{item.solution}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {explain.privacy?.length ? (
        <section className="section">
          <h2>Privacy</h2>
          {explain.privacy.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ) : null}

      {faqs.length ? (
        <section className="section">
          <h2>Frequently asked questions</h2>
          <div className="faq">
            {faqs.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {relatedGuides.length ? (
        <section className="section">
          <h2>Guides for this tool</h2>
          <div className="stack-links">
            {relatedGuides.map((guide) => (
              <Link key={guide.id || guide.slug} href={guide.path || guidePath(guide)}>
                {guide.title}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="section">
          <h2>Related tools</h2>
          <div className="grid-tools">
            {related.map((item) => (
              <ToolCard
                key={item.slug}
                tool={item}
                href={toolPath(item.slug, device)}
                description={item.definition || item.intro}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
