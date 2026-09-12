import { getTools } from "@/lib/tools";
import { getCategoriesWithCounts, getPublicGuides, getPublishedDevices, guidePath } from "@/lib/cms/guides";
import { IPHONE_TOOL_PAGES, toolPath } from "@/lib/paths";

export const STATIC_DIRECTORY_PAGES = [
  { href: "/about", name: "About" },
  { href: "/contact", name: "Contact" },
  { href: "/privacy", name: "Privacy Policy" },
  { href: "/terms", name: "Terms of Service" },
  { href: "/cookies", name: "Cookie Policy" },
  { href: "/tools", name: "All PDF tools" },
  { href: "/guides", name: "Guides" },
];

export async function getPublicDirectory() {
  const [{ guides }, categories, devices] = await Promise.all([
    getPublicGuides({ take: 200 }),
    getCategoriesWithCounts(),
    getPublishedDevices().catch(() => []),
  ]);

  const tools = getTools().map((tool) => ({
    href: toolPath(tool.slug),
    name: tool.name,
    blurb: tool.definition || tool.description,
  }));

  const deviceSections = devices.map((device) => {
    const deviceTools =
      device.slug === "iphone"
        ? IPHONE_TOOL_PAGES.map((slug) => {
            const tool = tools.find((item) => item.href === toolPath(slug));
            return tool
              ? { href: toolPath(slug, "iphone"), name: `${tool.name} on iPhone` }
              : null;
          }).filter(Boolean)
        : [];
    return {
      slug: device.slug,
      name: device.name,
      href: `/${device.slug}`,
      tools: deviceTools,
    };
  });

  const groupedGuides = categories.map((category) => ({
    slug: category.slug,
    name: category.name,
    href: `/guides/${category.slug}`,
    guides: guides
      .filter((guide) => guide.category?.slug === category.slug)
      .map((guide) => ({ href: guidePath(guide), name: guide.title })),
  }));

  const featured = guides
    .filter((guide) => guide.featured)
    .map((guide) => ({ href: guidePath(guide), name: guide.title }));

  return {
    tools,
    deviceSections,
    groupedGuides,
    featured,
    other: STATIC_DIRECTORY_PAGES,
  };
}
