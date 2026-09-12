import Link from "next/link";
import { BRAND, CONTACT_EMAIL } from "@/config/brand";
import { getTools } from "@/lib/tools";
import { toolPath } from "@/lib/paths";
import { DEVICE_HUBS } from "@/lib/devices";
import CookieSettingsLink from "./CookieSettingsLink";

export default function Footer({ publishedDeviceSlugs = [] }) {
  const year = new Date().getFullYear();
  const tools = getTools();
  const liveHubs = DEVICE_HUBS.filter((device) => publishedDeviceSlugs.includes(device.slug));
  const pendingHubs = DEVICE_HUBS.filter((device) => !publishedDeviceSlugs.includes(device.slug));

  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <Link href="/" className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BRAND.logoSrc} alt={BRAND.name} className="logo-img logo-img-footer" width="168" height="48" />
          </Link>
          <p>{BRAND.tagline}</p>
          <p>{BRAND.shortTagline} Your file is processed locally in your browser and is not uploaded to PDFFlow&apos;s servers for normal tool processing.</p>
          <p>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
          <p>
            © {year} {BRAND.name}
          </p>
        </div>
        <div>
          <strong>Tools</strong>
          {tools.slice(0, 8).map((tool) => (
            <Link key={tool.slug} href={toolPath(tool.slug)}>
              {tool.name}
            </Link>
          ))}
          <Link href="/tools">All tools</Link>
        </div>
        <div>
          <strong>Devices</strong>
          {liveHubs.map((device) => (
            <Link key={device.slug} href={`/${device.slug}`}>
              {device.name}
            </Link>
          ))}
          {pendingHubs.length ? (
            <Link href="/tools">{pendingHubs.map((device) => device.name).join(", ")} (browser tools)</Link>
          ) : null}
        </div>
        <div>
          <strong>Site</strong>
          <Link href="/guides">Guides</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/sitemap">Sitemap</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/cookies">Cookie Policy</Link>
          <CookieSettingsLink />
        </div>
      </div>
    </footer>
  );
}
