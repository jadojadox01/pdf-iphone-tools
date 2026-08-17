import { SITE_NAME, SITE_URL, absoluteUrl } from "./site";

export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
  keywords,
  noIndex = false,
  image,
}) {
  const url = path?.startsWith("http") ? path : absoluteUrl(path);
  const images = image ? [{ url: image.startsWith("http") ? image : absoluteUrl(image) }] : undefined;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: ogTitle || title,
      description: ogDescription || description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle || title,
      description: ogDescription || description,
      images: images?.map((item) => item.url),
    },
  };
}

export function toolMetadata(tool) {
  return pageMetadata({
    title: tool.title,
    description: tool.description,
    path: `/${tool.slug}`,
  });
}

export const defaultMetadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Free PDF Tools for iPhone — Convert PDF Online",
    template: `%s`,
  },
  description:
    "Convert, merge, compress, split, sign, and manage PDFs directly from your browser — no app required. Free online PDF tools for iPhone, iPad, Android, and desktop.",
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
};
