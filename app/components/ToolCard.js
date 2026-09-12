import Link from "next/link";
import { toolPath } from "@/lib/paths";
import { Icon } from "./Icons";

export default function ToolCard({ tool, href, title, description, showCta = true }) {
  if (!tool) return null;
  return (
    <Link className="tool-card" href={href || toolPath(tool.slug)}>
      <span className="tool-card-top">
        <span className="tool-icon" aria-hidden="true">
          <Icon name={tool.icon} />
        </span>
        <h3>{title || tool.name}</h3>
      </span>
      <p className="tool-definition">{description || tool.definition || tool.intro}</p>
      {showCta && tool.cta ? <span className="cta">{tool.cta}</span> : null}
    </Link>
  );
}
