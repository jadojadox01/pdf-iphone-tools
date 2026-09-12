import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function webAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/brand/logo.png"),
    image: absoluteUrl("/brand/logo-mark.png"),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "iOS, Android, Windows, macOS, Linux",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "PDFFlow is a website of PDF tools that run in your browser. Convert, merge, split, compress, sign, and protect files without installing an app.",
    featureList: [
      "PDF to Word",
      "PDF to JPG",
      "Merge PDF",
      "Split PDF",
      "Compress PDF",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "PDFFlow is a website of PDF tools that run in your browser. Convert, merge, split, compress, sign, and protect PDFs without installing an app.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function toolListJsonLd(tools) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PDF tools",
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      description: tool.definition || tool.description,
      url: absoluteUrl(`/tools/${tool.slug}`),
    })),
  };
}

export function definedTermJsonLd(tool, path) {
  if (!tool?.definition) return null;
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: tool.name,
    description: tool.definition,
    url: absoluteUrl(path),
  };
}

export function faqJsonLd(faqs, path) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
    url: absoluteUrl(path),
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
