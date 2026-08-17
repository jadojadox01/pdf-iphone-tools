import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { getTools } from "@/lib/tools";

export default function Footer() {
  const year = new Date().getFullYear();
  const tools = getTools();

  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <strong>{SITE_NAME}</strong>
          <p>Free PDF tools that run in your browser. No app required. Works on iPhone, iPad, Android, and desktop.</p>
          <p>© {year} {SITE_NAME}</p>
        </div>
        <div>
          <strong>Tools</strong>
          {tools.slice(0, 6).map((tool) => (
            <Link key={tool.slug} href={`/${tool.slug}`}>
              {tool.name}
            </Link>
          ))}
        </div>
        <div>
          <strong>More tools</strong>
          {tools.slice(6).map((tool) => (
            <Link key={tool.slug} href={`/${tool.slug}`}>
              {tool.name}
            </Link>
          ))}
        </div>
        <div>
          <strong>Site</strong>
          <Link href="/pdf-converter-for-iphone">PDF converter for iPhone</Link>
          <Link href="/tools">All tools</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/guides/rss.xml">Guides RSS</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/cookies">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}
