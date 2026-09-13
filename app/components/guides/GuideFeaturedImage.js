import { mediaAltFromGuide, mediaSrcFromGuide } from "@/lib/media";
import { isUsefulCaption } from "@/lib/cms/article-display";

export default function GuideFeaturedImage({ guide, title }) {
  const src = mediaSrcFromGuide(guide) || (guide?.featuredImageId ? `/media/${guide.featuredImageId}` : "");
  if (!src) return null;
  const heading = title || guide?.title || "";
  const alt = mediaAltFromGuide(guide, heading);
  const caption = isUsefulCaption(guide?.featuredImage?.caption, heading) ? guide.featuredImage.caption : "";

  return (
    <figure className="guide-hero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
