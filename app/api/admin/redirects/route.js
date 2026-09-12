import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminGuard } from "@/lib/admin-guard";

function normalizePath(value) {
  const path = String(value || "").trim();
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
}

export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;
  const redirects = await prisma.redirect.findMany({ orderBy: { fromPath: "asc" } });
  return NextResponse.json({ redirects });
}

export async function POST(request) {
  const denied = await adminGuard();
  if (denied) return denied;
  const body = await request.json().catch(() => ({}));
  const fromPath = normalizePath(body.fromPath);
  const toPath = normalizePath(body.toPath);
  if (!fromPath || !toPath) {
    return NextResponse.json({ error: "From and to paths are required." }, { status: 400 });
  }
  const redirect = await prisma.redirect.create({
    data: {
      fromPath,
      toPath,
      statusCode: Number(body.statusCode) || 301,
    },
  });
  return NextResponse.json({ redirect });
}
