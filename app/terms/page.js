import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { CONTACT_EMAIL, CONTACT_WHATSAPP, CONTACT_WHATSAPP_URL, SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: `Terms for using the free browser-based PDF tools on ${SITE_NAME}.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="wrap prose" style={{ padding: "32px 0 64px" }}>
      <h1>Terms of Service</h1>
      <p>Last updated: 12 September 2026</p>
      <p>
        By using {SITE_NAME}, you agree to these terms. The tools and guides are provided free of
        charge, as they are, for lawful personal and business use.
      </p>

      <h2>What this site is</h2>
      <p>
        {SITE_NAME} is a small independent website of PDF tools that run in your browser, plus
        written guides. It is not a hosted file store, a paid account product, or a staffed support
        desk. Questions can be sent to{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or WhatsApp{" "}
        <a href={CONTACT_WHATSAPP_URL}>{CONTACT_WHATSAPP}</a>.
      </p>

      <h2>Your files</h2>
      <p>
        You keep ownership of files you process. Your file is processed locally in your browser and is not uploaded to PDFFlow&apos;s servers for normal tool processing. This site does not host the PDFs you convert and does not keep copies of them as part of normal tool processing.
      </p>
      <p>
        You are responsible for having the right to convert, merge, split, sign, protect, or unlock
        a file. Unlock PDF only removes a password you already know. It does not bypass encryption
        or recover unknown passwords.
      </p>

      <h2>Results are not guaranteed</h2>
      <p>
        Output depends on the source PDF and on your device. Text extraction, tables, compression,
        signatures, and OCR can fail or look wrong — especially on scans, unusual layouts, damaged
        files, or non-English text. Check every download before you rely on it. Keep your original
        file until you have confirmed that the downloaded result is correct and usable. {SITE_NAME}{" "}
        does not guarantee conversion quality, OCR accuracy, or that a file can be recovered.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Use the site only with files you are allowed to process. Do not use it to break the law, to
        spread malware, or to attack other systems.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        The service is provided without warranties. To the extent the law allows, {SITE_NAME} is
        not liable for lost data, failed conversions, or other damages arising from use of the
        tools or guides.
      </p>

      <h2>Changes</h2>
      <p>
        These terms may be updated when the site changes. The date at the top of this page is the
        current version.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: the <Link href="/contact">contact page</Link>.
      </p>
    </div>
  );
}
