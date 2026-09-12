export const DEVICE_SLUGS = ["iphone", "android", "windows", "mac"];

/** iPhone tool URLs with unique Safari / Files copy. Other tools stay on /tools. */
export const IPHONE_TOOL_PAGES = ["pdf-to-word", "pdf-to-jpg", "merge-pdf", "split-pdf", "compress-pdf"];

export function toolPath(slug, device) {
  if (device === "iphone" && IPHONE_TOOL_PAGES.includes(slug)) return `/iphone/${slug}`;
  return `/tools/${slug}`;
}

export function hasDeviceToolPage(device, slug) {
  return device === "iphone" && IPHONE_TOOL_PAGES.includes(slug);
}
