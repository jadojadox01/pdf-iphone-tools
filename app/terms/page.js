import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: "Terms for using the free PDF tools on PDF iPhone Tools.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="wrap prose" style={{ padding: "32px 0 64px" }}>
      <h1>Terms of Service</h1>
      <p>Last updated: August 17, 2026</p>
      <p>
        By using {SITE_NAME}, you agree to these terms. The tools are provided free of charge, as is, for lawful personal and business use.
      </p>
      <h2>Your files</h2>
      <p>
        You keep ownership of files you process. You are responsible for having the right to convert, merge, or unlock those files. Unlocking a PDF requires a password you already know. The site will not attempt to bypass encryption.
      </p>
      <h2>Accuracy</h2>
      <p>
        Conversion quality depends on the source PDF. Text extraction, table detection, and compression can fail on damaged, scanned, or unusual files. Check downloaded files before you rely on them.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Do not use the site to process malware, to attack other systems, or to violate the law. We may rate-limit or block abuse if server features are added later.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        The service is provided without warranties. {SITE_NAME} is not liable for lost data, failed conversions, or damages arising from use of the tools.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent through the <Link href="/contact">contact page</Link>.
      </p>
    </div>
  );
}
