import { redirect } from "next/navigation";
import { getPublishedDevice } from "@/lib/cms/guides";
import { pageMetadata } from "@/lib/seo";

export async function deviceHubMetadata(slug, fallbackTitle) {
  const device = await getPublishedDevice(slug).catch(() => null);
  if (!device) {
    return pageMetadata({
      title: fallbackTitle || "PDF tools",
      description: "Convert, merge, split, and compress PDFs in your browser.",
      path: "/tools",
      noIndex: true,
    });
  }
  return pageMetadata({
    title: device.seoTitle || device.name || fallbackTitle,
    description: device.seoDescription || device.description || device.intro,
    path: `/${slug}`,
  });
}

export async function requirePublishedDevice(slug) {
  const device = await getPublishedDevice(slug).catch(() => null);
  if (!device) redirect("/tools");
  return device;
}
