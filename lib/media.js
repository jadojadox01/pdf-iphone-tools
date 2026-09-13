export function mediaPublicUrl(media) {
  if (!media) return "";
  if (media.id) return `/media/${media.id}`;
  const url = String(media.url || "").trim();
  if (url.startsWith("/api/media/")) {
    const id = url.replace("/api/media/", "").split(/[/?#]/)[0];
    return id ? `/media/${id}` : url;
  }
  if (url.startsWith("/") || (/^https?:\/\//i.test(url) && !/blob\.vercel-storage\.com/i.test(url))) {
    return url;
  }
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
