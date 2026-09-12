import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { CONTACT_EMAIL, CONTACT_WHATSAPP, CONTACT_WHATSAPP_URL, SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles files, page visits, and cookies. PDF conversion runs in your browser and is not uploaded to our servers.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="wrap prose" style={{ padding: "32px 0 64px" }}>
      <h1>Privacy Policy</h1>
      <p>Last updated: 11 September 2026</p>
      <p>
        This policy describes how {SITE_NAME} actually works. It is written for a small independent
        website, not a large company. We do not claim certifications, offices, or staff that we do
        not have.
      </p>

      <h2>Who runs this site</h2>
      <p>
        {SITE_NAME} is operated by the person you can reach at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or on WhatsApp at{" "}
        <a href={CONTACT_WHATSAPP_URL}>{CONTACT_WHATSAPP}</a>. There is no office address listed
        here.
      </p>

      <h2>PDF files you convert</h2>
      <p>
        Every PDF tool on this site runs in your browser. The PDF you choose is not uploaded to our
        servers for conversion, merge, split, compression, rotation, signing, password protection,
        unlocking, or OCR. We do not receive a copy of that file, we cannot read it, and we do not
        store it.
      </p>
      <p>
        Processing happens in the current browser tab. The result is a download created on your
        device. Closing the tab clears that in-memory copy. Nothing in this section means the rest
        of the website makes no network requests — see below.
      </p>

      <h2>OCR</h2>
      <p>
        PDF to Word, PDF to Excel, and PDF to eBook can run optical character recognition when a
        page has little embedded text. OCR runs locally in the browser using Tesseract.js. The
        engine files and English language data are loaded from this website (under{" "}
        <code>/tesseract</code>), not from a third-party OCR API. The PDF itself is not sent to us
        or to an OCR service.
      </p>
      <p>
        OCR currently uses English, and only a limited number of scanned pages in one run. It can
        misread text. Check the download before you rely on it.
      </p>

      <h2>Unlocking a PDF</h2>
      <p>
        Unlock PDF only works if you enter a password that already opens the file. {SITE_NAME} does
        not bypass encryption or guess passwords. You should only process files you are allowed to
        use.
      </p>

      <h2>What leaves your browser besides the PDF</h2>
      <p>The PDF tools do not upload your document. Other parts of the site still use the network:</p>
      <ul>
        <li>
          <strong>Loading a page.</strong> Your browser requests that page from the computers that
          host this website. Those requests typically include an IP address, browser details, and
          the page address. That is how websites are delivered. It is not a copy of your PDF.
        </li>
        <li>
          <strong>Fonts.</strong> Pages load fonts from Google Fonts. Google can see that a browser
          at your IP address requested those font files.
        </li>
        <li>
          <strong>Analytics (optional).</strong> If you accept analytics cookies, Google Analytics 4
          loads and may collect page addresses, approximate location, device, and browser
          information. The site code does not send PDF contents or filenames to analytics. See the{" "}
          <Link href="/cookies">Cookie Policy</Link>.
        </li>
        <li>
          <strong>Guide view counts.</strong> Opening a published guide sends the guide’s slug to
          this site so we can show an approximate view count. This browser may remember that locally
          so the same visit is not counted twice. That request does not include a PDF file.
        </li>
        <li>
          <strong>Share buttons.</strong> On guides, Facebook, LinkedIn, and X links open those
          sites with the guide’s page address and title. They run only if you click them. They do
          not send your PDFs.
        </li>
        <li>
          <strong>Videos in guides.</strong> A guide may include a YouTube embed. If it does,
          YouTube may receive a request when that page loads.
        </li>
        <li>
          <strong>Contact.</strong> Email and WhatsApp send whatever you choose to send, using your
          own apps. The contact form opens an email draft. It does not store the message on this
          website.
        </li>
      </ul>

      <h2>Accounts and the private dashboard</h2>
      <p>
        People who use the PDF tools do not create accounts. There is no customer login for
        conversion.
      </p>
      <p>
        A private dashboard is used to publish guides and related site content. Signing in uses a
        password checked on this site. Session information is kept in a first-party cookie named{" "}
        <code>admin_session</code>. The dashboard can store authors, guides, and images used in
        those guides. That is editorial content for running the site, not a database of people who
        converted PDFs.
      </p>

      <h2>Cookies</h2>
      <p>
        Cookies used by this site are listed in the <Link href="/cookies">Cookie Policy</Link>. PDF
        tools do not depend on them. Google Analytics cookies are set only if you accept analytics.
      </p>

      <h2>Advertising</h2>
      <p>
        This site does not show ads. Before Google ads are shown to visitors in the EEA, the UK, or Switzerland, a
        Google-certified consent management platform is required, and this policy will be updated.
      </p>

      <h2>Questions</h2>
      <p>
        Privacy questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, WhatsApp{" "}
        <a href={CONTACT_WHATSAPP_URL}>{CONTACT_WHATSAPP}</a>, or the{" "}
        <Link href="/contact">contact page</Link>.
      </p>
    </div>
  );
}
