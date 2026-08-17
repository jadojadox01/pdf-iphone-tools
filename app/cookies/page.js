import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cookie Policy",
  description: "Cookies used by PDF iPhone Tools, including analytics and the private dashboard.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <div className="wrap prose" style={{ padding: "32px 0 64px" }}>
      <h1>Cookie Policy</h1>
      <p>Last updated: August 17, 2026</p>
      <p>
        This site uses a small number of cookies. PDF files themselves are processed in your browser and are not stored in cookies.
      </p>
      <h2>Analytics</h2>
      <p>
        Google Analytics may set cookies to understand how the public pages are used. This helps us see which tools are opened, not what is inside your documents.
      </p>
      <h2>Dashboard</h2>
      <p>
        If you sign in to the private guides dashboard, an HTTP-only session cookie keeps you signed in. That cookie is not used for advertising.
      </p>
      <h2>Advertising</h2>
      <p>
        If Google AdSense or a similar partner is added later, those services may set cookies as described in their own policies. Download and convert buttons will remain separate from ad placements.
      </p>
      <p>
        You can control cookies in your browser settings. Blocking analytics cookies does not stop the PDF tools from working.
      </p>
    </div>
  );
}
