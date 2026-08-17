import { SITE_URL } from "@/lib/site";
import { getTools } from "@/lib/tools";
import { getCategoriesWithCounts, getPublicGuides } from "@/lib/cms/guides";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const [{ guides }, categories] = await Promise.all([
    getPublicGuides({ take: 500 }),
    getCategoriesWithCounts(),
  ]);

  const tools = getTools().map((tool) => ({
    url: `${SITE_URL}/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const publishedGuides = guides.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: new Date(guide.updatedAt || guide.publishedAt || Date.now()),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const categoryPages = categories.map((category) => ({
    url: `${SITE_URL}/guides/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const staticPages = ["", "/tools", "/guides", "/about", "/contact", "/privacy", "/terms", "/cookies", "/pdf-converter-for-iphone"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: path === "" ? 1 : 0.7,
    }),
  );

  return [...staticPages, ...tools, ...categoryPages, ...publishedGuides];
}
