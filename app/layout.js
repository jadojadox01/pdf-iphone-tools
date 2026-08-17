import Script from "next/script";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { defaultMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata = defaultMetadata;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-Y7LNYKSGJH"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Y7LNYKSGJH');
            `,
          }}
        />
        <div className="site-shell">
          <Navbar />
          <main id="main" className="site-main">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
