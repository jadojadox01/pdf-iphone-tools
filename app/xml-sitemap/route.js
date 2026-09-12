import { getSitemapEntries, sitemapXml } from "@/lib/xml-sitemap";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const xml = sitemapXml(await getSitemapEntries());
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    return new Response("Sitemap unavailable.", { status: 500 });
  }
}
