import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { CONTACT_EMAIL, CONTACT_WHATSAPP, CONTACT_WHATSAPP_URL, SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Cookie Policy",
  description: `Cookies used by ${SITE_NAME}: dashboard session and optional Google Analytics.`,
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <div className="wrap prose" style={{ padding: "32px 0 64px" }}>
      <h1>Cookie Policy</h1>
      <p>Last updated: 12 September 2026</p>
      <p>
        This page lists cookies this website actually uses. PDF files are processed in your browser
        and are not stored in cookies. The PDF tools work if you decline analytics.
      </p>
      <p>
        You can change your analytics choice at any time from <strong>Cookie settings</strong> in
        the footer.
      </p>

      <h2>Cookies this site sets</h2>
      <div className="legal-table-wrap">
        <table className="legal-table">
          <colgroup>
            <col className="legal-col-name" />
            <col className="legal-col-purpose" />
            <col className="legal-col-duration" />
            <col className="legal-col-type" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Purpose</th>
              <th scope="col">Duration</th>
              <th scope="col">Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>admin_session</code>
              </td>
              <td>
                Keeps the private guides dashboard signed in. Set only after a successful dashboard
                login. HTTP-only. SameSite Lax. Secure on the live site. Not used for PDF tools or
                advertising.
              </td>
              <td>7 days</td>
              <td>First-party, essential for the dashboard</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Google Analytics (optional)</h2>
      <p>
        If you accept analytics, this site loads Google Analytics 4 (gtag.js). Google may then set
        its own first-party cookies on this domain. The names are controlled by Google. They
        commonly include <code>_ga</code> and a cookie beginning with <code>_ga_</code>.
      </p>
      <p>
        Analytics is used to see which pages are opened. The application code does not send PDF
        contents, filenames, or custom “document converted” events. Google Analytics may still
        collect standard usage data such as page address, approximate location, device type, and
        browser type. IP-related information is processed by Google as part of that service; this
        site does not configure IP anonymization.
      </p>
      <p>
        Analytics scripts load only after you accept. If you decline, they are not loaded. Your
        choice is stored in this browser’s local storage (not as a cookie) under{" "}
        <code>pdfflow-analytics</code>. When the script loads, advertising storage stays denied.
        This site’s own banner is not a Google-certified consent management platform. Before serving
        personalized Google ads to visitors in the EEA, the UK, or Switzerland, Google requires
        publishers to use a Google-certified consent management platform (CMP) integrated with the
        IAB Transparency and Consent Framework. PDFFlow does not currently show ads.
      </p>

      <h2>What we do not use</h2>
      <ul>
        <li>Advertising cookies</li>
        <li>Cookies required to convert, merge, split, or download a PDF</li>
      </ul>
      <p>
        Guide view counts may use this browser’s local storage so the same visit is not counted twice.
        That is not a cookie.
      </p>

      <h2>Other storage and third parties</h2>
      <p>
        Pages load fonts from Google Fonts. That is not a cookie this site sets, but it is a
        request to Google. Some guides may embed a YouTube video. Share buttons on guides open
        Facebook, LinkedIn, or X only if you click them.
      </p>

      <h2>How to control cookies</h2>
      <p>
        Use Cookie settings in the footer to accept or decline analytics. You can also delete
        cookies in your browser. Blocking analytics does not stop the PDF tools.
      </p>

      <h2>Questions</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, WhatsApp{" "}
        <a href={CONTACT_WHATSAPP_URL}>{CONTACT_WHATSAPP}</a>, or the{" "}
        <Link href="/contact">contact page</Link>.
      </p>
    </div>
  );
}
