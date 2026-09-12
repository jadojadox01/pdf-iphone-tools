import { pageMetadata } from "@/lib/seo";
import { CONTACT_EMAIL, CONTACT_WHATSAPP, CONTACT_WHATSAPP_URL, SITE_NAME } from "@/lib/site";
import Link from "next/link";

export const metadata = pageMetadata({
  title: `About ${SITE_NAME}`,
  description: `${SITE_NAME} is a set of PDF tools that run in your browser. Convert, merge, split, compress, sign, and protect files without installing an app.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="wrap prose" style={{ padding: "32px 0 64px" }}>
      <h1>About</h1>
      <p>
        {SITE_NAME} is a set of PDF tools that run in your browser. You can convert a PDF to Word, JPG, Excel, PowerPoint, or EPUB, and merge, split, compress, rotate, sign, or password-protect a file.
      </p>
      <p>
        The site exists because those jobs are awkward on a phone, especially in Safari on iPhone. You should not need another app for conversion.
      </p>
      <p>
        This website is run by the person you can reach at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or on WhatsApp at{" "}
        <a href={CONTACT_WHATSAPP_URL}>{CONTACT_WHATSAPP}</a>. There is no office address listed here.
      </p>
      <h2>What the tools do</h2>
      <p>
        Each listed tool returns a downloadable file, or a message if that PDF cannot be processed. Scanned pages can use OCR in the browser for Word, Excel, and eBook. That is slower. Check names, numbers, and tables in the result.
      </p>
      <p>
        Your file is processed locally in your browser and is not uploaded to PDFFlow&apos;s servers for normal tool processing. PDFFlow does not keep copies of those files as part of normal tool processing.
      </p>
      <h2>Guides</h2>
      <p>
        The <Link href="/guides">guides</Link> explain how to use the tools for common tasks. Questions can be sent from the <Link href="/contact">contact page</Link>. See also the <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms of Service</Link>.
      </p>
    </div>
  );
}
