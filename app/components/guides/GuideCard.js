import Link from "next/link";
import { guideCover, guideHref } from "@/lib/guides/cover";

export default function GuideCard({ guide, featured = false }) {
  if (!guide) return null;
  const href = guideHref(guide);
  const cover = guideCover(guide);
  const meta = [guide.category?.name, guide.publishedAt ? formatCardDate(guide.publishedAt) : ""]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link className={`guide-card${featured ? " guide-card-featured" : ""}`} href={href}>
      <span className="guide-card-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt={guide.featuredImage?.alt || ""} />
      </span>
      <span className="guide-card-body">
        <strong>{guide.title}</strong>
        {meta ? <span className="guide-card-kicker">{meta}</span> : null}
        {featured && guide.excerpt ? <span className="guide-card-excerpt">{guide.excerpt}</span> : null}
        {featured ? <span className="btn btn-secondary guide-card-more">Read more</span> : null}
      </span>
    </Link>
  );
}

function formatCardDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
