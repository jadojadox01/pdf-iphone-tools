import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSessionToken, passwordAllowed, adminConfigured } from "@/lib/admin-auth";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  if (!passwordAllowed(body.password || "")) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await createSessionToken();
  const store = await cookies();
  store.set("admin_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({
    ok: true,
    warning: adminConfigured() ? null : "Using the development password. Set ADMIN_PASSWORD before deploying.",
  });
}
