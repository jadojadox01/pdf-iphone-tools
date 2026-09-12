const TOOL_REDIRECTS = [
  "pdf-to-jpg",
  "pdf-to-png",
  "pdf-to-excel",
  "pdf-to-ppt",
  "pdf-to-ebook",
  "word-to-pdf",
  "image-to-pdf",
  "image-to-jpg",
  "heic-to-jpg",
  "extract-images",
  "merge-pdf",
  "split-pdf",
  "compress-pdf",
  "rotate-pdf",
  "sign-pdf",
  "protect-pdf",
  "unlock-pdf",
].map((slug) => ({
  source: `/${slug}`,
  destination: `/tools/${slug}`,
  permanent: true,
}));

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["exceljs", "@prisma/client", "tesseract.js"],
  transpilePackages: ["pdfjs-dist", "heic2any"],
  outputFileTracingIncludes: {
    "/*": ["./data/cms.db", "./prisma/**/*"],
    "/guides/**": ["./data/cms.db"],
    "/iphone/**": ["./data/cms.db"],
    "/authors/**": ["./data/cms.db"],
    "/api/**": ["./data/cms.db"],
    "/xml-sitemap": ["./data/cms.db"],
  },
  async redirects() {
    return [
      { source: "/blog/how-to-convert-pdf-to-word-on-iphone", destination: "/guides/how-to/convert-pdf-to-word-on-iphone", permanent: true },
      { source: "/guides/how-to-convert-pdf-to-word-on-iphone", destination: "/guides/how-to/convert-pdf-to-word-on-iphone", permanent: true },
      { source: "/guides/search", destination: "/search", permanent: false },
      { source: "/blog", destination: "/guides", permanent: true },
      { source: "/blog/:slug", destination: "/guides/:slug", permanent: true },
      { source: "/guides/category/:slug", destination: "/guides/:slug", permanent: true },
      { source: "/pdf-to-word", destination: "/iphone/pdf-to-word", permanent: true },
      { source: "/free-pdf-to-word-iphone", destination: "/iphone/pdf-to-word", permanent: true },
      { source: "/free-pdf-to-word-iphone-ios", destination: "/iphone/pdf-to-word", permanent: true },
      { source: "/pdf-converter-for-iphone", destination: "/iphone", permanent: true },
      { source: "/pdf-converter-no-app-iphone", destination: "/iphone", permanent: true },
      { source: "/pdf-converter-no-app-iphone-promax-new-iphone", destination: "/iphone", permanent: true },
      { source: "/free-pdf-converter-ios", destination: "/iphone", permanent: true },
      { source: "/free-pdf-converter-ios-phones", destination: "/iphone", permanent: true },
      { source: "/convert-pdf-to-jpg-iphone", destination: "/iphone/pdf-to-jpg", permanent: true },
      { source: "/convert-pdf-to-jpg-iphone-ios", destination: "/iphone/pdf-to-jpg", permanent: true },
      { source: "/merge-pdf-iphone", destination: "/iphone/merge-pdf", permanent: true },
      { source: "/split-pdf-iphone", destination: "/iphone/split-pdf", permanent: true },
      { source: "/compress-pdf-iphone", destination: "/iphone/compress-pdf", permanent: true },
      { source: "/pdf-to-excel-iphone", destination: "/tools/pdf-to-excel", permanent: true },
      { source: "/pdf-to-ppt-iphone", destination: "/tools/pdf-to-ppt", permanent: true },
      { source: "/sign-pdf-iphone", destination: "/tools/sign-pdf", permanent: true },
      { source: "/rotate-pdf-iphone", destination: "/tools/rotate-pdf", permanent: true },
      { source: "/protect-pdf-iphone", destination: "/tools/protect-pdf", permanent: true },
      { source: "/unlock-pdf-iphone", destination: "/tools/unlock-pdf", permanent: true },
      { source: "/pdf-to-epub-iphone", destination: "/tools/pdf-to-ebook", permanent: true },
      ...TOOL_REDIRECTS,
    ];
  },
  async rewrites() {
    return [{ source: "/sitemap.xml", destination: "/xml-sitemap" }];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/search",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/authors/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
      {
        source: "/android",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
      {
        source: "/windows",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
      {
        source: "/mac",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
      {
        source: "/xml-sitemap",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/tesseract/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
