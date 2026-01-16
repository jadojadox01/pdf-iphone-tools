import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Free PDF iPhone Tools - Convert PDF to Word & JPG",
  description: "Convert PDF to Word or JPG directly on your iPhone. No app needed. Free online tools for iPhone users."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
