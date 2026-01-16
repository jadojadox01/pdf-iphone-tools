import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Script from "next/script";

export const metadata = {
  title: "Free PDF iPhone Tools - Convert PDF to Word & JPG",
  description: "Convert PDF to Word or JPG directly on your iPhone. No app needed. Free online tools for iPhone users."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
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
      </head>
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
