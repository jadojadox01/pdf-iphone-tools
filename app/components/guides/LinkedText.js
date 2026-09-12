import Link from "next/link";
import { tokenizeLinks } from "@/lib/cms/linkify";

export default function LinkedText({ text, links }) {
  return tokenizeLinks(text, links).map((token, index) => {
    if (!token.href) return <span key={index}>{token.text}</span>;
    if (token.external) {
      return (
        <a key={index} href={token.href} className="guide-extlink" target="_blank" rel="noopener noreferrer">
          {token.text}
        </a>
      );
    }
    return (
      <Link key={index} href={token.href} className="guide-backlink">
        {token.text}
      </Link>
    );
  });
}
