import { mediaSrcFromGuide } from "@/lib/media";

export function guideCover(guide) {
  return mediaSrcFromGuide(guide) || "/guides/covers/default.svg";
}

export function guideHref(guide) {
  const category = typeof guide?.category === "string" ? guide.category : guide?.category?.slug;
  return `/guides/${category || "how-to"}/${guide?.slug || ""}`;
}
