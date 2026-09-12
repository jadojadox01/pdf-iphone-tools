import Link from "next/link";
import GuideCard from "./GuideCard";
import { serializeGuideCard } from "@/lib/cms/guides";

export default function RecentArticles({ guides = [] }) {
  const items = guides.map((guide) => serializeGuideCard(guide) || guide).filter(Boolean);
  if (!items.length) return null;

  return (
    <section className="section blog-articles">
      <div className="section-head">
        <h2>Guides</h2>
        <Link href="/guides">All guides</Link>
      </div>
      <div className="blog-article-list">
        {items.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>
    </section>
  );
}
