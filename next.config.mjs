/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["exceljs", "@prisma/client"],
  transpilePackages: ["pdfjs-dist"],
  outputFileTracingIncludes: {
    "/*": ["./data/cms.db", "./prisma/**/*"],
    "/guides/**": ["./data/cms.db"],
    "/authors/**": ["./data/cms.db"],
    "/api/**": ["./data/cms.db"],
    "/sitemap.xml": ["./data/cms.db"],
  },
  async redirects() {
    return [
      { source: "/blog", destination: "/guides", permanent: true },
      { source: "/blog/:slug", destination: "/guides/:slug", permanent: true },
      { source: "/free-pdf-to-word-iphone", destination: "/pdf-to-word", permanent: true },
      { source: "/free-pdf-to-word-iphone-ios", destination: "/pdf-to-word", permanent: true },
      { source: "/convert-pdf-to-jpg-iphone", destination: "/pdf-to-jpg", permanent: true },
      { source: "/convert-pdf-to-jpg-iphone-ios", destination: "/pdf-to-jpg", permanent: true },
      { source: "/pdf-converter-no-app-iphone", destination: "/pdf-converter-for-iphone", permanent: true },
      { source: "/pdf-converter-no-app-iphone-promax-new-iphone", destination: "/pdf-converter-for-iphone", permanent: true },
      { source: "/free-pdf-converter-ios", destination: "/pdf-converter-for-iphone", permanent: true },
      { source: "/free-pdf-converter-ios-phones", destination: "/pdf-converter-for-iphone", permanent: true },
      { source: "/merge-pdf-iphone", destination: "/merge-pdf", permanent: true },
      { source: "/split-pdf-iphone", destination: "/split-pdf", permanent: true },
      { source: "/compress-pdf-iphone", destination: "/compress-pdf", permanent: true },
      { source: "/pdf-to-excel-iphone", destination: "/pdf-to-excel", permanent: true },
      { source: "/pdf-to-ppt-iphone", destination: "/pdf-to-ppt", permanent: true },
      { source: "/sign-pdf-iphone", destination: "/sign-pdf", permanent: true },
      { source: "/rotate-pdf-iphone", destination: "/rotate-pdf", permanent: true },
      { source: "/protect-pdf-iphone", destination: "/protect-pdf", permanent: true },
      { source: "/unlock-pdf-iphone", destination: "/unlock-pdf", permanent: true },
      { source: "/pdf-to-epub-iphone", destination: "/pdf-to-ebook", permanent: true },
    ];
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
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
