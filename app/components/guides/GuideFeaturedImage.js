import { mediaAltFromGuide, mediaSrcFromGuide } from "@/lib/media";

export default function GuideFeaturedImage({ guide, title }) {
  const src = mediaSrcFromGuide(guide);
  if (!src) return null;
  const alt = mediaAltFromGuide(guide, title || guide?.title || "");
  const caption = guide?.featuredImage?.caption || "";

  return (
    <figure className="guide-hero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
