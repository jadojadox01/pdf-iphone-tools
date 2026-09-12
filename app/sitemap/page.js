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
  const howTo = directory.groupedGuides.find((group) => group.slug === "how-to");
  const troubleshooting = directory.groupedGuides.find((group) => group.slug === "troubleshooting");
  const otherGuideGroups = directory.groupedGuides.filter(
    (group) => group.slug !== "how-to" && group.slug !== "troubleshooting" && group.guides.length,
  );
  const popular = [
    ...(directory.deviceSections[0] ? [{ href: directory.deviceSections[0].href, name: directory.deviceSections[0].name }] : []),
    ...directory.popularTools.slice(0, 5),
    ...directory.featured,
  ];

  return (
    <div className="wrap sitemap-page" style={{ padding: "32px 0 64px" }}>
      <h1>Sitemap</h1>
      <p className="lede">Public pages on this site. Drafts, admin screens, and empty sections are not listed.</p>

      <section className="section">
        <h2>PDF tools</h2>
        <p>
          <Link href="/tools">All PDF tools</Link>
        </p>
        <LinkList items={directory.tools} />
      </section>

      <section className="section">
        <h2>Guides</h2>
        <p>
          <Link href="/guides">All guides</Link>
        </p>
      </section>

      {howTo?.guides?.length ? (
        <section className="section">
          <h2>How-to guides</h2>
          <p>
            <Link href={howTo.href}>All how-to guides</Link>
          </p>
          <LinkList items={howTo.guides} />
        </section>
      ) : null}

      {troubleshooting?.guides?.length ? (
        <section className="section">
          <h2>Troubleshooting</h2>
          <p>
            <Link href={troubleshooting.href}>All troubleshooting guides</Link>
          </p>
          <LinkList items={troubleshooting.guides} />
        </section>
      ) : null}

      {otherGuideGroups.map((group) => (
        <section className="section" key={group.slug}>
          <h2>{group.name}</h2>
          <p>
            <Link href={group.href}>All {group.name.toLowerCase()} guides</Link>
          </p>
          <LinkList items={group.guides} />
        </section>
      ))}

      {directory.deviceSections.length > 0 && (
        <section className="section">
          <h2>Tools by device</h2>
          {directory.deviceSections.map((device) => (
            <div key={device.slug}>
              <p>
                <Link href={device.href}>{device.name} overview</Link>
              </p>
              <LinkList items={device.tools} />
            </div>
          ))}
        </section>
      )}

      {popular.length > 0 && (
        <section className="section">
          <h2>Popular resources</h2>
          <LinkList items={popular} />
        </section>
      )}

      <section className="section">
        <h2>Other resources</h2>
        <LinkList items={directory.other} />
      </section>
    </div>
  );
}
