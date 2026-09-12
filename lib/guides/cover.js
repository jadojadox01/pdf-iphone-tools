import { mediaSrcFromGuide } from "@/lib/media";

export function guideCover(guide) {
  const featured = mediaSrcFromGuide(guide);
  if (featured) return featured;
  if (!guide) return "/guides/covers/default.svg";
  const known = {
    "convert-pdf-to-word-on-iphone": "/guides/covers/convert-pdf-to-word-on-iphone.svg",
  };
  return known[guide.slug] || "/guides/covers/default.svg";
}

export function guideHref(guide) {
  const category = typeof guide?.category === "string" ? guide.category : guide?.category?.slug;
  return `/guides/${category || "how-to"}/${guide?.slug || ""}`;
}
