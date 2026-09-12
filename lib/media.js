export function mediaPublicUrl(media) {
  if (!media) return "";
  const url = String(media.url || "").trim();
  if (url && (url.startsWith("/") || /^https?:\/\//i.test(url))) {
    if (url.startsWith("/api/media/")) {
      const id = url.replace("/api/media/", "").split(/[/?#]/)[0];
      return id ? `/media/${id}` : url;
    }
    return url;
  }
  if (media.id) return `/media/${media.id}`;
  return "";
}

export function mediaSrcFromGuide(guide) {
  if (!guide) return "";
  const fromRelation = mediaPublicUrl(guide.featuredImage);
  if (fromRelation) return fromRelation;
  if (guide.featuredImageId) return `/media/${guide.featuredImageId}`;
  return "";
}

export function mediaAltFromGuide(guide, fallback = "") {
  return guide?.featuredImage?.alt || fallback || guide?.title || "";
}
