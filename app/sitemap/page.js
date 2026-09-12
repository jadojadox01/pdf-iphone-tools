import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { getPublicDirectory } from "@/lib/public-directory";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Sitemap",
  description: `A directory of ${SITE_NAME} tools, guides, and site pages.`,
  path: "/sitemap",
});

function LinkList({ items }) {
  if (!items?.length) return null;
  return (
    <ul className="sitemap-list">
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default async function HtmlSitemapPage() {
  const directory = await getPublicDirectory();

  return (
    <div className="wrap sitemap-page" style={{ padding: "32px 0 64px" }}>
      <h1>Sitemap</h1>
      <p className="lede">
        A directory of public pages on this site. Search engines also have an XML sitemap at{" "}
        <Link href="/sitemap.xml">/sitemap.xml</Link>.
      </p>

      <section className="section">
        <h2>PDF tools</h2>
        <LinkList items={directory.tools} />
      </section>

      {directory.deviceSections.map((device) => (
        <section className="section" key={device.slug}>
          <h2>Tools by device — {device.name}</h2>
          <p>
            <Link href={device.href}>{device.name} overview</Link>
          </p>
          <LinkList items={device.tools} />
        </section>
      ))}

      {directory.groupedGuides.map((group) => (
        <section className="section" key={group.slug}>
          <h2>{group.name} guides</h2>
          <p>
            <Link href={group.href}>All {group.name.toLowerCase()} guides</Link>
          </p>
          <LinkList items={group.guides} />
        </section>
      ))}

      {directory.featured.length > 0 && (
        <section className="section">
          <h2>Popular guides</h2>
          <LinkList items={directory.featured} />
        </section>
      )}

      <section className="section">
        <h2>Other resources</h2>
        <LinkList items={directory.other} />
      </section>
    </div>
  );
}
