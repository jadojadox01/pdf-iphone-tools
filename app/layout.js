import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Analytics from "./components/Analytics";
import CookieNotice from "./components/CookieNotice";
import { defaultMetadata } from "@/lib/seo";
import { getPublishedDevices } from "@/lib/cms/guides";
import "./globals.css";

export const metadata = defaultMetadata;

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }) {
  let publishedDeviceSlugs = [];
  try {
    publishedDeviceSlugs = (await getPublishedDevices()).map((device) => device.slug);
  } catch {
    publishedDeviceSlugs = ["iphone"];
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Source+Sans+3:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/brand/logo-mark.png?v=pdfflow" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/brand/apple-touch-icon.png" />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Analytics />
        <div className="site-shell">
          <Navbar publishedDeviceSlugs={publishedDeviceSlugs} />
          <main id="main" className="site-main">
            {children}
          </main>
          <Footer publishedDeviceSlugs={publishedDeviceSlugs} />
        </div>
        <CookieNotice />
      </body>
    </html>
  );
}
