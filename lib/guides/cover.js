export function guideCover(guide) {
  if (!guide) return "/guides/covers/default.svg";
  if (guide.featuredImage?.url) return guide.featuredImage.url;
  if (guide.featuredImage?.id) return `/api/media/${guide.featuredImage.id}`;
  const known = {
    "convert-pdf-to-word-on-iphone": "/guides/covers/convert-pdf-to-word-on-iphone.svg",
  };
  return known[guide.slug] || "/guides/covers/default.svg";
}

export function guideHref(guide) {
  const category = typeof guide?.category === "string" ? guide.category : guide?.category?.slug;
  return `/guides/${category || "how-to"}/${guide?.slug || ""}`;
}
