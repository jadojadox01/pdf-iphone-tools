import { redirect } from "next/navigation";

export const metadata = { robots: { index: false, follow: false } };

export default async function LegacyGuideSearchPage({ searchParams }) {
  const q = String((await searchParams).q || "").trim();
  redirect(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
}
