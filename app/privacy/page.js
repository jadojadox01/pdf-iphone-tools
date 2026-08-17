import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How PDF iPhone Tools handles files, analytics, and cookies. PDF processing happens in your browser.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="wrap prose" style={{ padding: "32px 0 64px" }}>
      <h1>Privacy Policy</h1>
      <p>Last updated: August 17, 2026</p>
      <h2>Files you process</h2>
      <p>
        PDF tools on {SITE_NAME} run in your browser. Your documents are not uploaded to our servers for conversion, merge, compression, signing, or password operations. We cannot read the contents of those files, and we do not store them.
      </p>
      <h2>Information we may collect</h2>
      <p>
        The website uses Google Analytics, which can collect standard usage data such as pages visited, approximate location, device type, and browser type. We do not use that data to identify the contents of your PDFs.
      </p>
      <h2>Cookies</h2>
      <p>
        Analytics cookies may be set by Google. A separate cookie is used only if you sign in to the private guides dashboard. See the <Link href="/cookies">Cookie Policy</Link> for details.
      </p>
      <h2>Advertising</h2>
      <p>
        This site is intended to be suitable for advertising networks such as Google AdSense in the future. If ads are enabled, those partners may set cookies as described in the Cookie Policy. Ads will not be placed over tool buttons or download controls.
      </p>
      <h2>Contact</h2>
      <p>
        Privacy questions can be sent through the <Link href="/contact">contact page</Link>.
      </p>
    </div>
  );
}
