import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { getTools } from "@/lib/tools";
import JsonLd, { breadcrumbJsonLd, webAppJsonLd } from "../components/JsonLd";

export const metadata = pageMetadata({
  title: "Free PDF Converter for iPhone — Convert PDF Online",
  description:
    "Convert PDF files to Word, JPG, Excel and more directly from your iPhone. Free online PDF tools with no app installation required.",
  path: "/pdf-converter-for-iphone",
  keywords: "free PDF converter for iPhone, PDF converter online, PDF tools for iPhone",
});

export default function IphoneLandingPage() {
  const tools = getTools();
  return (
    <div className="wrap" style={{ padding: "32px 0 64px" }}>
      <JsonLd data={webAppJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "PDF converter for iPhone", path: "/pdf-converter-for-iphone" },
        ])}
      />
      <h1>Free PDF converter for iPhone</h1>
      <p className="lede">
        Use these tools in Safari to convert or manage a PDF without installing an app. The same pages also work on iPad, Android, and desktop.
      </p>
      <p>
        Choose a PDF, run the tool, and download the result. Files are processed on your device.
      </p>
      <div className="steps" style={{ margin: "24px 0 32px" }}>
        <div className="step">
          <div className="step-num">1</div>
          <p>Open a tool below in Safari.</p>
        </div>
        <div className="step">
          <div className="step-num">2</div>
          <p>Pick a PDF from Files or iCloud Drive.</p>
        </div>
        <div className="step">
          <div className="step-num">3</div>
          <p>Download the converted or edited file.</p>
        </div>
      </div>
      <div className="grid-tools">
        {tools.map((tool) => (
          <Link className="tool-card" key={tool.slug} href={`/${tool.slug}`}>
            <h3>{tool.name}</h3>
            <p>{tool.intro}</p>
            <span className="cta">{tool.cta}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
