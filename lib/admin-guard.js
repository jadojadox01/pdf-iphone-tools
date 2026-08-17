import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSessionToken } from "@/lib/admin-auth";

export async function requireAdmin() {
  const store = await cookies();
  const token = store.get("admin_session")?.value;
  const expected = await createSessionToken();
  return Boolean(token && token === expected);
}

export async function adminGuard() {
  if (await requireAdmin()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
