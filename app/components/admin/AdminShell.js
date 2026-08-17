"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/guides", label: "Guides" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/authors", label: "Authors" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const isPreview = pathname.includes("/preview");
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isPreview) return undefined;
    document.body.classList.add("is-admin");
    return () => document.body.classList.remove("is-admin");
  }, [pathname, isPreview]);

  if (isLogin || isPreview) return children;

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          Guides CMS
        </Link>
        <nav>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href)) ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button type="button" className="btn btn-secondary" onClick={logout}>
          Sign out
        </button>
        <Link href="/" className="help">
          View site
        </Link>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
