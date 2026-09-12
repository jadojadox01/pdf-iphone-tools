import { SITE_DEFINITION, SITE_NAME, SITE_TAGLINE, SITE_URL, absoluteUrl } from "./site";

export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
  keywords,
  noIndex = false,
  image,
  type = "website",
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
      type,
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

export function toolMetadata(tool, path) {
  return pageMetadata({
    title: tool.seoTitle || tool.title || tool.name,
    description: tool.seoDescription || tool.definition || tool.description,
    path: path || `/${tool.slug}`,
  });
}

export const defaultMetadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s`,
  },
  description: SITE_DEFINITION,
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/brand/logo-mark.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/brand/logo-mark.png",
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};
