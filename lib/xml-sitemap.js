import { SITE_URL } from "@/lib/site";
import { getTools } from "@/lib/tools";
import { getCategoriesWithCounts, getPublicGuides, guidePath } from "@/lib/cms/guides";
import { IPHONE_TOOL_PAGES, toolPath } from "@/lib/paths";

export async function getSitemapEntries() {
  const [{ guides }, categories] = await Promise.all([
    getPublicGuides({ take: 500 }),
    getCategoriesWithCounts(),
  ]);

  const catalog = getTools();
  const tools = catalog.map((tool) => ({
    url: `${SITE_URL}${toolPath(tool.slug)}`,
    lastModified: new Date(),
  }));
  const iphoneTools = IPHONE_TOOL_PAGES.map((slug) => ({
    url: `${SITE_URL}${toolPath(slug, "iphone")}`,
    lastModified: new Date(),
  }));
  const publishedGuides = guides
    .filter((guide) => !String(guide.robots || "").includes("noindex"))
    .map((guide) => ({
      url: `${SITE_URL}${guidePath(guide)}`,
      lastModified: new Date(guide.updatedAt || guide.publishedAt || Date.now()),
    }));
  const categoryPages = categories.map((category) => ({
    url: `${SITE_URL}/guides/${category.slug}`,
    lastModified: new Date(),
  }));
  const staticPages = [
    "",
    "/iphone",
    "/tools",
    "/guides",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/cookies",
    "/sitemap",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...tools, ...iphoneTools, ...categoryPages, ...publishedGuides];
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function sitemapXml(entries) {
  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastModified ? new Date(entry.lastModified).toISOString() : "";
      return `<url><loc>${escapeXml(entry.url)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}
