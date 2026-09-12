import { SITE_NAME, SITE_URL } from "@/lib/site";
import { getPublicGuides, guidePath } from "@/lib/cms/guides";

export async function GET() {
  const { guides } = await getPublicGuides({ take: 50 });
  const items = guides
    .map(
      (guide) => `
    <item>
      <title>${escapeXml(guide.title)}</title>
      <link>${SITE_URL}${guidePath(guide)}</link>
      <guid>${SITE_URL}${guidePath(guide)}</guid>
      <pubDate>${new Date(guide.publishedAt || guide.createdAt).toUTCString()}</pubDate>
      <description>${escapeXml(guide.excerpt)}</description>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)} Guides</title>
    <link>${SITE_URL}/guides</link>
    <description>Published PDF guides from ${escapeXml(SITE_NAME)}.</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
