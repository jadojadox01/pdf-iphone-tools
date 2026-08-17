import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "About PDF iPhone Tools",
  description:
    "PDF iPhone Tools is a free browser-based PDF utility. Convert, merge, compress, split, sign, and protect PDFs without installing an app.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="wrap prose" style={{ padding: "32px 0 64px" }}>
      <h1>About</h1>
      <p>
        {SITE_NAME} is a free PDF utility that runs in the browser. It exists because many people — especially iPhone users in Safari — need to convert or tidy a PDF without installing another app.
      </p>
      <p>
        The product is operated by the team behind this website. Guides are published under the {SITE_NAME} byline unless a real person is named as the author. We do not invent staff names, user counts, or testimonials.
      </p>
      <h2>What you can do</h2>
      <p>
        Convert PDFs to Word, JPG, Excel, PowerPoint, or EPUB. Merge, split, compress, rotate, sign, password-protect, or unlock a PDF when you already know the password. Every listed tool is meant to return a real file, or an honest error if the PDF cannot be processed.
      </p>
      <p>
        Files are processed on your device. They are not uploaded to our servers for conversion, and we do not keep copies of your documents.
      </p>
      <h2>Guides</h2>
      <p>
        The <Link href="/guides">Guides</Link> section explains how to use these tools for common tasks, including iPhone workflows. Articles are written and published from an editorial dashboard. We prefer fewer, useful guides over keyword pages.
      </p>
      <p>
        Questions can be sent from the <Link href="/contact">contact page</Link>. Privacy and terms are published at <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms of Service</Link>.
      </p>
    </div>
  );
}
