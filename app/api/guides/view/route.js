import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPublicGuide } from "@/lib/cms/guides";
import { getGuideViews, incrementGuideViews } from "@/lib/guide-views";
import { slugify } from "@/lib/slug";

function cleanSlug(value) {
  return slugify(value || "");
}

function expireLegacyViewCookies(response, store) {
  try {
    for (const cookie of store.getAll()) {
      if (cookie.name.startsWith("gv_")) response.cookies.delete(cookie.name);
    }
  } catch {
    /* ignore */
  }
}

export async function GET(request) {
  const slug = cleanSlug(request.nextUrl.searchParams.get("slug"));
  if (!slug) return NextResponse.json({ error: "Missing guide." }, { status: 400 });
  const guide = await getPublicGuide(slug);
  if (!guide) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const response = NextResponse.json({ views: await getGuideViews(slug) });
  expireLegacyViewCookies(response, await cookies());
  return response;
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const slug = cleanSlug(body.slug);
  if (!slug) return NextResponse.json({ error: "Missing guide." }, { status: 400 });

  const guide = await getPublicGuide(slug);
  if (!guide) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const views = await incrementGuideViews(slug);
  const response = NextResponse.json({ views });
  expireLegacyViewCookies(response, await cookies());
  return response;
}
